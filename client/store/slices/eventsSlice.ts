import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { ApiEvent } from "../../types";
import { API_ENDPOINTS } from "../../lib/apiConfig";

// State interface
export interface EventsState {
  events: ApiEvent[];
  selectedEvent: ApiEvent | null;
  filteredEvents: ApiEvent[];
  filters: {
    category: string;
    search: string;
    language: "en" | "es";
    dateRange: [string, string];
    priceRange: [number, number];
    trending: boolean;
    presale: boolean;
    includesTransportation: boolean;
    refundableIfNoTicket: boolean;
    acceptsUnderAge: boolean;
    jerseyAddonAvailable: boolean;
    location: string;
    venueName: string;
  };
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
}

// Initial state
const initialState: EventsState = {
  events: [],
  selectedEvent: null,
  filteredEvents: [],
  filters: {
    category: "",
    search: "",
    language: "en",
    dateRange: ["", ""],
    priceRange: [0, 5000],
    trending: false,
    presale: false,
    includesTransportation: false,
    refundableIfNoTicket: false,
    acceptsUnderAge: false,
    jerseyAddonAvailable: false,
    location: "",
    venueName: "",
  },
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  itemsPerPage: 12,
};

// Async thunk for fetching active events with filters
export const fetchActiveEventsAsync = createAsyncThunk(
  "events/fetchActiveEvents",
  async (
    filters: Partial<EventsState["filters"]> = {},
    { rejectWithValue },
  ) => {
    try {
      // Build request body with API filter format
      const requestBody: any = {};

      // Title search
      if (filters.search) {
        requestBody.title = filters.search;
      }

      // Language for title search
      if (filters.language) {
        requestBody.language = filters.language;
      }

      // Boolean filters (only send if true to match API behavior)
      if (filters.trending) {
        requestBody.is_trending = 1;
      }
      if (filters.presale) {
        requestBody.is_presale = 1;
      }
      if (filters.includesTransportation) {
        requestBody.includes_transportation = 1;
      }
      if (filters.refundableIfNoTicket) {
        requestBody.refundable_if_no_ticket = 1;
      }
      if (filters.acceptsUnderAge) {
        requestBody.accepts_under_age = 1;
      }
      if (filters.jerseyAddonAvailable) {
        requestBody.jersey_addon_available = 1;
      }

      // Venue filters
      if (filters.location) {
        requestBody.location = filters.location;
      }
      if (filters.venueName) {
        requestBody.venue_name = filters.venueName;
      }

      const response = await fetch(API_ENDPOINTS.GET_ACTIVE_EVENTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // The API might return events directly or in a success wrapper
      if (Array.isArray(data)) {
        return data as ApiEvent[];
      } else if (data.success && Array.isArray(data.events)) {
        return data.events as ApiEvent[];
      } else {
        throw new Error(data.message || data.error || "Failed to fetch events");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch events";
      return rejectWithValue(errorMessage);
    }
  },
);

// Async thunk for fetching event by ID
export const fetchEventByIdAsync = createAsyncThunk(
  "events/fetchEventById",
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ACTIVE_EVENTS_BY_ID, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: eventId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check for API error response
      if (data.error) {
        if (data.error === "Event not found") {
          throw new Error("Event not found");
        }
        throw new Error(data.error);
      }

      // The API might return event directly or in a success wrapper
      if (data.success && data.event) {
        console.log(
          "🎯 API Response (fetchEventById) - event.jersey_addon_available:",
          data.event.jersey_addon_available,
        );
        console.log(
          "🎯 API Response (fetchEventById) - Full event:",
          data.event,
        );
        return data.event as ApiEvent;
      } else if (data.id) {
        // Event data returned directly
        return data as ApiEvent;
      } else {
        throw new Error(data.message || "Failed to fetch event");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch event";
      return rejectWithValue(errorMessage);
    }
  },
);

// Events slice
export const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setSelectedEvent: (state, action: PayloadAction<ApiEvent | null>) => {
      state.selectedEvent = action.payload;
    },
    updateFilters: (
      state,
      action: PayloadAction<Partial<EventsState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to first page when filters change
      // Note: Filtering is now done server-side via fetchActiveEventsAsync
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
      // Note: Need to call fetchActiveEventsAsync after clearing filters
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when items per page changes
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.currentPage = 1;
      // Note: Need to call fetchActiveEventsAsync after updating search
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch active events
      .addCase(fetchActiveEventsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveEventsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.filteredEvents = action.payload; // Server-side filtered results
        state.totalCount = action.payload.length;
        state.error = null;
      })
      .addCase(fetchActiveEventsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.events = [];
        state.filteredEvents = [];
        state.totalCount = 0;
      })
      // Fetch event by ID
      .addCase(fetchEventByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
        state.error = null;
      })
      .addCase(fetchEventByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.selectedEvent = null;
      });
  },
});

// Export actions
export const {
  setSelectedEvent,
  updateFilters,
  clearFilters,
  setCurrentPage,
  setItemsPerPage,
  setSearchQuery,
  clearError,
} = eventsSlice.actions;

// Export reducer
export default eventsSlice.reducer;
