import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SupportedLanguage } from "@/types";

interface LanguageState {
  currentLanguage: SupportedLanguage;
  availableLanguages: SupportedLanguage[];
}

// Function to detect browser language
const detectBrowserLanguage = (): SupportedLanguage => {
  const browserLang = navigator.language.split("-")[0]; // Get language without region
  const supportedLanguages: SupportedLanguage[] = ["en", "es"];

  // Check if browser language is supported
  if (supportedLanguages.includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage;
  }

  // Default to English if not supported
  return "en";
};

// Get initial language from localStorage or browser detection
const getInitialLanguage = (): SupportedLanguage => {
  try {
    // Check if there's a saved language in localStorage (from i18next)
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage && ["en", "es"].includes(savedLanguage)) {
      return savedLanguage as SupportedLanguage;
    }
  } catch (error) {
    console.warn("Could not access localStorage:", error);
  }

  return detectBrowserLanguage();
};

const initialState: LanguageState = {
  currentLanguage: getInitialLanguage(),
  availableLanguages: ["en", "es"],
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<SupportedLanguage>) => {
      state.currentLanguage = action.payload;

      // Persist to localStorage
      try {
        localStorage.setItem("i18nextLng", action.payload);
      } catch (error) {
        console.warn("Could not save language to localStorage:", error);
      }
    },
    initializeLanguage: (state) => {
      // This action can be dispatched on app startup to ensure consistency
      // If state is already persisted, keep it; otherwise use browser detection
      if (!state.currentLanguage) {
        const initialLang = getInitialLanguage();
        state.currentLanguage = initialLang;

        // Sync with i18next
        try {
          localStorage.setItem("i18nextLng", initialLang);
        } catch (error) {
          console.warn("Could not save language to localStorage:", error);
        }
      } else {
        // State was restored by redux-persist, sync with i18next
        try {
          localStorage.setItem("i18nextLng", state.currentLanguage);
        } catch (error) {
          console.warn("Could not save language to localStorage:", error);
        }
      }
    },
  },
});

export const { setLanguage, initializeLanguage } = languageSlice.actions;

// Selectors
export const selectCurrentLanguage = (state: { language: LanguageState }) =>
  state.language.currentLanguage;

export const selectAvailableLanguages = (state: { language: LanguageState }) =>
  state.language.availableLanguages;

export default languageSlice.reducer;
