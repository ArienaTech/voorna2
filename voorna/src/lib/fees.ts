/**
 * Revenue split logic (spec: "Revenue Model Detail").
 * All amounts are in the smallest currency unit (cents).
 */

export const PLATFORM_FEE_PCT = 8;

/** Stripe standard rate used for the *estimated* display only. */
const STRIPE_PCT = 2.9;
const STRIPE_FIXED = 30;

export interface RevenueSplit {
  gross: number;
  voornaFee: number;
  stripeFeeEstimate: number;
  netToOrganiser: number;
}

export function splitRevenue(gross: number, platformFeePct = PLATFORM_FEE_PCT): RevenueSplit {
  const voornaFee = Math.round((gross * platformFeePct) / 100);
  const stripeFeeEstimate = Math.round((gross * STRIPE_PCT) / 100 + STRIPE_FIXED);
  return {
    gross,
    voornaFee,
    stripeFeeEstimate,
    netToOrganiser: gross - voornaFee - stripeFeeEstimate,
  };
}

export function formatMoney(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
