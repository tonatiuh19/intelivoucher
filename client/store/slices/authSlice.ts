import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  birthdate?: string;
  isAuthenticated: boolean;
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
  isVerifyingCode: boolean;

  // Error state
  error: string | null;
}

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

    // User existence check
    startEmailCheck: (state) => {
      state.isCheckingEmail = true;
      state.error = null;
    },

    emailCheckSuccess: (
      state,
      action: PayloadAction<{ userExists: boolean; userData?: User }>,
    ) => {
      state.isCheckingEmail = false;
      state.userExists = action.payload.userExists;

      if (action.payload.userExists && action.payload.userData) {
        // User exists, proceed to verification
        state.modalStep = "verification";
        state.user = action.payload.userData;
      } else {
        // User doesn't exist, proceed to registration
        state.modalStep = "registration";
      }
    },

    emailCheckError: (state, action: PayloadAction<string>) => {
      state.isCheckingEmail = false;
      state.error = action.payload;
    },

    // User creation
    startUserCreation: (state) => {
      state.isCreatingUser = true;
      state.error = null;
    },

    userCreationSuccess: (state, action: PayloadAction<User>) => {
      state.isCreatingUser = false;
      state.user = action.payload;
      state.modalStep = "verification";
    },

    userCreationError: (state, action: PayloadAction<string>) => {
      state.isCreatingUser = false;
      state.error = action.payload;
    },

    // Code verification
    startCodeVerification: (state) => {
      state.isVerifyingCode = true;
      state.error = null;
    },

    codeVerificationSuccess: (state, action: PayloadAction<User>) => {
      state.isVerifyingCode = false;
      state.user = { ...action.payload, isAuthenticated: true };
      state.isSignInModalOpen = false;
      // Reset form data
      state.email = "";
      state.fullName = "";
      state.phone = "";
      state.birthdate = "";
      state.verificationCode = "";
      state.userExists = null;
      state.modalStep = "email";
    },

    codeVerificationError: (state, action: PayloadAction<string>) => {
      state.isVerifyingCode = false;
      state.error = action.payload;
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

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
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
  startEmailCheck,
  emailCheckSuccess,
  emailCheckError,
  startUserCreation,
  userCreationSuccess,
  userCreationError,
  startCodeVerification,
  codeVerificationSuccess,
  codeVerificationError,
  signOut,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
