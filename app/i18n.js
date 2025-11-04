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
       mainHeader: "Welcome to a World of Diverse Aquariums",
       mainSubHeader: "Come and create your own fish kingdom — add species, care for their conditions, and invite friends to collaborate. The system will suggest compatible fish and show statistics for your aquarium.",
       joinExperience: "Join The Experience",
       learnMore: "Learn More",
       collaboration: "Collaboration",
       collaborationDesc: "Invite friends to your aquarium and manage shared aquariums",
       inviteToCollaboration: "Invite to collaboration",
       collaborationEmail: "Email Address",
       sendInvite: "Send Invite",
       inviteSent: "Invitation sent to",
       back: "Back",
       history: "History",
       return: "Return",
       historyDesc: "View activity logs and changes in your aquariums",
       settings: "Settings",
       settingsDesc: "Manage your profile and account settings",
       createAquarium: "Create Aquarium",
       addFish: "Add Fish",
       addPlant: "Add Plant",
       addToAquarium: "Add to Aquarium",
       remove: "Remove",
      
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
       mainHeader: "Witaj w świecie różnorodnych akwariów",
       mainSubHeader: "Chodź i stwórz swoje własne rybie królestwo — dodawaj gatunki, dbaj o ich warunki i zapraszaj znajomych do wspólnej opieki. System podpowie Ci, które ryby pasują do siebie i pokaże statystyki Twojego akwarium.",
       joinExperience: "Dołącz do doświadczenia",
       learnMore: "Dowiedz się więcej",
       collaboration: "Współpraca",
       collaborationDesc: "Zaproś znajomych do akwarium i zarządzaj współdzielonymi akwariami",
       inviteToCollaboration: "Zaproś do współpracy",
       collaborationEmail: "Adres e-mail",
       sendInvite: "Wyślij zaproszenie",
       inviteSent: "Zaproszenie wysłane na",
       back: "Wstecz",
       history: "Historia",
       return: "Powrót",
       historyDesc: "Przeglądaj logi aktywności i zmiany w akwariach",
       settings: "Ustawienia",
       settingsDesc: "Zarządzaj profilem i ustawieniami konta",
       createAquarium: "Utwórz akwarium",
       addFish: "Dodaj ryby",
       addPlant: "Dodaj rośliny",
       addToAquarium: "Dodaj do akwarium",
       remove: "Usuń",
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