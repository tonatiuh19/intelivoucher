import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setLanguage,
  selectCurrentLanguage,
  selectAvailableLanguages,
} from "@/store/slices/languageSlice";
import { SupportedLanguage } from "@/types";

/**
 * Custom hook that provides language functionality with Redux integration
 * Combines i18next translation functions with Redux state management
 */
export function useLanguage() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(selectCurrentLanguage);
  const availableLanguages = useAppSelector(selectAvailableLanguages);

  const changeLanguage = (language: SupportedLanguage) => {
    // Update both Redux store and i18n
    dispatch(setLanguage(language));
    i18n.changeLanguage(language);
  };

  const isLanguageAvailable = (
    language: string,
  ): language is SupportedLanguage => {
    return availableLanguages.includes(language as SupportedLanguage);
  };

  return {
    // Translation function
    t,

    // Language state
    currentLanguage,
    availableLanguages,

    // Language actions
    changeLanguage,
    isLanguageAvailable,

    // i18n instance (for advanced usage)
    i18n,
  };
}
