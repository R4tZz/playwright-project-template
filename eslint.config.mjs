import playwright from 'eslint-plugin-playwright';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // Global ignores for all configurations
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'test-results/**',
      'playwright-report/**',
      'blob-report/**',
      'playwright/.cache/**',
      'reports/**',
      '*.min.js',
      '*.bundle.js',
      'coverage/**',
    ],
  },

  // Apply ESLint recommended rules to all files
  eslintJs.configs.recommended,

  // Apply prettier config to disable conflicting rules
  prettierConfig,
  // Apply TypeScript rules to TypeScript files
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescript,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: '.',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/explicit-function-return-type': 'off', // Allow functions without explicit return types for flexibility
      '@typescript-eslint/no-explicit-any': 'warn', // Discourage 'any' type but allow when necessary
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Prevent unused variables, allow underscore-prefixed args
      '@typescript-eslint/no-floating-promises': 'error', // Require proper handling of promises (await or .catch)
      '@typescript-eslint/await-thenable': 'error', // Prevent awaiting non-promise values
      '@typescript-eslint/require-await': 'error', // Require functions marked async to actually use await
      '@typescript-eslint/no-misused-promises': 'error', // Prevent promises in places expecting non-promises
      '@typescript-eslint/prefer-nullish-coalescing': 'error', // Use ?? instead of || for null/undefined checks
      '@typescript-eslint/prefer-optional-chain': 'error', // Use ?. instead of manual null checks

      // General code quality rules
      'no-console': 'warn', // Warn about console statements (should be removed in production)
      'no-debugger': 'error', // Prevent debugger statements in production code
      'no-undef': 'off', // Disable undefined variable checks (TypeScript handles this better)
      'prefer-const': 'error', // Use const for variables that are never reassigned
      'no-var': 'error', // Prevent usage of var keyword (use let/const instead)
    },
  },

  // Apply Playwright rules to test files
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts', '**/*.spec.ts', '**/*.spec.tsx', 'page-objects/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...playwright.configs['flat/recommended'].rules,

      // Playwright-specific best practices
      'playwright/expect-expect': 'error', // Ensure tests contain at least one assertion
      'playwright/max-nested-describe': ['error', { max: 2 }], // Limit nesting of describe blocks for readability
      'playwright/no-conditional-in-test': 'error', // Prevent if/else logic in tests (makes them non-deterministic)
      'playwright/no-element-handle': 'error', // Discourage ElementHandle usage (prefer Locator API)
      'playwright/no-eval': 'error', // Prevent eval() usage in tests for security
      'playwright/no-focused-test': 'error', // Prevent test.only() in committed code
      'playwright/no-force-option': 'warn', // Discourage force: true option (hides real issues)
      'playwright/no-page-pause': 'error', // Prevent page.pause() in committed test code
      'playwright/no-skipped-test': 'warn', // Warn about test.skip() to avoid forgotten disabled tests
      'playwright/no-useless-await': 'error', // Remove unnecessary await keywords
      'playwright/no-useless-not': 'error', // Prevent double negation in assertions
      'playwright/no-wait-for-timeout': 'error', // Prevent hard-coded waits (use web-first assertions instead)
      'playwright/prefer-web-first-assertions': 'error', // Use expect(locator).toBeVisible() instead of expect(await locator.isVisible()).toBe(true)
      'playwright/prefer-to-be': 'error', // Use toBe() instead of toEqual() for primitive values
      'playwright/prefer-to-contain': 'error', // Use toContain() for substring/array checks
      'playwright/prefer-to-have-length': 'error', // Use toHaveLength() for array/string length checks
      'playwright/require-top-level-describe': 'error', // Require tests to be wrapped in describe blocks
      'playwright/valid-expect': 'error', // Ensure expect() calls are valid and properly structured

      // Allow console.log in tests for debugging
      'no-console': 'off', // Tests can use console.log for debugging purposes

      // Test files can have any for mocking
      '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' type in tests for mocking flexibility
    },
  },

  // Specific rules for Page Object files
  {
    files: ['page-objects/**/*.ts'],
    rules: {
      // Page objects should have explicit return types for better API clarity
      '@typescript-eslint/explicit-function-return-type': 'error', // Enforce explicit return types for clearer page object APIs

      // Enforce consistent naming for page objects
      'prefer-const': 'error', // Use const for variables that never change in page objects

      // Page objects should not use console.log
      'no-console': 'error', // Prevent console.log in page objects (keep them clean and production-ready)
    },
  },
];
