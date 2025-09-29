import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../index";

// Basic selectors
export const selectLanguageState = (state: RootState) => state.language;

export const selectCurrentLanguage = createSelector(
  [selectLanguageState],
  (languageState) => languageState.currentLanguage,
);

export const selectAvailableLanguages = createSelector(
  [selectLanguageState],
  (languageState) => languageState.availableLanguages,
);

// Helper selector to check if a specific language is available
export const selectIsLanguageAvailable = createSelector(
  [selectAvailableLanguages, (_state: RootState, language: string) => language],
  (availableLanguages, language) =>
    availableLanguages.includes(language as any),
);
