"use client";

import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        className="px-3 py-1 rounded border text-sm"
        onClick={() => changeLanguage("en")}
        aria-pressed={i18n.language === "en"}
      >
        EN
      </button>
      <button
        className="px-3 py-1 rounded border text-sm"
        onClick={() => changeLanguage("pl")}
        aria-pressed={i18n.language === "pl"}
      >
        PL
      </button>
    </div>
  );
}


