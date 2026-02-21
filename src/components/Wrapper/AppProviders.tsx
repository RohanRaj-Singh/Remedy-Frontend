"use client";

import ReduxProvider from "@/components/Wrapper/ReduxProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";

function I18nUpdater() {
  const { language } = useAppSelector((state) => state.ui);
  
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);
  
  return null;
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <I18nextProvider i18n={i18n}>
        <I18nUpdater />
        {children}
      </I18nextProvider>
    </ReduxProvider>
  );
}