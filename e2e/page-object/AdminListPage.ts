import { expect, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export type AdminListConfig = {
  emptyTitle: string;
  headingLevel: 1 | 2;
  path: string;
  searchParam: string;
  searchPlaceholder: string;
  title: string;
};

export const NO_MATCH_TERM = 'zzzz-e2e-no-match';

export class AdminListPage extends BasePage {
  readonly filterButton = this.page.getByRole('button', { name: /^Filter/ });
  readonly resetButton = this.page.getByRole('button', { name: 'Reset', exact: true });
  readonly drawer = this.page.getByRole('dialog');
  readonly rows = this.page.locator('tbody').getByRole('row');
  readonly nextPage = this.page.getByRole('button', { name: 'Next' });

  // Getters, not fields: field initializers run before the `config` parameter property is set.
  get heading() {
    return this.page.getByRole('heading', {
      name: this.config.title,
      level: this.config.headingLevel,
    });
  }

  get searchBox() {
    return this.page.getByRole('searchbox', { name: this.config.searchPlaceholder });
  }

  get emptyState() {
    return this.page.getByText(this.config.emptyTitle, { exact: true });
  }

  constructor(
    page: Page,
    private readonly config: AdminListConfig,
  ) {
    super(page);
  }

  open() {
    return this.goto(this.config.path);
  }

  async expectLoaded() {
    await this.expectPath(this.config.path);
    await expect(this.heading).toBeVisible();
    await expect(this.searchBox).toBeVisible();
  }

  async searchFor(term: string) {
    await this.searchBox.fill(term);
  }

  async expectSearchInUrl(term: string) {
    await expect(this.page).toHaveURL(
      (url) => url.searchParams.get(this.config.searchParam) === term,
    );
  }

  async expectEmpty() {
    await expect(this.emptyState).toBeVisible();
  }

  async clearSearch() {
    await this.page.getByRole('button', { name: 'Clear search' }).click();
    await expect(this.searchBox).toHaveValue('');
  }

  async openFilters() {
    await this.filterButton.click();
    await expect(this.drawer.getByText('Filters', { exact: true })).toBeVisible();
  }

  async closeFilters() {
    await this.drawer.getByRole('button', { name: 'Close' }).click();
    await expect(this.drawer).toBeHidden();
  }

  async expectResetDisabled() {
    await expect(this.resetButton).toBeDisabled();
  }

  async expectRows(texts: string[]) {
    await expect(this.rows).toHaveCount(texts.length);
    await expect(this.rows).toContainText(texts);
  }

  async expectSummary(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async goToNextPage() {
    await this.nextPage.click();
  }

  async expectFilterCount(count: number) {
    await expect(this.filterButton).toHaveText(count ? `Filter (${count})` : 'Filter');
  }

  async resetFilters() {
    await this.resetButton.click();
  }

  /** Picks an option in a dropdown inside the open drawer, the way a user does: with the mouse. */
  async choose(dropdown: string, option: string) {
    const combobox = this.drawer.getByRole('combobox', { name: dropdown });

    await combobox.click();
    await this.page.getByRole('option', { name: option, exact: true }).click();
    await expect(combobox).toContainText(option);
  }

  /** The same, with the keyboard. */
  async chooseWithKeyboard(dropdown: string, options: string[], choice: string) {
    const combobox = this.drawer.getByRole('combobox', { name: dropdown });

    await combobox.click();
    for (let step = 0; step < options.indexOf(choice); step += 1) {
      await this.page.keyboard.press('ArrowDown');
    }
    await this.page.keyboard.press('Enter');
    await expect(combobox).toContainText(choice);
  }

  async applyFilters() {
    await this.drawer.getByRole('button', { name: 'Apply' }).click();
    await expect(this.drawer).toBeHidden();
  }

  /**
   * The table rebuilds its row cells once, shortly after data arrives, which drops a menu or switch
   * touched in that moment. Wait until a cell survives a full polling interval.
   */
  async expectRowsSettled() {
    await expect
      .poll(
        () =>
          this.page.evaluate(() => {
            const cell = document.querySelector('tbody tr td');
            if (!cell) return false;
            const survived = cell.hasAttribute('data-e2e-settled');
            cell.setAttribute('data-e2e-settled', '1');
            return survived;
          }),
        { intervals: [400] },
      )
      .toBe(true);
  }

  async openRowMenu(name: string) {
    const trigger = this.page.getByRole('button', { name: `Actions for ${name}` });

    // A click made right after a dialog closes can be swallowed, so retry until the menu is open.
    await expect(async () => {
      if ((await trigger.getAttribute('aria-expanded')) !== 'true') {
        await trigger.click();
      }
      await expect(trigger).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
    }).toPass({ timeout: 10_000 });
  }

  async chooseRowAction(name: string, action: string) {
    await this.openRowMenu(name);
    await this.page.getByRole('menuitem', { name: action }).click();
  }

  accessSwitch(name: string) {
    return this.page.getByRole('switch', { name: `Access for ${name}` });
  }

  /** The switch input is hidden under its styled label, so toggle it by clicking the label. */
  async toggleAccess(name: string) {
    await this.page
      .locator('label[data-slot="switch-control-wrap"]')
      .filter({ has: this.accessSwitch(name) })
      .click();
  }

  async confirm(title: string, button: string) {
    await expect(this.drawer.getByText(title)).toBeVisible();
    await this.drawer.getByRole('button', { name: button, exact: true }).click();
    await expect(this.drawer).toBeHidden();
  }

  async cancelConfirm(title: string) {
    await expect(this.drawer.getByText(title)).toBeVisible();
    await this.drawer.getByRole('button', { name: 'Cancel' }).click();
    await expect(this.drawer).toBeHidden();
  }
}
