import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to AquaTracker",
      description: "Manage your home aquarium with ease",
      myAquariums: "Aquariums",
      aquariumsDesc: "View and manage your aquariums",
      fishDatabase: "Fish Database",
      fishDesc: "Browse fish species and their requirements",
      plantsDatabase: "Plants Database", 
      plantsDesc: "Discover aquatic plants for your tank",
      statistics: "Statistics",
      statsDesc: "Track your aquarium data and trends",
      getStarted: "Get Started"
    }
  },
  pl: {
    translation: {
      welcome: "Witamy w AquaTracker",
      description: "Zarządzaj swoim domowym akwarium z łatwością",
      myAquariums: "Moje Akwaria",
      aquariumsDesc: "Przeglądaj i zarządzaj swoimi akwariami",
      fishDatabase: "Baza Ryb",
      fishDesc: "Przeglądaj gatunki ryb i ich wymagania",
      plantsDatabase: "Baza Roślin",
      plantsDesc: "Odkryj rośliny wodne do swojego zbiornika",
      statistics: "Statystyki",
      statsDesc: "Śledź dane i trendy swojego akwarium",
      getStarted: "Rozpocznij"
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