import { Page, Locator, expect } from '@playwright/test';

/**
 * Test utility functions for E2E tests
 * Common helpers for interacting with the application
 */

/**
 * Wait for the page to finish loading (network idle)
 * @param page - Playwright page instance
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

/**
 * Fill a form field by label text
 * @param page - Playwright page instance
 * @param label - Label text to find the associated input
 * @param value - Value to fill
 */
export async function fillFormFieldByLabel(page: Page, label: string, value: string) {
  const input = page.locator(`label:has-text("${label}") ~ input, label:has-text("${label}") ~ textarea`);
  await input.fill(value);
}

/**
 * Click a button by text content
 * @param page - Playwright page instance
 * @param text - Button text (case insensitive)
 */
export async function clickButton(page: Page, text: string) {
  const button = page.locator('button, a[role="button"]').filter({ hasText: new RegExp(text, 'i') });
  await button.first().click();
}

/**
 * Wait for a success toast/notification to appear
 * @param page - Playwright page instance
 * @param message - Optional specific message to wait for
 */
export async function waitForSuccessMessage(page: Page, message?: string) {
  if (message) {
    await expect(
      page.locator(`[role="alert"], .toast, [data-testid*="toast"]`).filter({ hasText: message })
    ).toBeVisible({ timeout: 5000 });
  } else {
    await expect(
      page.locator('[role="alert"], .toast, [data-testid*="toast"]').filter({ hasText: /success/i })
    ).toBeVisible({ timeout: 5000 });
  }
}

/**
 * Wait for an error message to appear
 * @param page - Playwright page instance
 * @param message - Optional specific message to wait for
 */
export async function waitForErrorMessage(page: Page, message?: string) {
  if (message) {
    await expect(
      page.locator(`[role="alert"], .toast, [data-testid*="toast"]`).filter({ hasText: message })
    ).toBeVisible({ timeout: 5000 });
  } else {
    await expect(
      page.locator('[role="alert"], .toast, [data-testid*="toast"]').filter({ hasText: /error/i })
    ).toBeVisible({ timeout: 5000 });
  }
}

/**
 * Select an option from a select dropdown
 * @param page - Playwright page instance
 * @param label - Label text or name attribute
 * @param option - Option text or value
 */
export async function selectOption(page: Page, label: string, option: string) {
  const select = page.locator(`select[name*="${label}"], label:has-text("${label}") ~ select`).first();
  await select.selectOption({ label: option });
}

/**
 * Check if element exists (without throwing)
 * @param locator - Playwright locator
 * @returns boolean indicating if element exists
 */
export async function elementExists(locator: Locator): Promise<boolean> {
  return await locator.isVisible().catch(() => false);
}

/**
 * Navigate to a route and wait for it to load
 * @param page - Playwright page instance
 * @param route - Route to navigate to
 */
export async function navigateAndWait(page: Page, route: string) {
  await page.goto(route);
  await waitForPageLoad(page);
}

/**
 * Take a screenshot with a descriptive name
 * @param page - Playwright page instance
 * @param name - Screenshot name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
}

/**
 * Wait for a specific URL pattern
 * @param page - Playwright page instance
 * @param pattern - URL pattern (string or regex)
 * @param timeout - Timeout in milliseconds
 */
export async function waitForUrl(page: Page, pattern: string | RegExp, timeout = 10000) {
  await page.waitForURL(pattern, { timeout });
}

/**
 * Check if user is on a specific page
 * @param page - Playwright page instance
 * @param route - Expected route
 */
export async function assertOnPage(page: Page, route: string | RegExp) {
  await expect(page).toHaveURL(route);
}

/**
 * Fill a search input and submit
 * @param page - Playwright page instance
 * @param query - Search query
 */
export async function search(page: Page, query: string) {
  const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
  await searchInput.fill(query);
  await searchInput.press('Enter');
}

/**
 * Wait for table to load with data
 * @param page - Playwright page instance
 */
export async function waitForTable(page: Page) {
  await page.waitForSelector('table tbody tr', { timeout: 5000 });
}

/**
 * Get table row count
 * @param page - Playwright page instance
 * @returns Number of rows in the table
 */
export async function getTableRowCount(page: Page): Promise<number> {
  return await page.locator('table tbody tr').count();
}

/**
 * Click on a table row by index
 * @param page - Playwright page instance
 * @param index - Row index (0-based)
 */
export async function clickTableRow(page: Page, index: number) {
  const row = page.locator('table tbody tr').nth(index);
  await row.click();
}

/**
 * Upload a file to a file input
 * @param page - Playwright page instance
 * @param selector - Input selector
 * @param filePath - Path to file
 */
export async function uploadFile(page: Page, selector: string, filePath: string) {
  const fileInput = page.locator(selector);
  await fileInput.setInputFiles(filePath);
}

/**
 * Wait for modal/dialog to appear
 * @param page - Playwright page instance
 */
export async function waitForModal(page: Page) {
  await page.waitForSelector('[role="dialog"], [role="alertdialog"], .modal', { timeout: 5000 });
}

/**
 * Close modal/dialog
 * @param page - Playwright page instance
 */
export async function closeModal(page: Page) {
  const closeButton = page.locator('[role="dialog"] button, .modal button').filter({ hasText: /close|cancel|×/i }).first();
  await closeButton.click();
}

/**
 * Wait for loading spinner to disappear
 * @param page - Playwright page instance
 */
export async function waitForLoadingToFinish(page: Page) {
  await page.waitForSelector('[data-testid*="loading"], .spinner, .loading', { state: 'hidden', timeout: 10000 }).catch(() => {
    // Ignore if loading spinner doesn't exist
  });
}

/**
 * Scroll element into view
 * @param locator - Playwright locator
 */
export async function scrollIntoView(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
}

/**
 * Wait for a specific number of milliseconds
 * @param ms - Milliseconds to wait
 */
export async function wait(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if page has a specific heading
 * @param page - Playwright page instance
 * @param headingText - Expected heading text
 */
export async function assertPageHeading(page: Page, headingText: string | RegExp) {
  const heading = page.locator('h1, h2').first();
  await expect(heading).toContainText(headingText);
}

/**
 * Get text content of an element
 * @param locator - Playwright locator
 * @returns Text content
 */
export async function getTextContent(locator: Locator): Promise<string> {
  return (await locator.textContent()) || '';
}

/**
 * Click link by text and wait for navigation
 * @param page - Playwright page instance
 * @param linkText - Link text to click
 */
export async function clickLinkAndWait(page: Page, linkText: string) {
  await page.locator('a').filter({ hasText: new RegExp(linkText, 'i') }).first().click();
  await waitForPageLoad(page);
}
