import { Page, Locator } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly mainNav: Locator;

  private readonly logoLink: Locator;
  private readonly menuButton: Locator;
  private readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainNav = page.getByRole('navigation').first();
    this.logoLink = page.getByRole('link', { name: 'Home' });
    this.menuButton = page.getByRole('button', { name: 'Menu' });
    this.searchInput = page.getByRole('searchbox');
  }

  async clickLogo(): Promise<void> {
    await this.logoLink.click();
  }

  async toggleMenu(): Promise<void> {
    await this.menuButton.click();
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
  }

  async clickNavLink(name: string): Promise<void> {
    await this.page.getByRole('link', { name, exact: true }).click();
  }
}
