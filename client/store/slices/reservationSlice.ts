import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  createReservation,
  validateReservationData,
  prepareReservationData,
  fetchUserReservations,
} from "@/lib/reservationApi";
import type {
  CreateReservationRequest,
  CreateReservationResponse,
  ReservationTicket,
  UserReservation,
} from "@/types";

// State interface
export interface ReservationState {
  // Current reservation process
  isLoading: boolean;
  isProcessingPayment: boolean;
  error: string | null;

  // Reservation data
  currentReservation: CreateReservationResponse | null;
  reservationHistory: CreateReservationResponse[];

  // User reservations (from API)
  userReservations: UserReservation[];
  isLoadingUserReservations: boolean;
  userReservationsError: string | null;

  // Form validation
  validationErrors: string[];

  // Success state
  isReservationComplete: boolean;
  lastCreatedTickets: ReservationTicket[];
}

// Initial state
const initialState: ReservationState = {
  isLoading: false,
  isProcessingPayment: false,
  error: null,
  currentReservation: null,
  reservationHistory: [],
  userReservations: [],
  isLoadingUserReservations: false,
  userReservationsError: null,
  validationErrors: [],
  isReservationComplete: false,
  lastCreatedTickets: [],
};

// Async thunk for creating a reservation
export const createReservationAsync = createAsyncThunk(
  "reservation/createReservation",
  async (
    payload: {
      checkoutData: any; // Type this according to your checkout form structure
      paymentData: {
        payment_method: "stripe" | "paypal";
        payment_token?: string;
        paypal_order_id?: string;
      };
    },
    { rejectWithValue },
  ) => {
    try {
      // Prepare reservation data
      const reservationData = prepareReservationData(
        payload.checkoutData,
        payload.paymentData,
      );

      // Validate the data before sending
      const validationErrors = validateReservationData(reservationData);
      if (validationErrors.length > 0) {
        return rejectWithValue({
          message: "Validation failed",
          errors: validationErrors,
        });
      }

      // Create the reservation
      const response = await createReservation(reservationData);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({
          message: error.message,
          errors: [],
        });
      }
      return rejectWithValue({
        message: "An unexpected error occurred while creating the reservation",
        errors: [],
      });
    }
  },
);

// Async thunk for direct reservation creation (if you need more control)
export const createReservationDirectAsync = createAsyncThunk(
  "reservation/createReservationDirect",
  async (reservationData: CreateReservationRequest, { rejectWithValue }) => {
    try {
      // Validate the data
      const validationErrors = validateReservationData(reservationData);
      if (validationErrors.length > 0) {
        return rejectWithValue({
          message: "Validation failed",
          errors: validationErrors,
        });
      }

      // Create the reservation
      const response = await createReservation(reservationData);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({
          message: error.message,
          errors: [],
        });
      }
      return rejectWithValue({
        message: "An unexpected error occurred while creating the reservation",
        errors: [],
      });
    }
  },
);

