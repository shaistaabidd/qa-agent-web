import { expect, test as base } from '@playwright/test';

import { AddCalendarPage } from '../page-object/AddCalendarPage';
import { AppShell } from '../page-object/AppShell';
import { CoAdminsPage } from '../page-object/CoAdminsPage';
import { CrudDemoPage } from '../page-object/CrudDemoPage';
import { DashboardPage } from '../page-object/DashboardPage';
import { EmailLogsPage } from '../page-object/EmailLogsPage';
import { ForgotPasswordPage } from '../page-object/ForgotPasswordPage';
import { InvitePage } from '../page-object/InvitePage';
import { LoginPage } from '../page-object/LoginPage';
import { OnboardingPage } from '../page-object/OnboardingPage';
import { OtpPage } from '../page-object/OtpPage';
import { PaymentResultPage } from '../page-object/PaymentResultPage';
import { PricingPage } from '../page-object/PricingPage';
import { ProfileSetupPage } from '../page-object/ProfileSetupPage';
import { ResetPasswordPage } from '../page-object/ResetPasswordPage';
import { ResourcesPage } from '../page-object/ResourcesPage';
import { SettingsPage } from '../page-object/SettingsPage';
import { SetupAccountPage } from '../page-object/SetupAccountPage';
import { SetupPage } from '../page-object/SetupPage';
import { SignDocumentPage } from '../page-object/SignDocumentPage';
import { SignupPage } from '../page-object/SignupPage';
import { SmsLogsPage } from '../page-object/SmsLogsPage';
import {
  answerFeatureFlagsByDefault,
  type GraphqlHandlers,
  type GraphqlMock,
  mockGraphql,
} from './graphql';
import { MockSession } from './session';

type Pages = {
  dashboardPage: DashboardPage;
  coAdminsPage: CoAdminsPage;
  mockApi: (handlers: GraphqlHandlers) => Promise<GraphqlMock>;
  setupAccountPage: SetupAccountPage;
  resetPasswordPage: ResetPasswordPage;
  signDocumentPage: SignDocumentPage;
  signupPage: SignupPage;
  pricingPage: PricingPage;
  paymentResultPage: PaymentResultPage;
  addCalendarPage: AddCalendarPage;
  session: MockSession;
  appShell: AppShell;
  crudDemoPage: CrudDemoPage;
  emailLogsPage: EmailLogsPage;
  forgotPasswordPage: ForgotPasswordPage;
  invitePage: InvitePage;
  loginPage: LoginPage;
  onboardingPage: OnboardingPage;
  otpPage: OtpPage;
  profileSetupPage: ProfileSetupPage;
  resourcesPage: ResourcesPage;
  settingsPage: SettingsPage;
  setupPage: SetupPage;
  smsLogsPage: SmsLogsPage;
};

export const test = base.extend<Pages>({
  // An uncaught error in the page is a bug even when the assertions still pass.
  page: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await answerFeatureFlagsByDefault(page);

    await use(page);

    expect(errors, 'uncaught errors in the page').toEqual([]);
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  coAdminsPage: async ({ page }, use) => {
    await use(new CoAdminsPage(page));
  },
  mockApi: async ({ page }, use) => {
    await use((handlers) => mockGraphql(page, handlers));
  },
  setupAccountPage: async ({ page }, use) => {
    await use(new SetupAccountPage(page));
  },
  resetPasswordPage: async ({ page }, use) => {
    await use(new ResetPasswordPage(page));
  },
  signDocumentPage: async ({ page }, use) => {
    await use(new SignDocumentPage(page));
  },
  pricingPage: async ({ page }, use) => {
    await use(new PricingPage(page));
  },
  paymentResultPage: async ({ page }, use) => {
    await use(new PaymentResultPage(page));
  },
  addCalendarPage: async ({ page }, use) => {
    await use(new AddCalendarPage(page));
  },
  appShell: async ({ page }, use) => {
    await use(new AppShell(page));
  },
  crudDemoPage: async ({ page }, use) => {
    await use(new CrudDemoPage(page));
  },
  emailLogsPage: async ({ page }, use) => {
    await use(new EmailLogsPage(page));
  },
  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },
  invitePage: async ({ page }, use) => {
    await use(new InvitePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  onboardingPage: async ({ page }, use) => {
    await use(new OnboardingPage(page));
  },
  otpPage: async ({ page }, use) => {
    await use(new OtpPage(page));
  },
  profileSetupPage: async ({ page }, use) => {
    await use(new ProfileSetupPage(page));
  },
  resourcesPage: async ({ page }, use) => {
    await use(new ResourcesPage(page));
  },
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
  session: async ({ loginPage, otpPage, page }, use) => {
    await use(new MockSession(page, loginPage, otpPage));
  },
  setupPage: async ({ page }, use) => {
    await use(new SetupPage(page));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  smsLogsPage: async ({ page }, use) => {
    await use(new SmsLogsPage(page));
  },
});

export { expect } from '@playwright/test';
