# 🎭 Playwright Test Automation Template

[![Playwright Tests](https://github.com/yourusername/playwright-project-template/actions/workflows/tests.yml/badge.svg)](https://github.com/yourusername/playwright-project-template/actions/workflows/tests.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.40+-green)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready template for end-to-end testing using **Playwright**, **TypeScript**, and the **Page Object Model** pattern. This template follows industry best practices for maintainable, scalable, and reliable test automation.

> 🚀 **Quick Start**: Get your test automation project up and running in under 5 minutes!

## ✨ Features

### 🔧 **Core Testing Framework**

- 🎭 **[Playwright](https://playwright.dev/)** - Fast, reliable end-to-end testing for modern web apps
- 📦 **TypeScript** - Full type safety and IntelliSense support
- 🏗️ **Page Object Model (POM)** - Maintainable test architecture
- 🔄 **Custom Fixtures** - Reusable test setup and teardown
- 🧪 **Web-First Assertions** - Auto-waiting, reliable assertions

### 🎨 **Code Quality & Standards**

- ✅ **ESLint + Prettier** - Consistent code formatting and linting
- 📏 **TypeScript Strict Mode** - Enhanced type checking
- 🔍 **VS Code Integration** - Debugging and IntelliSense support
- 📝 **JSDoc Documentation** - Well-documented code

### 🚀 **Performance & Reliability**

- ⚡ **Parallel Execution** - Fast test runs across multiple workers
- 🌐 **Cross-Browser Testing** - Chromium, Firefox, Safari, and mobile
- 🔄 **Test Retries** - Automatic retry on CI failures
- 📊 **Multiple Report Formats** - HTML, JSON, JUnit, and more

### 🛠️ **Developer Experience**

- 🎯 **Test Generation** - Playwright Codegen integration
- � **Environment Management** - dotenv configuration
- � **Mobile Testing** - Device emulation support
- 🎥 **Visual Debugging** - Screenshots, videos, and traces
- ⚙️ **CI/CD Ready** - GitHub Actions workflow included

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 8.x or higher (comes with Node.js)
- **VS Code** (recommended) with [Playwright Test extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

### ⚡ Installation

1. **Create a new project** using this template:

   ```bash
   # Using GitHub CLI
   gh repo create my-playwright-tests --template yourusername/playwright-project-template

   # Or clone directly
   git clone https://github.com/yourusername/playwright-project-template.git my-playwright-tests
   cd my-playwright-tests
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Install Playwright browsers**:

   ```bash
   npx playwright install
   ```

4. **Set up environment variables**:

   ```bash
   # Copy the example environment file
   copy .env.example .env  # Windows
   cp .env.example .env    # macOS/Linux

   # Edit .env with your configuration
   code .env
   ```

### 🎯 Verify Installation

Run the sample tests to ensure everything is working:

```bash
npm test
```

You should see tests running across multiple browsers. Open the HTML report to view detailed results:

```bash
npx playwright show-report
```

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests across all browsers
npm test

# Run tests with interactive UI mode (recommended for development)
npm run ui-mode

# Run tests in headed mode (see browser)
npm run test-headed

# Run specific browser tests
npm run test-chromium
npm run test-firefox
npm run test-webkit

# Run tests with debug traces
npm run test-trace

# Debug tests (step through with debugger)
npm run debug
```

### Advanced Test Execution

```bash
# Run specific test file
npx playwright test tests/specs/home.spec.ts

# Run tests matching a pattern
npx playwright test --grep "login"

# Run tests in specific project
npx playwright test --project=chromium

# Run tests with different reporters
npx playwright test --reporter=json
npx playwright test --reporter=junit

# Run tests in parallel with custom workers
npx playwright test --workers=4

# Run tests with custom timeout
npx playwright test --timeout=60000
```

### 🔧 Test Development Tools

```bash
# Generate tests with Playwright Codegen
npm run codegen

# Record tests against your app
npx playwright codegen http://localhost:3000

# Show test reports
npx playwright show-report

# Show test traces (after running with --trace)
npx playwright show-trace test-results/trace.zip
```

## 📁 Project Structure

```
📂 playwright-project-template/
├── 📄 .env.example          # Environment variables template
├── 📄 .gitignore           # Git ignore rules
├── 📄 package.json         # Project dependencies and scripts
├── 📄 playwright.config.ts # Playwright configuration
├── 📄 README.md           # This file
├── 📄 tsconfig.json       # TypeScript configuration
├── 📄 eslint.config.mjs   # ESLint configuration
│
├── 📁 tests/              # 🧪 Test specifications and fixtures
│   ├── 📁 fixtures/       # Custom fixtures for test setup
│   │   └── 📄 base.ts     # Base fixtures extending Playwright
│   └── 📁 specs/          # Test files organized by feature
│       └── 📄 home.spec.ts # Example test specifications
│
├── 📁 page-objects/       # 🏗️ Page Object Model classes
│   ├── 📄 HomePage.ts     # Home page interactions
│   ├── 📄 DocsPage.ts     # Documentation page interactions
│   └── 📁 components/     # Reusable UI components
│       └── 📄 HeaderComponent.ts # Header component
│
├── 📁 test-data/          # 📊 Test data files (JSON, CSV, etc.)
├── 📁 utils/              # 🛠️ Helper functions and utilities
├── 📁 screenshots/        # 📸 Generated screenshots
├── 📁 snapshots/          # 🖼️ Visual regression baselines
├── 📁 test-results/       # 📋 Test execution artifacts
└── 📁 reports/            # 📊 Test reports (HTML, JSON, etc.)
```

### 📂 Directory Purposes

| Directory                  | Purpose                                  | Key Files         |
| -------------------------- | ---------------------------------------- | ----------------- |
| `tests/fixtures/`          | Reusable test setup and teardown         | `base.ts`         |
| `tests/specs/`             | Test specifications organized by feature | `*.spec.ts`       |
| `page-objects/`            | Page Object Model classes                | `*Page.ts`        |
| `page-objects/components/` | Reusable UI components                   | `*Component.ts`   |
| `test-data/`               | Test datasets and mock data              | `*.json`, `*.csv` |
| `utils/`                   | Helper functions and utilities           | `*.ts`            |
| `test-results/`            | Screenshots, videos, traces              | Auto-generated    |
| `reports/`                 | Test execution reports                   | Auto-generated    |

## 📝 Writing Tests

### 🏗️ Page Object Model Pattern

Create Page Objects in `page-objects/` to encapsulate page interactions:

```typescript
// page-objects/LoginPage.ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.errorMessage = page.getByText('Invalid credentials');
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### 🧪 Writing Test Specifications

Create test files in `tests/specs/` using the Page Object Model:

```typescript
// tests/specs/auth/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../page-objects/LoginPage';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo();
  });

  test('should login with valid credentials', async ({ page }) => {
    // Arrange
    const username = 'testuser';
    const password = 'password123';

    // Act
    await loginPage.login(username, password);

    // Assert
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Act
    await loginPage.login('invalid', 'wrong');

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(/login/);
  });
});
```

### 🔧 Custom Fixtures

Create reusable test setup in `tests/fixtures/`:

```typescript
// tests/fixtures/auth.ts
import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';