// Async thunk for fetching user reservations
export const fetchUserReservationsAsync = createAsyncThunk(
  "reservation/fetchUserReservations",
  async (user_id: number, { rejectWithValue }) => {
    try {
      console.log(
        "🚀 Redux action fetchUserReservationsAsync called with user_id:",
        user_id,
      );
      const reservations = await fetchUserReservations(user_id);
      console.log(
        "✅ Redux action completed successfully with",
        reservations.length,
        "reservations",
      );
      return reservations;
    } catch (error) {
      console.error("❌ Redux action failed:", error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue(
        "An unexpected error occurred while fetching reservations",
      );
    }
  },
);

// Create the slice
const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    // Clear current reservation
    clearCurrentReservation: (state) => {
      state.currentReservation = null;
      state.isReservationComplete = false;
      state.lastCreatedTickets = [];
      state.error = null;
      state.validationErrors = [];
    },

    // Clear all reservation data
    clearReservationState: (state) => {
      return initialState;
    },

    // Clear errors
    clearReservationErrors: (state) => {
      state.error = null;
      state.validationErrors = [];
    },

    // Set validation errors
    setValidationErrors: (state, action: PayloadAction<string[]>) => {
      state.validationErrors = action.payload;
    },

    // Mark reservation as complete (for UI state management)
    markReservationComplete: (state) => {
      state.isReservationComplete = true;
    },

    // Add reservation to history
    addToReservationHistory: (
      state,
      action: PayloadAction<CreateReservationResponse>,
    ) => {
      state.reservationHistory.unshift(action.payload);
      // Keep only last 10 reservations
      if (state.reservationHistory.length > 10) {
        state.reservationHistory = state.reservationHistory.slice(0, 10);
      }
    },

    // Set payment processing state
    setPaymentProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessingPayment = action.payload;
    },

    // Clear user reservations
    clearUserReservations: (state) => {
      state.userReservations = [];
      state.userReservationsError = null;
    },
  },
  extraReducers: (builder) => {
    // Handle createReservationAsync
    builder
      .addCase(createReservationAsync.pending, (state) => {
        state.isLoading = true;
        state.isProcessingPayment = true;
        state.error = null;
        state.validationErrors = [];
        state.isReservationComplete = false;
      })
      .addCase(createReservationAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isProcessingPayment = false;
        state.currentReservation = action.payload;
        state.lastCreatedTickets = action.payload.tickets;
        state.isReservationComplete = true;
        state.error = null;
        state.validationErrors = [];

        // Add to history
        state.reservationHistory.unshift(action.payload);
        if (state.reservationHistory.length > 10) {
          state.reservationHistory = state.reservationHistory.slice(0, 10);
        }
      })
      .addCase(createReservationAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isProcessingPayment = false;
        state.isReservationComplete = false;

        const payload = action.payload as
          | { message: string; errors: string[] }
          | undefined;
        if (payload) {
          state.error = payload.message;
          state.validationErrors = payload.errors;
        } else {
          state.error = "Failed to create reservation";
          state.validationErrors = [];
        }
      });

    // Handle createReservationDirectAsync
    builder
      .addCase(createReservationDirectAsync.pending, (state) => {
        state.isLoading = true;
        state.isProcessingPayment = true;
        state.error = null;
        state.validationErrors = [];
        state.isReservationComplete = false;
      })
      .addCase(createReservationDirectAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isProcessingPayment = false;
        state.currentReservation = action.payload;
        state.lastCreatedTickets = action.payload.tickets;
        state.isReservationComplete = true;
        state.error = null;
        state.validationErrors = [];

        // Add to history
        state.reservationHistory.unshift(action.payload);
        if (state.reservationHistory.length > 10) {
          state.reservationHistory = state.reservationHistory.slice(0, 10);
        }
      })
      .addCase(createReservationDirectAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isProcessingPayment = false;
        state.isReservationComplete = false;

        const payload = action.payload as
          | { message: string; errors: string[] }
          | undefined;
        if (payload) {
          state.error = payload.message;
          state.validationErrors = payload.errors;
        } else {
          state.error = "Failed to create reservation";
          state.validationErrors = [];
        }
      });

    // Handle fetchUserReservationsAsync
    builder
      .addCase(fetchUserReservationsAsync.pending, (state) => {
        state.isLoadingUserReservations = true;
        state.userReservationsError = null;
      })
      .addCase(fetchUserReservationsAsync.fulfilled, (state, action) => {
        state.isLoadingUserReservations = false;
        state.userReservations = action.payload;
        state.userReservationsError = null;
      })
      .addCase(fetchUserReservationsAsync.rejected, (state, action) => {
        state.isLoadingUserReservations = false;
        state.userReservationsError = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearCurrentReservation,
  clearReservationState,
  clearReservationErrors,
  setValidationErrors,
  markReservationComplete,
  addToReservationHistory,
  setPaymentProcessing,
  clearUserReservations,
} = reservationSlice.actions;

// Export reducer
export default reservationSlice.reducer;
