import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export type ProjectTab =
  'Overview' | 'Credentials' | 'Scope features' | 'Runs' | 'Issues' | 'Dashboard';

/** The project layout (header and tabs) and the controls on each tab. */
export class ProjectPage extends BasePage {
  readonly rows = this.page.locator('tbody').getByRole('row');

  constructor(page: Page) {
    super(page);
  }

  heading(name: string) {
    return this.page.getByRole('heading', { name, level: 1 });
  }

  tab(name: ProjectTab) {
    return this.page.getByRole('tab', { name: new RegExp(`^${name}`) });
  }

  open(path: string) {
    return this.goto(path);
  }

  async expectProject(name: string) {
    await expect(this.heading(name)).toBeVisible();
  }

  async openTab(name: ProjectTab, path: string) {
    await this.tab(name).click();
    await this.expectPath(path);
  }

  async expectTabBadge(name: ProjectTab, count: number) {
    await expect(this.tab(name)).toContainText(String(count));
  }

  async fill(label: string, value: string) {
    await this.page.getByLabel(label).fill(value);
  }

  async expectFieldValue(label: string, value: string) {
    await expect(this.page.getByLabel(label)).toHaveValue(value);
  }

  async expectFieldType(label: string, type: string) {
    await expect(this.page.getByLabel(label)).toHaveAttribute('type', type);
  }

  /** Picks an option from a dropdown, found by its label. */
  async choose(dropdown: string, option: string) {
    const combobox = this.page.getByRole('combobox', { name: dropdown });

    await combobox.click();
    await this.page.getByRole('option', { name: option, exact: true }).click();
    await expect(combobox).toContainText(option);
  }

  /** A tab inside a page (such as a run's panels), as opposed to the project's own tabs. */
  async clickTab(name: string) {
    await this.page.getByRole('tab', { name: new RegExp(`^${name}`) }).click();
  }

  async clickLink(name: string) {
    await this.page.getByRole('link', { name }).click();
  }

  async expectText(text: string | RegExp) {
    await expect(this.page.getByText(text).first()).toBeVisible();
  }

  async expectNoText(text: string | RegExp) {
    await expect(this.page.getByText(text)).toHaveCount(0);
  }

  button(name: string | RegExp) {
    return this.page.getByRole('button', { name });
  }

  async expectButton(name: string | RegExp, visible = true) {
    await expect(this.button(name)).toHaveCount(visible ? 1 : 0);
  }

  row(text: string) {
    return this.rows.filter({ hasText: text });
  }

  async expectRowTag(text: string, tag: string | RegExp) {
    await expect(this.row(text)).toContainText(tag);
  }
}
