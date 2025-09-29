import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Trip, TransportationMode, JerseySelection } from "../../types";

// State interface
export interface TripsState {
  trips: Trip[];
  selectedTrip: Trip | null;
  filters: {
    category: string;
    location: string;
    priceRange: [number, number];
    dateRange: [string, string];
  };
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

// Initial state
const initialState: TripsState = {
  trips: [],
  selectedTrip: null,
  filters: {
    category: "",
    location: "",
    priceRange: [0, 10000],
    dateRange: ["", ""],
  },
  loading: false,
  error: null,
  searchQuery: "",
};

// Async thunks for effects
export const fetchTrips = createAsyncThunk(
  "trips/fetchTrips",
  async (params?: { category?: string; location?: string }) => {
    // Simulate API call - replace with actual API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data - replace with actual API response
    const mockTrips: Trip[] = [
      {
        id: "1",
        title: "Sample Trip",
        category: "Football",
        date: "2025-10-15",
        location: "Stadium A",
        price: "150",
        image: "/placeholder.svg",
        rating: 4.5,
        soldOut: false,
        trending: true,
        includesTransportation: true,
        isPresale: false,
        requiresTicketAcquisition: true,
        refundableIfNoTicket: true,
        paymentOptions: {
          installmentsAvailable: true,
          presaleDepositAvailable: false,
          secondPaymentInstallmentsAvailable: true,
        },
        acceptsUnderAge: true,
        jerseyAddonAvailable: true,
        jerseyPrice: 80,
        availableZones: [
          {
            id: "vip",
            name: "VIP Section",
            price: 250,
            description: "Premium seating with exclusive amenities",
            available: true,
          },
          {
            id: "regular",
            name: "Regular Seating",
            price: 150,
            description: "Standard stadium seating",
            available: true,
          },
        ],
      },
    ];

    return mockTrips;
  },
);

export const fetchTripById = createAsyncThunk(
  "trips/fetchTripById",
  async (tripId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock response - replace with actual API
    const mockTrip: Trip = {
      id: tripId,
      title: "Sample Trip Details",
      category: "Football",
      date: "2025-10-15",
      location: "Stadium A",
      price: "150",
      image: "/placeholder.svg",
      rating: 4.5,
      soldOut: false,
      trending: true,
      includesTransportation: true,
      isPresale: false,
      requiresTicketAcquisition: true,
      refundableIfNoTicket: true,
      paymentOptions: {
        installmentsAvailable: true,
        presaleDepositAvailable: false,
        secondPaymentInstallmentsAvailable: true,
      },
      acceptsUnderAge: true,
      jerseyAddonAvailable: true,
      jerseyPrice: 80,
      availableZones: [
        {
          id: "vip",
          name: "VIP Section",
          price: 250,
          description: "Premium seating with exclusive amenities",
          available: true,
        },
        {
          id: "regular",
          name: "Regular Seating",
          price: 150,
          description: "Standard stadium seating",
          available: true,
        },
      ],
    };

    return mockTrip;
  },
);

// Create slice
export const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    // Synchronous actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<TripsState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = "";
    },
    selectTrip: (state, action: PayloadAction<Trip>) => {
      state.selectedTrip = action.payload;
    },
    clearSelectedTrip: (state) => {
      state.selectedTrip = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setTrips: (state, action: PayloadAction<Trip[]>) => {
      state.trips = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle async thunk actions
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch trips";
      })
      .addCase(fetchTripById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTrip = action.payload;
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch trip details";
      });
  },
});

// Export actions
export const {
  setSearchQuery,
  setFilters,
  clearFilters,
  selectTrip,
  clearSelectedTrip,
  clearError,
  setTrips,
} = tripsSlice.actions;