export const test = baseTest.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  authenticatedUser: async ({ page }, use) => {
    // Set up authenticated state
    await page.goto('/login');
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

## 🎯 Best Practices

### ✅ **DO's**

| Practice                     | Description                        | Example                                        |
| ---------------------------- | ---------------------------------- | ---------------------------------------------- |
| **Use Role-Based Locators**  | Prefer user-facing selectors       | `page.getByRole('button', { name: 'Submit' })` |
| **Follow Page Object Model** | Encapsulate page interactions      | Create `LoginPage.ts` for login functionality  |
| **Web-First Assertions**     | Use auto-waiting assertions        | `await expect(locator).toBeVisible()`          |
| **Independent Tests**        | Each test should be self-contained | Setup data in each test                        |
| **Descriptive Names**        | Use clear, behavior-focused names  | `'should redirect to dashboard after login'`   |
| **Group Related Tests**      | Use describe blocks                | `test.describe('Shopping Cart', () => {})`     |

### ❌ **DON'Ts**

| Anti-Pattern            | Why Avoid                    | Better Alternative                                             |
| ----------------------- | ---------------------------- | -------------------------------------------------------------- |
| **Hard-coded waits**    | Unreliable and slow          | `page.waitForTimeout(2000)` → `await expect(el).toBeVisible()` |
| **CSS/XPath selectors** | Brittle and hard to maintain | `.submit-btn` → `getByRole('button', { name: 'Submit' })`      |
| **Test dependencies**   | Makes tests fragile          | Independent test setup                                         |
| **Shared state**        | Can cause flaky tests        | Use fixtures instead                                           |
| **Large test files**    | Hard to maintain             | Split by feature/functionality                                 |

### 🏗️ **Architecture Guidelines**

```typescript
// ✅ GOOD: Well-structured test
test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/users');
  });

  test('should create a new user', async ({ page }) => {
    // Arrange
    const userPage = new UserPage(page);
    const userData = { name: 'John Doe', email: 'john@example.com' };

    // Act
    await userPage.createUser(userData);

    // Assert
    await expect(userPage.successMessage).toBeVisible();
    await expect(userPage.getUserRow(userData.name)).toBeVisible();
  });
});
```

### 🔍 **Locator Strategy Priority**

1. **Role-based**: `getByRole('button', { name: 'Submit' })`
2. **Text-based**: `getByText('Welcome')`
3. **Label-based**: `getByLabel('Email address')`
4. **Placeholder**: `getByPlaceholder('Enter email')`
5. **Test ID**: `getByTestId('submit-btn')` _(when semantic locators aren't feasible)_
6. **CSS/XPath**: Use only as last resort

### 📊 **Data Management**

- Store test data in `test-data/` directory
- Use JSON files for structured data
- Create data factories for dynamic test data
- Avoid hardcoding values in tests

## 🔌 VS Code Extensions

### Essential Extensions

Install these VS Code extensions for the best development experience:

| Extension                                                                                           | Purpose                                 | Installation                                        |
| --------------------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------------------------------- |
| [**Playwright Test**](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) | Run and debug tests directly in VS Code | `code --install-extension ms-playwright.playwright` |
| [**ESLint**](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)            | Code linting and error detection        | `code --install-extension dbaeumer.vscode-eslint`   |
| [**Prettier**](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)          | Code formatting                         | `code --install-extension esbenp.prettier-vscode`   |
| [**TypeScript Importer**](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter)     | Auto-import TypeScript modules          | `code --install-extension pmneo.tsimporter`         |

### VS Code Settings

Create `.vscode/settings.json` in your project:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "playwright.testDir": "./tests",
  "playwright.showTrace": true
}
```

## 🎨 Customizing the Template

### 1. Update Project Information

```bash
# Update package.json
npm pkg set name="your-project-name"
npm pkg set description="Your project description"
npm pkg set author="Your Name <your.email@example.com>"
npm pkg set repository.url="https://github.com/yourusername/your-repo"
```

### 2. Configure Your Application

Edit `playwright.config.ts`:

```typescript
export default defineConfig({
  use: {
    // Update with your application URL
    baseURL: 'https://your-app.com',

    // Add custom headers if needed
    extraHTTPHeaders: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  },

  // Add projects for your specific needs
  projects: [
    {
      name: 'api-tests',
      testMatch: '**/api/**/*.spec.ts',
      use: { baseURL: 'https://api.your-app.com' },
    },
    {
      name: 'visual-tests',
      testMatch: '**/visual/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'on',
      },
    },
  ],
});
```

### 3. Set Up Your Page Objects

Organize your page objects by feature:

```
page-objects/
├── auth/
│   ├── LoginPage.ts
│   └── SignupPage.ts
├── dashboard/
│   ├── DashboardPage.ts
│   └── SettingsPage.ts
└── components/
    ├── HeaderComponent.ts
    ├── SidebarComponent.ts
    └── ModalComponent.ts
