import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Base selector
const selectPaymentKeysState = (state: RootState) => state.paymentKeys;

// Memoized selectors
export const selectPaymentKeysData = createSelector(
  [selectPaymentKeysState],
  (paymentKeysState) => paymentKeysState.data,
);

export const selectPaymentKeysLoading = createSelector(
  [selectPaymentKeysState],
  (paymentKeysState) => paymentKeysState.loading,
);

export const selectPaymentKeysError = createSelector(
  [selectPaymentKeysState],
  (paymentKeysState) => paymentKeysState.error,
);

export const selectPaymentKeysLastFetched = createSelector(
  [selectPaymentKeysState],
  (paymentKeysState) => paymentKeysState.lastFetched,
);

// Specific provider selectors
export const selectStripeConfig = createSelector(
  [selectPaymentKeysData],
  (paymentKeysData) => paymentKeysData?.stripe,
);

export const selectPayPalConfig = createSelector(
  [selectPaymentKeysData],
  (paymentKeysData) => paymentKeysData?.paypal,
);

// Stripe publishable key selector
export const selectStripePublishableKey = createSelector(
  [selectStripeConfig],
  (stripeConfig) => stripeConfig?.publishableKey,
);

// PayPal client ID selector
export const selectPayPalClientId = createSelector(
  [selectPayPalConfig],
  (paypalConfig) => paypalConfig?.clientId,
);

// Check if payment keys are available
export const selectArePaymentKeysLoaded = createSelector(
  [selectPaymentKeysData, selectPaymentKeysLoading],
  (paymentKeysData, loading) =>
    !loading &&
    paymentKeysData !== null &&
    (paymentKeysData.stripe !== undefined ||
      paymentKeysData.paypal !== undefined),
);

// Check if payment keys need to be refreshed (older than 1 hour)
export const selectShouldRefreshPaymentKeys = createSelector(
  [selectPaymentKeysLastFetched],
  (lastFetched) => {
    if (!lastFetched) return true;
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    return Date.now() - lastFetched > oneHour;
  },
);
