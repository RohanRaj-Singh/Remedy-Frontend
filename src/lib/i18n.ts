import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import arCommon from "../locales/ar/common.json";
import bnCommon from "../locales/bn/common.json";
import enCommon from "../locales/en/common.json";

const resources = {
  en: { common: enCommon },
  bn: { common: bnCommon },
  ar: { common: arCommon },
};

// Detect language from localStorage or default to 'en'
let detectedLang = "en";
if (typeof window !== "undefined") {
  detectedLang = localStorage.getItem("lang") || "en";
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: detectedLang,
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common"],
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