```

### 4. Environment Configuration

Update `.env.example` with your specific variables:

```bash
# Your application-specific variables
APP_URL=https://your-app.com
API_URL=https://api.your-app.com
CDN_URL=https://cdn.your-app.com

# Authentication
AUTH_TOKEN=your-test-token
TEST_USER_ID=123

# Feature flags
ENABLE_BETA_FEATURES=true

# Third-party services
ANALYTICS_ID=GA-XXXXXXX
```

## 📚 Additional Resources

### 📖 **Learning Materials**

- [**Playwright Documentation**](https://playwright.dev/docs/intro) - Official Playwright docs
- [**TypeScript Handbook**](https://www.typescriptlang.org/docs/) - Learn TypeScript
- [**Page Object Model Guide**](https://playwright.dev/docs/pom) - POM best practices
- [**Test Design Patterns**](https://martinfowler.com/articles/practical-test-pyramid.html) - Testing strategies

### 🛠️ **Tools & Utilities**

- [**Playwright Inspector**](https://playwright.dev/docs/debug#playwright-inspector) - Interactive debugging
- [**Trace Viewer**](https://playwright.dev/docs/trace-viewer) - Visual test analysis
- [**Codegen**](https://playwright.dev/docs/codegen) - Generate tests from user actions
- [**VS Code Extension**](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) - IDE integration

### 🌐 **Community**

- [**Playwright Discord**](https://discord.com/invite/playwright) - Community chat
- [**GitHub Discussions**](https://github.com/microsoft/playwright/discussions) - Q&A and discussions
- [**Stack Overflow**](https://stackoverflow.com/questions/tagged/playwright) - Technical questions
- [**YouTube Channel**](https://www.youtube.com/c/Playwright) - Video tutorials

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Application URLs
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3001/api

# Test Users (use test accounts only)
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123
TEST_ADMIN_EMAIL=admin@example.com
TEST_ADMIN_PASSWORD=adminpassword123

# Test Configuration
DEFAULT_TIMEOUT=30000
TEST_RETRIES=2
PARALLEL_WORKERS=4

# Browser Configuration
HEADLESS=true
SLOW_MO=0

# Debugging
DEBUG_MODE=false
TRACE_ON_FAILURE=true
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
```

