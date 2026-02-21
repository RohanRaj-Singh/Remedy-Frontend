// components/LanguageSelector.tsx
"use client";

import i18n from "../lib/i18n";

const languages = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
];

export default function LanguageSelector() {
  const current = i18n.language || "en";

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lng);
    }
  };

  return (
    <div>
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => changeLanguage(l.code)}
          aria-pressed={current === l.code}
          style={{ marginRight: 8 }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
