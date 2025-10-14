import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to AquaTracker",
      getStarted: "Get started by editing",
      saveAndSee: "Save and see your changes instantly.",
      deployNow: "Deploy now",
      readDocs: "Read our docs",
      learn: "Learn",
      examples: "Examples",
      gotoNext: "Go to nextjs.org →"
    }
  },
  pl: {
    translation: {
      welcome: "Witamy w AquaTracker",
      getStarted: "Zacznij od edycji",
      saveAndSee: "Zapisz i zobacz zmiany natychmiast.",
      deployNow: "Wdróż teraz",
      readDocs: "Przeczytaj dokumentację",
      learn: "Nauka",
      examples: "Przykłady",
      gotoNext: "Przejdź do nextjs.org →"
    }
  }
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });
}

export default i18n;