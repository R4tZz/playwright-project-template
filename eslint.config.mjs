import playwright from 'eslint-plugin-playwright';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // Apply ESLint recommended rules to all files
  eslintJs.configs.recommended,
  prettierConfig,

  // Apply TypeScript rules to TypeScript files
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
        ...globals.node, // Add Node.js globals
      },
    },
    rules: {
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-undef': 'off', // TypeScript already checks this
    },
  },

  // Apply Playwright rules to test files
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts', '**/*.spec.ts', '**/*.spec.tsx'],
    languageOptions: {
      globals: {
        ...globals.node, // Add Node.js globals for test files too
      },
    },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Custom Playwright rules for your project
    },
  },
];
