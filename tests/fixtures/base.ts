import { test as base, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/HomePage';

type MyFixtures = {
  homePage: HomePage;
};

export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect };
