import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Base selectors
export const selectCheckoutState = (state: RootState) => state.checkout;
export const selectCartItems = (state: RootState) => state.checkout.items;
export const selectCheckoutStep = (state: RootState) => state.checkout.step;
export const selectPaymentMethod = (state: RootState) =>
  state.checkout.paymentMethod;
export const selectCustomerDetails = (state: RootState) =>
  state.checkout.customerDetails;
export const selectTotals = (state: RootState) => state.checkout.totals;
export const selectPromoCode = (state: RootState) => state.checkout.promoCode;
export const selectCheckoutLoading = (state: RootState) =>
  state.checkout.loading;
export const selectCheckoutError = (state: RootState) => state.checkout.error;

// Memoized selectors with business logic
export const selectCartItemCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0),
);

export const selectIsCartEmpty = createSelector(
  [selectCartItems],
  (items) => items.length === 0,
);

export const selectCartItemsByTrip = createSelector(
  [selectCartItems],
  (items) => {
    const byTrip: Record<string, typeof items> = {};

    items.forEach((item) => {
      const tripId = item.trip.id;
      if (!byTrip[tripId]) {
        byTrip[tripId] = [];
      }
      byTrip[tripId].push(item);
    });

    return byTrip;
  },
);

export const selectCartItemByTripId = (tripId: string) =>
  createSelector([selectCartItems], (items) =>
    items.find((item) => item.trip.id === tripId),
  );

export const selectHasJerseySelections = createSelector(
  [selectCartItems],
  (items) =>
    items.some((item) =>
      item.jerseySelections.some((selection) => selection !== null),
    ),
);

export const selectIncompleteJerseySelections = createSelector(
  [selectCartItems],
  (items) => {
    const incomplete: Array<{ tripId: string; missingCount: number }> = [];

    items.forEach((item) => {
      if (item.trip.jerseyAddonAvailable) {
        const nullSelections = item.jerseySelections.filter(
          (s) => s === null,
        ).length;
        if (nullSelections > 0) {
          incomplete.push({
            tripId: item.trip.id,
            missingCount: nullSelections,
          });
        }
      }
    });

    return incomplete;
  },
);

export const selectTransportationOptions = createSelector(
  [selectCartItems],
  (items) => {
    const options = new Set<string>();
    items.forEach((item) => {
      if (item.transportation !== "none") {
        options.add(item.transportation);
      }
    });
    return Array.from(options);
  },
);

export const selectRequiresEmergencyContact = createSelector(
  [selectCartItems],
  (items) => items.some((item) => item.trip.acceptsUnderAge),
);

export const selectCartSubtotal = createSelector(
  [selectTotals],
  (totals) => totals.subtotal,
);

export const selectCartTotal = createSelector(
  [selectTotals],
  (totals) => totals.total,
);

export const selectHasDiscount = createSelector(
  [selectTotals],
  (totals) => totals.discount > 0,
);

export const selectCanProceedToPayment = createSelector(
  [selectIsCartEmpty, selectCustomerDetails, selectIncompleteJerseySelections],
  (isEmpty, customerDetails, incompleteJerseys) => {
    if (isEmpty) return false;

    const hasRequiredDetails = !!(
      customerDetails.name &&
      customerDetails.email &&
      customerDetails.phone
    );

    const hasCompleteJerseys = incompleteJerseys.length === 0;

    return hasRequiredDetails && hasCompleteJerseys;
  },
);

export const selectEstimatedDeliveryDate = createSelector(
  [selectCartItems],
  (items) => {
    if (items.length === 0) return null;

    // Calculate earliest trip date and add processing time
    const earliestTripDate = Math.min(
      ...items.map((item) => new Date(item.trip.date).getTime()),
    );

    const processingDays = 7; // 7 days before trip for delivery
    const deliveryDate = new Date(
      earliestTripDate - processingDays * 24 * 60 * 60 * 1000,
    );

    return deliveryDate.toISOString().split("T")[0]; // Return YYYY-MM-DD format
  },
);
