"use client";

import i18n from "@/lib/i18n";
import { setLanguage } from "@/redux/api/slice/uiSlice";
import { persistor, store } from "@/redux/store/store";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

function LanguageInitializer() {
  useEffect(() => {
    // Get language from localStorage or browser settings
    const savedLang = typeof window !== "undefined" ? localStorage.getItem("lang") : null;

    // If we have a saved language, use it
    if (savedLang && ["en", "bn"].includes(savedLang)) {
      store.dispatch(setLanguage(savedLang as "en" | "bn"));
      i18n.changeLanguage(savedLang);
    } else if (typeof window !== "undefined") {
      // Otherwise, detect from browser
      const browserLang = navigator.language.split("-")[0];
      if (["en", "bn"].includes(browserLang)) {
        store.dispatch(setLanguage(browserLang as "en" | "bn"));
        i18n.changeLanguage(browserLang);
      }
    }
  }, []);

  return null;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageInitializer />
        {children}
      </PersistGate>
    </Provider>
  );
}
