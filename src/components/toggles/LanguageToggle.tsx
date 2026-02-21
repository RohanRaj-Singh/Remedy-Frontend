"use client";

import i18n from "@/lib/i18n";
import { setLanguage } from "@/redux/api/slice/uiSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";

interface LanguageToggleProps {
  onLanguageChange?: (language: string) => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ onLanguageChange }) => {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state) => state.ui);

  // Sync Redux state with i18n
  useEffect(() => {
    i18n.changeLanguage(language);

    // Save language preference to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", language);
    }

    onLanguageChange?.(language);
  }, [language, onLanguageChange]);

  const handleToggle = () => {
    // Toggle between languages: en <-> ar
    if (language === "en") {
      dispatch(setLanguage("ar"));
    } else {
      dispatch(setLanguage("en"));
    }
  };

  // Get display labels for languages
  const getCurrentLanguageLabel = () => {
    switch (language) {
      case "en":
        return "English";
      case "ar":
        return "Arabic";
      default:
        return "English";
    }
  };

  // const getNextLanguageLabel = () => {
  //   switch (language) {
  //     case "en":
  //       return "Arabic";
  //     case "ar":
  //       return "English";
  //     default:
  //       return "Arabic";
  //   }
  // };

  const getCurrentLanguageShortLabel = () => {
    switch (language) {
      case "en":
        return "En";
      case "ar":
        return "ar";
      default:
        return "En";
    }
  };

  const getNextLanguageShortLabel = () => {
    switch (language) {
      case "en":
        return "ar";
      case "ar":
        return "En";
      default:
        return "ar";
    }
  };

  return (
    <label className="relative z-10 inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="sr-only"
        checked={language === "en"}
        onChange={handleToggle}
      />

      <div className="relative z-10 flex h-8 w-20 items-center justify-between rounded-full bg-white p-0.5 font-bold shadow-inner transition-colors duration-300 sm:h-14 sm:w-48 sm:p-1">
        {/* Desktop Label */}
        <span
          className={`sm:text-md absolute hidden h-7 w-10 items-center justify-center rounded-full text-xs font-bold transition-transform duration-300 sm:h-14 sm:w-24 md:flex ${
            language === "en"
              ? "translate-x-0 text-black"
              : "translate-x-10 text-black sm:translate-x-20"
          }`}
        >
          {getCurrentLanguageLabel() === "English" ? "Arabic" : "English"}
        </span>

        {/* Desktop Toggle Button */}
        <span
          className={`sm:text-md z-10 hidden h-7 w-10 items-center justify-center rounded-full border-4 border-white text-xs font-bold text-white transition-transform duration-300 sm:h-14 sm:w-24 md:flex ${
            language === "en"
              ? "translate-x-10 bg-[#f37820] sm:translate-x-23"
              : "-translate-x-0.5 bg-[#f37820] sm:-translate-x-1"
          }`}
        >
          {getCurrentLanguageLabel() === "English" ? "English" : "Arabic"}
        </span>

        {/* Mobile Label */}
        <span
          className={`sm:text-md absolute flex h-7 w-10 items-center justify-center rounded-full text-xs font-bold transition-transform duration-300 sm:h-14 sm:w-24 md:hidden ${
            language === "en"
              ? "translate-x-0 text-black"
              : "translate-x-10 text-black sm:translate-x-20"
          }`}
        >
          {getCurrentLanguageShortLabel()}
        </span>

        {/* Mobile Toggle Button */}
        <span
          className={`sm:text-md z-10 flex h-7 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white transition-transform duration-300 sm:h-14 sm:w-24 md:hidden ${
            language === "en"
              ? "translate-x-10 bg-[#f37820] sm:translate-x-23"
              : "-translate-x-0.5 bg-[#f37820] sm:-translate-x-1"
          }`}
        >
          {getNextLanguageShortLabel()}
        </span>
      </div>
    </label>
  );
};

export default LanguageToggle;
