import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SupportedLanguage } from "@/types";
import {
  validateUserByEmail,
  createUser as createUserApi,
  sendVerificationCode,
  validateVerificationCode,
  transformApiUserToAppUser,
  calculateIsUnderAge,
  type CreateUserRequest,
} from "@/lib/authApi";

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  birthdate: string;
  isUnderAge?: boolean;
  isAuthenticated: boolean;
  languagePreference?: SupportedLanguage;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  // Modal state
  isSignInModalOpen: boolean;
  modalStep: "email" | "registration" | "verification";

  // Form data
  email: string;
  fullName: string;
  phone: string;
  birthdate: string;
  verificationCode: string;

  // User state
  user: User | null;
  userExists: boolean | null;

  // Loading states
  isCheckingEmail: boolean;
  isCreatingUser: boolean;
  isSendingCode: boolean;
  isVerifyingCode: boolean;

  // Error state
  error: string | null;
}

// Async Thunks
export const checkUserEmail = createAsyncThunk(
  "auth/checkUserEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      const result = await validateUserByEmail(email);
      return {
        exists: result.exists,
        user: result.user ? transformApiUserToAppUser(result.user) : undefined,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to check email",
      );
    }
  },
);

export const createNewUser = createAsyncThunk(
  "auth/createNewUser",
  async (
    userData: {
      email: string;
      fullName: string;
      phone: string;
      birthdate: string;
      currentLanguage: SupportedLanguage;
    },
    { rejectWithValue },
  ) => {
    try {
      const isUnderAge = calculateIsUnderAge(userData.birthdate);
      const createUserData: CreateUserRequest = {
        email: userData.email,
        full_name: userData.fullName,
        phone: userData.phone,
        date_of_birth: userData.birthdate,
        language_preference: userData.currentLanguage,
        is_under_age: isUnderAge ? 1 : 0,
      };

      const newUser = await createUserApi(createUserData);
      return transformApiUserToAppUser(newUser);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create user",
      );
    }
  },
);

export const sendCode = createAsyncThunk(
  "auth/sendCode",
  async (
    { userId, email }: { userId: number; email: string },
    { rejectWithValue },
  ) => {
    try {
      const success = await sendVerificationCode(userId, email);
      if (!success) {
        throw new Error("Failed to send verification code");
      }
      return success;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to send verification code",
      );
    }
  },
);

export const verifyCode = createAsyncThunk(
  "auth/verifyCode",
  async (
    { userId, code }: { userId: number; code: string },
    { rejectWithValue },
  ) => {
    try {
      const success = await validateVerificationCode(userId, code);
      if (!success) {
        throw new Error("Invalid verification code");
      }
      return success;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Invalid verification code",
      );
    }
  },
);

const initialState: AuthState = {
  // Modal state
  isSignInModalOpen: false,
  modalStep: "email",

  // Form data
  email: "",
  fullName: "",
  phone: "",
  birthdate: "",
  verificationCode: "",

  // User state
  user: null,
  userExists: null,

  // Loading states
  isCheckingEmail: false,
  isCreatingUser: false,
  isSendingCode: false,
  isVerifyingCode: false,

  // Error state
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Modal actions
    openSignInModal: (state) => {
      state.isSignInModalOpen = true;
      state.modalStep = "email";
      state.error = null;
    },

    closeSignInModal: (state) => {
      state.isSignInModalOpen = false;
      state.modalStep = "email";
      state.email = "";
      state.fullName = "";
      state.phone = "";
      state.birthdate = "";
      state.verificationCode = "";
      state.userExists = null;
      state.error = null;
    },

    setModalStep: (state, action: PayloadAction<AuthState["modalStep"]>) => {
      state.modalStep = action.payload;
    },

    // Form actions
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
      state.error = null;
    },

    setFullName: (state, action: PayloadAction<string>) => {
      state.fullName = action.payload;
      state.error = null;
    },

    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
      state.error = null;
    },

    setBirthdate: (state, action: PayloadAction<string>) => {
      state.birthdate = action.payload;
      state.error = null;
    },

    setVerificationCode: (state, action: PayloadAction<string>) => {
      state.verificationCode = action.payload;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Authentication actions
    signOut: (state) => {
      state.user = null;
      state.isSignInModalOpen = false;
      state.modalStep = "email";
      state.email = "";
      state.fullName = "";
      state.phone = "";
      state.birthdate = "";
      state.verificationCode = "";
      state.userExists = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Check user email thunk
    builder
      .addCase(checkUserEmail.pending, (state) => {
        state.isCheckingEmail = true;
        state.error = null;
      })
      .addCase(checkUserEmail.fulfilled, (state, action) => {
        state.isCheckingEmail = false;
        state.userExists = action.payload.exists;

        if (action.payload.exists && action.payload.user) {
          // User exists, set user data and proceed to verification
          state.user = { ...action.payload.user, isAuthenticated: false };
          state.modalStep = "verification";
        } else {
          // User doesn't exist, proceed to registration
          state.modalStep = "registration";
        }
      })
      .addCase(checkUserEmail.rejected, (state, action) => {
        state.isCheckingEmail = false;
        state.error = action.payload as string;
      })

      // Create new user thunk
      .addCase(createNewUser.pending, (state) => {
        state.isCreatingUser = true;
        state.error = null;
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.isCreatingUser = false;
        state.user = { ...action.payload, isAuthenticated: false };
        state.modalStep = "verification";
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.isCreatingUser = false;
        state.error = action.payload as string;
      })

      // Send code thunk
      .addCase(sendCode.pending, (state) => {
        state.isSendingCode = true;
        state.error = null;
      })
      .addCase(sendCode.fulfilled, (state) => {
        state.isSendingCode = false;
        // Code was sent successfully, user should already be on verification step
        state.modalStep = "verification";
      })
      .addCase(sendCode.rejected, (state, action) => {
        state.isSendingCode = false;
        state.error = action.payload as string;
      })

      // Verify code thunk
      .addCase(verifyCode.pending, (state) => {
        state.isVerifyingCode = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state) => {
        state.isVerifyingCode = false;
        if (state.user) {
          state.user.isAuthenticated = true;
        }
        // Close modal and reset form after successful verification
        state.isSignInModalOpen = false;
        state.modalStep = "email";
        state.email = "";
        state.fullName = "";
        state.phone = "";
        state.birthdate = "";
        state.verificationCode = "";
        state.userExists = null;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.isVerifyingCode = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  openSignInModal,
  closeSignInModal,
  setModalStep,
  setEmail,
  setFullName,
  setPhone,
  setBirthdate,
  setVerificationCode,
  signOut,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
