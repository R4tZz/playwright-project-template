import { test, expect } from '../fixtures/base';

test.describe('Home Page', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test('displays main heading', async ({ homePage }) => {
    await expect(homePage.mainHeading).toBeVisible();
  });

  test('header navigation works', async ({ homePage }) => {
    await homePage.header.clickNavLink('About');
    await expect(homePage.page).toHaveURL(/.*about/);

    await homePage.header.clickLogo();
    await expect(homePage.page).toHaveURL('/');
  });

  test('search functionality works', async ({ homePage }) => {
    await homePage.header.search('test query');
    await expect(homePage.page).toHaveURL(/.*search/);
  });
});
