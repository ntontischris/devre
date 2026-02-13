import { test, expect } from '@playwright/test';

/**
 * Example E2E Test
 * Basic smoke tests that don't require authentication
 * These tests verify that the application is running and pages load
 */

test.describe('Basic Application Tests', () => {
  test('application homepage loads', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads without errors
    await expect(page).toHaveURL(/\//);

    // Page should have a title
    await expect(page).toHaveTitle(/.+/);
  });

  test('login page is accessible', async ({ page }) => {
    await page.goto('/login');

    // Should navigate to login page
    await expect(page).toHaveURL(/\/login/);

    // Should have a form
    await expect(page.locator('form')).toBeVisible();
  });

  test('signup page is accessible', async ({ page }) => {
    await page.goto('/signup');

    // Should navigate to signup page
    await expect(page).toHaveURL(/\/signup/);

    // Should have a form
    await expect(page.locator('form')).toBeVisible();
  });

  test('forgot password page is accessible', async ({ page }) => {
    await page.goto('/forgot-password');

    // Should navigate to forgot password page
    await expect(page).toHaveURL(/\/forgot-password/);

    // Should have a form
    await expect(page.locator('form')).toBeVisible();
  });

  test('protected admin route redirects to login', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Should redirect to login when not authenticated
    await expect(page).toHaveURL(/\/login/);
  });

  test('protected client route redirects to login', async ({ page }) => {
    await page.goto('/client/dashboard');

    // Should redirect to login when not authenticated
    await expect(page).toHaveURL(/\/login/);
  });

  test('application has proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Should have viewport meta tag
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();
  });

  test('login form has required fields', async ({ page }) => {
    await page.goto('/login');

    // Should have email input
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await expect(emailInput).toBeVisible();

    // Should have password input
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    await expect(passwordInput).toBeVisible();

    // Should have submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('signup form has required fields', async ({ page }) => {
    await page.goto('/signup');

    // Should have email input
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await expect(emailInput).toBeVisible();

    // Should have password input
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    await expect(passwordInput).toBeVisible();

    // Should have submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('navigation responds correctly', async ({ page }) => {
    await page.goto('/login');

    // Get the current URL
    const loginUrl = page.url();
    expect(loginUrl).toContain('/login');

    // Navigate to signup
    await page.goto('/signup');

    // URL should change
    const signupUrl = page.url();
    expect(signupUrl).toContain('/signup');
    expect(signupUrl).not.toBe(loginUrl);
  });
});
