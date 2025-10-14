import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchPaymentKeys, PaymentKeysData } from "@/lib/paymentKeysApi";

// State interface
export interface PaymentKeysState {
  data: PaymentKeysData | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null; // Timestamp for cache management
}

// Initial state
const initialState: PaymentKeysState = {
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunk to fetch payment keys
export const loadPaymentKeys = createAsyncThunk(
  "paymentKeys/loadPaymentKeys",
  async (_, { rejectWithValue }) => {
    try {
      const keys = await fetchPaymentKeys();
      return keys;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to load payment keys",
      );
    }
  },
);

// Payment keys slice
export const paymentKeysSlice = createSlice({
  name: "paymentKeys",
  initialState,
  reducers: {
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },

    // Reset the entire state
    resetPaymentKeys: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load payment keys cases
      .addCase(loadPaymentKeys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadPaymentKeys.fulfilled,
        (state, action: PayloadAction<PaymentKeysData>) => {
          state.loading = false;
          state.error = null;
          state.data = action.payload;
          state.lastFetched = Date.now();
        },
      )
      .addCase(loadPaymentKeys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.data = null;
      });
  },
});

// Export actions
export const { clearError, resetPaymentKeys } = paymentKeysSlice.actions;

// Export reducer
export default paymentKeysSlice.reducer;
