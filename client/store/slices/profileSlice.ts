import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SupportedLanguage } from "@/types";
import {
  getUserInfoById,
  updateUser,
  transformApiUserProfileToAppUser,
  transformAppUserToApiUpdateRequest,
  type ApiUserProfile,
  type UpdateUserRequest,
} from "@/lib/profileApi";

export interface ProfileUser {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  birthdate: string;
  country: string;
  isUnderAge: boolean;
  isAuthenticated: boolean;
  languagePreference: SupportedLanguage;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileState {
  // Profile data
  profile: ProfileUser | null;

  // Loading states
  isLoadingProfile: boolean;
  isUpdatingProfile: boolean;

  // Error state
  error: string | null;
  updateError: string | null;

  // Success state
  updateSuccess: boolean;
}

const initialState: ProfileState = {
  profile: null,
  isLoadingProfile: false,
  isUpdatingProfile: false,
  error: null,
  updateError: null,
  updateSuccess: false,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (userId: number, { rejectWithValue }) => {
    try {
      const apiUser = await getUserInfoById(userId);
      return transformApiUserProfileToAppUser(apiUser);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch profile",
      );
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (
    profileData: {
      id: number;
      email: string;
      fullName: string;
      phone: string;
      birthdate: string;
      country: string;
      languagePreference?: SupportedLanguage;
    },
    { rejectWithValue },
  ) => {
    try {
      const apiRequest = transformAppUserToApiUpdateRequest(profileData);
      const updatedApiUser = await updateUser(apiRequest);
      return transformApiUserProfileToAppUser(updatedApiUser);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    setProfile: (state, action: PayloadAction<ProfileUser | null>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.updateError = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoadingProfile = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoadingProfile = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoadingProfile = false;
        state.error = action.payload as string;
      });

    // Update user profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdatingProfile = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.profile = action.payload;
        state.updateError = null;
        state.updateSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        state.updateError = action.payload as string;
        state.updateSuccess = false;
      });
  },
});

export const {
  clearProfileError,
  clearUpdateSuccess,
  setProfile,
  clearProfile,
} = profileSlice.actions;
export default profileSlice.reducer;
