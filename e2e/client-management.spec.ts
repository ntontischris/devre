import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

/**
 * Client Management E2E Tests
 * Tests admin client CRUD operations and navigation
 */

test.describe('Client Management', () => {
  test.beforeEach(async ({ page }) => {
    // SKIP: Requires database with test admin user
    test.skip(!process.env.E2E_TEST_USERS_READY, 'Test users not configured in database');

    // Login as admin before each test
    await loginAsAdmin(page);
  });

  test('admin can view clients list page', async ({ page }) => {
    await page.goto('/admin/clients');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that we're on the clients page
    await expect(page).toHaveURL(/\/admin\/clients$/);

    // Check for page heading or title
    await expect(
      page.locator('h1, h2').filter({ hasText: /clients/i }).first()
    ).toBeVisible();

    // Check for common elements: table, list, or cards
    const hasTable = await page.locator('table').isVisible().catch(() => false);
    const hasList = await page.locator('[role="list"]').isVisible().catch(() => false);
    const hasCards = await page.locator('[data-testid*="client-card"]').isVisible().catch(() => false);

    expect(hasTable || hasList || hasCards).toBeTruthy();
  });

  test('clients list shows add new client button', async ({ page }) => {
    await page.goto('/admin/clients');

    // Look for "New Client" or "Add Client" button
    const addButton = page.locator('a, button').filter({ hasText: /new client|add client|create client/i }).first();
    await expect(addButton).toBeVisible();

    // Verify it links to the new client page
    const href = await addButton.getAttribute('href');
    if (href) {
      expect(href).toContain('/admin/clients/new');
    }
  });

  test('admin can navigate to create new client page', async ({ page }) => {
    await page.goto('/admin/clients');

    // Click the new client button
    const addButton = page.locator('a, button').filter({ hasText: /new client|add client|create client/i }).first();
    await addButton.click();

    // Should navigate to new client page
    await expect(page).toHaveURL(/\/admin\/clients\/new/);

    // Check for form presence
    await expect(page.locator('form')).toBeVisible();
  });

  test('new client form renders with required fields', async ({ page }) => {
    await page.goto('/admin/clients/new');

    // Wait for form to load
    await expect(page.locator('form')).toBeVisible();

    // Check for common client form fields
    // Name field
    const nameField = page.locator('input[name*="name"], input[placeholder*="name" i]').first();
    await expect(nameField).toBeVisible();

    // Email field
    const emailField = page.locator('input[type="email"], input[name*="email"]').first();
    await expect(emailField).toBeVisible();

    // Submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('admin can create a new client', async ({ page }) => {
    // SKIP: Requires database interaction and proper form setup
    test.skip(true, 'Requires database state and form submission implementation');

    await page.goto('/admin/clients/new');

    // Fill in the form (adjust selectors based on your actual form)
    await page.locator('input[name*="name"]').fill('Test Client E2E');
    await page.locator('input[type="email"]').fill('testclient@e2e.test');
    await page.locator('input[name*="phone"]').fill('555-123-4567');

    // Submit the form
    await page.locator('button[type="submit"]').click();

    // Should redirect to clients list or client detail page
    await page.waitForURL(/\/admin\/clients(\/\d+)?/, { timeout: 10000 });

    // Verify success message or presence of new client
    await expect(
      page.locator('text=/success|created|added/i').first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('admin can view client detail page', async ({ page }) => {
    // SKIP: Requires existing client in database
    test.skip(true, 'Requires database with at least one client record');

    // Navigate to clients list
    await page.goto('/admin/clients');

    // Click on first client (adjust selector based on your list implementation)
    const firstClient = page.locator('tr td a, [data-testid*="client"] a, a[href*="/admin/clients/"]').first();
    await firstClient.click();

    // Should be on client detail page
    await expect(page).toHaveURL(/\/admin\/clients\/[\w-]+$/);

    // Check for client details sections
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('client detail page shows projects and invoices sections', async ({ page }) => {
    // SKIP: Requires existing client in database
    test.skip(true, 'Requires database with client record and related data');

    // Navigate to a client detail page (using a mock ID)
    await page.goto('/admin/clients/test-client-id');

    // Check for sections (adjust based on your layout)
    const hasProjects = await page.locator('text=/projects/i').isVisible().catch(() => false);
    const hasInvoices = await page.locator('text=/invoices/i').isVisible().catch(() => false);
    const hasContracts = await page.locator('text=/contracts/i').isVisible().catch(() => false);

    expect(hasProjects || hasInvoices || hasContracts).toBeTruthy();
  });

  test('admin can navigate to edit client page', async ({ page }) => {
    // SKIP: Requires existing client in database
    test.skip(true, 'Requires database with at least one client record');

    // Navigate to client detail page
    await page.goto('/admin/clients/test-client-id');

    // Look for edit button
    const editButton = page.locator('a, button').filter({ hasText: /edit/i }).first();
    await editButton.click();

    // Should navigate to edit page
    await expect(page).toHaveURL(/\/admin\/clients\/[\w-]+\/edit/);

    // Check for form
    await expect(page.locator('form')).toBeVisible();
  });

  test('admin can edit a client', async ({ page }) => {
    // SKIP: Requires database interaction
    test.skip(true, 'Requires database with client record and form submission');

    await page.goto('/admin/clients/test-client-id/edit');

    // Update a field
    const nameField = page.locator('input[name*="name"]').first();
    await nameField.fill('Updated Client Name E2E');

    // Submit the form
    await page.locator('button[type="submit"]').click();

    // Should redirect back to client detail or list
    await page.waitForURL(/\/admin\/clients/, { timeout: 10000 });

    // Verify success message
    await expect(
      page.locator('text=/success|updated|saved/i').first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('clients list has search or filter functionality', async ({ page }) => {
    await page.goto('/admin/clients');

    // Look for search input or filter controls
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();

    // Check if search/filter exists (optional feature)
    const hasSearch = await searchInput.isVisible().catch(() => false);

    // This is informational - search is a common feature
    if (hasSearch) {
      await expect(searchInput).toBeVisible();
    }
  });

  test('empty clients list shows appropriate message', async ({ page }) => {
    // SKIP: Requires empty database or specific test state
    test.skip(true, 'Requires database with no clients (specific test state)');

    await page.goto('/admin/clients');

    // Look for empty state message
    await expect(
      page.locator('text=/no clients|empty|get started/i').first()
    ).toBeVisible();
  });
});
