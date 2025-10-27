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
      getStarted: "Get Started",
      auth: {
        login: "Sign In",
        register: "Create Account",
        logout: "Logout",
        email: "Email Address",
        password: "Password",
        confirmPassword: "Confirm Password",
        name: "Name",
        loginButton: "Sign In",
        registerButton: "Create Account",
        alreadyHaveAccount: "Already have an account? Sign in",
        dontHaveAccount: "Don't have an account? Sign up",
        loading: "Loading...",
        fillAllFields: "Please fill in all fields",
        invalidEmail: "Please enter a valid email address",
        passwordTooShort: "Password must be at least 6 characters",
        passwordsDontMatch: "Passwords don't match",
        loginError: "Invalid email or password",
        registrationError: "Registration failed. Please try again."
      }
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
      getStarted: "Rozpocznij",
      auth: {
        login: "Zaloguj się",
        register: "Utwórz konto",
        logout: "Wyloguj",
        email: "Adres e-mail",
        password: "Hasło",
        confirmPassword: "Potwierdź hasło",
        name: "Imię",
        loginButton: "Zaloguj się",
        registerButton: "Utwórz konto",
        alreadyHaveAccount: "Masz już konto? Zaloguj się",
        dontHaveAccount: "Nie masz konta? Zarejestruj się",
        loading: "Ładowanie...",
        fillAllFields: "Proszę wypełnić wszystkie pola",
        invalidEmail: "Proszę podać prawidłowy adres e-mail",
        passwordTooShort: "Hasło musi mieć co najmniej 6 znaków",
        passwordsDontMatch: "Hasła nie pasują do siebie",
        loginError: "Nieprawidłowy e-mail lub hasło",
        registrationError: "Rejestracja nie powiodła się. Spróbuj ponownie."
      }
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