### Playwright Config Customization

Key configuration options in `playwright.config.ts`:

```typescript
export default defineConfig({
  // Test timeout per test
  timeout: 30000,

  // Global test options
  use: {
    // Base URL for navigation
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Browser context options
    headless: process.env.HEADLESS !== 'false',

    // Capture options (configured for CI)
    screenshot: { mode: 'only-on-failure', fullPage: true },
    video: { mode: 'retain-on-failure' },
    trace: { mode: 'retain-on-failure' },
  },

  // Retry configuration
  retries: process.env.CI ? 2 : 0,

  // Parallel execution
  workers: process.env.CI ? 4 : undefined,

  // Browser projects
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});
```

## 🐛 Debugging & Troubleshooting

### Interactive Debugging

```bash
# Run tests with Playwright Inspector
npx playwright test --debug

# Run specific test with debugger
npx playwright test tests/specs/login.spec.ts --debug

# Run tests in UI mode for interactive debugging
npx playwright test --ui
```

### Debug in VS Code

1. Install the [Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) extension
2. Set breakpoints in your test files
3. Run tests using the VS Code Test Explorer
4. Use the integrated debugger to step through code

### Trace Analysis

```bash
# Run tests with trace collection
npx playwright test --trace on

# View traces after test completion
npx playwright show-trace test-results/trace.zip
```

### Common Issues & Solutions

| Issue                 | Cause                                  | Solution                                        |
| --------------------- | -------------------------------------- | ----------------------------------------------- |
| **Element not found** | Element not ready or locator incorrect | Use `await expect(locator).toBeVisible()` first |
| **Timeout errors**    | Slow page loads or network issues      | Increase timeout or check network conditions    |
| **Flaky tests**       | Race conditions or timing issues       | Add proper waits, avoid hard-coded delays       |
| **Tests fail in CI**  | Different environment conditions       | Use consistent test data and environment setup  |

## 🚀 CI/CD Integration

### GitHub Actions

The template includes a complete GitHub Actions workflow in `.github/workflows/tests.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npm test

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Other CI Platforms

<details>
<summary><strong>Azure DevOps</strong></summary>

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'

  - script: npm ci
    displayName: 'Install dependencies'

  - script: npx playwright install --with-deps
    displayName: 'Install Playwright browsers'

  - script: npm test
    displayName: 'Run tests'

  - task: PublishTestResults@2
    condition: succeededOrFailed()
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: 'test-results/junit.xml'
```

</details>

<details>
<summary><strong>GitLab CI</strong></summary>

```yaml
stages:
  - test

e2e-tests:
  image: mcr.microsoft.com/playwright:focal
  stage: test
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    reports:
      junit: test-results/junit.xml
    paths:
      - test-results/
      - playwright-report/
    expire_in: 1 week
```

</details>

### Performance Optimization for CI

```typescript
// playwright.config.ts - CI optimizations
export default defineConfig({
  // Use more workers on CI for faster execution
  workers: process.env.CI ? 4 : 2,

  // Reduce timeouts for faster feedback
  timeout: process.env.CI ? 30000 : 60000,

  // Minimal media capture on CI
  use: {
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
    video: process.env.CI ? 'retain-on-failure' : 'off',
    trace: process.env.CI ? 'retain-on-failure' : 'on',
  },

  // Retry flaky tests on CI
  retries: process.env.CI ? 2 : 0,
});
```
