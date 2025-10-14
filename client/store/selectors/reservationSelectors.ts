import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import type { ReservationState } from "../slices/reservationSlice";

// Base selector
const selectReservationState = (state: RootState): ReservationState =>
  state.reservation;

// Loading state selectors
export const selectIsReservationLoading = createSelector(
  selectReservationState,
  (reservation) => reservation.isLoading,
);

export const selectIsProcessingPayment = createSelector(
  selectReservationState,
  (reservation) => reservation.isProcessingPayment,
);

export const selectIsReservationInProgress = createSelector(
  selectReservationState,
  (reservation) => reservation.isLoading || reservation.isProcessingPayment,
);

// Error selectors
export const selectReservationError = createSelector(
  selectReservationState,
  (reservation) => reservation.error,
);

export const selectReservationValidationErrors = createSelector(
  selectReservationState,
  (reservation) => reservation.validationErrors,
);

export const selectHasReservationErrors = createSelector(
  selectReservationState,
  (reservation) =>
    reservation.error !== null || reservation.validationErrors.length > 0,
);

// Current reservation selectors
export const selectCurrentReservation = createSelector(
  selectReservationState,
  (reservation) => reservation.currentReservation,
);

export const selectIsReservationComplete = createSelector(
  selectReservationState,
  (reservation) => reservation.isReservationComplete,
);

export const selectLastCreatedTickets = createSelector(
  selectReservationState,
  (reservation) => reservation.lastCreatedTickets,
);

// Reservation history selectors
export const selectReservationHistory = createSelector(
  selectReservationState,
  (reservation) => reservation.reservationHistory,
);

export const selectReservationHistoryCount = createSelector(
  selectReservationHistory,
  (history) => history.length,
);

// Current reservation details selectors
export const selectCurrentReservationDetails = createSelector(
  selectCurrentReservation,
  (reservation) => {
    if (!reservation) return null;

    return {
      purchaseId: reservation.purchase_id,
      transactionId: reservation.transaction_id,
      paymentMethod: reservation.payment_method,
      paymentStatus: reservation.payment_status,
      totalAmount: reservation.total_amount,
      ticketCount: reservation.tickets.length,
    };
  },
);

// Current reservation tickets selector
export const selectCurrentReservationTickets = createSelector(
  selectCurrentReservation,
  (reservation) => reservation?.tickets || [],
);

// Payment status selectors
export const selectPaymentStatus = createSelector(
  selectCurrentReservation,
  (reservation) => reservation?.payment_status,
);

export const selectIsPaymentSuccessful = createSelector(
  selectPaymentStatus,
  (status) => status === "completed",
);

export const selectIsPaymentPending = createSelector(
  selectPaymentStatus,
  (status) => status === "pending",
);

// Transaction info selectors
export const selectTransactionId = createSelector(
  selectCurrentReservation,
  (reservation) => reservation?.transaction_id,
);

export const selectPurchaseId = createSelector(
  selectCurrentReservation,
  (reservation) => reservation?.purchase_id,
);

// Combined status selector for UI
export const selectReservationStatus = createSelector(
  [
    selectIsReservationLoading,
    selectIsProcessingPayment,
    selectIsReservationComplete,
    selectHasReservationErrors,
  ],
  (isLoading, isProcessingPayment, isComplete, hasErrors) => ({
    isLoading,
    isProcessingPayment,
    isComplete,
    hasErrors,
    isIdle: !isLoading && !isProcessingPayment && !isComplete && !hasErrors,
  }),
);

// Success state selector for confirmation screen
export const selectReservationSuccessData = createSelector(
  [
    selectCurrentReservation,
    selectLastCreatedTickets,
    selectIsReservationComplete,
  ],
  (reservation, tickets, isComplete) => {
    if (!isComplete || !reservation) return null;

    return {
      purchaseId: reservation.purchase_id,
      transactionId: reservation.transaction_id,
      paymentMethod: reservation.payment_method,
      totalAmount: reservation.total_amount,
      tickets,
      message: reservation.message,
    };
  },
);

// Recent reservations selector (for user dashboard)
export const selectRecentReservations = createSelector(
  selectReservationHistory,
  (history) => history.slice(0, 5), // Last 5 reservations
);

// Export all selectors
export default {
  selectReservationState,
  selectIsReservationLoading,
  selectIsProcessingPayment,
  selectIsReservationInProgress,
  selectReservationError,
  selectReservationValidationErrors,
  selectHasReservationErrors,
  selectCurrentReservation,
  selectIsReservationComplete,
  selectLastCreatedTickets,
  selectReservationHistory,
  selectReservationHistoryCount,
  selectCurrentReservationDetails,
  selectCurrentReservationTickets,
  selectPaymentStatus,
  selectIsPaymentSuccessful,
  selectIsPaymentPending,
  selectTransactionId,
  selectPurchaseId,
  selectReservationStatus,
  selectReservationSuccessData,
  selectRecentReservations,
};
