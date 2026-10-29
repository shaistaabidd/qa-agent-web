import { expect, type Page } from '@playwright/test';

import { AdminListPage } from './AdminListPage';

export type ResourceTab = 'Client Resources' | 'Clinic Resources' | 'Archived';

export class ResourcesPage extends AdminListPage {
  readonly addButton = this.page.getByRole('button', { name: 'Add resource' });

  constructor(page: Page) {
    super(page, {
      headingLevel: 2,
      emptyTitle: 'No resources',
      path: '/resources',
      searchParam: 'q',
      searchPlaceholder: 'Search resources by title',
      title: 'Resources',
    });
  }

  async expectAddVisible() {
    await expect(this.addButton).toBeVisible();
  }

  tab(name: ResourceTab) {
    return this.page.getByRole('radio', { name });
  }

  async expectTabSelected(name: ResourceTab) {
    await expect(this.tab(name)).toBeChecked();
  }

  async selectTab(name: ResourceTab) {
    await this.tab(name).click();
    await this.expectTabSelected(name);
  }

  async filterByCategory(category: string) {
    await this.page.getByRole('combobox', { name: 'Filter by category' }).click();
    await this.page.getByRole('option', { name: category, exact: true }).click();
    await expect(this.page.getByRole('combobox', { name: 'Filter by category' })).toContainText(
      category,
    );
  }

  async expectCategoryInUrl(category: string) {
    await expect(this.page).toHaveURL((url) => url.searchParams.get('category') === category);
  }

  async expectRowText(title: string, text: string) {
    await expect(this.rows.filter({ hasText: title })).toContainText(text);
  }

  async openAddDrawer() {
    await this.addButton.click();
    await expect(this.page.getByRole('dialog', { name: 'Add resource' })).toBeVisible();
  }
}
