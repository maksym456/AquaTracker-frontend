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
       editAquarium: "Edit Aquarium",
       addFish: "Add Fish",
       addPlant: "Add Plant",
       addToAquarium: "Add to Aquarium",
       remove: "Remove",
        allFish: "All Fish",
       noAquariums: "You don't have any aquariums yet",
       selectAquarium: "Select Aquarium",
       addingFishToAquarium: "Adding",
       addingPlantToAquarium: "Adding",
       fishAddedSuccessfully: "Fish has been added to the aquarium!",
       plantAddedSuccessfully: "Plant has been added to the aquarium!",
       errorAddingFish: "Failed to add fish to aquarium.",
       errorAddingPlant: "Failed to add plant to aquarium.",
       errorLoadingAquariums: "Failed to load aquariums.",
       pleaseLogin: "You must be logged in to add items to aquarium.",
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
       description: "Aquarium Description",
       descriptionPlaceholder: "Add aquarium description (optional)",
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
      api: "API",
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
      compatibilityWarning: "Compatibility Warning",
      confirmAddIncompatible: "Are you sure you want to add this fish despite incompatibility?",
      showOnlyCompatible: "Show only compatible fish",
      recommendedSpecies: "Recommended Species",
      perfectMatch: "Perfect Match",
      goodMatch: "Good Match",
      matchWithWarning: "Match with Warning",
      incompatible: "Incompatible",
      warning: "Warning",
      aquariumStatus: "Aquarium Status",
      error: "ERROR",
      ok: "OK",
      compatibilityIssues: "Compatibility Issues",
      moreIssues: "more",
      conflictMayCauseEating: "Conflict may cause the peaceful individual to be eaten.",
      peacefulFishMayBeEaten: "Peaceful fish may be eaten",
      cannotBeWith: "cannot be with",
      waterTypeMismatch: "Water type mismatch: aquarium %s, fish %s requires %s.",
      aquarium: "aquarium",
      fish: "fish",
      requires: "requires",
      fishWillBeRemoved: "⚠️ Fish will be automatically removed in a few seconds!",
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
          "Słodkowodna": "Freshwater",
          "Słonowodna": "Saltwater",
          "Słonawowodna": "Brackish",
          brackish: "Brackish",
          calm: "Calm",
          semiAggressive: "Semi-aggressive",
          aggressive: "Aggressive",
          veryAggressive: "Very aggressive",
          piece: "piece",
          pieces: "pieces"
        },
        temperament: {
          "spokojne": "peaceful",
          "agresywne": "aggressive",
          "pół-agresywne": "semi-aggressive"
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
      plant: {
        parameters: {
          temperature: "Temperature",
          biotope: "Biotope",
          ph: "pH",
          hardness: "Hardness",
          lightRequirements: "Light Requirements",
          co2Requirements: "CO2 Requirements",
          difficulty: "Difficulty"
        },
        values: {
          light: {
            "bez znaczenia": "Not important",
            "słabe": "Weak",
            "umiarkowane": "Moderate",
            "mocne": "Strong"
          },
          co2: {
            "brak": "None",
            "CO2": "CO2",
            "Fe": "Fe",
            "CO2, Fe": "CO2, Fe",
            "Fe, P, NO3": "Fe, P, NO3"
          },
          difficulty: {
            "łatwa": "Easy",
            "średnia": "Medium",
            "trudna": "Hard"
          }
        },
        biotopes: {
          "Afryka": "Africa",
          "Azja": "Asia",
          "Europa": "Europe",
          "Ameryka Południowa": "South America",
          "Ameryka Północna": "North America",
          "Australia/Oceania": "Australia/Oceania"
        },
        species: {
          "Moczarka": {
            name: "Elodea",
            description: "Fast-growing stem plant (oxygenating), great for starting an aquarium – strongly absorbs nitrates and limits algae. Can grow planted in substrate or floating. Easy to grow, tolerates weaker light; trim and replant the tops."
          },
          "Nurzaniec": {
            name: "Vallisneria",
            description: "Rosette plant with long, ribbon-like leaves, ideal for background. Spreads quickly through runners. Likes stable conditions; don't bury the base (crown). If overgrown, shorten leaves and remove oldest ones."
          },
          "Anubias": {
            name: "Anubias",
            description: "Slow-growing rhizome plant for shade; best to tie/glue to root or stone. Don't bury rhizome in substrate (rots). Grows well in weaker light without CO₂, but in strong light easily catches algae; propagation by rhizome division."
          },
          "Mech Jawajski": {
            name: "Java Moss",
            description: "Popular moss for decorating decorations; forms dense clumps and provides shelter for shrimp and fry. Tolerates weak–moderate light and usually doesn't require CO₂. Requires regular trimming, as it easily collects detritus; can be tied with thread/fishing line."
          },
          "Ludwigia": {
            name: "Ludwigia",
            description: "Stem plant with green‑red leaves; color strongly depends on light and fertilization. Grows best in moderate–strong light, with CO₂ becomes denser. Trim tops, and replant cut cuttings in substrate."
          },
          "Rogatek": {
            name: "Hornwort",
            description: "Very fast-growing floating or loosely anchored plant (without true roots). Excellent at removing excess nutrients from water, helps fight algae and as an 'oxygenating' plant. Likes frequent trimming; can drop needles in weak light or large parameter fluctuations."
          },
          "Kryptokoryna": {
            name: "Cryptocoryne",
            description: "Rosette plant for foreground or middle ground; likes calm, stable conditions. After changes in aquarium, so-called 'crypt melt' (leaf drop) may occur – usually recovers from roots. Responds well to root fertilization (pellets/tabs) and propagates through runners."
          },
          "Lotos Tygrysi": {
            name: "Tiger Lotus",
            description: "Bulb plant with large leaves (green or red), often as a solitaire in middle/background. Strong root feeder – likes fertile substrate and root fertilization. Plant bulb partially exposed; trim leaves reaching for surface if you want to maintain underwater form (otherwise heavily shades)."
          },
          "Żabienica": {
            name: "Amazon Sword",
            description: "Large rosette plant (so-called Amazon sword), often as central decoration or background in larger tanks. Requires nutrients in substrate (tabs, soil) and regular fertilization – this is a strongly rooting plant. Can quickly overgrow small aquariums; propagates through young plants on flower stalk."
          },
          "Limnofila": {
            name: "Limnophila",
            description: "Fast-growing stem plant with feathery leaves, great for background and stabilizing fresh aquariums. Grows in moderate light, and CO₂ increases density and growth rate. Trim and replant tops to get dense clumps; very good at reducing nitrates."
          },
          "Rotala": {
            name: "Rotala",
            description: "Stem plant with small leaves; in strong light can color pink‑red. Grows best in moderate–strong light, with CO₂ and balanced fertilization. Regular trimming stimulates bushing; cuttings from tops can be easily replanted."
          },
          "Duży Heniek": {
            name: "Large Heniek",
            description: "Fine-leaved stem plant forming dense 'bushes'; suitable for middle or background, and in strong light can also be trimmed like low carpet. Likes stable fertilization; CO₂ clearly improves density. Propagation by cuttings; plant in small clumps, as freshly planted tends to float."
          },
          "Ponikło Maleńkie": {
            name: "Dwarf Hairgrass",
            description: "Grass for foreground forming 'lawn'. Spreads through runners and over time becomes compact turf. For dense carpet usually needs moderate–strong light and CO₂. Divide cuttings into small clumps; after transplanting may temporarily wither, but usually quickly recovers."
          },
          "Gałązka Kulista": {
            name: "Marimo Ball",
            description: "Spherical form of algae (marimo) – grows very slowly and doesn't require substrate. Prefers weaker light and rather cooler water; in strong light easier to get covered with film. Occasionally rotate/'roll' the ball and rinse in aquarium water to maintain shape and not collect dirt."
          },
          "Heniek Mały": {
            name: "Small Heniek",
            description: "One of the finest plants for carpet (foreground) – gives very dense, low lawn. Requires strong light, stable CO₂ and good fertilization; in weaker conditions easily detaches and withers. Divide cuttings into micro-clumps; regular trimming densifies carpet."
          },
          "Monte Carlo": {
            name: "Monte Carlo",
            description: "Popular carpet plant, usually easier than 'Small Heniek' – forms creeping stems and medium‑low lawn. Grows in moderate–strong light; CO₂ is very helpful (without CO₂ grows slower and looser). Plant cuttings in small portions; trimming and replanting densifies carpet."
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
       editAquarium: "Edytuj akwarium",
       addFish: "Dodaj ryby",
       addPlant: "Dodaj rośliny",
       addToAquarium: "Dodaj do akwarium",
       selectAquarium: "Wybierz akwarium",
       addingFishToAquarium: "Dodawanie",
       addingPlantToAquarium: "Dodawanie",
       fishAddedSuccessfully: "Ryba została dodana do akwarium!",
       plantAddedSuccessfully: "Roślina została dodana do akwarium!",
       errorAddingFish: "Nie udało się dodać ryby do akwarium.",
       errorAddingPlant: "Nie udało się dodać rośliny do akwarium.",
       errorLoadingAquariums: "Nie udało się załadować akwariów.",
       pleaseLogin: "Musisz być zalogowany, aby dodać elementy do akwarium.",
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
       description: "Opis akwarium",
       descriptionPlaceholder: "Dodaj opis akwarium (opcjonalnie)",
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
      api: "API",
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
      compatibilityWarning: "Ostrzeżenie o kompatybilności",
      confirmAddIncompatible: "Czy na pewno chcesz dodać tę rybę mimo niekompatybilności?",
      showOnlyCompatible: "Pokaż tylko kompatybilne ryby",
      recommendedSpecies: "Rekomendowane gatunki",
      perfectMatch: "Idealnie pasujące",
      goodMatch: "Dobrze pasujące",
      matchWithWarning: "Pasujące z ostrzeżeniem",
      incompatible: "Niekompatybilne",
      warning: "Ostrzeżenie",
      aquariumStatus: "Status akwarium",
      error: "BŁĄD",
      ok: "OK",
      compatibilityIssues: "Problemy z kompatybilnością",
      moreIssues: "więcej",
      conflictMayCauseEating: "Konflikt może spowodować pożarcie łagodnego osobnika.",
      peacefulFishMayBeEaten: "Ryba spokojna może zostać pożarta",
      warning: "Ostrzeżenie",
      cannotBeWith: "nie mogą być z",
      waterTypeMismatch: "Niezgodność typu wody: akwarium %s, ryba %s wymaga %s.",
      aquarium: "akwarium",
      fish: "ryba",
      requires: "wymaga",
      fishWillBeRemoved: "⚠️ Ryba zostanie automatycznie usunięta po kilku sekundach!",
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
          "Słodkowodna": "Słodkowodna",
          "Słonowodna": "Słonowodna",
          "Słonawowodna": "Słonawowodna",
          brackish: "Słonawa",
          calm: "Spokojne",
          semiAggressive: "Pół-agresywne",
          aggressive: "Agresywne",
          veryAggressive: "Bardzo agresywne",
          piece: "sztuka",
          pieces: "sztuk"
        },
        temperament: {
          "spokojne": "spokojne",
          "agresywne": "agresywne",
          "pół-agresywne": "pół-agresywne"
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
      plant: {
        parameters: {
          temperature: "Temperatura",
          biotope: "Biotyp",
          ph: "pH",
          hardness: "Twardość",
          lightRequirements: "Wymagania świetlne",
          co2Requirements: "Wymagania CO2",
          difficulty: "Trudność"
        },
        values: {
          light: {
            "bez znaczenia": "Bez znaczenia",
            "słabe": "Słabe",
            "umiarkowane": "Umiarkowane",
            "mocne": "Mocne"
          },
          co2: {
            "brak": "Brak",
            "CO2": "CO2",
            "Fe": "Fe",
            "CO2, Fe": "CO2, Fe",
            "Fe, P, NO3": "Fe, P, NO3"
          },
          difficulty: {
            "łatwa": "Łatwa",
            "średnia": "Średnia",
            "trudna": "Trudna"
          }
        },
        biotopes: {
          "Afryka": "Afryka",
          "Azja": "Azja",
          "Europa": "Europa",
          "Ameryka Południowa": "Ameryka Południowa",
          "Ameryka Północna": "Ameryka Północna",
          "Australia/Oceania": "Australia/Oceania"
        },
        species: {
          "Moczarka": {
            name: "Moczarka",
            description: "Szybko rosnąca roślina łodygowa (tlenowa), świetna na start akwarium – mocno pobiera azotany i ogranicza glony. Może rosnąć posadzona w podłożu lub pływająca. Łatwa w uprawie, dobrze znosi słabsze światło; przycina się i sadzi ponownie wierzchołki."
          },
          "Nurzaniec": {
            name: "Nurzaniec",
            description: "Roślina rozetowa o długich, taśmowatych liściach, idealna na tło. Szybko się rozrasta przez rozłogi. Lubi stabilne warunki; nie zakopuj nasady (korony). W razie przerostu skracaj liście i usuwaj najstarsze."
          },
          "Anubias": {
            name: "Anubias",
            description: "Wolno rosnąca roślina kłączowa do cienia; najlepiej przywiązać/przykleić do korzenia lub kamienia. Nie zakopuj kłącza w podłożu (gnije). Dobrze rośnie w słabszym świetle bez CO₂, ale przy mocnym świetle łatwo łapie glony; rozmnażanie przez podział kłącza."
          },
          "Mech Jawajski": {
            name: "Mech Jawajski",
            description: "Popularny mech do obsadzania dekoracji; tworzy gęste kępy i daje schronienie krewetkom oraz narybkowi. Toleruje słabe–średnie światło i zwykle nie wymaga CO₂. Wymaga regularnego przycinania, bo łatwo zbiera detrytus; można go wiązać nitką/żyłką."
          },
          "Ludwigia": {
            name: "Ludwigia",
            description: "Roślina łodygowa o zielono‑czerwonych liściach; kolor mocno zależy od światła i nawożenia. Najlepiej rośnie przy średnim–mocnym świetle, z CO₂ staje się gęstsza. Przycinaj wierzchołki, a odcięte sadzonki wsadzaj ponownie w podłoże."
          },
          "Rogatek": {
            name: "Rogatek",
            description: "Bardzo szybko rosnąca roślina pływająca lub luźno zakotwiczona (bez prawdziwych korzeni). Świetnie wyjada nadmiar składników z wody, pomaga w walce z glonami i jako roślina \"tlenowa\". Lubi częste przycinki; potrafi gubić igiełki przy słabym świetle lub dużych wahaniach parametrów."
          },
          "Kryptokoryna": {
            name: "Kryptokoryna",
            description: "Roślina rozetowa do pierwszego lub środkowego planu; lubi spokojne, stabilne warunki. Po zmianach w akwarium może wystąpić tzw. \"crypt melt\" (zrzucanie liści) – zwykle odbija z korzeni. Dobrze reaguje na nawożenie pod korzeń (kulki/tabsy) i rozmnaża się przez rozłogi."
          },
          "Lotos Tygrysi": {
            name: "Lotos Tygrysi",
            description: "Roślina cebulowa o dużych liściach (zielonych lub czerwonych), często jako soliter w środkowym/tylnym planie. Silny żarłok korzeniowy – lubi żyzne podłoże i nawożenie pod korzeń. Sadź cebulę częściowo odsłoniętą; przycinaj liście pędzące do tafli, jeśli chcesz utrzymać formę podwodną (inaczej mocno zacienia)."
          },
          "Żabienica": {
            name: "Żabienica",
            description: "Duża roślina rozetowa (tzw. mieczyk amazoński), często jako centralna ozdoba lub tło w większych zbiornikach. Wymaga składników w podłożu (tabsy, ziemia) i regularnego nawożenia – to roślina silnie korzeniąca się. Może szybko przerosnąć małe akwaria; rozmnaża się przez młode roślinki na pędzie kwiatostanowym."
          },
          "Limnofila": {
            name: "Limnofila",
            description: "Szybko rosnąca roślina łodygowa o pierzastych liściach, świetna na tło i do stabilizacji świeżego akwarium. Rośnie w średnim świetle, a CO₂ zwiększa gęstość i tempo wzrostu. Przycinaj i sadź ponownie wierzchołki, aby uzyskać gęste kępy; bardzo dobrze redukuje azotany."
          },
          "Rotala": {
            name: "Rotala",
            description: "Roślina łodygowa o drobnych liściach; przy mocnym świetle potrafi wybarwiać się na różowo‑czerwono. Najlepiej rośnie w średnim–mocnym świetle, z CO₂ i zbilansowanym nawożeniem. Regularne przycinanie pobudza krzewienie; sadzonki z wierzchołków można łatwo ponownie posadzić."
          },
          "Duży Heniek": {
            name: "Duży Heniek",
            description: "Drobno listna roślina łodygowa tworząca gęste \"krzaczki\"; nadaje się na środek lub tło, a przy mocnym świetle może być też przycinana jak niski dywan. Lubi stabilne nawożenie; CO₂ wyraźnie poprawia zagęszczenie. Rozmnażanie przez sadzonki; sadź w małych kępkach, bo świeżo posadzona ma tendencję do wypływania."
          },
          "Ponikło Maleńkie": {
            name: "Ponikło Maleńkie",
            description: "Trawka na pierwszy plan tworząca \"trawnik\". Rozrasta się przez rozłogi i z czasem robi zwartą darń. Do gęstego dywanu zwykle potrzebuje średniego–mocnego światła i CO₂. Sadzonki dziel na małe kępki; po przesadzeniu może przejściowo marnieć, ale zazwyczaj szybko odbija."
          },
          "Gałązka Kulista": {
            name: "Gałązka Kulista",
            description: "Kulista forma glonu (marimo) – rośnie bardzo wolno i nie wymaga podłoża. Preferuje słabsze światło i raczej chłodniejszą wodę; w mocnym świetle łatwiej porasta nalotem. Co jakiś czas obracaj/\"roluj\" kulkę i przepłukuj w wodzie z akwarium, aby zachowała kształt i nie zbierała brudu."
          },
          "Heniek Mały": {
            name: "Heniek Mały",
            description: "Jedna z najdrobniejszych roślin na dywan (pierwszy plan) – daje bardzo gęsty, niski trawnik. Wymaga mocnego światła, stabilnego CO₂ i dobrego nawożenia; w słabszych warunkach łatwo się odrywa i marnieje. Sadzonki dziel na mikrokępki; regularne przycinanie zagęszcza dywan."
          },
          "Monte Carlo": {
            name: "Monte Carlo",
            description: "Popularna roślina na dywan, zwykle łatwiejsza od \"Małego Heńka\" – tworzy pełzające pędy i średnio‑niski trawnik. Rośnie w średnim–mocnym świetle; CO₂ jest bardzo pomocne (bez CO₂ rośnie wolniej i luźniej). Sadzonki sadź w małych porcjach; przycinanie i ponowne sadzenie zagęszcza dywan."
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