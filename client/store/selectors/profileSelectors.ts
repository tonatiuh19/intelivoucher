import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Base selectors
const selectProfileState = (state: RootState) => state.profile;

// Profile data selectors
export const selectProfile = createSelector(
  [selectProfileState],
  (profile) => profile.profile,
);

export const selectProfileId = createSelector(
  [selectProfile],
  (profile) => profile?.id,
);

export const selectProfileEmail = createSelector(
  [selectProfile],
  (profile) => profile?.email,
);

export const selectProfileFullName = createSelector(
  [selectProfile],
  (profile) => profile?.fullName,
);

export const selectProfilePhone = createSelector(
  [selectProfile],
  (profile) => profile?.phone,
);

export const selectProfileCountry = createSelector(
  [selectProfile],
  (profile) => profile?.country,
);

export const selectProfileLanguage = createSelector(
  [selectProfile],
  (profile) => profile?.languagePreference,
);

// Loading state selectors
export const selectIsLoadingProfile = createSelector(
  [selectProfileState],
  (profile) => profile.isLoadingProfile,
);

export const selectIsUpdatingProfile = createSelector(
  [selectProfileState],
  (profile) => profile.isUpdatingProfile,
);

// Error state selectors
export const selectProfileError = createSelector(
  [selectProfileState],
  (profile) => profile.error,
);

export const selectUpdateProfileError = createSelector(
  [selectProfileState],
  (profile) => profile.updateError,
);

// Success state selectors
export const selectUpdateProfileSuccess = createSelector(
  [selectProfileState],
  (profile) => profile.updateSuccess,
);

// Computed selectors
export const selectHasProfile = createSelector([selectProfile], (profile) =>
  Boolean(profile),
);

export const selectIsProfileComplete = createSelector(
  [selectProfile],
  (profile) =>
    Boolean(
      profile &&
        profile.email &&
        profile.fullName &&
        profile.phone &&
        profile.birthdate &&
        profile.country,
    ),
);
