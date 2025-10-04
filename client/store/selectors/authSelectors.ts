import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Base selector
const selectAuth = (state: RootState) => state.auth;

// Modal selectors
export const selectIsSignInModalOpen = createSelector(
  selectAuth,
  (auth) => auth.isSignInModalOpen,
);

export const selectModalStep = createSelector(
  selectAuth,
  (auth) => auth.modalStep,
);

// Form data selectors
export const selectEmail = createSelector(selectAuth, (auth) => auth.email);

export const selectFullName = createSelector(
  selectAuth,
  (auth) => auth.fullName,
);

export const selectPhone = createSelector(selectAuth, (auth) => auth.phone);

export const selectBirthdate = createSelector(
  selectAuth,
  (auth) => auth.birthdate,
);

export const selectVerificationCode = createSelector(
  selectAuth,
  (auth) => auth.verificationCode,
);

// User selectors
export const selectUser = createSelector(selectAuth, (auth) => auth.user);

export const selectIsAuthenticated = createSelector(
  selectUser,
  (user) => user?.isAuthenticated || false,
);

export const selectUserExists = createSelector(
  selectAuth,
  (auth) => auth.userExists,
);

// Loading state selectors
export const selectIsCheckingEmail = createSelector(
  selectAuth,
  (auth) => auth.isCheckingEmail,
);

export const selectIsCreatingUser = createSelector(
  selectAuth,
  (auth) => auth.isCreatingUser,
);

export const selectIsSendingCode = createSelector(
  selectAuth,
  (auth) => auth.isSendingCode,
);

export const selectIsVerifyingCode = createSelector(
  selectAuth,
  (auth) => auth.isVerifyingCode,
);

export const selectIsAnyAuthLoading = createSelector(
  selectAuth,
  (auth) =>
    auth.isCheckingEmail ||
    auth.isCreatingUser ||
    auth.isSendingCode ||
    auth.isVerifyingCode,
);

// Error selector
export const selectAuthError = createSelector(selectAuth, (auth) => auth.error);

// Computed selectors
export const selectCanProceedFromEmail = createSelector(
  [selectEmail, selectIsCheckingEmail],
  (email, isChecking) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.length > 0 && emailRegex.test(email) && !isChecking;
  },
);

export const selectCanProceedFromRegistration = createSelector(
  [selectFullName, selectPhone, selectBirthdate, selectIsCreatingUser],
  (fullName, phone, birthdate, isCreating) => {
    return (
      fullName.trim().length > 0 &&
      phone.trim().length > 0 &&
      birthdate.length > 0 &&
      !isCreating
    );
  },
);

export const selectCanProceedFromVerification = createSelector(
  [selectVerificationCode, selectIsVerifyingCode],
  (code, isVerifying) => {
    return code.length === 6 && /^\d{6}$/.test(code) && !isVerifying;
  },
);
