import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class ProjectsPage extends BasePage {
  readonly heading = this.page.getByRole('heading', { name: 'Projects', level: 1 });
  readonly newProjectButton = this.page.getByRole('button', { name: 'New project' });
  readonly dialog = this.page.getByRole('dialog', { name: 'New project' });
  readonly rows = this.page.locator('tbody').getByRole('row');

  constructor(page: Page) {
    super(page);
  }

  open() {
    return this.goto('/projects');
  }

  async expectLoaded() {
    await this.expectPath('/projects');
    await expect(this.heading).toBeVisible();
  }

  async expectProjects(names: string[]) {
    for (const name of names) {
      await expect(this.rows.filter({ hasText: name })).toBeVisible();
    }
  }

  async expectEmpty() {
    await expect(this.page.getByText('No projects yet')).toBeVisible();
  }

  async createProject(name: string, targetUrl: string) {
    await this.newProjectButton.click();
    await this.dialog.getByLabel('Name').fill(name);
    await this.dialog.getByLabel('Staging target URL').fill(targetUrl);
    await this.dialog.getByRole('button', { name: 'Create project' }).click();
  }

  async expectDialogError(message: string) {
    await expect(this.dialog).toContainText(message);
  }

  async expectDialogOpen() {
    await expect(this.dialog).toBeVisible();
  }
}
