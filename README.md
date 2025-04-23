# Playwright Test Automation Template

A robust template for end-to-end testing using Playwright, TypeScript, and the Page Object Model pattern. This template follows best practices for maintainable and scalable test automation.

## Features

- 🎭 [Playwright](https://playwright.dev/) for reliable end-to-end testing
- 📦 TypeScript support out of the box
- 🏗️ Page Object Model (POM) design pattern
- 🔄 Custom fixtures for reusable test setup
- 🎨 ESLint + Prettier for code consistency
- 🚀 Parallel test execution
- 📊 Multiple report formats (HTML, JSON, List)
- 🌐 Multi-browser testing support
- 📝 Environment variable management with dotenv
- 🔍 VS Code debugging configuration
- ⚡ GitHub Actions CI workflow

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- VS Code (recommended)

### Installation

1. Clone this template:

   ```bash
   git clone https://github.com/yourusername/playwright-project-template.git
   cd playwright-project-template
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

4. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI mode
npm run ui-mode

# Run tests in headed mode
npm run test-headed

# Run tests in a specific browser
npm run test-chromium

# Run tests with traces
npm run test-trace

# Debug tests
npm run debug

# Generate tests with Codegen
npm run codegen
```

### Project Structure

```
├── .env                # Environment variables (add to .gitignore)
├── package.json        # Project dependencies and scripts
├── playwright.config.ts # Playwright configuration
├── tests/
│   ├── fixtures/      # Custom fixtures for test setup
│   └── specs/         # Test specifications grouped by feature
├── page-objects/       # Page Object Model classes
│   └── components/    # Reusable UI components
├── test-data/         # Test data files
├── utils/             # Helper functions and utilities
├── reports/           # Test execution reports
└── test-results/      # Test artifacts (screenshots, traces, videos)
```

### Writing Tests

1. Create Page Objects in `page-objects/` for your application pages:

   ```typescript
   // page-objects/LoginPage.ts
   export class LoginPage {
     readonly page: Page;

     constructor(page: Page) {
       this.page = page;
     }

     async login(username: string, password: string) {
       // Implementation
     }
   }
   ```

2. Write tests using Page Objects:
   ```typescript
   // tests/specs/auth/login.spec.ts
   test.describe('Authentication', () => {
     test('successful login', async ({ page }) => {
       const loginPage = new LoginPage(page);
       // Test implementation
     });
   });
   ```

### Best Practices

- Follow the Page Object Model pattern
- Keep tests independent and atomic
- Use data-test attributes for element selection
- Avoid hard-coded waits
- Group tests logically by feature
- Maintain test data separately
- Use environment variables for configuration

### VS Code Extensions

The following extensions are recommended:

- Playwright Test for VSCode
- ESLint
- Prettier

### Customizing the Template

1. Update `playwright.config.ts` with your project settings
2. Modify `.env.example` with your required variables
3. Update GitHub Actions workflow in `.github/workflows/`
4. Adjust ESLint and Prettier configs as needed

### Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
