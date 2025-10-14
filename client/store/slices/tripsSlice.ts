import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Trip, TransportationMode, JerseySelection } from "../../types";
import { fetchActiveEvents, fetchEventById } from "../../lib/tripsApi";

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
  async (
    params: { category?: string; location?: string } = {},
    { rejectWithValue },
  ) => {
    try {
      const trips = await fetchActiveEvents();

      // Apply filters if provided
      let filteredTrips = trips;

      if (params?.category) {
        filteredTrips = filteredTrips.filter((trip) =>
          trip.category.name
            .toLowerCase()
            .includes(params.category!.toLowerCase()),
        );
      }

      if (params?.location) {
        filteredTrips = filteredTrips.filter((trip) =>
          trip.location.toLowerCase().includes(params.location!.toLowerCase()),
        );
      }

      return filteredTrips;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch trips",
      );
    }
  },
);

export const fetchTripById = createAsyncThunk(
  "trips/fetchTripById",
  async (tripId: string, { rejectWithValue }) => {
    try {
      const trip = await fetchEventById(tripId);

      if (!trip) {
        throw new Error("Trip not found");
      }

      return trip;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch trip details",
      );
    }
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
