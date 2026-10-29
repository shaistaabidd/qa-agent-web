import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export type CrudTabName = 'All' | 'Active' | 'Archived';

export class CrudDemoPage extends BasePage {
  readonly heading = this.page.getByRole('heading', { name: 'Posts', level: 2 });
  readonly searchBox = this.page.getByRole('searchbox', { name: 'Search posts…' });
  readonly addButton = this.page.getByRole('button', { name: 'Add post' });
  readonly featuredToggle = this.page.getByRole('button', { name: /^(All IDs|Featured only)$/ });
  readonly rows = this.page.locator('tbody').getByRole('row');
  readonly nextPage = this.page.getByRole('button', { name: 'Next' });
  readonly previousPage = this.page.getByRole('button', { name: 'Previous' });
  readonly rowsPerPage = this.page.getByRole('combobox', { name: 'Rows per page' });
  readonly dialog = this.page.getByRole('dialog');
  readonly titleSortHeader = this.page.getByRole('columnheader', { name: 'Title' });

  constructor(page: Page) {
    super(page);
  }

  open() {
    return this.goto('/crud');
  }

  async expectLoaded() {
    await this.expectPath('/crud');
    await expect(this.heading).toBeVisible();
    await expect(this.addButton).toBeVisible();
  }

  async expectTitles(titles: string[]) {
    await expect(this.rows).toHaveCount(titles.length);
    await expect(this.rows).toContainText(titles);
  }

  async expectRowPresent(title: string) {
    await expect(this.rows.filter({ hasText: title })).toHaveCount(1);
  }

  async expectRowAbsent(title: string) {
    await expect(this.rows.filter({ hasText: title })).toHaveCount(0);
  }

  async expectSummary(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async selectTab(name: CrudTabName) {
    await this.page.getByRole('radio', { name }).click();
    await expect(this.page.getByRole('radio', { name })).toBeChecked();
  }

  async searchFor(term: string) {
    await this.searchBox.fill(term);
  }

  async expectNoResults() {
    await expect(this.page.getByText('No posts match your search')).toBeVisible();
  }

  async toggleFeatured() {
    await this.featuredToggle.click();
  }

  async expectFeaturedOn(on: boolean) {
    await expect(this.featuredToggle).toHaveAttribute('aria-pressed', String(on));
  }

  async sortByTitle() {
    await this.titleSortHeader.getByRole('button').click();
  }

  async expectTitleSort(order: 'ascending' | 'descending' | 'none') {
    await expect(this.titleSortHeader).toHaveAttribute('aria-sort', order);
  }

  async goToNextPage() {
    await this.nextPage.click();
  }

  async choosePageSize(size: 5 | 10 | 20) {
    await this.rowsPerPage.click();
    await this.page.getByRole('option', { name: String(size), exact: true }).click();
    await expect(this.rowsPerPage).toContainText(String(size));
  }

  async expectPageButtons(state: { next: boolean; previous: boolean }) {
    await expect(this.nextPage).toBeEnabled({ enabled: state.next });
    await expect(this.previousPage).toBeEnabled({ enabled: state.previous });
  }

  async openRowMenu(title: string) {
    await this.page.getByRole('button', { name: `Actions for ${title}` }).click();
  }

  async chooseRowAction(title: string, action: 'Edit' | 'Delete') {
    await this.openRowMenu(title);
    await this.page.getByRole('menuitem', { name: action }).click();
  }

  async fillPostForm(values: { body?: string; title?: string }) {
    if (values.title !== undefined) {
      await this.dialog.getByLabel('Title').fill(values.title);
    }
    if (values.body !== undefined) {
      await this.dialog.getByLabel('Body').fill(values.body);
    }
  }

  async submitDialog(label: 'Create post' | 'Save changes') {
    await this.dialog.getByRole('button', { name: label }).click();
  }

  async expectDialogClosed() {
    await expect(this.dialog).toBeHidden();
  }

  async expectFieldError(message: string) {
    await expect(this.dialog.getByText(message)).toBeVisible();
  }

  async addPost(title: string, body: string) {
    await this.addButton.click();
    await expect(this.dialog.getByText('Add post', { exact: true })).toBeVisible();
    await this.fillPostForm({ body, title });
    await this.submitDialog('Create post');
    await this.expectDialogClosed();
  }

  async confirmDelete(title: string) {
    await expect(this.dialog.getByText(`Delete “${title}”?`)).toBeVisible();
    await this.dialog.getByRole('button', { name: 'Delete', exact: true }).click();
    await this.expectDialogClosed();
  }

  async cancelDialog() {
    await this.dialog.getByRole('button', { name: 'Cancel' }).click();
    await this.expectDialogClosed();
  }
}
