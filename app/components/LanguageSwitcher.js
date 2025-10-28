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
        className="w-12 h-8 px-3 py-1 rounded border text-sm text-black border-gray-300"
        onClick={() => changeLanguage("en")}
        aria-pressed={i18n.language === "en"}
        
        style={{ backgroundImage: "url('/flags/us.svg')", 
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        }}
      >
        
      </button>
      <button
        className="w-12 h-8 px-3 py-1 rounded border text-sm bg-white text-black border-gray-300"
        onClick={() => changeLanguage("pl")}
        aria-pressed={i18n.language === "pl"}
        style={{ backgroundImage: "url('/flags/pl.svg')", 
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",  
          }}
        
      >
        
      </button>
    </div>
  );
}


