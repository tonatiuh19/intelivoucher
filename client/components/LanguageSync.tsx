import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setLanguage,
  initializeLanguage,
  selectCurrentLanguage,
} from "@/store/slices/languageSlice";

export function LanguageSync() {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(selectCurrentLanguage);

  useEffect(() => {
    // Initialize language state on app startup
    dispatch(initializeLanguage());
  }, [dispatch]);

  useEffect(() => {
    // Sync i18n with Redux store language
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  useEffect(() => {
    // Handle the case where i18n might have a different language than Redux after rehydration
    const syncOnRehydration = () => {
      if (
        i18n.isInitialized &&
        currentLanguage &&
        i18n.language !== currentLanguage
      ) {
        i18n.changeLanguage(currentLanguage);
      }
    };

    // Wait a bit for redux-persist rehydration to complete
    const timeout = setTimeout(syncOnRehydration, 100);
    return () => clearTimeout(timeout);
  }, [i18n, currentLanguage]);

  useEffect(() => {
    // Listen for i18n language changes and sync with Redux
    const handleLanguageChanged = (lng: string) => {
      if (lng !== currentLanguage && ["en", "es"].includes(lng)) {
        dispatch(setLanguage(lng as "en" | "es"));
      }
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n, currentLanguage, dispatch]);

  // This component doesn't render anything
  return null;
}
