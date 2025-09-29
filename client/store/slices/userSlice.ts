import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Purchase } from "../../types";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferences: {
    favoriteCategories: string[];
    notifications: boolean;
    language: "en" | "es";
  };
}

// State interface
export interface UserState {
  user: User | null;
  purchases: Purchase[];
  favorites: string[]; // Trip IDs
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  user: null,
  purchases: [],
  favorites: [],
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks for effects
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: { email: string; password: string }) => {
    // Simulate API login
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response - replace with actual API
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email: credentials.email,
      phone: "+1234567890",
      preferences: {
        favoriteCategories: ["Football", "Basketball"],
        notifications: true,
        language: "en",
      },
    };

    return mockUser;
  },
);

export const fetchUserPurchases = createAsyncThunk(
  "user/fetchPurchases",
  async (userId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock purchases - replace with actual API
    const mockPurchases: Purchase[] = [
      {
        id: "p1",
        tripId: "1",
        title: "Sample Trip",
        date: "2025-10-15",
        location: "Stadium A",
        image: "/placeholder.svg",
        quantity: 2,
        zone: "VIP",
        transportation: "van",
        transportOrigin: "City Center",
        jerseySelections: [
          { size: "L", playerName: "Player 1", playerNumber: "10" },
          null,
        ],
        total: 350,
        status: "confirmed",
        createdAt: "2025-09-15T10:00:00Z",
      },
    ];

    return mockPurchases;
  },
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData: Partial<User>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    return profileData;
  },
);

// Create slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Synchronous actions
    logout: (state) => {
      state.user = null;
      state.purchases = [];
      state.favorites = [];
      state.isAuthenticated = false;
      state.error = null;
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      const tripId = action.payload;
      if (!state.favorites.includes(tripId)) {
        state.favorites.push(tripId);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      const tripId = action.payload;
      state.favorites = state.favorites.filter((id) => id !== tripId);
    },
    updatePreferences: (
      state,
      action: PayloadAction<Partial<User["preferences"]>>,
    ) => {
      if (state.user) {
        state.user.preferences = {
          ...state.user.preferences,
          ...action.payload,
        };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle async thunk actions
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(fetchUserPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload;
      })
      .addCase(fetchUserPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch purchases";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update profile";
      });
  },
});

// Export actions
export const {
  logout,
  addToFavorites,
  removeFromFavorites,
  updatePreferences,
  clearError,
} = userSlice.actions;
