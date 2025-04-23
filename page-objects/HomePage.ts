import { Page, Locator } from '@playwright/test';
import { HeaderComponent } from './components/HeaderComponent';

export class HomePage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly mainHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.mainHeading = page.getByRole('heading', { level: 1 });
  }

  async navigate(): Promise<void> {
    await this.page.goto('/');
  }

  async expectToBeOnHomePage(): Promise<void> {
    await this.page.waitForURL('/');
  }
}
