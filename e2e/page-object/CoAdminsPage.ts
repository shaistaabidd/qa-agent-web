import { expect, type Page } from '@playwright/test';

import { AdminListPage } from './AdminListPage';

export type CoAdminTab = 'Active' | 'Archived' | 'Pending Invites';

export class CoAdminsPage extends AdminListPage {
  readonly inviteButton = this.page.getByRole('button', { name: 'Invite user' });
  readonly emails = this.page.getByLabel('Emails');

  constructor(page: Page) {
    super(page, {
      emptyTitle: 'No users',
      headingLevel: 2,
      path: '/co-admin',
      searchParam: 'q',
      searchPlaceholder: 'Search by name or email',
      title: 'Users',
    });
  }

  override async expectLoaded() {
    await super.expectLoaded();
    await expect(this.inviteButton).toBeVisible();
  }

  /** Call once the flags have loaded: the button is also absent while they load. */
  async expectLoadedWithoutInvite() {
    await super.expectLoaded();
    await this.expectRowsSettled();
    await expect(this.inviteButton).toBeHidden();
  }

  async selectTab(name: CoAdminTab) {
    await this.page.getByRole('radio', { name }).click();
    await expect(this.page.getByRole('radio', { name })).toBeChecked();
    await this.expectRowsSettled();
  }

  async expectTabSelected(name: CoAdminTab) {
    await expect(this.page.getByRole('radio', { name })).toBeChecked();
  }

  async expectTabs() {
    for (const name of ['Active', 'Pending Invites', 'Archived']) {
      await expect(this.page.getByRole('radio', { name })).toBeVisible();
    }
  }

  async expectPeople(names: string[]) {
    await this.expectRows(names);
  }

  async openEdit(name: string) {
    await this.chooseRowAction(name, 'Edit');
    await expect(this.drawer.getByText('Edit user')).toBeVisible();
  }

  async expectEditFormValues(values: { email: string; firstName: string; lastName: string }) {
    await expect(this.drawer.getByLabel('First name')).toHaveValue(values.firstName);
    await expect(this.drawer.getByLabel('Last name')).toHaveValue(values.lastName);
    await expect(this.drawer.getByLabel('Email')).toHaveValue(values.email);
    await expect(this.drawer.getByLabel('Email')).toBeDisabled();
  }

  async saveEdit(firstName: string, lastName: string) {
    await this.drawer.getByLabel('First name').fill(firstName);
    await this.drawer.getByLabel('Last name').fill(lastName);
    await this.drawer.getByRole('button', { name: 'Save changes' }).click();
  }

  async expectRowActions(name: string, actions: string[], hidden: string[]) {
    await this.openRowMenu(name);
    for (const action of actions) {
      await expect(this.page.getByRole('menuitem', { name: action })).toBeVisible();
    }
    for (const action of hidden) {
      await expect(this.page.getByRole('menuitem', { name: action })).toBeHidden();
    }
    await this.page.keyboard.press('Escape');
  }

  async openInvite() {
    await this.inviteButton.click();
    await expect(this.drawer.getByText('Each person gets an email')).toBeVisible();
  }

  async sendInvite(emails: string) {
    await this.emails.fill(emails);
    await this.drawer.getByRole('button', { name: 'Send invite' }).click();
  }

  /** The API refused the invite and the page re-read the flags: no button, no open form. */
  async expectInviteWithdrawn() {
    await expect(this.drawer).toBeHidden();
    await expect(this.inviteButton).toBeHidden();
  }

  async expectInviteError(message: string) {
    await expect(this.drawer.getByText(message)).toBeVisible();
  }

  async expectRejectedInvite(email: string, reason: string) {
    await expect(this.drawer.getByText(`${email} — ${reason}`)).toBeVisible();
    await expect(this.emails).toHaveValue(email);
  }

  async cancelInvite() {
    await this.drawer.getByRole('button', { name: 'Cancel' }).click();
    await expect(this.drawer).toBeHidden();
  }

  async expectNoRejectedInvites() {
    await expect(this.drawer.getByText('These emails were not invited')).toBeHidden();
  }
}
