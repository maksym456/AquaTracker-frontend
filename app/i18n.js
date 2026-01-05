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
       contacts: "Contacts",
       contactsDesc: "Manage your contacts and send invitations",
       inviteToCollaboration: "Invite to collaboration",
       collaborationEmail: "Email Address",
       sendInvite: "Send Invite",
       inviteSent: "Invitation sent to",
       contactsList: "Contacts List",
       noContacts: "No contacts yet",
       pending: "Pending",
       inviteFriend: "Invite Friend",
       back: "Back",
       history: "History",
       return: "Return",
       historyDesc: "View activity logs and changes in your aquariums",
       settings: "Settings",
       settingsDesc: "Manage your profile and account settings",
       sessionDuration: "Session Duration",
       sessionInfo: "Session Information",
       loginTime: "Login Date and Time",
       sessionDurationLabel: "Session Duration",
       day: "day",
       days: "days",
       hour: "hour",
       hours: "hours",
       minute: "minute",
       minutes: "minutes",
       noSessionData: "No session data available",
       close: "Close",
       createAquarium: "Create Aquarium",
       addFish: "Add Fish",
       addPlant: "Add Plant",
       addToAquarium: "Add to Aquarium",
       remove: "Remove",
        allFish: "All Fish",
       noAquariums: "You don't have any aquariums yet",
       createFirstAquarium: "Click the button below to create your first aquarium",
       aquariumName: "Aquarium Name",
       waterType: "Water Type",
       freshwater: "Freshwater",
       saltwater: "Saltwater",
       temperature: "Water Temperature (°C)",
       temperatureRange: "Range: 18-30°C",
       biotope: "Biotope",
       biotopeSouthAmerica: "South America",
       biotopeNorthAmerica: "North America",
       biotopeAsia: "Asia",
       biotopeAfrica: "Africa",
       biotopeAustralia: "Australia/Oceania",
       ph: "pH",
       phRange: "Range: 5.5-9.0",
       hardness: "Water Hardness (dGH)",
       hardnessRange: "Range: 1-30 dGH",
       cancel: "Cancel",
       create: "Create",
       save: "Save",
       editProfile: "Edit Profile",
       changePassword: "Change Password (optional)",
       currentPassword: "Current Password",
       newPassword: "New Password",
       fillAllPasswordFields: "To change password, fill in all password fields",
       profileUpdated: "Profile updated successfully!",
       noDescription: "No description",
       loading: "Loading...",
       fishes: "Fishes",
       plants: "Plants",
       activityHistory: "Activity History",
       activityHistoryDesc: "View all changes and activities in your aquariums",
       filterByAction: "Filter by Action",
       filterByAquarium: "Filter by Aquarium",
       allActions: "All Actions",
       allAquariums: "All Aquariums",
       actionType: "Action Type",
       aquarium: "Aquarium",
       date: "Date",
       actionCreated: "Created",
       actionEdited: "Edited",
       actionDeleted: "Deleted",
       actionFishAdded: "Fish Added",
       actionFishRemoved: "Fish Removed",
       actionPlantAdded: "Plant Added",
       actionPlantRemoved: "Plant Removed",
       actionParameterChanged: "Parameter Changed",
       noActivity: "No activity found",
       sortByDate: "Sort by Date",
       newestFirst: "Newest First",
       oldestFirst: "Oldest First",
       darkMode: "Dark Mode",
      dataSource: "Data Source",
      dataSourceType: "Source Type",
      mockData: "Mock Data (local)",
      environment: "Environment",
      development: "Development",
      status: "Status",
      connected: "Connected",
      lastSync: "Last Synchronization",
      offlineMode: "Offline Mode",
      dataStoredLocally: "Data stored locally (mock)",
      version: "Version",
      deactivateAccount: "Deactivate Account",
      searchFish: "Search fish...",
      searchPlants: "Search plants...",
      all: "All",
      allPlants: "All Plants",
      imageNotAvailable: "Image not available",
      compatibility: "Water Parameters Compatibility",
      compatibilityPercentage: "Compatibility",
      fishDistribution: "Fish Species Distribution",
      plantDistribution: "Plant Species Distribution",
      fishAndPlantsCount: "Fish and Plants Count",
      noFishInAquarium: "No fish in aquarium",
      noPlantsInAquarium: "No plants in aquarium",
      fishSpecies: "Fish Species",
      plantSpecies: "Plant Species",
      overstocking: "Overstocking",
      averageOccupancy: "Average Occupancy",
      occupancy: "Occupancy",
      overstockingInfo: "1cm = 1L",
      mostCommonSpecies: "Most Common Species",
      pieces: "pieces",
      aquariumVolume: "Aquarium Volume",
      allAquariums: "All Aquariums",
      selectFish: "Select fish",
      selectPlant: "Select plant",
      add: "Add",
      quantity: "Quantity",
      years: "years",
      brackish: "Brackish",
      aggressiveness: "Aggressiveness",
      noSort: "No sorting",
      leastAggressive: "Least aggressive",
      mostAggressive: "Most aggressive",
      temperament: "Temperament",
      water: "Water",
      agg: "Agg.",
      open: "Open",
      fish: {
        parameters: {
          waterType: "Water Type",
          temperature: "Temperature",
          biotope: "Biotope",
          ph: "pH",
          hardness: "Hardness",
          temperament: "Temperament",
          minSchoolSize: "School (min)",
          lifespan: "Lifespan"
        },
        values: {
          freshwater: "Freshwater",
          saltwater: "Saltwater",
          brackish: "Brackish",
          calm: "Calm",
          semiAggressive: "Semi-aggressive",
          aggressive: "Aggressive",
          veryAggressive: "Very aggressive",
          piece: "piece",
          pieces: "pieces"
        },
        biotopes: {
          "Azja": "Asia",
          "Ameryka Południowa": "South America",
          "Ameryka Północna": "North America",
          "Afryka": "Africa",
          "Austalia/Oceania": "Australia/Oceania"
        },
        species: {
          "Welonka (Złota rybka)": {
            name: "Goldfish",
            description: "Goldfish is a calm fish that moves slowly and feels good in a group. It likes aquariums with plants and hiding places. It is hardy but requires clean water and appropriate temperature to live long."
          },
          "Gupik (Głupik)": {
            name: "Guppy",
            description: "Guppy is a livebearing, very hardy fish with exceptionally diverse coloration, especially in males, which have long, showy tails. It is active, social and easy to breed, making it great for beginner aquarists."
          },
          "Bojownik syjamski": {
            name: "Siamese Fighting Fish (Betta)",
            description: "Siamese Fighting Fish is a showy, majestic fish known for its long, flowing fins and intense colors. Males are territorial and can be aggressive towards other males and fish with similar fins, so they are usually kept alone."
          },
          "Neon Innesa": {
            name: "Neon Tetra",
            description: "Neon Tetra is a small, energetic schooling fish known for its intense blue glow visible even in low light."
          },
          "Skalar (Żaglowiec)": {
            name: "Angelfish",
            description: "Angelfish is a semi-aggressive fish that feels best in a group. It likes plenty of space to swim and plants to hide near. It may show dominant behavior towards other fish, so it's best kept with species of similar temperament."
          },
          "Mieczyk Hellera": {
            name: "Swordtail",
            description: "Swordtail is a livebearing, distinctive fish known for the characteristic 'sword' on the tail of males. It is active, hardy and does well in larger aquariums. Although generally social, it can show slightly dominant behavior, especially males towards each other, so it's best kept in a larger group."
          },
          "Molinezja": {
            name: "Molly",
            description: "Molly is a calm fish that feels best in a group. It is active and likes to swim among plants. It is hardy and easy to maintain, well suited for aquariums with other calm fish."
          },
          "Gurami mozaikowy": {
            name: "Mosaic Gourami",
            description: "Mosaic Gourami is a calm fish with a characteristic, fine, mosaic pattern on its body. It moves slowly and often uses elongated pectoral fins to explore its surroundings."
          },
          "Danio pręgowany": {
            name: "Zebrafish",
            description: "Zebrafish is a fast, energetic schooling fish with a slender body and distinct horizontal stripes. It is very hardy and adapts well to different conditions, making it great for beginners."
          },
          "Kardynałek chiński": {
            name: "Chinese Cardinal",
            description: "Chinese Cardinal is a small, lively and calm fish with a metallic sheen and red fin coloration. It is exceptionally hardy and feels good even in cooler aquariums. In a group it displays natural, harmonious behavior, creating impressive mini-schools."
          },
          "Razbora klinowa": {
            name: "Harlequin Rasbora",
            description: "Harlequin Rasbora is a calm schooling fish that feels best in a group. It is active and moves among plants, creating impressive groups. It likes well-lit aquariums with swimming areas and hiding places."
          },
          "Tęczanka neonowa": {
            name: "Neon Rainbowfish",
            description: "Neon Rainbowfish is a calm schooling fish that feels best in a group. It has colorful, metallic coloration and likes to move among plants. It is hardy and easy to maintain, well suited for aquariums with other calm fish."
          },
          "Kirys pstry": {
            name: "Spotted Corydoras",
            description: "Spotted Corydoras is a calm fish that likes to stay near the bottom of the aquarium and hide among plants. It feels best in a group, then it moves naturally and actively."
          },
          "Glonojad (Zbrojnik)": {
            name: "Pleco (Armored Catfish)",
            description: "Pleco is a calm fish that helps keep the aquarium clean by eating algae from plants and glass. It likes hiding places and quiet spots in the tank. It is hardy and easy to maintain, well suited for aquariums with other calm fish."
          },
          "Błazenek pomarańczowy": {
            name: "Orange Clownfish",
            description: "Orange Clownfish is a calm fish that feels best in a pair. It likes hiding places, e.g. between rocks or among corals. It is hardy but requires stable saltwater conditions and appropriate temperature."
          },
          "Pirania czerwona": {
            name: "Red Piranha",
            description: "Red Piranha is an aggressive fish that lives best in a group. It needs plenty of space to swim and an appropriate aquarium to display natural behaviors."
          },
          "Pokolec królewski": {
            name: "Royal Gramma",
            description: "Royal Gramma is a calm fish that is best kept alone. It likes to have hiding places, e.g. between rocks or corals. It is hardy and can live long in a saltwater aquarium with stable water conditions."
          },
          "Proporczykowiec": {
            name: "Flagfish",
            description: "Flagfish is a semi-aggressive fish that feels best in a group. It likes to have hiding places and swimming areas. It may show dominant behavior towards other fish, so it's best kept with species of similar temperament."
          },
          "Pyszczak (Malawi)": {
            name: "Malawi Cichlid",
            description: "Malawi Cichlid is an aggressive fish that feels best in its territory. It likes to have hiding places and space to swim."
          },
          "Księżniczka z Burundi": {
            name: "Princess of Burundi",
            description: "Princess of Burundi is an aggressive fish that feels best in a group. It likes to have hiding places and plenty of space to swim."
          },
          "Kolcobrzuch karłowaty": {
            name: "Dwarf Pufferfish",
            description: "Dwarf Pufferfish is an aggressive fish that is best kept alone. It has a strong character and can defend its territory. It likes hiding places and spots to hide. It is hardy but requires stable water conditions."
          },
          "Mandaryn wspaniały": {
            name: "Mandarin Dragonet",
            description: "Mandarin Dragonet is a calm fish that is best kept alone. It likes hiding places and plants or corals in which it can move. It is sensitive to water conditions, so it requires a stable saltwater aquarium."
          },
          "Ustnik słoneczny": {
            name: "Yellow Wrasse",
            description: "Yellow Wrasse is a calm fish that is best kept alone. It likes to have hiding places, e.g. between rocks or corals. It is hardy and can live long in a saltwater aquarium with stable water conditions."
          },
          "Babka złota": {
            name: "Golden Goby",
            description: "Golden Goby is a calm fish that feels best in a group. It is active and likes to swim among plants and hiding places. It is hardy and easy to maintain, well suited for aquariums with other calm fish."
          }
        }
      },
      auth: {
        login: "Sign In",
        register: "Create Account",
        logout: "Logout",
        email: "Email Address",
        password: "Password",
        confirmPassword: "Confirm Password",
        name: "Name",
        loginButton: "Sign In",
        registerButton: "Sign Up",
        alreadyHaveAccount: "Already have an account? Sign in",
        dontHaveAccount: "Don't have an account? Sign up",
        loading: "Loading...",
        fillAllFields: "Please fill in all fields",
        invalidEmail: "Please enter a valid email address",
        passwordTooShort: "Password must be at least 6 characters",
        passwordsDontMatch: "Passwords don't match",
        loginError: "Invalid email or password",
        registrationError: "Registration failed. Please try again.",
        orUseEmail: "or use your email password",
        orUseEmailRegister: "or use your email for registration",
        forgotPassword: "Forget Your Password?",
        welcomeBack: "Do you have an account?",
        welcomeBackDesc: "Enter your personal details to use all of site features",
        helloFriend: "Hello Friend!",
        helloFriendDesc: "Register with your personal details to use all of site features",
        doYouHaveAccount: "Do you have an account?",
        logIn: "Log in"
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
       contacts: "Kontakty",
       contactsDesc: "Zarządzaj kontaktami i wysyłaj zaproszenia",
       inviteToCollaboration: "Zaproś do współpracy",
       collaborationEmail: "Adres e-mail",
       sendInvite: "Wyślij zaproszenie",
       inviteSent: "Zaproszenie wysłane na",
       contactsList: "Lista znajomych",
       noContacts: "Brak znajomych",
       pending: "Oczekuje na akceptację",
       inviteFriend: "Zaproś przyjaciela",
       back: "Wstecz",
       history: "Historia",
       return: "Powrót",
       historyDesc: "Przeglądaj logi aktywności i zmiany w akwariach",
       settings: "Ustawienia",
       settingsDesc: "Zarządzaj profilem i ustawieniami konta",
       sessionDuration: "Długość sesji",
       sessionInfo: "Informacje o sesji",
       loginTime: "Data i godzina logowania",
       sessionDurationLabel: "Czas trwania sesji",
       day: "dzień",
       days: "dni",
       hour: "godzina",
       hours: "godzin",
       minute: "minuta",
       minutes: "minut",
       noSessionData: "Brak danych o sesji",
       close: "Zamknij",
       createAquarium: "Utwórz akwarium",
       addFish: "Dodaj ryby",
       addPlant: "Dodaj rośliny",
       addToAquarium: "Dodaj do akwarium",
       remove: "Usuń",
       allFish: "Wszystkie ryby",
       noAquariums: "Nie masz jeszcze żadnych akwariów",
       createFirstAquarium: "Kliknij przycisk poniżej, aby utworzyć swoje pierwsze akwarium",
       aquariumName: "Nazwa akwarium",
       waterType: "Typ wody",
       freshwater: "Słodkowodne",
       saltwater: "Słonowodne",
       temperature: "Temperatura wody (°C)",
       temperatureRange: "Zakres: 18-30°C",
       biotope: "Biotop",
       biotopeSouthAmerica: "Ameryka Południowa",
       biotopeNorthAmerica: "Ameryka Północna",
       biotopeAsia: "Azja",
       biotopeAfrica: "Afryka",
       biotopeAustralia: "Australia/Oceania",
       ph: "pH",
       phRange: "Zakres: 5.5-9.0",
       hardness: "Twardość wody (dGH)",
       hardnessRange: "Zakres: 1-30 dGH",
       cancel: "Anuluj",
       create: "Utwórz",
       save: "Zapisz",
       editProfile: "Edycja profilu",
       changePassword: "Zmiana hasła (opcjonalnie)",
       currentPassword: "Obecne hasło",
       newPassword: "Nowe hasło",
       fillAllPasswordFields: "Aby zmienić hasło, wypełnij wszystkie pola hasła",
       profileUpdated: "Profil został zaktualizowany!",
       noDescription: "Brak opisu",
       loading: "Ładowanie...",
       fishes: "Ryby",
       plants: "Rośliny",
       activityHistory: "Historia aktywności",
       activityHistoryDesc: "Przeglądaj wszystkie zmiany i aktywności w akwariach",
       filterByAction: "Filtruj po akcji",
       filterByAquarium: "Filtruj po akwarium",
       allActions: "Wszystkie akcje",
       allAquariums: "Wszystkie akwaria",
       actionType: "Typ akcji",
       aquarium: "Akwarium",
       date: "Data",
       actionCreated: "Utworzono",
       actionEdited: "Edytowano",
       actionDeleted: "Usunięto",
       actionFishAdded: "Dodano rybę",
       actionFishRemoved: "Usunięto rybę",
       actionPlantAdded: "Dodano roślinę",
       actionPlantRemoved: "Usunięto roślinę",
       actionParameterChanged: "Zmieniono parametr",
       noActivity: "Brak aktywności",
       sortByDate: "Sortuj po dacie",
       newestFirst: "Najnowsze najpierw",
       oldestFirst: "Najstarsze najpierw",
       darkMode: "Tryb ciemny",
      dataSource: "Źródło danych",
      dataSourceType: "Typ źródła",
      mockData: "Mock Data (lokalne)",
      environment: "Środowisko",
      development: "Development",
      status: "Status",
      connected: "Połączono",
      lastSync: "Ostatnia synchronizacja",
      offlineMode: "W trybie offline",
      dataStoredLocally: "Dane przechowywane lokalnie (mock)",
      version: "Wersja",
      deactivateAccount: "Dezaktywuj konto",
      searchFish: "Szukaj ryb...",
      searchPlants: "Szukaj roślin...",
      all: "Wszystkie",
      allPlants: "Wszystkie rośliny",
      imageNotAvailable: "Obraz niedostępny",
      compatibility: "Zgodność parametrów wody",
      compatibilityPercentage: "Zgodność",
      fishDistribution: "Rozkład gatunków ryb",
      plantDistribution: "Rozkład gatunków roślin",
      fishAndPlantsCount: "Liczba ryb i roślin",
      noFishInAquarium: "Brak ryb w akwarium",
      noPlantsInAquarium: "Brak roślin w akwarium",
      fishSpecies: "Gatunków ryb",
      plantSpecies: "Gatunków roślin",
      overstocking: "Przerybienie",
      averageOccupancy: "Średnia zajętość",
      occupancy: "Zajętość",
      overstockingInfo: "1cm = 1L",
      mostCommonSpecies: "Najliczniejszy gatunek",
      pieces: "sztuk",
      aquariumVolume: "Objętość akwarium",
      allAquariums: "Wszystkie akwaria",
      selectFish: "Wybierz rybę",
      selectPlant: "Wybierz roślinę",
      add: "Dodaj",
      quantity: "Ilość",
      years: "lat",
      brackish: "Słonawa",
      aggressiveness: "Agresywność",
      noSort: "Bez sortowania",
      leastAggressive: "Najspokojniejsze",
      mostAggressive: "Najagresywniejsze",
      temperament: "Usposobienie",
      water: "Woda",
      agg: "Agres.",
      open: "Otwórz",
      fish: {
        parameters: {
          waterType: "Typ wody",
          temperature: "Temperatura",
          biotope: "Biotyp",
          ph: "pH wody",
          hardness: "Twardość",
          temperament: "Usposobienie",
          minSchoolSize: "Stado (min)",
          lifespan: "Długość życia"
        },
        values: {
          freshwater: "Słodkowodna",
          saltwater: "Słona",
          brackish: "Słonawa",
          calm: "Spokojne",
          semiAggressive: "Pół-agresywne",
          aggressive: "Agresywne",
          veryAggressive: "Bardzo agresywne",
          piece: "sztuka",
          pieces: "sztuk"
        },
        biotopes: {
          "Azja": "Azja",
          "Ameryka Południowa": "Ameryka Południowa",
          "Ameryka Północna": "Ameryka Północna",
          "Afryka": "Afryka",
          "Austalia/Oceania": "Australia/Oceania"
        },
        species: {
          "Welonka (Złota rybka)": {
            name: "Welonka (Złota rybka)",
            description: "Welonka (Złota rybka) to spokojna ryba, która porusza się powoli i dobrze czuje się w grupie. Lubi akwaria z roślinami i miejscami do ukrycia. Jest odporna, ale wymaga czystej wody i odpowiedniej temperatury, aby żyć długo."
          },
          "Gupik (Głupik)": {
            name: "Gupik (Głupik)",
            description: "Gupik to żyworodna, bardzo odporna ryba o wyjątkowo zróżnicowanym ubarwieniu, szczególnie u samców, które mają długie, efektowne ogony. Jest aktywna, towarzyska i łatwa w hodowli, dlatego świetnie sprawdza się u początkujących akwarystów."
          },
          "Bojownik syjamski": {
            name: "Bojownik syjamski",
            description: "Bojownik syjamski to efektowna, majestatyczna ryba znana z długich, falujących płetw i intensywnych barw. Samce są terytorialne i potrafią być agresywne wobec innych samców oraz ryb o podobnych płetwach, dlatego zwykle trzyma się je pojedynczo."
          },
          "Neon Innesa": {
            name: "Neon Innesa",
            description: "Neon Innesa to drobna, energiczna ryba ławicowa, znana z intensywnego niebieskiego połysku widocznego nawet w słabym oświetleniu."
          },
          "Skalar (Żaglowiec)": {
            name: "Skalar (Żaglowiec)",
            description: "Skalar (Żaglowiec) to ryba pół-agresywna, która najlepiej czuje się w grupie. Lubi dużo miejsca do pływania i rośliny, przy których może się chować. Może pokazywać dominujące zachowania wobec innych ryb, dlatego najlepiej trzymać ją z gatunkami o podobnym temperamencie."
          },
          "Mieczyk Hellera": {
            name: "Mieczyk Hellera",
            description: "Mieczyk Hellera to żyworodna, wyrazista ryba znana z charakterystycznego 'mieczyka' na ogonie samców. Jest ruchliwa, wytrzymała i dobrze odnajduje się w większych akwariach. Choć generalnie towarzyska, potrafi wykazywać lekko dominujące zachowania, zwłaszcza samce między sobą, dlatego najlepiej trzymać ją w większej grupie."
          },
          "Molinezja": {
            name: "Molinezja",
            description: "Molinezja to spokojna ryba, która najlepiej czuje się w grupie. Jest aktywna i lubi pływać wśród roślin. Jest odporna i łatwa w utrzymaniu, dobrze nadaje się do akwarium z innymi spokojnymi rybami."
          },
          "Gurami mozaikowy": {
            name: "Gurami mozaikowy",
            description: "Gurami mozaikowy to spokojna ryba o charakterystycznym, drobnym, mozaikowym wzorze na ciele. Porusza się powoli i często wykorzystuje wydłużone płetwy piersiowe do badania otoczenia."
          },
          "Danio pręgowany": {
            name: "Danio pręgowany",
            description: "Danio pręgowany to szybka, energiczna ryba ławicowa o smukłym ciele i wyraźnych, poziomych pręgach. Jest bardzo odporna i dobrze adaptuje się do różnych warunków, dzięki czemu świetnie nadaje się dla początkujących."
          },
          "Kardynałek chiński": {
            name: "Kardynałek chiński",
            description: "Kardynałek chiński to niewielka, żywa i spokojna ryba o metalicznym połysku i czerwonym zabarwieniu płetw. Jest wyjątkowo odporna i dobrze czuje się nawet w chłodniejszych akwariach. W grupie prezentuje naturalne, harmonijne zachowania, tworząc efektowne mini-ławice."
          },
          "Razbora klinowa": {
            name: "Razbora klinowa",
            description: "Razbora klinowa to spokojna ryba ławicowa, która najlepiej czuje się w grupie. Jest aktywna i porusza się wśród roślin, tworząc efektowne grupy. Lubi dobrze oświetlone akwaria z miejscami do pływania i kryjówkami."
          },
          "Tęczanka neonowa": {
            name: "Tęczanka neonowa",
            description: "Tęczanka neonowa to spokojna ryba ławicowa, która najlepiej czuje się w grupie. Ma kolorowe, metaliczne ubarwienie i lubi poruszać się wśród roślin. Jest odporna i łatwa w utrzymaniu, dobrze nadaje się do akwarium z innymi spokojnymi rybami."
          },
          "Kirys pstry": {
            name: "Kirys pstry",
            description: "Kirysek pstry to spokojna ryba, która lubi przebywać przy dnie akwarium i chować się między roślinami. Najlepiej czuje się w grupie, wtedy porusza się naturalnie i aktywnie."
          },
          "Glonojad (Zbrojnik)": {
            name: "Glonojad (Zbrojnik)",
            description: "Glonojad / Zbrojnik to spokojna ryba, która pomaga utrzymać akwarium w czystości, zjadając glony z roślin i szybów. Lubi kryjówki i spokojne miejsca w zbiorniku. Jest odporna i łatwa w utrzymaniu, dobrze nadaje się do akwarium z innymi spokojnymi rybami."
          },
          "Błazenek pomarańczowy": {
            name: "Błazenek pomarańczowy",
            description: "Błazenek pomarańczowy to spokojna ryba, która najlepiej czuje się w parze. Lubi miejsca do ukrycia, np. między skałami lub wśród korali. Jest odporna, ale wymaga stabilnych warunków wody słonowodnej i odpowiedniej temperatury."
          },
          "Pirania czerwona": {
            name: "Pirania czerwona",
            description: "Pirania czerwona to agresywna ryba, która najlepiej żyje w grupie. Potrzebuje dużo miejsca do pływania i odpowiedniego akwarium, aby mogła wykazywać naturalne zachowania."
          },
          "Pokolec królewski": {
            name: "Pokolec królewski",
            description: "Pokolec królewski to spokojna ryba, która najlepiej trzymać pojedynczo. Lubi mieć miejsca do ukrycia, np. między skałami lub koralami. Jest odporna i może żyć długo w akwarium słonowodnym przy stabilnych warunkach wody."
          },
          "Proporczykowiec": {
            name: "Proporczykowiec",
            description: "Proporczykowiec to ryba pół-agresywna, która najlepiej czuje się w grupie. Lubi mieć kryjówki i miejsca do pływania. Może wykazywać dominujące zachowania wobec innych ryb, dlatego najlepiej trzymać ją z gatunkami o podobnym temperamencie."
          },
          "Pyszczak (Malawi)": {
            name: "Pyszczak (Malawi)",
            description: "Pyszczak (Malawi) to agresywna ryba, która najlepiej czuje się w swoim terytorium. Lubi mieć kryjówki i przestrzeń do pływania."
          },
          "Księżniczka z Burundi": {
            name: "Księżniczka z Burundi",
            description: "Księżniczka z Burundi to agresywna ryba, która najlepiej czuje się w grupie. Lubi mieć kryjówki i dużo miejsca do pływania."
          },
          "Kolcobrzuch karłowaty": {
            name: "Kolcobrzuch karłowaty",
            description: "Kolcobrzuch karłowaty to agresywna ryba, która najlepiej trzymać pojedynczo. Ma mocny charakter i potrafi bronić swojego terytorium. Lubi kryjówki i miejsca do ukrycia. Jest odporna, ale wymaga stabilnych warunków wody."
          },
          "Mandaryn wspaniały": {
            name: "Mandaryn wspaniały",
            description: "Mandaryn wspaniały to spokojna ryba, która najlepiej trzymać pojedynczo. Lubi miejsca do ukrycia i rośliny lub koralowce, w których może się poruszać. Jest wrażliwa na warunki wody, dlatego wymaga stabilnego akwarium słonowodnego."
          },
          "Ustnik słoneczny": {
            name: "Ustnik słoneczny",
            description: "Ustnik słoneczny to spokojna ryba, którą najlepiej trzymać pojedynczo. Lubi mieć miejsca do ukrycia, np. między skałami lub koralami. Jest odporna i może żyć długo w akwarium słonowodnym przy stabilnych warunkach wody."
          },
          "Babka złota": {
            name: "Babka złota",
            description: "Babka złota to spokojna ryba, która najlepiej czuje się w grupie. Jest aktywna i lubi pływać wśród roślin oraz kryjówek. Jest odporna i łatwa w utrzymaniu, dobrze nadaje się do akwarium z innymi spokojnymi rybami."
          }
        }
      },
      auth: {
        login: "Zaloguj się",
        register: "Utwórz konto",
        logout: "Wyloguj",
        email: "Adres e-mail",
        password: "Hasło",
        confirmPassword: "Potwierdź hasło",
        name: "Imię",
        loginButton: "Zaloguj się",
        registerButton: "Zarejestruj się",
        alreadyHaveAccount: "Masz już konto? Zaloguj się",
        dontHaveAccount: "Nie masz konta? Zarejestruj się",
        loading: "Ładowanie...",
        fillAllFields: "Proszę wypełnić wszystkie pola",
        invalidEmail: "Proszę podać prawidłowy adres e-mail",
        passwordTooShort: "Hasło musi mieć co najmniej 6 znaków",
        passwordsDontMatch: "Hasła nie pasują do siebie",
        loginError: "Nieprawidłowy e-mail lub hasło",
        registrationError: "Rejestracja nie powiodła się. Spróbuj ponownie.",
        orUseEmail: "lub użyj swojego e-maila i hasła",
        orUseEmailRegister: "lub użyj swojego e-maila do rejestracji",
        forgotPassword: "Zapomniałeś hasła?",
        welcomeBack: "Masz już konto?",
        welcomeBackDesc: "Wprowadź swoje dane osobowe, aby korzystać ze wszystkich funkcji strony",
        helloFriend: "Witaj przyjacielu!",
        helloFriendDesc: "Zarejestruj się używając swoich danych osobowych, aby korzystać ze wszystkich funkcji strony",
        doYouHaveAccount: "Masz już konto?",
        logIn: "Zaloguj się"
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