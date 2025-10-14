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
    dateRange: [string, string];
    priceRange: [number, number];
    trending: boolean;
    presale: boolean;
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
    dateRange: ["", ""],
    priceRange: [0, 5000],
    trending: false,
    presale: false,
  },
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  itemsPerPage: 12,
};

// Async thunk for fetching active events
export const fetchActiveEventsAsync = createAsyncThunk(
  "events/fetchActiveEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ACTIVE_EVENTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

// Helper function to apply filters
const applyFilters = (
  events: ApiEvent[],
  filters: EventsState["filters"],
): ApiEvent[] => {
  return events.filter((event) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle =
        event.title.toLowerCase().includes(searchLower) ||
        event.title_es.toLowerCase().includes(searchLower);
      const matchesDescription =
        event.description.toLowerCase().includes(searchLower) ||
        event.description_es.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesDescription) return false;
    }

    // Category filter
    if (filters.category && event.category_id !== filters.category) {
      return false;
    }

    // Trending filter
    if (filters.trending && event.is_trending !== "1") {
      return false;
    }

    // Presale filter
    if (filters.presale && event.is_presale !== "1") {
      return false;
    }

    // Date range filter
    if (filters.dateRange[0] && filters.dateRange[1]) {
      const eventDate = new Date(event.event_date);
      const startDate = new Date(filters.dateRange[0]);
      const endDate = new Date(filters.dateRange[1]);
      if (eventDate < startDate || eventDate > endDate) {
        return false;
      }
    }

    return true;
  });
};

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
      state.filteredEvents = applyFilters(state.events, state.filters);
      state.totalCount = state.filteredEvents.length;
      state.currentPage = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredEvents = state.events;
      state.totalCount = state.events.length;
      state.currentPage = 1;
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
      state.filteredEvents = applyFilters(state.events, state.filters);
      state.totalCount = state.filteredEvents.length;
      state.currentPage = 1;
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
        state.filteredEvents = applyFilters(action.payload, state.filters);
        state.totalCount = state.filteredEvents.length;
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
