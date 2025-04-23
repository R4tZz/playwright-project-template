import { Page, Locator } from '@playwright/test';
import { HeaderComponent } from './components/HeaderComponent';

export class DocsPage {
  readonly page: Page;
  readonly header: HeaderComponent;

  readonly pageTitle: Locator;
  readonly sideNavigation: Locator;

  private readonly apiLink: Locator;
  private readonly getStartedLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);

    this.pageTitle = page.getByRole('heading', { level: 1 });
    this.sideNavigation = page.getByRole('navigation').first();

    this.apiLink = page.getByRole('link', { name: 'API' });
    this.getStartedLink = page.getByRole('link', { name: 'Getting Started' });
  }

  async navigate(): Promise<void> {
    await this.page.goto('/docs/intro');
  }

  async navigateToApiReference(): Promise<void> {
    await this.apiLink.click();
  }

  async navigateToGettingStarted(): Promise<void> {
    await this.getStartedLink.click();
  }
}
