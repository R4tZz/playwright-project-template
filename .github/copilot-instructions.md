# Playwright Code Style Guide & Best Practices

## Introduction

This guide outlines best practices for writing maintainable, robust, and readable end-to-end tests using Playwright. It emphasizes the use of the Page Object Model (POM) design pattern and custom fixtures to promote code reuse and separation of concerns. The guide also covers modern testing approaches including soft assertions, parallel execution strategies, and enhanced debugging capabilities. Adhering to these practices will help ensure your test suite is scalable, reliable, and easy to manage.

This guide reflects the latest practices recommended in the official Playwright documentation as of 2025. Always refer to the [latest Playwright documentation](https://playwright.dev/docs/intro) for the most up-to-date information.

## Table of Contents

1.  [Recommended Folder Structure](#recommended-folder-structure)
2.  [General Best Practices](#general-best-practices)
3.  [Locators](#locators)
4.  [Page Object Model (POM)](#page-object-model-pom)
    - [Structure](#structure)
    - [Naming Conventions](#naming-conventions)
    - [Locators in POM](#locators-in-pom)
    - [Action Methods](#action-methods)
    - [Assertions](#assertions-in-pom)
    - [Example](#pom-example)
5.  [Custom Fixtures](#custom-fixtures)
    - [Purpose](#purpose)
    - [Creating Fixtures](#creating-fixtures)
    - [Using Fixtures](#using-fixtures)
    - [Scope](#scope)
    - [Example](#fixture-example)
6.  [Assertions](#assertions)
    - [Web-First Assertions](#web-first-assertions)
    - [Soft Assertions](#soft-assertions)
    - [Common Assertions](#common-assertions)
7.  [Waiting Mechanisms](#waiting-mechanisms)
8.  [Test Structure and Naming](#test-structure-and-naming)
9.  [Configuration (`playwright.config.ts`)](#configuration-playwrightconfigts)
10. [Parallel Testing](#parallel-testing)
11. [Debugging](#debugging)
12. [Clock Management](#clock-management)
13. [Test Sharding](#test-sharding)
14. [Performance Testing](#performance-testing)
15. [Miscellaneous](#miscellaneous)
16. [API Testing and Authentication](#api-testing-and-authentication)
17. [Visual Testing and Snapshots](#visual-testing-and-snapshots)
18. [Mobile Testing](#mobile-testing)
19. [Security Testing](#security-testing)
20. [Modern Web Features](#modern-web-features)

## Recommended Folder Structure

A well-organized folder structure is crucial for maintainability as your test suite grows. Here's a recommended structure that aligns with POM and fixture usage:

```
your-project-root/
├── .env                # Environment variables (add to .gitignore)
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies and scripts
├── playwright.config.ts # Playwright configuration file
├── tests/              # Root directory for test specifications
│   ├── fixtures/       # Custom fixtures definitions (or a single fixtures.ts here)
│   │   └── fixtures.ts
│   ├── specs/          # Actual test files (can be further nested by feature)
│   │   ├── auth/       # Tests related to authentication
│   │   │   └── login.spec.ts
│   │   ├── shopping_cart/ # Tests for shopping cart feature
│   │   │   └── cart.spec.ts
│   │   └── product_search.spec.ts
│   └── example.spec.ts # Default Playwright example test (can be removed)
├── page-objects/       # Directory for Page Object Model classes
│   ├── components/     # Reusable UI components (e.g., header, footer, modals)
│   │   └── HeaderComponent.ts
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   └── ProductDetailsPage.ts
├── test-data/          # Optional: Directory for test data files (e.g., JSON, CSV)
│   └── users.json
├── utils/              # Optional: For reusable helper functions (not POMs or fixtures)
│   └── api-helpers.ts
└── test-results/       # Default output for reports, traces, screenshots (add to .gitignore)
    └── ...             # Generated content
```

**Explanation:**

- **`playwright.config.ts`**: The main configuration file at the root.
- **`tests/`**: Contains all test-related code.
  - **`fixtures/`** (or `tests/fixtures.ts`): Houses custom fixture definitions, keeping setup logic separate.
  - **`specs/`** (or directly under `tests/`): Contains the actual test files (`*.spec.ts`). Grouping tests by feature (e.g., `auth/`, `shopping_cart/`) within this directory is highly recommended for larger projects. The `testDir` option in `playwright.config.ts` should point here (e.g., `testDir: './tests/specs'`).
- **`page-objects/`**: Contains all POM classes.
  - **`components/`**: A sub-directory within `page-objects` for POM classes representing reusable components shared across multiple pages (like navigation bars, modals, etc.).
- **`test-data/`**: An optional directory to store static data used by tests.
- **`utils/`** or **`helpers/`**: Optional directory for generic helper functions that don't belong in a specific Page Object or fixture (e.g., data generators, specific API interaction helpers).
- **`.env`**: Store environment variables like base URLs, usernames, passwords. **Ensure this is added to `.gitignore`**.
- **`test-results/`**: Playwright's default output directory. **Ensure this is added to `.gitignore`**.

This structure promotes separation of concerns and makes it easier to navigate and maintain the test suite. Adjust the naming and nesting according to your project's specific needs and scale.

## General Best Practices

- **Keep Tests Independent:** Each test should run independently without relying on the state left by previous tests. Use `test.beforeEach` or fixtures for setup and `test.afterEach` for cleanup if necessary.
- **Use `test.describe` for Grouping:** Group related tests using `test.describe()` for better organization and reporting (aligns well with the folder structure under `tests/specs/`).
- **Avoid `page.waitForTimeout()`:** Do not use hard-coded waits. Rely on Playwright's auto-waiting mechanisms and web-first assertions. Use `page.waitForTimeout()` only for debugging purposes or very specific scenarios where other waits are unsuitable (which is rare).
- **Prefer Async/Await:** Use `async`/`await` consistently for all Playwright operations.

## Locators

- **Prefer User-Facing Locators:** Prioritize locators that users can see and interact with. Playwright's recommended order:
  1.  `page.getByRole()`: Locates by ARIA role, attributes, and accessible name. Most resilient.
  2.  `page.getByText()`: Locates by text content.
  3.  `page.getByLabel()`: Locates form controls by associated label text.
  4.  `page.getByPlaceholder()`: Locates inputs by placeholder.
  5.  `page.getByAltText()`: Locates elements (usually images) by `alt` text.
  6.  `page.getByTitle()`: Locates elements by title attribute.
  7.  `page.getByTestId()`: Locates by `data-testid` attribute (configurable via `testIdAttribute` in config). Use this when semantic locators aren't feasible.
- **Avoid XPath and CSS Selectors When Possible:** These are less resilient to DOM changes compared to user-facing locators. Use them as a last resort.
- **Use Locator Chaining/Filtering:** Refine locators using methods like `.filter()`, `.first()`, `.last()`, `.nth()`.

  ```typescript
  // Good: Filter by text within a role
  page.getByRole('listitem').filter({ hasText: 'Product Name' });

  // Good: Get the first button
  page.getByRole('button').first();
  ```

## Page Object Model (POM)

POM is a design pattern that encapsulates interactions with the UI of a specific page or component into a dedicated class. This separates test logic from UI interaction details.

### Structure

- Create a separate file for each page or significant reusable component (e.g., `HomePage.ts`, `LoginPage.ts`, `ShoppingCartComponent.ts`) within the `page-objects/` directory.
- The class should encapsulate locators and methods specific to that page/component.

### Naming Conventions

- **Files:** Use PascalCase ending with `Page` or `Component` (e.g., `ProductDetailsPage.ts`). Place them in the `page-objects/` directory or subdirectories.
- **Classes:** Use PascalCase matching the file name (e.g., `ProductDetailsPage`).
- **Methods:** Use camelCase describing the user action (e.g., `MapsTo`, `login`, `addProductToCart`).

### Locators in POM

- Define locators as `readonly` properties within the class, typically initialized in the constructor or as class fields.
- Keep locators `private` or `protected` if they are only used internally by the POM's methods. Expose them publicly only if absolutely necessary for complex assertions in the test file.
- Use the `page` or a `locator` instance passed to the constructor.

```typescript
// page-objects/LoginPage.ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  readonly errorMessage: Locator; // May need to be public for assertions

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.errorMessage = page.locator('.error-message'); // Example using CSS if needed
  }

  // ... action methods
}
```

### Action Methods

- Create public methods that represent user actions or workflows on the page (e.g., `login(username, password)`, `search(query)`, `MapsToProfile()`).
- Methods should perform actions using the defined locators.
- Methods performing navigation should typically return an instance of the _next_ Page Object.
- Methods performing actions on the same page usually return `void` or `this` (for chaining if desired, though less common in modern Playwright).

```typescript
// page-objects/LoginPage.ts
import { type Page, type Locator } from '@playwright/test';
import { DashboardPage } from './DashboardPage'; // Import next page

export class LoginPage {
  // ... (constructor and locators as above)

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAndExpectSuccess(username: string, password: string): Promise<DashboardPage> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    // Assuming successful login navigates to DashboardPage
    return new DashboardPage(this.page);
  }

  async navigateTo(): Promise<void> {
    // Assumes baseURL is set in playwright.config.ts
    await this.page.goto('/login');
  }
}
```

### Assertions in POM

- **Avoid Assertions:** Generally, avoid putting `expect` assertions within POM methods. POMs should focus on _actions_ and _locating elements_. Assertions belong in the test files (`tests/specs/**/*.spec.ts`) to define the expected outcomes.
- **Exception:** Simple, reusable assertions checking the state _of the page itself_ (e.g., `isErrorMessageVisible()`) _might_ be acceptable, but prefer keeping assertions in tests for clarity.

### POM Example (`tests/specs/auth/login.spec.ts` using `LoginPage`)

```typescript
// tests/specs/auth/login.spec.ts
import { test, expect } from '../../fixtures/fixtures'; // Import custom test if using fixtures

// If not using fixtures for POM initialization:
// import { test, expect } from '@playwright/test';

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ loginPage }) => {
    // Initialize POM here if not using a fixture
    await loginPage.navigateTo();
  });

  test('should allow login with valid credentials', async ({ loginPage }) => {
    // ACT
    const dashboardPage = await loginPage.loginAndExpectSuccess('validUser', 'validPassword');

    // ASSERT
    // Assertion using a locator/method from the *next* page object
    await expect(dashboardPage.welcomeMessage).toBeVisible(); // Assuming DashboardPage has welcomeMessage locator
    await expect(dashboardPage.page).toHaveURL(/.*dashboard/); // Or use dashboardPage.expectToBeOnPage();
  });

  test('should show error message with invalid credentials', async ({ loginPage }) => {
    // ACT
    await loginPage.login('invalidUser', 'wrongPassword');

    // ASSERT
    // Assertion using a locator from the *current* page object
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid username or password');
  });
});
```

## Custom Fixtures

Fixtures provide context for your tests, such as setting up environments, initializing POMs, or providing data. They help reduce boilerplate and improve test setup consistency. They typically reside in the `tests/fixtures/` directory.

### Purpose

- **Setup/Teardown:** Perform actions before (and optionally after) tests or workers run (e.g., log in a user, seed a database, start a server).
- **Provide Context:** Pass pre-configured objects like authenticated pages, API clients, or initialized Page Objects directly to tests.
- **Parameterization:** Run tests with different configurations or data sets.

### Creating Fixtures

- Define fixtures by extending the `base` test object from `@playwright/test`.
- Place fixture definitions in `tests/fixtures/fixtures.ts` (or similar).
- A fixture function takes dependencies (like `page`, `browser`, other fixtures) and uses the `use` function to provide the fixture value.

```typescript
// tests/fixtures/fixtures.ts
import { test as base, expect } from '@playwright/test'; // Import expect here too
import { HomePage } from '../../page-objects/HomePage';
import { LoginPage } from '../../page-objects/LoginPage';
import { DashboardPage } from '../../page-objects/DashboardPage';

// Define the types for your fixtures
type MyFixtures = {
  homePage: Homepage;
  loginPage: LoginPage;
  loggedInPage: Page; // Example: A page already logged in
  dashboardPage: DashboardPage;
};

// Extend the base test with your fixtures
export const test = base.extend<MyFixtures>({
  // Default fixture format
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  // Fixture to provide an initialized LoginPage instance
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo(); // Optional: Navigate automatically
    await use(loginPage);
    // Add cleanup if needed after 'use'
  },

  // Fixture to provide a page instance that is already logged in
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('fixtureUser', 'fixturePassword');
    // Ensure login was successful (e.g., wait for a dashboard element)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await use(page);
    // Optional: Add logout logic here if needed for cleanup
  },

  // Fixture providing DashboardPage - depends on a logged-in state
  dashboardPage: async ({ loggedInPage }, use) => {
    // Use loggedInPage fixture which ensures user is logged in
    const dashboardPage = new DashboardPage(loggedInPage);
    await use(dashboardPage);
  },
});

// Re-export expect so tests import it from fixtures file
export { expect };
```

### Using Fixtures

- Import the custom `test` and `expect` objects from your fixtures file (`tests/fixtures/fixtures.ts`) in your spec files (`tests/specs/**/*.spec.ts`).
- Destructure the fixture names in the test function parameters.

```typescript
// tests/specs/dashboard/dashboard.spec.ts
import { test, expect } from '../../fixtures/fixtures'; // Import custom test and expect

test.describe('Dashboard Tests (using fixtures)', () => {
  // Test using the loggedInPage and dashboardPage fixtures
  test('should display welcome message', async ({ dashboardPage }) => {
    // ARRANGE is handled by the fixture

    // ACT (Optional, if further action needed)

    // ASSERT
    await expect(dashboardPage.welcomeMessage).toContainText('Welcome');
  });

  // Test using the loginPage fixture (less common if loggedInPage exists, but possible)
  test('should allow navigation from login page', async ({ loginPage, dashboardPage }) => {
    // ARRANGE (partially done by fixture - loginPage is initialized and navigated)

    // ACT
    await loginPage.loginAndExpectSuccess('user', 'pass');

    // ASSERT
    await expect(dashboardPage.welcomeMessage).toBeVisible();
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
```

### Scope

- **`test` (default):** The fixture setup/teardown runs for _each_ test function.
- **`worker`:** The fixture setup/teardown runs _once per worker process_. Useful for expensive setups like logging in once for multiple tests run by the same worker. Use `scope: 'worker'` in the fixture definition.

```typescript
// tests/fixtures/fixtures.ts
// ...
export const test = base.extend<MyFixtures & { workerScopedData: string }>({
  // ... other fixtures

  workerScopedData: [
    async ({}, use) => {
      // Setup runs once per worker
      const data = await initializeSomethingExpensive();
      await use(data);
      // Teardown runs once per worker after all tests in that worker finish
      await cleanupSomethingExpensive(data);
    },
    { scope: 'worker' },
  ], // Set scope to worker
});
// ...
```

### Fixture Example

See `tests/fixtures/fixtures.ts` and `tests/specs/dashboard/dashboard.spec.ts` above.

## Assertions

### Web-First Assertions

- **Use Web-First Assertions:** Always prefer `expect(locator)` assertions (e.g., `expect(locator).toBeVisible()`, `expect(locator).toHaveText()`). They automatically wait for the condition to be met within the configured timeout.
- **Avoid `expect(await locator.isVisible())`:** This creates race conditions as the element state might change between the `isVisible()` call and the assertion.

### Soft Assertions

- **Soft Assertions:** Use soft assertions to continue test execution even if an assertion fails. This is useful for exploratory testing or when multiple conditions need to be checked without stopping the test.
- **Example:**
  ```typescript
  test('soft assertions example', async ({ page }) => {
    await page.goto('/dashboard');
    expect.soft(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    expect.soft(page.getByText('Welcome')).toContainText('Welcome');
  });
  ```

### Common Assertions

- **Common Assertions:**
  - `expect(locator).toBeVisible()` / `.toBeHidden()`
  - `expect(locator).toBeEnabled()` / `.toBeDisabled()`
  - `expect(locator).toHaveText()` / `.toContainText()`
  - `expect(locator).toHaveAttribute()`
  - `expect(locator).toHaveValue()`
  - `expect(locator).toHaveCount()`
  - `expect(locator).toBeChecked()`
  - `expect(page).toHaveURL()`
  - `expect(page).toHaveTitle()`
  - `expect(apiResponse).toBeOK()` (for API testing)
- **Keep Assertions in Test Files:** As mentioned in the POM section, test files (`tests/specs/**/*.spec.ts`) are the primary place for assertions.

## Waiting Mechanisms

- **Rely on Auto-Waiting:** Playwright actions (like `.click()`, `.fill()`) and web-first assertions (`expect(locator)...`) have built-in auto-waiting. Use them primarily.
- **Explicit Waits (Use Sparingly):**
  - `page.waitForURL()`: Wait for the page URL to match a pattern.
  - `page.waitForSelector()`: (Less recommended) Wait for an element matching the selector. Prefer `expect(locator).toBeVisible()`.
  - `page.waitForResponse()`: Wait for a specific network response.
  - `page.waitForLoadState()`: Wait for 'load', 'domcontentloaded', or 'networkidle'. Use 'networkidle' cautiously.
  - `expect(locator).toBeVisible({ timeout: 10000 })`: Override default timeout for a specific assertion.

## Test Structure and Naming

- **Arrange-Act-Assert (AAA):** Structure your tests clearly:
  1.  **Arrange:** Set up preconditions (often handled by `beforeEach` or fixtures).
  2.  **Act:** Perform the action(s) being tested (usually calls to POM methods).
  3.  **Assert:** Verify the outcome using `expect`.
- **Descriptive Names:**
  - `test.describe()`: Describe the feature or component being tested (e.g., `'Login Page'`, `'Shopping Cart'`). Aligns with folder names under `tests/specs/`.
  - `test()`: Describe the specific scenario or expected outcome (e.g., `'should display error on invalid login'`, `'should allow adding items to cart'`).

## Configuration (`playwright.config.ts`)

- **`testDir`:** Specify the directory where test specification files are located (e.g., `./tests/specs`).
- **`outputDir`:** Define where test results like traces, screenshots, and videos are stored (e.g., `./test-results`).
- **`baseURL`:** Define a base URL to simplify navigation (`page.goto('/login')`).
- **`timeout`:** Set the global timeout for each test.
- **`expect.timeout`:** Set the default timeout for `expect` assertions. Keep it reasonably short but sufficient for elements to appear.
- **`use`:** Configure browser context options globally or per project (e.g., `viewport`, `headless`, `screenshot`, `trace`, `video`, `permissions`).
- **`projects`:** Define configurations for different browsers (Chromium, Firefox, WebKit) or setups (e.g., mobile emulation, different authentication states).
- **`reporter`:** Configure test reporters (e.g., `html`, `list`, `json`). The HTML reporter is excellent for debugging.
- **`fullyParallel`: `true`** is recommended for faster execution by running files in parallel.
- **`forbidOnly`: `true`** in CI environments prevents accidentally committing focused tests (`test.only`).
- **`retries`:** Configure retries for flaky tests (e.g., `1` or `2` in CI).

## Parallel Testing

- **Enable Parallel Execution:** Use `fullyParallel: true` in the configuration to run tests in parallel across multiple files. This significantly reduces test execution time.
- **Worker Isolation:** Ensure tests are independent and do not share state between workers. Use worker-scoped fixtures for expensive setups.
- **Example Configuration:**
  ```typescript
  // playwright.config.ts
  export default {
    fullyParallel: true,
    workers: 4, // Adjust based on your machine's capabilities
    retries: 2, // Retry flaky tests
  };
  ```

## Debugging

- **Tracing:** Enable tracing (`trace: 'on'` or `'retain-on-failure'` in config) for debugging. The trace viewer provides invaluable insights into test execution failures.
- **Debug Mode:** Use `PWDEBUG=1` environment variable to run tests in debug mode (`npx playwright test`).
- **Step-by-Step Execution:** Use `page.pause()` to pause execution and inspect the state interactively.
- **Screenshots and Videos:** Configure `screenshot: 'on'` and `video: 'on'` in the configuration for visual debugging.
- **Playwright Inspector:** Use the Playwright Inspector (`npx playwright codegen`) to explore locators and record interactions.

## Clock Management

Clock management is crucial for testing time-dependent features reliably. Playwright provides built-in capabilities to control time in your tests.

- **Install Clock:** Set up clock control at the start of your test:

  ```typescript
  await page.clock.install({ time: new Date('2024-12-10T08:00:00') });
  ```

- **Pause Time:** Freeze time at a specific moment:

  ```typescript
  await page.clock.pauseAt(new Date('2024-12-10T10:00:00'));
  ```

- **Resume Time:** Allow time to progress normally:
  ```typescript
  await page.clock.resume();
  ```

## Test Sharding

For large test suites, sharding allows distributing tests across multiple machines or processes:

- **Command Line Usage:**

  ```bash
  npx playwright test --shard=1/3  # Run first shard of three
  npx playwright test --shard=2/3  # Run second shard
  npx playwright test --shard=3/3  # Run third shard
  ```

- **CI Configuration Example:**
  ```yaml
  jobs:
    test:
      strategy:
        matrix:
          shard: [1/3, 2/3, 3/3]
      steps:
        - run: npx playwright test --shard=${{ matrix.shard }}
  ```

## Performance Testing

Consider these best practices when measuring performance:

- **Network Throttling:**

  ```typescript
  test('slow network test', async ({ browser }) => {
    const context = await browser.newContext({
      networkThrottling: {
        downloadThroughput: 1024 * 1024, // 1 Mbps
        uploadThroughput: 1024 * 1024, // 1 Mbps
        latency: 100, // 100ms
      },
    });
    const page = await context.newPage();
    // ... test with throttled network
  });
  ```

- **CPU Throttling:**

  ```typescript
  test('slow CPU test', async ({ browser }) => {
    const context = await browser.newContext({
      throttling: {
        cpu: 4, // CPU slowdown factor
      },
    });
    // ... test with throttled CPU
  });
  ```

- **Resource Timing:**
  ```typescript
  test('measure page load', async ({ page }) => {
    const timing = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        responseStart: navigation.responseStart,
        loadEventEnd: navigation.loadEventEnd,
      };
    });
    console.log(`Page load time: ${timing.loadEventEnd - timing.responseStart}ms`);
  });
  ```

## Miscellaneous

- **Environment Variables:** Use environment variables (`.env` files with `dotenv`) for sensitive data (credentials) and environment-specific configurations (like `baseURL`). Access them via `process.env`. Store `.env` at the project root and add it to `.gitignore`.
- **Playwright Codegen:** Use `npx playwright codegen <url>` as a tool to help discover locators or record basic interactions, but always review and refine the generated code to follow best practices (especially locator strategy).
- **API Testing:** Leverage Playwright's `request` context (`playwright.request`) for API testing or for setting up application state via API calls before UI interaction. Create API client wrappers (potentially in `utils/`) similar to POMs.
- **Keep Tests Focused:** Each test should ideally verify one specific piece of functionality or requirement. Avoid overly long or complex tests trying to cover too much.

## API Testing and Authentication

### API Request Context

Use Playwright's built-in `APIRequestContext` for API testing and setting up test data:

```typescript
// tests/fixtures/api-fixtures.ts
import { test as base } from '@playwright/test';

export type APIFixtures = {
  apiContext: APIRequestContext;
  createUser: (data: UserData) => Promise<User>;
};

export const test = base.extend<APIFixtures>({
  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL,
      extraHTTPHeaders: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });
    await use(context);
    await context.dispose();
  },

  createUser: async ({ apiContext }, use) => {
    const createUserFn = async (data: UserData) => {
      const response = await apiContext.post('/users', { data });
      return response.json();
    };
    await use(createUserFn);
  },
});
```

### Authentication Patterns

1. **Token-based Authentication:**

```typescript
// tests/fixtures/auth-fixtures.ts
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Get token from API or auth service
    const token = await getAuthToken();

    // Set token in localStorage before page load
    await page.addInitScript((token) => {
      window.localStorage.setItem('auth_token', token);
    }, token);

    await use(page);
  },
});
```

2. **Cookie-based Authentication:**

```typescript
// tests/fixtures/auth-fixtures.ts
export const test = base.extend<AuthFixtures>({
  authenticatedContext: async ({ browser }, use) => {
    const context = await browser.newContext();

    // Login and get cookies
    const loginResponse = await context.request.post('/api/login', {
      data: { username: 'user', password: 'pass' },
    });
    const cookies = await context.cookies();

    // Store authentication state
    await context.storageState({ path: './auth.json' });

    await use(context);
    await context.close();
  },
});
```

### Testing REST APIs

Create dedicated API client classes for different API domains:

```typescript
// utils/api-clients/UserApiClient.ts
export class UserApiClient {
  constructor(private apiContext: APIRequestContext) {}

  async getUser(id: string) {
    const response = await this.apiContext.get(`/users/${id}`);
    if (!response.ok()) throw new Error(`Failed to get user: ${response.statusText()}`);
    return response.json();
  }

  async createUser(data: UserData) {
    const response = await this.apiContext.post('/users', { data });
    if (!response.ok()) throw new Error(`Failed to create user: ${response.statusText()}`);
    return response.json();
  }
}
```

Use API clients in tests:

```typescript
// tests/specs/api/users.spec.ts
test('should create and retrieve user', async ({ apiContext }) => {
  const userApi = new UserApiClient(apiContext);

  // Create user
  const userData = { name: 'Test User', email: 'test@example.com' };
  const created = await userApi.createUser(userData);

  // Verify user was created
  const retrieved = await userApi.getUser(created.id);
  expect(retrieved).toMatchObject(userData);
});
```

## Visual Testing and Snapshots

### Visual Comparison Testing

Visual testing helps catch unintended visual regressions. Playwright provides built-in support for screenshot comparison:

```typescript
// tests/specs/visual/homepage.spec.ts
test('homepage visual regression', async ({ page }) => {
  await page.goto('/');

  // Take screenshot of specific element
  await expect(page.getByRole('main')).toHaveScreenshot('homepage-main.png');

  // Take full page screenshot
  await expect(page).toHaveScreenshot('homepage-full.png', {
    fullPage: true,
  });
});
```

### Screenshot Configuration

Configure screenshot behavior in `playwright.config.ts`:

```typescript
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      // Threshold for pixel difference
      maxDiffPixelRatio: 0.1,

      // Snapshot storage location
      pathTemplate: './screenshots/{testFilePath}/{arg}{ext}',

      // Automatically update snapshots
      updateSnapshots: process.env.UPDATE_SNAPSHOTS === 'true',
    },
  },
});
```

### Accessibility Snapshots

Use accessibility snapshots to catch accessibility regressions:

```typescript
test('navigation menu accessibility', async ({ page }) => {
  await page.goto('/');

  // Take accessibility snapshot of navigation
  await expect(page.getByRole('navigation')).toMatchAriaSnapshot('navigation-a11y.json');
});
```

### Best Practices for Visual Testing

1. **Stable Test Environment:**
   - Use fixed viewport sizes
   - Disable animations
   - Mock dynamic content
   - Use deterministic data

```typescript
test.describe('visual tests', () => {
  test.use({
    viewport: { width: 1280, height: 720 },
    contextOptions: {
      reducedMotion: 'reduce',
    },
  });

  test('component appearance', async ({ page }) => {
    // Your visual test
  });
});
```

2. **Focused Screenshots:**

   - Prefer component-level screenshots over full page
   - Use clear, descriptive snapshot names
   - Group related visual tests together

3. **Maintenance Strategy:**
   - Review visual differences carefully
   - Update screenshots deliberately with `--update-snapshots`
   - Include screenshot baselines in version control
   - Document known visual variations

## Mobile Testing

### Device Emulation

Configure mobile device testing in `playwright.config.ts`:

```typescript
import { devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'Pixel 5',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'iPhone 12',
      use: {
        ...devices['iPhone 12'],
      },
    },
  ],
});
```

### Touch Gestures

Test mobile-specific interactions:

```typescript
test('swipe gesture', async ({ page }) => {
  // Swipe from right to left
  await page.getByTestId('carousel').swipe('right', 'left');

  // Tap element
  await page.getByRole('button').tap();

  // Multi-touch gesture (pinch)
  await page.touchscreen.pinch(100, 200, 'zoom-in');
});
```

### Responsive Design Testing

Test responsive behavior across breakpoints:

```typescript
test('responsive layout', async ({ page }) => {
  // Test mobile layout
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.getByTestId('mobile-menu')).toBeVisible();

  // Test desktop layout
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(page.getByTestId('desktop-menu')).toBeVisible();
});
```

### Mobile-Specific Best Practices

1. **Device Context:**

   - Use real device names from `devices` export
   - Set appropriate viewport sizes
   - Configure touch/mobile-specific flags

2. **Network Conditions:**

   - Emulate mobile network conditions
   - Test offline functionality

   ```typescript
   test.use({
     networkConditions: {
       download: (1000 * 1024) / 8, // 1 Mbps
       upload: (500 * 1024) / 8, // 500 Kbps
       latency: 100, // 100ms
     },
   });
   ```

3. **Touch-First Testing:**
   - Prefer `tap()` over `click()`
   - Test touch-specific gestures
   - Verify hover alternatives
4. **Viewport Management:**
   - Test orientation changes
   - Verify content reflow
   - Check for overflow issues

## Security Testing

### Authentication Testing

Test various authentication scenarios:

```typescript
test.describe('Authentication Security', () => {
  test('should prevent XSS in login form', async ({ page }) => {
    const xssPayload = '<script>alert(1)</script>';
    await page.getByLabel('Username').fill(xssPayload);
    await page.getByRole('button', { name: 'Login' }).click();
    // Verify XSS payload is properly escaped
    await expect(page.locator('body')).not.toContainText(xssPayload);
  });

  test('should enforce password requirements', async ({ page }) => {
    await page.getByLabel('Password').fill('weak');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
  });
});
```

### CSRF Protection

Verify CSRF token handling:

```typescript
test('should include CSRF token in forms', async ({ page }) => {
  await page.goto('/form');
  const csrfToken = await page.locator('input[name="csrf_token"]').getAttribute('value');
  expect(csrfToken).toBeTruthy();
});
```

### Headers and Security Policies

Test security-related headers:

```typescript
test('should set security headers', async ({ page }) => {
  const response = await page.goto('/');
  const headers = response.headers();
  expect(headers['content-security-policy']).toBeTruthy();
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['x-content-type-options']).toBe('nosniff');
});
```

### Cookie Security

Verify secure cookie attributes:

```typescript
test('should set secure cookie attributes', async ({ context }) => {
  await context.addCookies([
    {
      name: 'session',
      value: 'test',
      domain: 'example.com',
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'Strict',
    },
  ]);
});
```

### API Security

Test API endpoint security:

```typescript
test('should require authentication for protected endpoints', async ({ request }) => {
  const response = await request.get('/api/protected');
  expect(response.status()).toBe(401);

  const response2 = await request.get('/api/protected', {
    headers: {
      Authorization: `Bearer ${invalidToken}`,
    },
  });
  expect(response2.status()).toBe(403);
});
```

### Best Practices

1. **Input Validation:**

   - Test for XSS vulnerabilities
   - Verify SQL injection protection
   - Check file upload restrictions

2. **Authentication:**

   - Test password complexity rules
   - Verify account lockout policies
   - Check session timeout behavior

3. **Authorization:**

   - Test role-based access control
   - Verify resource permissions
   - Check for horizontal privilege escalation

4. **API Security:**

   - Validate rate limiting
   - Test API key rotation
   - Verify proper error handling

5. **Data Protection:**
   - Test sensitive data masking
   - Verify secure transmission
   - Check secure storage practices

## Modern Web Features

### Web Components

Test Shadow DOM elements:

```typescript
test('should interact with shadow DOM', async ({ page }) => {
  // Access elements in shadow DOM
  const button = page.locator('my-component').locator('>>> button');
  await button.click();

  // Assert on shadow DOM content
  await expect(page.locator('my-component').locator('>>> .content')).toContainText('Updated');
});
```

### Service Workers

Test service worker functionality:

```typescript
test('should handle offline mode', async ({ context, page }) => {
  // Wait for service worker registration
  await page.waitForServiceWorker();

  // Simulate offline mode
  await context.setOffline(true);

  // Verify offline functionality
  await page.goto('/offline-page');
  await expect(page.getByText('You are offline')).toBeVisible();
});
```

### WebSocket Testing

Monitor WebSocket connections:

```typescript
test('should handle WebSocket messages', async ({ page }) => {
  // Listen for WebSocket frames
  page.on('websocket', (ws) => {
    ws.on('framesent', (data) => console.log(data));
    ws.on('framereceived', (data) => console.log(data));
  });

  await page.goto('/chat');

  // Verify real-time updates
  await page.getByRole('textbox').fill('Hello');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByTestId('messages')).toContainText('Hello');
});
```

### Web Workers

Test web worker functionality:

```typescript
test('should handle web worker computation', async ({ page }) => {
  // Monitor worker creation
  const worker = await page.waitForWorker(/worker\.js$/);

  // Verify worker functionality
  await page.getByRole('button', { name: 'Start Calculation' }).click();
  await expect(page.getByTestId('result')).toHaveText('42');
});
```

### Modern JavaScript Features

Test modules and async functionality:

```typescript
test('should handle dynamic imports', async ({ page }) => {
  // Wait for dynamic import to complete
  await page.waitForLoadState('domcontentloaded');

  // Verify module functionality
  await expect(page.getByTestId('module-content')).toBeVisible();
});
```

### Best Practices for Modern Web Features

1. **Shadow DOM Testing:**

   - Use `>>>` combinator for shadow DOM selectors
   - Test component encapsulation
   - Verify style isolation

2. **Service Worker Testing:**

   - Test installation and activation
   - Verify cache strategies
   - Test offline functionality
   - Check push notifications

3. **Real-time Testing:**

   - Monitor WebSocket connections
   - Test reconnection logic
   - Verify message ordering
   - Handle connection failures

4. **Performance Considerations:**
   - Monitor resource loading
   - Test lazy loading behavior
   - Verify progressive enhancement
   - Check memory usage with workers
