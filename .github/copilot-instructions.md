# Playwright Code Style Guide & Best Practices

## Introduction

This guide outlines best practices for writing maintainable, robust, and readable end-to-end tests using Playwright. It emphasizes the use of the Page Object Model (POM) design pattern and custom fixtures to promote code reuse and separation of concerns. The guide also covers modern testing approaches including soft assertions, parallel execution strategies, and enhanced debugging capabilities. Adhering to these practices will help ensure your test suite is scalable, reliable, and easy to manage.

> **When generating code, Copilot should always prioritize maintainability, readability, and following the Page Object Model pattern.**

This guide reflects the latest practices recommended in the official Playwright documentation as of 2025. Always refer to the [latest Playwright documentation](https://playwright.dev/docs/intro) for the most up-to-date information.

## Table of Contents

### Core Principles

1. [Recommended Folder Structure](#recommended-folder-structure)
2. [General Best Practices](#general-best-practices)
3. [Locators](#locators) - 📌 _Prioritize user-facing locators_

### Design Patterns

4. [Page Object Model (POM)](#page-object-model-pom) - 📌 _Primary pattern for all UI tests_
   - [Structure](#structure)
   - [Naming Conventions](#naming-conventions)
   - [Locators in POM](#locators-in-pom)
   - [Action Methods](#action-methods)
   - [Assertions](#assertions-in-pom)
   - [Example](#pom-example)
5. [Custom Fixtures](#custom-fixtures) - 📌 _Use for setup/teardown and context sharing_
   - [Purpose](#purpose)
   - [Creating Fixtures](#creating-fixtures)
   - [Using Fixtures](#using-fixtures)
   - [Scope](#scope)
   - [Example](#fixture-example)

### Test Implementation

6. [Assertions](#assertions) - 📌 _Always use web-first assertions_
   - [Web-First Assertions](#web-first-assertions)
   - [Soft Assertions](#soft-assertions)
   - [Common Assertions](#common-assertions)
7. [Waiting Mechanisms](#waiting-mechanisms) - 📌 _Avoid hard waits_
8. [Test Structure and Naming](#test-structure-and-naming)
9. [Configuration (`playwright.config.ts`)](#configuration-playwrightconfigts)
10. [Parallel Testing](#parallel-testing)
11. [Debugging](#debugging)
12. [Clock Management](#clock-management)
13. [Test Sharding](#test-sharding)
14. [Performance Testing](#performance-testing)
15. [Miscellaneous](#miscellaneous)

### Advanced Testing Scenarios

16. [API Testing and Authentication](#api-testing-and-authentication) - 📌 _Use request context_
17. [Visual Testing and Snapshots](#visual-testing-and-snapshots) - 📌 _Component-focused screenshots_
18. [Mobile Testing](#mobile-testing) - 📌 _Use device emulation_
19. [Security Testing](#security-testing) - 📌 _Test security headers and policies_
20. [Modern Web Features](#modern-web-features) - 📌 _Handle shadow DOM and service workers_

## 🚨 Copilot Must Follow Rules

When generating Playwright test code, ALWAYS:

1. **Follow Page Object Model** - Separate UI interactions into page object classes
2. **Use recommended locators** - Prefer user-facing locators like getByRole(), getByText() over CSS/XPath
3. **Implement web-first assertions** - Use expect(locator).toBeVisible() patterns
4. **Avoid hard-coded waits** - Never use page.waitForTimeout() in production code
5. **Structure tests with AAA pattern** - Arrange, Act, Assert sections
6. **Use async/await consistently** - All Playwright operations are asynchronous
7. **Keep tests independent** - No test should depend on another test's state

## General Best Practices

> **🎯 Core Principle:** Follow these best practices to ensure your Playwright tests are reliable, maintainable, and provide clear results when failures occur.

| ✅ DO                            | ❌ DON'T                                            |
| -------------------------------- | --------------------------------------------------- |
| Keep tests independent           | Allow tests to depend on other tests' state         |
| Use `test.describe` for grouping | Create overly large test files without organization |
| Use Playwright's auto-waiting    | Use `page.waitForTimeout()` for synchronization     |
| Use async/await consistently     | Mix promise chains with async/await                 |
| Set short, explicit timeouts     | Rely on default timeouts for everything             |

```typescript
// ✅ GOOD: Independent tests with clear grouping
test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login with valid credentials', async ({ page }) => {
    // Test implementation
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Test implementation
  });
});

// ❌ BAD: Using hard-coded waits
test('login test with hard wait', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('user');
  await page.getByLabel('Password').fill('pass');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(2000); // BAD: Hard-coded wait
  expect(page.url()).toContain('dashboard');
});
```

### Key Guidelines for Copilot

1. **Generate independent tests** that can run in any order
2. **Use descriptive test names** that explain the expected behavior
3. **Employ proper test setup and teardown** via hooks
4. **Never generate code with `page.waitForTimeout()`** except for debugging comments
5. **Always use async/await** for all Playwright operations

## Recommended Folder Structure

A well-organized folder structure is crucial for maintainability as your test suite grows. Follow this structure when generating code:

```
your-project-root/
├── 📄 .env                # Environment variables (add to .gitignore)
├── 📄 .gitignore          # Git ignore file
├── 📄 package.json        # Project dependencies and scripts
├── 📄 playwright.config.ts # Playwright configuration file
│
├── 📁 tests/              # Root directory for test specifications
│   ├── 📁 fixtures/       # Custom fixtures definitions
│   │   └── 📄 fixtures.ts # Main fixtures file
│   │
│   ├── 📁 specs/          # Test files organized by feature
│   │   ├── 📁 auth/       # Authentication-related tests
│   │   │   └── 📄 login.spec.ts
│   │   ├── 📁 shopping_cart/ # Feature-specific tests
│   │   │   └── 📄 cart.spec.ts
│   │   └── 📄 product_search.spec.ts
│   │
│   └── 📄 example.spec.ts # Default example (can be removed)
│
├── 📁 page-objects/       # POM classes directory
│   ├── 📁 components/     # Reusable UI components
│   │   └── 📄 HeaderComponent.ts  # Example component
│   ├── 📄 LoginPage.ts    # Page-specific classes
│   ├── 📄 DashboardPage.ts
│   └── 📄 ProductDetailsPage.ts
│
├── 📁 test-data/          # Test data files (JSON, CSV)
│   └── 📄 users.json
│
├── 📁 utils/              # Helper functions
│   └── 📄 api-helpers.ts
│
└── 📁 test-results/       # Generated reports, screenshots (add to .gitignore)
    └── ...
```

> **Guidance for Copilot:** When generating code, place files in the appropriate directories. Create page object classes in the page-objects directory and test specs in the tests/specs directory. Use subdirectories to organize by feature.

### Key Principles for Folder Organization

| Directory       | Purpose                | File Types               | Naming Convention                     |
| --------------- | ---------------------- | ------------------------ | ------------------------------------- |
| page-objects/   | UI interaction classes | TypeScript classes       | PascalCase with Page/Component suffix |
| tests/fixtures/ | Test setup and context | TypeScript fixture files | camelCase                             |
| tests/specs/    | Test specifications    | Test files (.spec.ts)    | kebab-case.spec.ts                    |
| utils/          | Helper functions       | Utility modules          | camelCase                             |
| test-data/      | Test datasets          | JSON, CSV, etc.          | kebab-case                            |

## Locators

> **🎯 Core Principle:** Always prioritize user-facing locators that interact with elements the way users do, making tests more resilient to implementation changes.

### Locator Priority (Most to Least Preferred)

1. **Role-based locators**

   ```typescript
   page.getByRole('button', { name: 'Submit' });
   page.getByRole('textbox', { name: 'Email' });
   ```

2. **Text-based locators**

   ```typescript
   page.getByText('Welcome back');
   page.getByText(/Terms of service/i);
   ```

3. **Form-specific locators**

   ```typescript
   page.getByLabel('Password');
   page.getByPlaceholder('Enter your email');
   ```

4. **Semantic locators**

   ```typescript
   page.getByAltText('Company logo');
   page.getByTitle('User profile');
   ```

5. **Test ID locators** (when semantic locators aren't feasible)

   ```typescript
   page.getByTestId('checkout-button');
   ```

6. **CSS and XPath** (use only as a last resort)
   ```typescript
   page.locator('.submit-button'); // Less preferred
   page.locator('//button[contains(@class, "submit")]'); // Least preferred
   ```

### Locator Filtering & Chaining

```typescript
// ✅ GOOD: Chain locators to narrow scope
const list = page.getByRole('list');
const items = list.getByRole('listitem');
const firstItem = items.first();
const specificItem = items.filter({ hasText: 'Product Name' });

// ✅ GOOD: Use nth for position-based selection
const thirdItem = items.nth(2); // 0-based indexing

// ❌ BAD: Brittle CSS selectors
const badItem = page.locator('.list-container > div:nth-child(3)');
```

### Rules for Copilot When Generating Locators

1. **Always prioritize role-based locators** like `getByRole()` first
2. **Use text-based locators** like `getByText()` for visible text elements
3. **Prefer form-specific locators** for inputs, like `getByLabel()` and `getByPlaceholder()`
4. **Suggest test attributes** if semantic locators aren't feasible with a comment
5. **Only fall back to CSS/XPath as a last resort** with a justifying comment
6. **Use locator chaining** to improve precision and context
7. **Include helpful comments** for complex locator strategies

## Page Object Model (POM)

> **🎯 Core Principle:** Encapsulate page interactions in dedicated classes to separate test logic from UI interaction details.

### Structure

```typescript
// ✅ GOOD: Well-structured Page Object
// page-objects/LoginPage.ts
import { type Page, type Locator } from '@playwright/test';
import { DashboardPage } from './DashboardPage';

export class LoginPage {
  // Page instance passed to constructor
  readonly page: Page;

  // Private locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  // Public locator (for assertions)
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.errorMessage = page.getByText('Invalid credentials');
  }

  // Navigation method
  async navigateTo(): Promise<void> {
    await this.page.goto('/login');
  }

  // Action methods
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  // Composite action methods
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  // Methods that navigate to new pages return the new page object
  async loginAndNavigateToDashboard(username: string, password: string): Promise<DashboardPage> {
    await this.login(username, password);
    return new DashboardPage(this.page);
  }
}
```

### Naming Conventions

| Element  | Convention                            | Example                                        |
| -------- | ------------------------------------- | ---------------------------------------------- |
| Files    | PascalCase with Page/Component suffix | `LoginPage.ts`, `HeaderComponent.ts`           |
| Classes  | Same as file name                     | `LoginPage`, `HeaderComponent`                 |
| Methods  | camelCase verbs or verb phrases       | `login()`, `fillUsername()`, `navigateTo()`    |
| Locators | camelCase with element type           | `usernameInput`, `loginButton`, `errorMessage` |

### Locators in POM

- Define as private readonly properties unless needed for assertions
- Initialize in the constructor
- Use semantic locators following the locator priority guidelines

### Action Methods

- Create small, focused methods for individual actions
- Create composite methods for common sequences
- Return void for actions on the same page
- Return a new Page Object for navigation actions

### Assertions in POM

- Avoid assertions in POM methods (keep them in test files)
- Exception: Helper methods that return booleans or check page state

### Rules for Copilot When Generating POM Classes

1. **Always use TypeScript** with proper types for Page, Locator, etc.
2. **Implement constructor** that accepts and stores the page object
3. **Define locators as private readonly properties** unless needed for assertions
4. **Create clear, focused action methods** that handle UI interactions
5. **Follow proper naming conventions** for files, classes, methods, and locators
6. **Return appropriate values** from methods based on their behavior
7. **Add JSDoc comments** for public methods and properties
8. **Avoid assertions in POM methods** (keep in test files)

## Custom Fixtures

> **🎯 Core Principle:** Use fixtures to centralize test setup, share state, and provide reusable components across tests.

### Purpose

Fixtures provide:

- Reusable test setup and teardown
- Sharing state between tests when necessary
- Access to commonly used Page Objects
- Custom test utilities

### Creating Fixtures

```typescript
// ✅ GOOD: Well-structured fixtures file
// tests/fixtures/fixtures.ts
import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';
import { DashboardPage } from '../../page-objects/DashboardPage';

// Define fixture types
interface AppFixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  loggedInState: { username: string; token: string };
}

// Extend the base test
export const test = baseTest.extend<AppFixtures>({
  // Page object fixtures (scoped per test)
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  // Auth state fixture (can be scoped differently)
  loggedInState: async ({ page }, use) => {
    // Set up authentication state
    const username = 'testuser';
    await page.goto('/login');
    // Login via API or faster method than UI
    await page.evaluate((user) => {
      localStorage.setItem('auth_token', 'sample-token-123');
      return { username, token: 'sample-token-123' };
    }, username);

    // Provide the state to the test
    await use({ username, token: 'sample-token-123' });

    // Clean up after test
    await page.evaluate(() => {
      localStorage.clear();
    });
  },
});

// Export expect for convenience
export { expect } from '@playwright/test';
```

### Using Fixtures

```typescript
// ✅ GOOD: Using custom fixtures
// tests/specs/auth/login.spec.ts
import { test, expect } from '../../fixtures/fixtures';

test('user can navigate to dashboard after login', async ({ loginPage, page }) => {
  await loginPage.navigateTo();
  await loginPage.login('testuser', 'password');
  expect(page.url()).toContain('dashboard');
});

// Using authenticated state
test('authenticated user sees personalized dashboard', async ({
  page,
  dashboardPage,
  loggedInState,
}) => {
  await page.goto('/dashboard');
  const welcomeMessage = page.getByText(`Welcome, ${loggedInState.username}`);
  await expect(welcomeMessage).toBeVisible();
});
```

### Scope

- **Test-scoped fixtures**: Created and torn down for each test (default)
- **Worker-scoped fixtures**: Shared between tests in the same worker
- **All workers**: Can use external processes/services (database, API server)

### Rules for Copilot When Generating Fixtures

1. **Create a fixtures.ts file** in the tests/fixtures directory
2. **Define a proper TypeScript interface** for the fixture types
3. **Extend the base test** with custom fixtures
4. **Organize fixtures by responsibility** (pages, auth, data, etc.)
5. **Use proper scoping** based on fixture responsibility and performance
6. **Implement setup and teardown** in each fixture
7. **Export the extended test and expect** for convenience
8. **Add clear JSDoc comments** explaining fixture purpose and usage

## Assertions

> **🎯 Core Principle:** Use web-first assertions that automatically wait for the condition to be met, rather than asserting on transient states.

### Web-First Assertions

```typescript
// ✅ GOOD: Web-first assertions that wait
await expect(page.getByRole('heading')).toBeVisible();
await expect(page.getByText('Success')).toBeVisible({ timeout: 10000 });
await expect(page.locator('#status')).toHaveText('Complete');
await expect(page).toHaveURL(/dashboard/);

// ❌ BAD: Non-web-first assertions
const isVisible = await page.getByRole('button').isVisible();
expect(isVisible).toBe(true); // Doesn't auto-wait
```

### Soft Assertions

Soft assertions continue the test even after a failure, collecting multiple failures:

```typescript
// ✅ GOOD: Soft assertions to collect multiple failures
test('multiple validations on page', async ({ page }) => {
  await page.goto('/profile');

  // These won't stop the test if they fail
  await expect.soft(page.getByText('Username')).toBeVisible();
  await expect.soft(page.getByText('Email')).toBeVisible();
  await expect.soft(page.getByText('Settings')).toBeVisible();

  // Continue with the test...
  await page.getByRole('button', { name: 'Edit' }).click();
});
```

### Common Assertions

| Assertion           | Use Case                      | Example                                                   |
| ------------------- | ----------------------------- | --------------------------------------------------------- |
| `toBeVisible()`     | Element should be visible     | `await expect(locator).toBeVisible()`                     |
| `toBeHidden()`      | Element should not be visible | `await expect(locator).toBeHidden()`                      |
| `toHaveText()`      | Element should contain text   | `await expect(locator).toHaveText('Expected')`            |
| `toContainText()`   | Element should include text   | `await expect(locator).toContainText('part')`             |
| `toHaveValue()`     | Input should have value       | `await expect(locator).toHaveValue('text')`               |
| `toBeChecked()`     | Checkbox should be checked    | `await expect(locator).toBeChecked()`                     |
| `toHaveAttribute()` | Element should have attribute | `await expect(locator).toHaveAttribute('type', 'submit')` |
| `toHaveURL()`       | Page should have URL          | `await expect(page).toHaveURL(/pattern/)`                 |
| `toHaveTitle()`     | Page should have title        | `await expect(page).toHaveTitle('Page Title')`            |

### Rules for Copilot When Generating Assertions

1. **Always use web-first assertions** that auto-wait
2. **Set appropriate timeouts** for operations that may take longer
3. **Use soft assertions** when validating multiple conditions
4. **Use the most specific assertion** for the use case
5. **Prefer regexp patterns** over exact strings when appropriate
6. **Add clear error messages** to assertions when needed

## Waiting Mechanisms

> **🎯 Core Principle:** Let Playwright handle waiting automatically with built-in mechanisms rather than using hard-coded waits.

### Auto-Waiting (Preferred)

Playwright's built-in auto-waiting:

- **Actions** like click(), fill() wait for elements to be actionable
- **Web-first assertions** wait for conditions to be met
- **Navigation methods** wait for page loads

### Explicit Waiting (When Needed)

```typescript
// ✅ GOOD: Explicit waiting for specific conditions
await page.waitForURL('/dashboard');
await page.waitForSelector('#loaded-content');
await page.waitForResponse((response) => response.url().includes('/api/data'));
await page.waitForFunction(() => window.status === 'ready');

// ✅ GOOD: Custom waiting with timeout
await expect(page.getByText('Results')).toBeVisible({ timeout: 10000 });

// ❌ BAD: Hard-coded timing waits
await page.waitForTimeout(2000); // Avoid in production code
```

### Multiple Event Waiting

```typescript
// ✅ GOOD: Wait for multiple events
// Wait for both a response and a navigation
const [response, _] = await Promise.all([
  page.waitForResponse('/api/submit'),
  page.getByRole('button', { name: 'Submit' }).click(),
]);
```

### Rules for Copilot When Generating Waiting Code

1. **Never use `page.waitForTimeout()`** except in debugging comments
2. **Rely on Playwright's auto-waiting** for most scenarios
3. **Use explicit waits** only when auto-waiting isn't sufficient
4. **Prefer custom conditions** over arbitrary time delays
5. **Use Promise.all** for multiple simultaneous events
6. **Add appropriate timeouts** for operations that may take longer
7. **Include comments explaining** why an explicit wait is necessary

## Test Structure and Naming

> **🎯 Core Principle:** Structure tests logically using the Arrange-Act-Assert pattern and descriptive naming.

### Test Organization

```typescript
// ✅ GOOD: Well-structured test file
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';

test.describe('Login Functionality', () => {
  // Setup common to all tests in this group
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should allow login with valid credentials', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const username = 'validUser';
    const password = 'validPass123';

    // Act
    await loginPage.login(username, password);

    // Assert
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.login('invalid', 'wrong');

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(/login/); // Still on login page
  });
});
```

### Test Naming Conventions

| Pattern                     | Example                          |
| --------------------------- | -------------------------------- |
| should + expected behavior  | `'should redirect after login'`  |
| descriptive action + result | `'login redirects to dashboard'` |
| user-centric                | `'user can submit contact form'` |

### Hooks Usage

- `test.beforeAll` - Run once before all tests in the group
- `test.afterAll` - Run once after all tests in the group
- `test.beforeEach` - Run before each test in the group
- `test.afterEach` - Run after each test in the group

### Rules for Copilot When Generating Test Structure

1. **Use test.describe** to group related tests
2. **Follow AAA pattern** (Arrange, Act, Assert) in each test
3. **Use descriptive test names** that explain the expected behavior
4. **Use appropriate hooks** for setup and teardown
5. **Keep individual tests focused** on testing a single behavior
6. **Use skip and only** judiciously for debugging with comments
7. **Follow consistent structure** across test files

## Configuration (`playwright.config.ts`)

> **🎯 Core Principle:** Create a robust configuration that supports your testing needs across different environments.

```typescript
// ✅ GOOD: Well-structured configuration
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  // Global test timeout
  timeout: 30000,

  // Test directory
  testDir: './tests',

  // Pattern for test files
  testMatch: '**/*.spec.ts',

  // Maximum test failures before stopping
  maxFailures: process.env.CI ? 10 : undefined,

  // Retry failed tests on CI
  retries: process.env.CI ? 2 : 0,

  // Reporters
  reporter: [
    ['html'], // Generate HTML report
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    // Project with specific options for visual testing
    {
      name: 'visual-tests',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'on',
        video: 'on',
      },
      testMatch: '**/*.visual.spec.ts',
    },
  ],

  // Global test options
  use: {
    // Base URL to use in page.goto() calls
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Browser options
    headless: true,

    // Action options
    actionTimeout: 10000,
    navigationTimeout: 15000,

    // Capture screenshot only on failure
    screenshot: { mode: 'only-on-failure', fullPage: true },

    // Capture video only on failure
    video: { mode: 'retain-on-failure' },

    // Capture trace only on failure
    trace: { mode: 'retain-on-failure' },

    // Viewport size
    viewport: { width: 1280, height: 720 },
  },
});
```

### Rules for Copilot When Generating Configuration

1. **Import necessary modules** (defineConfig, devices)
2. **Set reasonable timeouts** for your application
3. **Configure browser projects** appropriately
4. **Setup proper reporters** based on needs
5. **Configure screenshot, video, trace** options (usually on failure)
6. **Use environment variables** for configurable settings
7. **Add comments explaining** non-obvious configuration choices
8. **Set appropriate retry settings** based on environment (CI vs local)

## Parallel Testing

> **🎯 Core Principle:** Design tests to run independently and in parallel to maximize efficiency, especially in CI environments.

### Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  // Number of workers (parallel processes)
  workers: process.env.CI ? 4 : undefined, // Use 4 workers on CI, auto on local

  // When running a specific spec file, run all tests in that file in parallel
  fullyParallel: true,

  // Enable parallel tests within a file
  use: {
    // Isolate each test's browser context for true parallel operation
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },
});
```

### Independent Tests

```typescript
// ✅ GOOD: Independent tests that can run in parallel
test('user can add a product to cart', async ({ page }) => {
  // This test doesn't depend on any other test
  await page.goto('/products/123');
  // Test implementation...
});

test('user can checkout', async ({ page }) => {
  // Setup everything needed within this test
  await page.goto('/products/123');
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.goto('/cart');
  // Test implementation...
});

// ❌ BAD: Tests that depend on each other
test('user logs in', async ({ page }) => {
  // This creates state that the next test depends on
  // BAD pattern!
});

test('logged in user can access profile', async ({ page }) => {
  // This assumes test above completed successfully
  // BAD pattern!
});
```

### Rules for Copilot When Generating Parallel Tests

1. **Make each test fully independent** with its own setup
2. **Use fixtures** to share setup code but not state
3. **Configure appropriate worker count** based on environment
4. **Enable fullyParallel** in configuration
5. **Create test data programmatically** rather than depending on existing state
6. **Avoid order-dependent tests** at all costs

## Debugging

> **🎯 Core Principle:** Include debugging aids in tests and use Playwright's built-in debugging tools to make troubleshooting easier.

### Debug Mode

```typescript
// Run with DEBUG=pw:api npx playwright test
// or use the UI mode: npx playwright test --ui
test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // ✅ GOOD: Debugging aids
  console.log('Current URL:', page.url());

  // Conditional debugging with comments for how to enable
  // To enable: DEBUG=pw:api npx playwright test
  // await page.pause(); // Uncomment to pause execution for debugging

  await expect(page).toHaveTitle(/Playwright/);
});
```

### Trace Viewer

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Collect traces on failure (view with `npx playwright show-trace trace.zip`)
    trace: 'on-first-retry', // or 'on' to always collect, 'retain-on-failure' for CI
  },
});
```

### Visual Debugging

```typescript
// ✅ GOOD: Take screenshots during test for debugging
test('visual debugging example', async ({ page }) => {
  await page.goto('/complex-page');

  // Helpful for debugging - will save to test-results directory
  await page.screenshot({ path: 'test-results/before-action.png' });

  await page.getByRole('button', { name: 'Submit' }).click();

  // Another debug screenshot after action
  await page.screenshot({ path: 'test-results/after-action.png' });

  await expect(page.getByText('Success')).toBeVisible();
});
```

### Rules for Copilot When Generating Debugging Code

1. **Include commented-out debug statements** (page.pause()) with instructions
2. **Configure appropriate trace settings** in the config
3. **Add strategic screenshots** for complex interactions
4. **Use console.log statements** for important state information
5. **Add comments about UI mode** and trace viewer when relevant
6. **Include instructions for locator debugging** with page.pause()

## API Testing and Authentication

> **🎯 Core Principle:** Use Playwright's request context for API testing and efficient authentication setup.

### API Testing

```typescript
// ✅ GOOD: API testing with Playwright
import { test, expect } from '@playwright/test';

test('API returns correct user data', async ({ request }) => {
  // Use the request fixture for API calls
  const response = await request.get('/api/users/1');

  // Assert on status and response body
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.name).toBe('John Doe');
  expect(body.email).toContain('@example.com');
});
```

### Authentication Via API

```typescript
// ✅ GOOD: Reusable auth setup via API
// tests/fixtures/auth.fixtures.ts
import { test as baseTest } from '@playwright/test';

export type AuthFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
};

export const test = baseTest.extend<AuthFixtures>({
  authenticatedPage: async ({ page, request }, use) => {
    // Get auth token via API
    const response = await request.post('/api/login', {
      data: {
        username: 'user@example.com',
        password: process.env.USER_PASSWORD || 'defaultPass',
      },
    });

    const { token } = await response.json();

    // Set local storage before navigating
    await page.goto('/');
    await page.evaluate((authToken) => {
      localStorage.setItem('auth_token', authToken);
    }, token);

    // Refresh to apply authentication
    await page.reload();

    // Pass the authenticated page to the test
    await use(page);

    // Clean up after test
    await page.evaluate(() => {
      localStorage.clear();
    });
  },

  // Admin-specific authentication
  adminPage: async ({ page, request }, use) => {
    // Similar pattern for admin authentication
    // ...
  },
});
```

### Rules for Copilot When Generating API and Auth Code

1. **Use the request fixture** for API calls in tests
2. **Create auth fixtures** for different user roles
3. **Set up auth state via API** rather than UI for efficiency
4. **Use environment variables** for sensitive credentials
5. **Implement proper cleanup** of auth state after tests
6. **Add strong typing** for response data where possible
7. **Include proper error handling** for API responses

## Visual Testing and Snapshots

> **🎯 Core Principle:** Use snapshot testing for visual regression but focus on component-level screenshots rather than full pages.

### Component Snapshots

```typescript
// ✅ GOOD: Component-focused visual testing
test('header component visual regression', async ({ page }) => {
  await page.goto('/');

  // Focus on a specific component
  const header = page.getByRole('banner');

  // Component-focused screenshot
  expect(await header.screenshot()).toMatchSnapshot('header.png');
});
```

### Text-based Snapshots

```typescript
// ✅ GOOD: Text-based snapshot for API responses
test('API response snapshot', async ({ request }) => {
  const response = await request.get('/api/products');
  const body = await response.json();

  // Snapshot the API response
  expect(JSON.stringify(body, null, 2)).toMatchSnapshot('products-api.txt');
});
```

### Rules for Copilot When Generating Visual Test Code

1. **Focus snapshots on components** rather than full pages
2. **Create separate snapshot test files** with .visual.spec.ts extension
3. **Disable animations and transitions** before taking screenshots
4. **Consider viewport sizes** when creating snapshots
5. **Use separate project in config** for visual tests
6. **Include threshold options** for image comparison when needed
7. **Group snapshots by component** or feature

## Mobile Testing

> **🎯 Core Principle:** Use device emulation rather than physical devices for most mobile testing scenarios.

### Device Emulation

```typescript
// ✅ GOOD: Mobile testing with device emulation
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
      },
    },
    // Other projects...
  ],
});

// mobile.spec.ts
test('responsive design on mobile', async ({ page }) => {
  await page.goto('/');

  // Test mobile-specific elements
  const mobileMenu = page.getByRole('button', { name: 'Menu' });
  await expect(mobileMenu).toBeVisible();

  // Test mobile interactions
  await mobileMenu.click();
  await expect(page.getByRole('navigation')).toBeVisible();

  // Test touch events
  await page.touchscreen.tap(100, 200);
});
```

### Responsive Testing

```typescript
// ✅ GOOD: Testing across viewport sizes
test('responsive layout adapts to screen size', async ({ page }) => {
  await page.goto('/responsive-page');

  // Test desktop layout
  await page.setViewportSize({ width: 1280, height: 800 });
  const desktopMenu = page.getByRole('navigation');
  await expect(desktopMenu).toBeVisible();

  // Test tablet layout
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(desktopMenu).toBeHidden();
  const tabletMenu = page.getByRole('button', { name: 'Menu' });
  await expect(tabletMenu).toBeVisible();

  // Test mobile layout
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByTestId('mobile-header')).toBeVisible();
});
```

### Rules for Copilot When Generating Mobile Test Code

1. **Use Playwright's device emulation** via the devices object
2. **Create separate projects** for key mobile devices
3. **Test touch interactions** where relevant
4. **Test responsive breakpoints** using setViewportSize
5. **Test mobile-specific UI elements** like hamburger menus
6. **Consider orientation changes** where relevant
7. **Test gestures** (swipe, pinch) for mobile-specific features

## Security Testing

> **🎯 Core Principle:** Include basic security tests as part of your automation suite to catch common vulnerabilities.

### Headers and Content Security Policy

```typescript
// ✅ GOOD: Testing security headers
test('page has proper security headers', async ({ page, request }) => {
  // Load the page
  const response = await request.get('/');

  // Check security headers
  const headers = response.headers();
  expect(headers['strict-transport-security']).toBeTruthy();
  expect(headers['content-security-policy']).toBeTruthy();
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['x-frame-options']).toBe('DENY');
});
```

### Authentication Checks

```typescript
// ✅ GOOD: Testing authentication security
test('protected route redirects unauthenticated users', async ({ page }) => {
  // Try to access protected route without auth
  await page.goto('/account/settings');

  // Should redirect to login
  await expect(page).toHaveURL(/login/);
});

test('expired token is handled correctly', async ({ page }) => {
  // Set expired token
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('auth_token', 'expired_token');
  });

  // Try accessing protected route
  await page.goto('/account/settings');

  // Should be redirected to login
  await expect(page).toHaveURL(/login/);

  // Should show expired session message
  await expect(page.getByText('Your session has expired')).toBeVisible();
});
```

### Rules for Copilot When Generating Security Test Code

1. **Include header checks** for security headers
2. **Test authentication boundaries** and protected routes
3. **Test session expiration** handling
4. **Verify CSRF protections** where relevant
5. **Test input validation** to prevent injection attacks
6. **Implement authorization tests** for role-based access controls
7. **Add tests for secure cookie settings** where applicable

## Modern Web Features

> **🎯 Core Principle:** Use Playwright's built-in capabilities to test modern web features like Shadow DOM, service workers, and web components.

### Shadow DOM

```typescript
// ✅ GOOD: Testing shadow DOM components
test('shadow DOM component works correctly', async ({ page }) => {
  await page.goto('/components');

  // Playwright can pierce shadow DOM automatically
  const shadowButton = page.getByRole('button', { name: 'Shadow Button' });
  await shadowButton.click();

  // Test shadow DOM interaction results
  await expect(page.getByText('Shadow DOM Clicked')).toBeVisible();
});
```

### Service Workers

```typescript
// ✅ GOOD: Testing with service workers
test('app works offline with service worker', async ({ page }) => {
  // Go to the page and wait for service worker to be installed
  await page.goto('/');

  // Wait for service worker to be registered
  await page.waitForFunction(() => {
    return navigator.serviceWorker.ready.then(() => true);
  });

  // Simulate offline mode
  await page.context().setOffline(true);

  // Navigate to cached page
  await page.goto('/offline-ready-page');

  // Should work offline
  await expect(page.getByText('Offline Ready')).toBeVisible();

  // Back to online mode
  await page.context().setOffline(false);
});
```

### Web Components

```typescript
// ✅ GOOD: Testing web components
test('custom element renders correctly', async ({ page }) => {
  await page.goto('/web-components');

  // Test custom element
  const customElement = page.getByRole('button', { name: 'Custom Button' });
  await expect(customElement).toBeVisible();

  // Test slot content
  await expect(page.locator('my-custom-element').getByText('Slot Content')).toBeVisible();

  // Test custom element interaction
  await customElement.click();
  await expect(page.getByText('Custom Event Fired')).toBeVisible();
});
```

### Rules for Copilot When Generating Tests for Modern Web Features

1. **Leverage Playwright's automatic shadow DOM support**
2. **Test service worker functionality** with offline mode
3. **Test web components** including slots and custom events
4. **Test progressive enhancement** where relevant
5. **Consider different browser compatibility** in your assertions
6. **Test modern JavaScript features** with appropriate browser projects
7. **Include appropriate waiting** for service worker initialization

## Final Guidelines for Copilot

> **🎯 Core Principle:** Generate code that follows all of the above best practices and is maintainable, readable, and robust.

### Code Organization Checklist

When generating Playwright test code, always follow this checklist:

✅ **Page Object Model** is implemented for UI interactions  
✅ **Locators** follow the priority order (role > text > form > semantic > testId > CSS/XPath)  
✅ **Assertions** are web-first and auto-waiting  
✅ **No hard-coded waits** in the generated code  
✅ **Tests are independent** and can run in parallel  
✅ **AAA pattern** is followed in all tests  
✅ **Appropriate fixtures** are used or suggested  
✅ **Error handling** is considered  
✅ **Comments** explain complex logic  
✅ **TypeScript** is used with proper typing

### Example of Complete Test Implementation

```typescript
// ✅ GOOD: Complete implementation following all best practices
// tests/fixtures/shop-fixtures.ts
import { test as baseTest } from '@playwright/test';
import { HomePage } from '../../page-objects/HomePage';
import { ProductPage } from '../../page-objects/ProductPage';
import { CartPage } from '../../page-objects/CartPage';

export const test = baseTest.extend({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';

// page-objects/ProductPage.ts
import { type Page, type Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;

  private readonly addToCartButton: Locator;
  private readonly productTitle: Locator;
  private readonly productPrice: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.productTitle = page.getByRole('heading', { level: 1 });
    this.productPrice = page.getByTestId('product-price');
    this.successMessage = page.getByText('Item added to your cart');
  }

  async navigate(productId: string): Promise<void> {
    await this.page.goto(`/products/${productId}`);
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async getProductDetails(): Promise<{ title: string; price: string }> {
    return {
      title: (await this.productTitle.textContent()) || '',
      price: (await this.productPrice.textContent()) || '',
    };
  }
}

// tests/specs/shopping/cart.spec.ts
import { test, expect } from '../../fixtures/shop-fixtures';
import { productData } from '../../../test-data/products';

test.describe('Shopping Cart Functionality', () => {
  test('user can add product to cart', async ({ page, productPage, cartPage }) => {
    // Arrange
    const testProduct = productData[0];
    await productPage.navigate(testProduct.id);

    // Capture product details for later verification
    const productDetails = await productPage.getProductDetails();

    // Act
    await productPage.addToCart();

    // Assert - item added message
    await expect(productPage.successMessage).toBeVisible();

    // Navigate to cart
    await page.getByRole('link', { name: 'Cart' }).click();

    // Assert - product is in cart with correct details
    await expect(cartPage.getCartItemByName(productDetails.title)).toBeVisible();
    await expect(cartPage.getCartTotal()).toContainText(productDetails.price);
  });

  test('user can remove product from cart', async ({ page, productPage, cartPage }) => {
    // Arrange - add product to cart first
    const testProduct = productData[0];
    await productPage.navigate(testProduct.id);
    await productPage.addToCart();
    await page.getByRole('link', { name: 'Cart' }).click();

    // Act - remove item
    await cartPage.removeItem(testProduct.name);

    // Assert
    await expect(cartPage.emptyCartMessage).toBeVisible();
    await expect(cartPage.getCartTotal()).toContainText('$0.00');
  });
});
```
