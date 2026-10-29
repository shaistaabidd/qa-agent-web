import { z } from 'zod';

const MAX_MONEY_AMOUNT = 999_999.99;
const MAX_MONEY_LABEL = '$999,999.99';
const MIN_PERCENT = 0;
const MAX_PERCENT = 100;

function parseMoneyInput(value: string): number | null {
  const cleaned = value.replace(/[$,\s]/g, '').trim();
  if (cleaned === '' || cleaned === '.' || cleaned === '-' || cleaned === '-.') {
    return null;
  }
  const amount = Number(cleaned);
  return Number.isFinite(amount) ? amount : null;
}

function issueMoneyRange(
  amount: number,
  ctx: z.RefinementCtx,
  {
    tooLowMessage,
    tooHighMessage,
  }: {
    tooLowMessage: string;
    tooHighMessage: string;
  },
): boolean {
  if (amount <= 0) {
    ctx.addIssue({ code: 'custom', message: tooLowMessage });
    return true;
  }
  if (amount > MAX_MONEY_AMOUNT) {
    ctx.addIssue({ code: 'custom', message: tooHighMessage });
    return true;
  }
  return false;
}

function issuePercentRange(
  percent: number,
  ctx: z.RefinementCtx,
  {
    tooLowMessage,
    tooHighMessage,
  }: {
    tooLowMessage: string;
    tooHighMessage: string;
  },
): boolean {
  if (percent < MIN_PERCENT) {
    ctx.addIssue({ code: 'custom', message: tooLowMessage });
    return true;
  }
  if (percent > MAX_PERCENT) {
    ctx.addIssue({ code: 'custom', message: tooHighMessage });
    return true;
  }
  return false;
}

/** Shipping: more than $0, up to $999,999.99. */
export const shippingAmountSchema = z.string().superRefine((value, ctx) => {
  const amount = parseMoneyInput(value);
  if (amount == null) {
    ctx.addIssue({
      code: 'custom',
      message: 'Enter a valid shipping amount',
    });
    return;
  }
  issueMoneyRange(amount, ctx, {
    tooLowMessage: 'Shipping must be more than $0',
    tooHighMessage: `Shipping cannot exceed ${MAX_MONEY_LABEL}`,
  });
});

/** Wholesale rate: more than $0, up to $999,999.99. */
export const wholesaleAmountSchema = z.string().superRefine((value, ctx) => {
  const amount = parseMoneyInput(value);
  if (amount == null) {
    ctx.addIssue({
      code: 'custom',
      message: 'Enter a valid wholesale rate',
    });
    return;
  }
  issueMoneyRange(amount, ctx, {
    tooLowMessage: 'Wholesale rate must be more than $0',
    tooHighMessage: `Wholesale rate cannot exceed ${MAX_MONEY_LABEL}`,
  });
});

function percentInputSchema({
  invalidMessage,
  tooLowMessage,
  tooHighMessage,
}: {
  invalidMessage: string;
  tooLowMessage: string;
  tooHighMessage: string;
}) {
  return z.string().superRefine((value, ctx) => {
    const cleaned = value.replace(/%/g, '').trim();
    if (cleaned === '' || cleaned === '.' || cleaned === '-' || cleaned === '-.') {
      ctx.addIssue({ code: 'custom', message: invalidMessage });
      return;
    }
    const percent = Number(cleaned);
    if (!Number.isFinite(percent)) {
      ctx.addIssue({ code: 'custom', message: invalidMessage });
      return;
    }
    issuePercentRange(percent, ctx, { tooLowMessage, tooHighMessage });
  });
}

/** Platform fee percent: 0–100% inclusive. */
export const platformFeePercentSchema = percentInputSchema({
  invalidMessage: 'Enter a valid platform fee',
  tooLowMessage: 'Platform fee cannot be less than 0%',
  tooHighMessage: 'Platform fee cannot exceed 100%',
});

/** Pricing fee percent: 0–100% inclusive. */
export const feePercentSchema = percentInputSchema({
  invalidMessage: 'Enter a valid fee',
  tooLowMessage: 'Fee cannot be less than 0%',
  tooHighMessage: 'Fee cannot exceed 100%',
});

/** Custom provider tier markup: 0–100% inclusive. */
export const tierPricingPercentSchema = percentInputSchema({
  invalidMessage: 'Enter a valid markup',
  tooLowMessage: 'Markup cannot be less than 0%',
  tooHighMessage: 'Markup cannot exceed 100%',
});

/** Pharmacy earns: more than $0, up to $999,999.99, and cannot exceed wholesale. */
export function pharmacyEarnsAmountSchema(wholesaleValue: string) {
  return z.string().superRefine((value, ctx) => {
    const earns = parseMoneyInput(value);
    if (earns == null) {
      ctx.addIssue({
        code: 'custom',
        message: 'Enter a valid pharmacy earns amount',
      });
      return;
    }
    if (
      issueMoneyRange(earns, ctx, {
        tooLowMessage: 'Pharmacy earns must be more than $0',
        tooHighMessage: `Pharmacy earns cannot exceed ${MAX_MONEY_LABEL}`,
      })
    ) {
      return;
    }
    const wholesale = parseMoneyInput(wholesaleValue);
    if (wholesale == null) return;
    if (earns > wholesale) {
      ctx.addIssue({
        code: 'custom',
        message: 'Pharmacy earns cannot exceed wholesale',
      });
    }
  });
}

/** Money field that must be greater than $0, at most $999,999.99, and at least a prior step. */
export function moneyAtLeastSchema(
  minimumValue: string,
  {
    invalidMessage,
    tooLowMessage,
  }: {
    invalidMessage: string;
    tooLowMessage: string;
  },
) {
  return z.string().superRefine((value, ctx) => {
    const amount = parseMoneyInput(value);
    if (amount == null) {
      ctx.addIssue({ code: 'custom', message: invalidMessage });
      return;
    }
    if (
      issueMoneyRange(amount, ctx, {
        tooLowMessage: 'Amount must be more than $0',
        tooHighMessage: `Amount cannot exceed ${MAX_MONEY_LABEL}`,
      })
    ) {
      return;
    }
    const minimum = parseMoneyInput(minimumValue);
    if (minimum == null) return;
    if (amount < minimum) {
      ctx.addIssue({ code: 'custom', message: tooLowMessage });
    }
  });
}
