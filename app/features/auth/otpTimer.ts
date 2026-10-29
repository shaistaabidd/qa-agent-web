const OTP_TIMER_KEY = 'otp_timer_simple';
const OTP_TIMER_TIMESTAMP_KEY = 'otp_timer_simple_timestamp';

/** Resend cooldown; mirrors saas-api's OneTimePassword::RESEND_COOLDOWN. */
export const OTP_DURATION_SECONDS = 30;

function canUseStorage() {
  return typeof window !== 'undefined';
}

export function startOtpTimer(duration = OTP_DURATION_SECONDS) {
  if (!canUseStorage()) {
    return;
  }

  try {
    localStorage.setItem(OTP_TIMER_KEY, String(duration));
    localStorage.setItem(OTP_TIMER_TIMESTAMP_KEY, String(Date.now()));
  } catch {
    // Storage can be blocked or full. The resend cooldown is skipped.
  }
}

export function clearOtpTimer() {
  if (!canUseStorage()) {
    return;
  }

  try {
    localStorage.removeItem(OTP_TIMER_KEY);
    localStorage.removeItem(OTP_TIMER_TIMESTAMP_KEY);
  } catch {
    // Storage can be blocked.
  }
}

export function remainingOtpSeconds(duration = OTP_DURATION_SECONDS) {
  if (!canUseStorage()) {
    return 0;
  }

  try {
    const storedTime = localStorage.getItem(OTP_TIMER_KEY);
    const storedTimestamp = localStorage.getItem(OTP_TIMER_TIMESTAMP_KEY);

    if (!storedTime || !storedTimestamp) {
      return 0;
    }

    const elapsed = Math.floor((Date.now() - Number(storedTimestamp)) / 1000);
    const remaining = duration - elapsed;

    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
}
