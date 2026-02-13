# E2E Test Setup Guide

This guide will help you set up and run the Playwright E2E tests for the Devre Media System.

## Prerequisites

- Node.js installed
- Supabase running locally (`supabase start`)
- Next.js development server running (`npm run dev`)

## Installation

Playwright is already installed as a dev dependency. To install the browsers needed for testing:

```bash
npx playwright install
```

This will install Chromium, Firefox, and WebKit browsers.

## Test Users Setup

Before running authenticated tests, you need to create test users in your local Supabase database.

### Create Admin User

1. Navigate to http://localhost:54323 (Supabase Studio)
2. Go to Authentication > Users
3. Create a new user:
   - Email: `admin@devre.test`
   - Password: `Admin123!`
4. Update the user's role in the `profiles` table to `admin` or `super_admin`

### Create Client User

1. In Supabase Studio, create another user:
   - Email: `client@devre.test`
   - Password: `Client123!`
2. Update the user's role in the `profiles` table to `client`

### Enable Test Users

Create a `.env.test.local` file (or add to `.env.local`):

```env
E2E_TEST_USERS_READY=1
```

This tells the tests that authenticated test users are ready.

## Running Tests

### Run all tests (headless)
```bash
npm run test:e2e
```

### Run tests with UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Debug tests
```bash
npm run test:e2e:debug
```

### View test report
```bash
npm run test:e2e:report
```

### Run specific test file
```bash
npx playwright test e2e/auth.spec.ts
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Structure

```
e2e/
├── .auth/                    # Stored authentication states (gitignored)
├── helpers/
│   ├── auth.ts              # Authentication helpers
│   └── test-utils.ts        # Common test utilities
├── auth.spec.ts             # Authentication tests
├── client-management.spec.ts # Client CRUD tests
├── project-flow.spec.ts     # Project management tests
├── invoice-payment.spec.ts  # Invoice tests
├── client-portal.spec.ts    # Client portal tests
├── messaging.spec.ts        # Messaging tests
├── contracts.spec.ts        # Contract tests
├── filming-requests.spec.ts # Filming request/booking tests
├── example.spec.ts          # Basic smoke tests (no auth required)
└── global-setup.ts          # Global setup (optional)
```

## Test Categories

### Smoke Tests (No Authentication Required)
- `example.spec.ts` - Basic application tests

These can run immediately without any setup.

### Authenticated Tests
Most test files require authenticated users and will skip if `E2E_TEST_USERS_READY` is not set:
- `auth.spec.ts` - Login, logout, role-based access
- `client-management.spec.ts` - Client CRUD operations
- `project-flow.spec.ts` - Project management
- `invoice-payment.spec.ts` - Invoice management
- `client-portal.spec.ts` - Client dashboard and features
- `messaging.spec.ts` - Project messaging
- `contracts.spec.ts` - Contract management and signing
- `filming-requests.spec.ts` - Booking wizard and request management

### Tests Requiring Database State
Many tests are marked with `test.skip()` because they require specific database records:
- Tests that create/edit/delete records
- Tests that display lists of items
- Tests that interact with relationships

## Writing Tests

### Test Structure
```typescript
import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup - login, navigate, etc.
    await loginAsAdmin(page);
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await page.goto('/some/route');

    // Act
    await page.click('button');

    // Assert
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### Using Test Utilities
```typescript
import { waitForSuccessMessage, clickButton } from './helpers/test-utils';

await clickButton(page, 'Save');
await waitForSuccessMessage(page, 'Saved successfully');
```

## Troubleshooting

### Tests timeout
- Ensure Next.js dev server is running
- Check that Supabase is running
- Increase timeout in playwright.config.ts

### Authentication tests fail
- Verify test users exist in Supabase
- Check email/password match in e2e/helpers/auth.ts
- Ensure E2E_TEST_USERS_READY=1 is set

### Cannot find elements
- Use `page.pause()` to debug
- Use Playwright Inspector: `npx playwright test --debug`
- Check element selectors with browser DevTools

## CI/CD Integration

To run tests in CI (GitHub Actions, etc.):

```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Start Supabase
  run: npx supabase start

- name: Run E2E tests
  run: npm run test:e2e
  env:
    E2E_TEST_USERS_READY: 1
```

## Best Practices

1. **Use data-testid attributes** for stable selectors
2. **Keep tests independent** - don't rely on other tests
3. **Clean up after tests** - delete created records
4. **Use page objects** for complex pages
5. **Mock external services** when possible
6. **Use meaningful test names** that describe behavior
7. **Avoid hardcoded waits** - use `waitForSelector` instead

## Performance Tips

1. Run tests in parallel (default)
2. Use `storageState` to reuse authentication
3. Skip unnecessary tests with `test.skip()`
4. Use `test.only()` during development
5. Run specific test files instead of entire suite

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Test Selectors](https://playwright.dev/docs/selectors)
- [Playwright Assertions](https://playwright.dev/docs/test-assertions)
