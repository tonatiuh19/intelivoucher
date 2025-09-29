import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type {
  Trip,
  TransportationMode,
  JerseySelection,
  Purchase,
} from "../../types";

// Checkout item interface
export interface CheckoutItem {
  trip: Trip;
  quantity: number;
  zone: string;
  transportation: TransportationMode;
  transportOrigin?: string;
  jerseySelections: (JerseySelection | null)[]; // length = quantity
}

// Payment method interface
export interface PaymentMethod {
  type: "credit_card" | "debit_card" | "paypal" | "bank_transfer";
  installments?: number;
  isDeposit?: boolean;
}

// State interface
export interface CheckoutState {
  items: CheckoutItem[];
  step: "selection" | "details" | "payment" | "confirmation";
  paymentMethod: PaymentMethod | null;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    emergencyContact?: {
      name: string;
      phone: string;
    };
  };
  totals: {
    subtotal: number;
    taxes: number;
    fees: number;
    discount: number;
    total: number;
  };
  promoCode: string;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CheckoutState = {
  items: [],
  step: "selection",
  paymentMethod: null,
  customerDetails: {
    name: "",
    email: "",
    phone: "",
  },
  totals: {
    subtotal: 0,
    taxes: 0,
    fees: 0,
    discount: 0,
    total: 0,
  },
  promoCode: "",
  loading: false,
  error: null,
};

// Async thunks for effects
export const validatePromoCode = createAsyncThunk(
  "checkout/validatePromoCode",
  async (promoCode: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock validation - replace with actual API
    const validCodes = ["SAVE10", "WELCOME", "STUDENT"];

    if (validCodes.includes(promoCode.toUpperCase())) {
      return {
        code: promoCode.toUpperCase(),
        discount: promoCode.toUpperCase() === "SAVE10" ? 0.1 : 0.05,
        type: "percentage" as const,
      };
    }

    throw new Error("Invalid promo code");
  },
);

export const processPayment = createAsyncThunk(
  "checkout/processPayment",
  async (paymentData: {
    items: CheckoutItem[];
    paymentMethod: PaymentMethod;
    customerDetails: CheckoutState["customerDetails"];
    totals: CheckoutState["totals"];
  }) => {
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock response - replace with actual payment gateway
    const purchase: Purchase = {
      id: `purchase_${Date.now()}`,
      tripId: paymentData.items[0].trip.id,
      title: paymentData.items[0].trip.title,
      date: paymentData.items[0].trip.date,
      location: paymentData.items[0].trip.location,
      image: paymentData.items[0].trip.image,
      quantity: paymentData.items[0].quantity,
      zone: paymentData.items[0].zone,
      transportation: paymentData.items[0].transportation,
      transportOrigin: paymentData.items[0].transportOrigin,
      jerseySelections: paymentData.items[0].jerseySelections,
      total: paymentData.totals.total,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    return purchase;
  },
);

// Helper function to calculate totals
const calculateTotals = (items: CheckoutItem[], discount: number = 0) => {
  const subtotal = items.reduce((sum, item) => {
    const basePrice = parseFloat(item.trip.price);
    const jerseyTotal =
      item.jerseySelections.filter(Boolean).length *
      (item.trip.jerseyPrice || 0);
    return sum + (basePrice + jerseyTotal) * item.quantity;
  }, 0);

  const taxes = subtotal * 0.15; // 15% tax
  const fees = 25; // Processing fee
  const discountAmount = subtotal * discount;
  const total = subtotal + taxes + fees - discountAmount;

  return {
    subtotal,
    taxes,
    fees,
    discount: discountAmount,
    total,
  };
};

// Create slice
export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    // Synchronous actions
    addToCart: (state, action: PayloadAction<CheckoutItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item.trip.id === action.payload.trip.id &&
          item.zone === action.payload.zone &&
          item.transportation === action.payload.transportation,
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.jerseySelections.push(...action.payload.jerseySelections);
      } else {
        state.items.push(action.payload);
      }

      state.totals = calculateTotals(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const tripId = action.payload;
      state.items = state.items.filter((item) => item.trip.id !== tripId);
      state.totals = calculateTotals(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ tripId: string; quantity: number }>,
    ) => {
      const { tripId, quantity } = action.payload;
      const item = state.items.find((item) => item.trip.id === tripId);

      if (item && quantity > 0) {
        item.quantity = quantity;
        // Adjust jersey selections array length to match quantity
        if (item.jerseySelections.length > quantity) {
          item.jerseySelections = item.jerseySelections.slice(0, quantity);
        } else {
          while (item.jerseySelections.length < quantity) {
            item.jerseySelections.push(null);
          }
        }
        state.totals = calculateTotals(state.items);
      }
    },
    updateJerseySelection: (
      state,
      action: PayloadAction<{
        tripId: string;
        index: number;
        selection: JerseySelection | null;
      }>,
    ) => {
      const { tripId, index, selection } = action.payload;
      const item = state.items.find((item) => item.trip.id === tripId);

      if (item && index < item.jerseySelections.length) {
        item.jerseySelections[index] = selection;
        state.totals = calculateTotals(state.items);
      }
    },
    setStep: (state, action: PayloadAction<CheckoutState["step"]>) => {
      state.step = action.payload;
    },
    setPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.paymentMethod = action.payload;
    },
    updateCustomerDetails: (
      state,
      action: PayloadAction<Partial<CheckoutState["customerDetails"]>>,
    ) => {
      state.customerDetails = { ...state.customerDetails, ...action.payload };
    },
    setPromoCode: (state, action: PayloadAction<string>) => {
      state.promoCode = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.totals = initialState.totals;
      state.step = "selection";
      state.paymentMethod = null;
      state.promoCode = "";
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle async thunk actions
    builder
      .addCase(validatePromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validatePromoCode.fulfilled, (state, action) => {
        state.loading = false;
        const discountPercent = action.payload.discount;
        state.totals = calculateTotals(state.items, discountPercent);
      })
      .addCase(validatePromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Invalid promo code";
        state.promoCode = "";
      })
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state) => {
        state.loading = false;
        state.step = "confirmation";
        // Keep items for confirmation page, but could clear after viewing
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Payment processing failed";
      });
  },
});

// Export actions
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateJerseySelection,
  setStep,
  setPaymentMethod,
  updateCustomerDetails,
  setPromoCode,
  clearCart,
  clearError,
} = checkoutSlice.actions;
