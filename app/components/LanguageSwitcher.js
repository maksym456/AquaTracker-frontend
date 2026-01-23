"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Zapisz do localStorage (i18n automatycznie to zrobi przez event listener, ale dla pewności)
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lng);
    }
  };

  // Domyślny stan języka przed zamontowaniem (dla SSR)
  const currentLanguage = mounted ? i18n.language : "en";

  return (
    <div className="flex gap-2 items-center">
      <button
        className="w-12 h-8 px-3 py-1 rounded border text-sm text-black border-gray-300 transition-transform duration-200 hover:scale-110 hover:shadow-lg"
        onClick={() => changeLanguage("en")}
        aria-pressed={currentLanguage === "en"}
        aria-label="Switch to English"
        suppressHydrationWarning
        style={{ backgroundImage: "url('/flags/us.svg')", 
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        }}
      >
        <span className="sr-only">English</span>
      </button>
      <button
        className="w-12 h-8 px-3 py-1 rounded border text-sm bg-white text-black border-gray-300 transition-transform duration-200 hover:scale-110 hover:shadow-lg"
        onClick={() => changeLanguage("pl")}
        aria-pressed={currentLanguage === "pl"}
        aria-label="Przełącz na polski"
        suppressHydrationWarning
        style={{ backgroundImage: "url('/flags/pl.svg')", 
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",  
          }}
      >
        <span className="sr-only">Polski</span>
      </button>
    </div>
  );
}


