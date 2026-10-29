import type { Page } from '@playwright/test';

import type { LoginPage } from '../page-object/LoginPage';
import type { OtpPage } from '../page-object/OtpPage';
import { type GraphqlHandlers, mockGraphql } from './graphql';
import type { MockUser } from './mockUsers';

const MOCK_PASSWORD = 'E2e-Password-1!';
const MOCK_OTP = '123456';

/** Signs in through the real login and OTP screens with the backend answers mocked. */
export class MockSession {
  constructor(
    private readonly page: Page,
    private readonly loginPage: LoginPage,
    private readonly otpPage: OtpPage,
  ) {}

  async signInAs(user: MockUser, extraHandlers: GraphqlHandlers = {}) {
    const mock = await mockGraphql(this.page, {
      LoginUser: () => ({ loginUser: { message: 'OTP sent', token: null, user: null } }),
      ValidateOtp: () => ({ validateOtp: { resetPasswordToken: null, token: 'e2e-token', user } }),
      ...extraHandlers,
    });

    await this.loginPage.goto();
    await this.loginPage.login(user.email, MOCK_PASSWORD);
    await this.otpPage.expectLoaded();
    await this.otpPage.submit(MOCK_OTP);
    await this.otpPage.expectSignedIn();

    return mock;
  }
}
