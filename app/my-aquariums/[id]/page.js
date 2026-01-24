"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Box, Button, Typography, Modal, Paper, Grid, Divider, CircularProgress, Alert, TextField, List, ListItem, ListItemText, IconButton, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Snackbar, Switch, FormControlLabel } from "@mui/material";
import { keyframes } from "@emotion/react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "../../contexts/ThemeContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import { getAquariumById, addFishToAquarium, removeFishFromAquarium, addPlantToAquarium, removePlantFromAquarium, getFishes, getPlants } from "../../lib/api";
import { checkFishCompatibilityWithAquarium, filterCompatibleFishes, getRecommendedFishes, normalizeTemperament, checkWaterTypeCompatibility } from "../../lib/fishCompatibility";

export default function AquariumDetailPage() {
  
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  // Upewnij się, że komponent jest zamontowany przed renderowaniem tłumaczeń
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Uniwersalna funkcja do tłumaczenia nazw ryb i roślin (działa dwukierunkowo: polski ↔ angielski)
  const translateSpeciesName = (name, type = 'fish') => {
    if (!name) return name;
    
    let trimmed = name.trim();
    // Usuń wszystkie treści w nawiasach - użytkownik chce tylko główne nazwy
    // Usuwa wszystkie wystąpienia (tekst) z nazwy
    trimmed = trimmed.replace(/\s*\([^)]*\)/g, '').trim();
    
    // Po usunięciu nawiasów, namePart to po prostu wyczyszczona nazwa
    let namePart = trimmed;
    
    // Pobierz wszystkie gatunki
    const allSpecies = t(`${type}.species`, { returnObjects: true });
    if (!allSpecies || typeof allSpecies !== 'object') {
      // Jeśli nie ma tłumaczeń, zwróć wyczyszczoną nazwę
      return namePart;
    }
    
    // 1. Sprawdź czy namePart jest kluczem (polska nazwa)
    if (allSpecies[namePart]) {
      return t(`${type}.species.${namePart}.name`, { defaultValue: namePart });
    }
    
    // 2. Sprawdź czy namePart jest wartością name (angielska nazwa) - znajdź odpowiedni klucz
    const foundKey = Object.keys(allSpecies).find(key => {
      const speciesName = t(`${type}.species.${key}.name`, { defaultValue: key });
      return speciesName === namePart || speciesName.toLowerCase() === namePart.toLowerCase();
    });
    
    if (foundKey) {
      return t(`${type}.species.${foundKey}.name`, { defaultValue: namePart });
    }
    
    // 3. Sprawdź częściowe dopasowanie (case-insensitive)
    const foundKeyPartial = Object.keys(allSpecies).find(key => {
      const speciesName = t(`${type}.species.${key}.name`, { defaultValue: key });
      return speciesName.toLowerCase().includes(namePart.toLowerCase()) || 
             namePart.toLowerCase().includes(speciesName.toLowerCase()) ||
             key.toLowerCase().includes(namePart.toLowerCase()) ||
             namePart.toLowerCase().includes(key.toLowerCase());
    });
    
    if (foundKeyPartial) {
      return t(`${type}.species.${foundKeyPartial}.name`, { defaultValue: namePart });
    }
    
    // Jeśli nie znaleziono, zwróć wyczyszczoną nazwę
    return namePart;
  };

  const { darkMode } = useTheme();

  const router = useRouter();

  const params = useParams();
  const aquariumId = params?.id;

  const [aquarium, setAquarium] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [statisticsOpen, setStatisticsOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [addFishModalOpen, setAddFishModalOpen] = useState(false);
  const [addPlantModalOpen, setAddPlantModalOpen] = useState(false);
  const [availableFishes, setAvailableFishes] = useState([]);
  const [availablePlants, setAvailablePlants] = useState([]);
  const [selectedFishId, setSelectedFishId] = useState("");
  const [previewFishId, setPreviewFishId] = useState("");
  const [selectedPlantId, setSelectedPlantId] = useState("");
  const [previewPlantId, setPreviewPlantId] = useState("");
  const [fishQuantity, setFishQuantity] = useState(1);
  const [plantQuantity, setPlantQuantity] = useState(1);
  const [isAddingFish, setIsAddingFish] = useState(false);
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const [compatibilityIssues, setCompatibilityIssues] = useState([]);
  const [plantCompatibilityIssues, setPlantCompatibilityIssues] = useState([]);
  const [showCompatibilityFilter, setShowCompatibilityFilter] = useState(true);
  const [fishPanelExpanded, setFishPanelExpanded] = useState(false);
  const [plantPanelExpanded, setPlantPanelExpanded] = useState(false);
  const [compatibilityPanelExpanded, setCompatibilityPanelExpanded] = useState(false);
  const [frontendStatusIssues, setFrontendStatusIssues] = useState([]);
  const [deathNotification, setDeathNotification] = useState(null);
  const [foodChainEnabled, setFoodChainEnabled] = useState(false); // Włącznik łańcucha pokarmowego
  const [osmoticShockEnabled, setOsmoticShockEnabled] = useState(false); // Włącznik szoku osmotycznego
  const [plasmolysisEnabled, setPlasmolysisEnabled] = useState(false); // Włącznik plazmolizy (dla roślin)
  const [isFishSelectOpen, setIsFishSelectOpen] = useState(false);
  const [isPlantSelectOpen, setIsPlantSelectOpen] = useState(false);
  const lastLogIdsRef = useRef(new Set());
  const imageContainerRef = useRef(null);
  const aquariumRef = useRef(null); // Ref do aktualnego stanu akwarium (dla łańcucha pokarmowego)
  const availableFishesRef = useRef([]); // Ref do dostępnych ryb (dla łańcucha pokarmowego)
  const availablePlantsRef = useRef([]); // Ref do dostępnych roślin (dla szoku osmotycznego)

  // Funkcja pomocnicza do mapowania nazw ryb na ścieżki ikon
  const getFishImage = (fishName, iconName) => {
    if (iconName) {
      return `/fish/${iconName}`;
    }
    const imageMap = {
      "Welonka": "/fish/Welonka__Złota_rybka.png",
      "Gupik": "/fish/Gupik__Głupik.png",
      "Bojownik syjamski": "/fish/Bojownik_syjamski.png",
      "Neon Innesa": "/fish/Neon_Innesa.png",
      "Skalar": "/fish/Skalar__Żaglowiec.png",
      "Mieczyk Hellera": "/fish/Mieczyk_Hellera.png",
      "Molinezja": "/fish/Molinezja.png",
      "Gurami mozaikowy": "/fish/Gurami_mozaikowy.png",
      "Danio pręgowany": "/fish/Danio_pręgowany.png",
      "Kardynałek chiński": "/fish/Kardynałek_chiński.png",
      "Razbora klinowa": "/fish/Razbora_klinowa.png",
      "Tęczanka neonowa": "/fish/Tęczanka_neonowa.png",
      "Kirys pstry": "/fish/Kirys_pstry.png",
      "Glonojad": "/fish/GlonojadZbrojnik-.png",
      "Błazenek pomarańczowy": "/fish/Błazenek_pomarańczowy.png",
      "Pirania czerwona": "/fish/Pirania_czerwona.png",
      "Pokolec królewski": "/fish/Pokolec_królewski.png",
      "Proporczykowiec": "/fish/Proporczykowiec.png",
      "Pyszczak": "/fish/Pyszczak__Malawi.png",
      "Księżniczka z Burundi": "/fish/Księżniczka_z_Burundi.png",
      "Kolcobrzuch karłowaty": "/fish/Kolcobrzuch_karłowaty.png",
      "Mandaryn wspaniały": "/fish/Mandaryn_wspaniały.png",
      "Ustnik żółty": "/fish/Ustnik_żółty_ryba.png",
      "Ustnik słoneczny": "/fish/Ustnik_żółty_ryba.png",
      "Babka złota": "/fish/Babka_złota.png"
    };
    return imageMap[fishName] || "/fish/Welonka__Złota_rybka.png";
  };

  // Funkcja pomocnicza do mapowania nazw roślin na ścieżki ikon
  const getPlantImage = (plantName, iconName) => {
    if (iconName) {
      const iconPath = iconName.endsWith('.png') ? iconName : `${iconName}.png`;
      return `/plant/${iconPath}`;
    }
    
    const plantImageMap = {
      'Anubias': 'Anubias.png',
      'Duży Heniek': 'Duży_Heniek.png',
      'Gałązka Kulista': 'Gałązka_Kulista.png',
      'Heniek Mały': 'Heniek_Mały.png',
      'Kryptokoryna': 'Kryptokoryna.png',
      'Limnofila': 'Limnofila.png',
      'Lotos Tygrysi': 'Lotos_Tygrysi.png',
      'Ludwigia': 'Ludwigia.png',
      'Mech Jawajski': 'Mech_Jawajski.png',
      'Moczarka': 'Moczarka.png',
      'Monte Carlo': 'Monte_Carlo.png',
      'Nurzaniec': 'Nurzaniec.png',
      'Ponikło Maleńkie': 'Ponikło_Maleńkie.png',
      'Rogatek': 'Rogatek.png',
      'Rotala': 'Rotala.png',
      'Żabienica': 'Żabienica.png',
    };
    
    if (plantName && plantImageMap[plantName]) {
      return `/plant/${plantImageMap[plantName]}`;
    }
    
    if (plantName) {
      const normalizedName = plantName.replace(/\s+/g, '_') + '.png';
      return `/plant/${normalizedName}`;
    }
    
    return "/plant/default.png";
  };

  useEffect(() => {
    async function fetchAquarium() {
      if (!aquariumId) {
        router.push('/my-aquariums');
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const foundAquarium = await getAquariumById(aquariumId);
        if (foundAquarium) {
          // Normalizuj dane: backend zwraca 'fish', frontend używa 'fishes'
          // Backend może zwracać temperatureC i hardnessDGH, mapujemy na temperature i hardness
          const normalizedAquarium = {
            ...foundAquarium,
            fishes: foundAquarium.fishes || foundAquarium.fish || [],
            plants: foundAquarium.plants || [],
            temperature: foundAquarium.temperature || foundAquarium.temperatureC || null,
            hardness: foundAquarium.hardness || foundAquarium.hardnessDGH || null,
            status: foundAquarium.status // Zachowaj status z backendu (dla wykrzyknika)
          };
          setAquarium(normalizedAquarium);
          aquariumRef.current = normalizedAquarium; // Aktualizuj ref
          
          // Inicjalizuj zbiór ostatnich logów przy pierwszym załadowaniu
          // aby nie pokazywać starych logów jako nowych powiadomień
          try {
            const logs = await getLogs({ 
              aquariumId: aquariumId,
              actionType: 'FISH_DIED',
              sort: 'desc',
              limit: 10
            });
            logs.forEach(log => {
              const logId = log.id?.toString() || `${log.createdAt}_${log.message}`;
              lastLogIdsRef.current.add(logId);
            });
          } catch (logError) {
            // Cicho ignoruj błędy przy inicjalizacji logów
          }
        } else {
          setError("Akwarium nie zostało znalezione.");
          router.push('/my-aquariums');
        }
      } catch (err) {
        console.error("Error fetching aquarium:", err);
        setError(err.message || "Nie udało się załadować akwarium.");
        router.push('/my-aquariums');
      } finally {
        setIsLoading(false);
      }
    }
    
    void fetchAquarium();
  }, [aquariumId, router]);

  // Auto-refresh co 5 sekund, aby widzieć automatycznie usunięte ryby
  // Cicho ignoruje błędy połączenia, aby nie przerywać działania aplikacji
  // Sprawdza również logi o śmierci ryb i wyświetla powiadomienia
  useEffect(() => {
    if (!aquariumId) return;
    
    let consecutiveErrors = 0;
    const MAX_CONSECUTIVE_ERRORS = 3;
    
    const refreshInterval = setInterval(async () => {
      try {
        const foundAquarium = await getAquariumById(aquariumId);
        if (foundAquarium) {
          // Normalizuj dane: backend zwraca 'fish', frontend używa 'fishes'
          // Backend może zwracać temperatureC i hardnessDGH, mapujemy na temperature i hardness
          const normalizedAquarium = {
            ...foundAquarium,
            fishes: foundAquarium.fishes || foundAquarium.fish || [],
            plants: foundAquarium.plants || [],
            temperature: foundAquarium.temperature || foundAquarium.temperatureC || null,
            hardness: foundAquarium.hardness || foundAquarium.hardnessDGH || null,
            status: foundAquarium.status // Zachowaj status z backendu (dla wykrzyknika)
          };
          setAquarium(normalizedAquarium);
          aquariumRef.current = normalizedAquarium; // Aktualizuj ref
          consecutiveErrors = 0; // Reset licznika błędów przy sukcesie
          
          // Sprawdź logi o śmierci ryb (cicho ignoruj błędy)
          try {
            const logs = await getLogs({ 
              aquariumId: aquariumId,
              actionType: 'FISH_DIED',
              sort: 'desc',
              limit: 5
            });
            
            if (logs && Array.isArray(logs)) {
              // Znajdź nowe logi o śmierci ryb
              const newDeathLogs = logs.filter(log => {
                const logId = log.id?.toString() || `${log.createdAt}_${log.message}`;
                return !lastLogIdsRef.current.has(logId);
              });
              
              // Wyświetl powiadomienia o nowych śmierciach
              if (newDeathLogs.length > 0) {
                const latestLog = newDeathLogs[0];
                setDeathNotification({
                  message: latestLog.message || latestLog.title || t('fishDied', { defaultValue: 'Ryba zdechła' }),
                  severity: 'error'
                });
                
                // Zaktualizuj zbiór ostatnich logów
                newDeathLogs.forEach(log => {
                  const logId = log.id?.toString() || `${log.createdAt}_${log.message}`;
                  lastLogIdsRef.current.add(logId);
                });
              }
            }
          } catch (logError) {
            // Cicho ignoruj błędy przy pobieraniu logów - nie przerywaj auto-refresh
            // Nie loguj, aby nie spamować konsoli
          }
        }
      } catch (err) {
        consecutiveErrors++;
        // Loguj tylko w trybie deweloperskim lub przy pierwszym błędzie
        if (process.env.NODE_ENV === 'development' || consecutiveErrors === 1) {
          console.warn("Error refreshing aquarium (will retry silently):", err.message);
        }
        
        // Jeśli zbyt wiele błędów z rzędu, zatrzymaj auto-refresh
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          console.warn("Too many consecutive errors, stopping auto-refresh");
          clearInterval(refreshInterval);
        }
      }
    }, 5000); // Zwiększono do 5 sekund, aby zmniejszyć obciążenie
    
    return () => clearInterval(refreshInterval);
  }, [aquariumId, t]);

  // Pobierz dostępne ryby i rośliny
  useEffect(() => {
    async function fetchAvailableData() {
      try {
        const [fishes, plants] = await Promise.all([
          getFishes(),
          getPlants()
        ]);
        setAvailableFishes(fishes || []);
        availableFishesRef.current = fishes || []; // Aktualizuj ref
        setAvailablePlants(plants || []);
        availablePlantsRef.current = plants || []; // Aktualizuj ref
      } catch (err) {
        console.error("Error fetching available fishes/plants:", err);
      }
    }
    void fetchAvailableData();
  }, []);

  // Lokalna detekcja problemów (żeby pokazać wykrzyknik nawet bez statusu z backendu)
  useEffect(() => {
    const currentAquarium = aquarium;
    const fishesDb = Array.isArray(availableFishes) ? availableFishes : [];
    const plantsDb = Array.isArray(availablePlants) ? availablePlants : [];

    const hasAnyFishes = Array.isArray(currentAquarium?.fishes) && currentAquarium.fishes.length > 0;
    const hasAnyPlants = Array.isArray(currentAquarium?.plants) && currentAquarium.plants.length > 0;
    const hasFishesDb = Array.isArray(fishesDb) && fishesDb.length > 0;
    const hasPlantsDb = Array.isArray(plantsDb) && plantsDb.length > 0;

    if ((!hasAnyFishes && !hasAnyPlants) || (!hasFishesDb && !hasPlantsDb)) {
      setFrontendStatusIssues([]);
      return;
    }

    const parseRangeString = (rangeString) => {
      if (!rangeString) return null;
      const s = String(rangeString).trim();
      const parts = s.split('-').map((p) => parseFloat(p.trim()));
      if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return null;
      return { min: Math.min(parts[0], parts[1]), max: Math.max(parts[0], parts[1]) };
    };

    const isValueInRange = (value, rangeString) => {
      const range = parseRangeString(rangeString);
      if (!range) return true;
      const v = parseFloat(value);
      if (Number.isNaN(v)) return true;
      return v >= range.min && v <= range.max;
    };

    const aquariumTemperature = currentAquarium.temperature ?? currentAquarium.temperatureC ?? null;
    const aquariumPh = currentAquarium.ph ?? null;
    const aquariumHardness = currentAquarium.hardness ?? currentAquarium.hardnessDGH ?? null;
    const aquariumBiotope = currentAquarium.biotope ?? null;
    const aquariumWaterType = currentAquarium.waterType ?? null;

    const issues = [];

    // 1) Konflikt usposobień (żeby było sens włączyć łańcuch pokarmowy)
    const fishesWithTemp = hasAnyFishes && hasFishesDb
      ? currentAquarium.fishes
          .map((af) => {
            const fishDetails = fishesDb.find((f) => f.id === af.fishId);
            if (!fishDetails) return null;
            return { ...af, details: fishDetails, temperament: normalizeTemperament(fishDetails.temperament) };
          })
          .filter(Boolean)
      : [];

    const hasPredators = fishesWithTemp.some((f) => f.temperament === "agresywne" || f.temperament === "pol_agresywne");
    const hasPeaceful = fishesWithTemp.some((f) => f.temperament === "spokojne");
    if (hasPredators && hasPeaceful) {
      issues.push({
        type: "TEMPERAMENT_INCOMPATIBILITY",
        severity: "WARNING",
        message: t("foodChainDescription", { defaultValue: "Agresywne ryby mogą zjeść spokojne" })
      });
    }

    // 2) Niezgodne warunki środowiska (żeby było sens włączyć szok osmotyczny)
    if (hasAnyFishes && hasFishesDb) {
      for (const aquariumFish of currentAquarium.fishes) {
        const fishDetails = fishesDb.find((f) => f.id === aquariumFish.fishId);
        if (!fishDetails) continue;

        const reasons = [];

        if (aquariumWaterType && fishDetails.waterType && !checkWaterTypeCompatibility(aquariumWaterType, fishDetails.waterType)) {
          reasons.push("typ wody");
        }
        if (!isValueInRange(aquariumTemperature, fishDetails.temperature)) reasons.push("temperatura");
        if (!isValueInRange(aquariumPh, fishDetails.ph)) reasons.push("pH");
        if (!isValueInRange(aquariumHardness, fishDetails.hardnessDGH)) reasons.push("twardość");

        const fishBiotope = fishDetails.biotope ?? fishDetails.biotype ?? null;
        if (aquariumBiotope && fishBiotope) {
          const a = String(aquariumBiotope).toLowerCase().trim();
          const f = String(fishBiotope).toLowerCase().trim();
          if (a && f && a !== f) reasons.push("biotyp");
        }

        const minSchool = fishDetails.minShoalSize ?? fishDetails.minSchoolSize ?? null;
        const currentCount = aquariumFish.count ?? 1;
        if (typeof minSchool === "number" && minSchool > 1 && currentCount < minSchool) reasons.push("stado");

        if (reasons.length > 0) {
          const translateReason = (reason) => {
            const map = {
              "typ wody": "fish.parameters.waterType",
              "temperatura": "fish.parameters.temperature",
              "pH": "fish.parameters.ph",
              "twardość": "fish.parameters.hardness",
              "biotyp": "fish.parameters.biotope",
              "stado": "fish.parameters.minSchoolSize",
            };
            const key = map[reason];
            return key ? t(key, { defaultValue: reason }) : reason;
          };
          const translatedReasons = reasons.map(translateReason).join(", ");
          issues.push({
            type: "ENVIRONMENT_MISMATCH",
            severity: "ERROR",
            message: t("osmoticShockMismatch", {
              defaultValue: `Szok osmotyczny: ${translateSpeciesName(fishDetails.name, "fish")} – niezgodne: ${translatedReasons}.`,
              fishName: translateSpeciesName(fishDetails.name, "fish"),
              reasons: translatedReasons
            })
          });
        }
      }
    }

    if (hasAnyPlants && hasPlantsDb) {
      for (const aquariumPlant of currentAquarium.plants) {
        const plantDetails = plantsDb.find((p) => p.id === aquariumPlant.plantId);
        if (!plantDetails) continue;

        const reasons = [];

        if (!isValueInRange(aquariumTemperature, plantDetails.temperature)) reasons.push("temperatura");
        if (!isValueInRange(aquariumPh, plantDetails.ph)) reasons.push("pH");
        if (!isValueInRange(aquariumHardness, plantDetails.hardnessDGH)) reasons.push("twardość");

        const plantBiotope = plantDetails.biotope ?? null;
        if (aquariumBiotope && plantBiotope) {
          const a = String(aquariumBiotope).toLowerCase().trim();
          const p = String(plantBiotope).toLowerCase().trim();
          if (a && p && a !== p) reasons.push("biotyp");
        }

        if (reasons.length > 0) {
          const translateReason = (reason) => {
            const map = {
              "temperatura": "plant.parameters.temperature",
              "pH": "plant.parameters.ph",
              "twardość": "plant.parameters.hardness",
              "biotyp": "plant.parameters.biotope",
            };
            const key = map[reason];
            return key ? t(key, { defaultValue: reason }) : reason;
          };
          const translatedReasons = reasons.map(translateReason).join(", ");
          issues.push({
            type: "PLASMOLYSIS_MISMATCH",
            severity: "ERROR",
            message: t("plasmolysisMismatch", {
              defaultValue: `Plazmoliza: ${translateSpeciesName(plantDetails.name, "plant")} – niezgodne: ${translatedReasons}.`,
              plantName: translateSpeciesName(plantDetails.name, "plant"),
              reasons: translatedReasons
            })
          });
        }
      }
    }

    setFrontendStatusIssues(issues);
  }, [aquarium, availableFishes, availablePlants, t]);

  // Łańcuch pokarmowy - automatyczne usuwanie spokojnych ryb przez agresywne
  useEffect(() => {
    if (!foodChainEnabled || !aquariumId) return;
    
    const PREDATION_INTERVAL = 6000; // 6 sekund (szybciej dla prezentacji)
    const ATTACK_CHANCE = 0.50; // 50% szansy na atak w każdym cyklu
    const WARNING_DELAY = 4000; // 4 sekundy ostrzeżenia przed atakiem
    
    const predationInterval = setInterval(async () => {
      const currentAquarium = aquariumRef.current;
      const currentAvailableFishes = availableFishesRef.current;
      
      if (!currentAquarium?.fishes || currentAquarium.fishes.length < 2 || !currentAvailableFishes.length) {
        return;
      }
      
      // Połącz ryby z akwarium z ich szczegółami
      const fishesWithDetails = currentAquarium.fishes
        .map(aquariumFish => {
          const fishDetails = currentAvailableFishes.find(f => f.id === aquariumFish.fishId);
          if (!fishDetails) return null;
          return {
            ...aquariumFish,
            details: fishDetails,
            temperament: normalizeTemperament(fishDetails.temperament)
          };
        })
        .filter(f => f !== null);
      
      // Znajdź drapieżników (agresywne i pół-agresywne)
      const predators = fishesWithDetails.filter(f => 
        f.temperament === "agresywne" || f.temperament === "pol_agresywne"
      );
      
      // Znajdź ofiary (spokojne)
      const victims = fishesWithDetails.filter(f => f.temperament === "spokojne");
      
      // Warunki ataku: musi być przynajmniej 1 drapieżnik i 1 ofiara
      if (predators.length === 0 || victims.length === 0) {
        return;
      }
      
      // Losuj czy atak się uda
      if (Math.random() > ATTACK_CHANCE) {
        return; // Atak nie udany
      }
      
      // Wybierz losowego drapieżnika i ofiarę
      const predator = predators[Math.floor(Math.random() * predators.length)];
      const victim = victims[Math.floor(Math.random() * victims.length)];
      
      const predatorName = predator.details.name || "Drapieżnik";
      const victimName = victim.details.name || "Ofiara";
      
      // Pokaż ostrzeżenie przed atakiem
      setDeathNotification({
        message: `⚠️ ${predatorName} poluje na ${victimName}...`,
        severity: 'warning',
        countdown: WARNING_DELAY / 1000
      });
      
      // Po opóźnieniu wykonaj atak
      setTimeout(async () => {
        try {
          // Usuń tylko jedną sztukę ofiary z akwarium (nie wszystkie)
          await removeFishFromAquarium(aquariumId, victim.fishId, 1);
          
          // Odśwież akwarium
          const updatedAquarium = await getAquariumById(aquariumId);
          if (updatedAquarium) {
            const normalizedAquarium = {
              ...updatedAquarium,
              fishes: updatedAquarium.fishes || updatedAquarium.fish || [],
              plants: updatedAquarium.plants || [],
              temperature: updatedAquarium.temperature || updatedAquarium.temperatureC || null,
              hardness: updatedAquarium.hardness || updatedAquarium.hardnessDGH || null,
              status: updatedAquarium.status // Zachowaj status z backendu
            };
            setAquarium(normalizedAquarium);
            aquariumRef.current = normalizedAquarium;
          }
          
          // Pokaż powiadomienie o ataku
          setDeathNotification({
            message: `💀 ${predatorName} zjadł ${victimName}! Natura bywa okrutna...`,
            severity: 'error'
          });
          
          // Ukryj powiadomienie po 5 sekundach
          setTimeout(() => {
            setDeathNotification(null);
          }, 5000);
          
        } catch (err) {
          console.error("Error removing fish in predation:", err);
          setDeathNotification(null);
        }
      }, WARNING_DELAY);
      
    }, PREDATION_INTERVAL);
    
    return () => clearInterval(predationInterval);
  }, [foodChainEnabled, aquariumId]);

  // Szok osmotyczny - automatyczne usuwanie ryb z niezgodnym typem wody
  useEffect(() => {
    if (!osmoticShockEnabled || !aquariumId) return;
    
    const OSMOTIC_SHOCK_INTERVAL = 6000; // 6 sekund (podobnie jak food chain)
    const DEATH_CHANCE = 0.50; // 50% szansy na śmierć w każdym cyklu
    const WARNING_DELAY = 4000; // 4 sekundy ostrzeżenia przed śmiercią

    const parseRangeString = (rangeString) => {
      if (!rangeString) return null;
      const s = String(rangeString).trim();
      const parts = s.split('-').map((p) => parseFloat(p.trim()));
      if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return null;
      return { min: Math.min(parts[0], parts[1]), max: Math.max(parts[0], parts[1]) };
    };

    const isValueInRange = (value, rangeString) => {
      const range = parseRangeString(rangeString);
      if (!range) return true; // brak danych zakresu = nie egzekwuj
      const v = parseFloat(value);
      if (Number.isNaN(v)) return true; // brak danych akwarium = nie egzekwuj
      return v >= range.min && v <= range.max;
    };
    
    const osmoticShockInterval = setInterval(async () => {
      const currentAquarium = aquariumRef.current;
      const currentAvailableFishes = availableFishesRef.current;
      
      const hasAnyFishes = Array.isArray(currentAquarium?.fishes) && currentAquarium.fishes.length > 0;

      if (!hasAnyFishes || !currentAvailableFishes.length) {
        return;
      }
      
      const aquariumWaterType = currentAquarium.waterType ?? null;
      
      const aquariumTemperature = currentAquarium.temperature ?? currentAquarium.temperatureC ?? null;
      const aquariumPh = currentAquarium.ph ?? null;
      const aquariumHardness = currentAquarium.hardness ?? currentAquarium.hardnessDGH ?? null;
      const aquariumBiotope = currentAquarium.biotope ?? null;

      // Znajdź ryby, które nie przeżyją w środowisku (woda/temperatura/pH/twardość/biotyp/stado)
      const incompatibleFishes = hasAnyFishes ? currentAquarium.fishes
        .map((aquariumFish) => {
          const fishDetails = currentAvailableFishes.find((f) => f.id === aquariumFish.fishId);
          if (!fishDetails) {
            console.log(`[Szok osmotyczny] Nie znaleziono szczegółów dla ryby ID: ${aquariumFish.fishId}`);
            return null;
          }

          const reasons = [];

          // Typ wody
          if (aquariumWaterType && fishDetails.waterType) {
            const isCompatible = checkWaterTypeCompatibility(aquariumWaterType, fishDetails.waterType);
            if (!isCompatible) reasons.push("niezgodny typ wody");
          }

          // Temperatura (zakres w fishDetails.temperature)
          if (!isValueInRange(aquariumTemperature, fishDetails.temperature)) {
            reasons.push("nieodpowiednia temperatura");
          }

          // pH (zakres w fishDetails.ph)
          if (!isValueInRange(aquariumPh, fishDetails.ph)) {
            reasons.push("nieodpowiednie pH");
          }

          // Twardość (zakres w fishDetails.hardnessDGH)
          if (!isValueInRange(aquariumHardness, fishDetails.hardnessDGH)) {
            reasons.push("nieodpowiednia twardość");
          }

          // Biotyp/Biotop
          const fishBiotope = fishDetails.biotope ?? fishDetails.biotype ?? null;
          if (aquariumBiotope && fishBiotope) {
            const a = String(aquariumBiotope).toLowerCase().trim();
            const f = String(fishBiotope).toLowerCase().trim();
            if (a && f && a !== f) {
              reasons.push("niezgodny biotyp");
            }
          }

          // Stado (min) — jeśli w akwarium jest mniej sztuk danego gatunku niż minimum
          const minSchool = fishDetails.minShoalSize ?? fishDetails.minSchoolSize ?? null;
          const currentCount = aquariumFish.count ?? 1;
          if (typeof minSchool === "number" && minSchool > 1 && currentCount < minSchool) {
            reasons.push(`za małe stado (min. ${minSchool})`);
          }

          if (reasons.length === 0) return null;

          return {
            ...aquariumFish,
            details: fishDetails,
            reasons
          };
        })
        .filter((f) => f !== null)
        : [];
      
      console.log(`[Szok osmotyczny] Znaleziono ${incompatibleFishes.length} ryb z niezgodnymi warunkami`);
      
      // Jeśli są ryby z niezgodnymi warunkami
      if (incompatibleFishes.length > 0) {
        // Losuj czy ryba zdycha w tym cyklu
        if (Math.random() > DEATH_CHANCE) {
          return; // Ryba nie zdycha w tym cyklu
        }
        
        // Wybierz losową rybę z niezgodnymi warunkami
        const fishToDie = incompatibleFishes[Math.floor(Math.random() * incompatibleFishes.length)];
        const entityName = fishToDie.details?.name || "Ryba";
        // Poprawne formy przymiotnikowe dla polskiego i angielskiego
        const aquariumWaterTypeName = (() => {
          const waterType = String(aquariumWaterType || '').toLowerCase().trim();
          if (waterType === 'freshwater' || waterType === 'słodkowodna') {
            return t('freshwaterAdjective', { defaultValue: 'Słodkowodnej' });
          } else if (waterType === 'saltwater' || waterType === 'słonowodna') {
            return t('saltwaterAdjective', { defaultValue: 'Słonej' });
          } else if (waterType === 'brackish' || waterType === 'słonawowodna') {
            return t('brackishAdjective', { defaultValue: 'Słonawowodnej' });
          }
          return aquariumWaterType;
        })();
        
        // Pokaż ostrzeżenie przed śmiercią
        const compactReasonKey = (reason) => {
          const r = String(reason || "").toLowerCase();
          if (r.includes("typ wody")) return "fish.parameters.waterType";
          if (r.includes("temperatura")) return "fish.parameters.temperature";
          if (r.includes("ph")) return "fish.parameters.ph";
          if (r.includes("twardo")) return "fish.parameters.hardness";
          if (r.includes("biotyp")) return "fish.parameters.biotope";
          if (r.includes("stado")) return "fish.parameters.minSchoolSize";
          return null;
        };

        const reasonsText = Array.isArray(fishToDie.reasons)
          ? Array.from(new Set(
              fishToDie.reasons
                .map(compactReasonKey)
                .filter(Boolean)
                .map((k) => t(k, { defaultValue: k }))
            )).join(", ")
          : "";

        setDeathNotification({
          message: t("osmoticShockWarning", {
            defaultValue: `⚠️ ${entityName} nie jest w stanie przeżyć w tym środowisku (niezgodne: ${reasonsText}). Nastąpi szok osmotyczny...`,
            fishName: entityName,
            reasons: reasonsText
          }),
          severity: 'warning',
          countdown: WARNING_DELAY / 1000
        });
        
        // Po opóźnieniu usuń rybę
        setTimeout(async () => {
          try {
            // Usuń tylko jedną sztukę ryby
            await removeFishFromAquarium(aquariumId, fishToDie.fishId, 1);
            
            // Odśwież akwarium
            const updatedAquarium = await getAquariumById(aquariumId);
            if (updatedAquarium) {
              const normalizedAquarium = {
                ...updatedAquarium,
                fishes: updatedAquarium.fishes || updatedAquarium.fish || [],
                plants: updatedAquarium.plants || [],
                temperature: updatedAquarium.temperature || updatedAquarium.temperatureC || null,
                hardness: updatedAquarium.hardness || updatedAquarium.hardnessDGH || null,
                status: updatedAquarium.status // Zachowaj status z backendu
              };
              setAquarium(normalizedAquarium);
              aquariumRef.current = normalizedAquarium;
            }
            
            // Pokaż powiadomienie o śmierci
            setDeathNotification({
              message: t("osmoticShockDeath", {
                defaultValue: `💀 ${entityName} nie przeżyła w tym środowisku (Szok osmotyczny)!`,
                fishName: entityName
              }),
              severity: 'error'
            });
            
            // Ukryj powiadomienie po 5 sekundach
            setTimeout(() => {
              setDeathNotification(null);
            }, 5000);
            
          } catch (err) {
            console.error("Error removing fish in osmotic shock:", err);
            setDeathNotification(null);
          }
        }, WARNING_DELAY);
      }
    }, OSMOTIC_SHOCK_INTERVAL);
    
    return () => clearInterval(osmoticShockInterval);
  }, [osmoticShockEnabled, aquariumId, t]);

  // Plazmoliza - automatyczne usuwanie roślin z niezgodnymi warunkami
  useEffect(() => {
    if (!plasmolysisEnabled || !aquariumId) return;

    const PLASMOLYSIS_INTERVAL = 6000;
    const DEATH_CHANCE = 0.50;
    const WARNING_DELAY = 4000;

    const parseRangeString = (rangeString) => {
      if (!rangeString) return null;
      const s = String(rangeString).trim();
      const parts = s.split('-').map((p) => parseFloat(p.trim()));
      if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return null;
      return { min: Math.min(parts[0], parts[1]), max: Math.max(parts[0], parts[1]) };
    };

    const isValueInRange = (value, rangeString) => {
      const range = parseRangeString(rangeString);
      if (!range) return true;
      const v = parseFloat(value);
      if (Number.isNaN(v)) return true;
      return v >= range.min && v <= range.max;
    };

    const plasmolysisInterval = setInterval(async () => {
      const currentAquarium = aquariumRef.current;
      const plantsDb = availablePlantsRef.current;

      const hasAnyPlants = Array.isArray(currentAquarium?.plants) && currentAquarium.plants.length > 0;
      if (!hasAnyPlants || !Array.isArray(plantsDb) || plantsDb.length === 0) return;

      const aquariumTemperature = currentAquarium.temperature ?? currentAquarium.temperatureC ?? null;
      const aquariumPh = currentAquarium.ph ?? null;
      const aquariumHardness = currentAquarium.hardness ?? currentAquarium.hardnessDGH ?? null;
      const aquariumBiotope = currentAquarium.biotope ?? null;

      const incompatiblePlants = currentAquarium.plants
        .map((aquariumPlant) => {
          const plantDetails = plantsDb.find((p) => p.id === aquariumPlant.plantId);
          if (!plantDetails) return null;

          const reasons = [];
          if (!isValueInRange(aquariumTemperature, plantDetails.temperature)) reasons.push("nieodpowiednia temperatura");
          if (!isValueInRange(aquariumPh, plantDetails.ph)) reasons.push("nieodpowiednie pH");
          if (!isValueInRange(aquariumHardness, plantDetails.hardnessDGH)) reasons.push("nieodpowiednia twardość");

          const plantBiotope = plantDetails.biotope ?? null;
          if (aquariumBiotope && plantBiotope) {
            const a = String(aquariumBiotope).toLowerCase().trim();
            const p = String(plantBiotope).toLowerCase().trim();
            if (a && p && a !== p) reasons.push("niezgodny biotyp");
          }

          if (reasons.length === 0) return null;
          return { ...aquariumPlant, details: plantDetails, reasons };
        })
        .filter(Boolean);

      if (incompatiblePlants.length === 0) return;
      if (Math.random() > DEATH_CHANCE) return;

      const plantToDie = incompatiblePlants[Math.floor(Math.random() * incompatiblePlants.length)];
      const plantName = plantToDie.details?.name || "Roślina";

      const compactReasonKey = (reason) => {
        const r = String(reason || "").toLowerCase();
        if (r.includes("temperatura")) return "plant.parameters.temperature";
        if (r.includes("ph")) return "plant.parameters.ph";
        if (r.includes("twardo")) return "plant.parameters.hardness";
        if (r.includes("biotyp")) return "plant.parameters.biotope";
        return null;
      };

      const reasonsText = Array.isArray(plantToDie.reasons)
        ? Array.from(new Set(
            plantToDie.reasons
              .map(compactReasonKey)
              .filter(Boolean)
              .map((k) => t(k, { defaultValue: k }))
          )).join(", ")
        : "";

      setDeathNotification({
        message: t("plasmolysisWarning", {
          defaultValue: `⚠️ ${plantName} nie jest w stanie przeżyć w tym środowisku (niezgodne: ${reasonsText}). Nastąpi plazmoliza...`,
          plantName,
          reasons: reasonsText
        }),
        severity: "warning",
        countdown: WARNING_DELAY / 1000
      });

      setTimeout(async () => {
        try {
          await removePlantFromAquarium(aquariumId, plantToDie.plantId, 1);

          const updatedAquarium = await getAquariumById(aquariumId);
          if (updatedAquarium) {
            const normalizedAquarium = {
              ...updatedAquarium,
              fishes: updatedAquarium.fishes || updatedAquarium.fish || [],
              plants: updatedAquarium.plants || [],
              temperature: updatedAquarium.temperature || updatedAquarium.temperatureC || null,
              hardness: updatedAquarium.hardness || updatedAquarium.hardnessDGH || null,
              status: updatedAquarium.status
            };
            setAquarium(normalizedAquarium);
            aquariumRef.current = normalizedAquarium;
          }

          setDeathNotification({
            message: t("plasmolysisDeath", {
              defaultValue: `💀 ${plantName} nie przeżyła w tym środowisku (Plazmoliza)!`,
              plantName
            }),
            severity: "error"
          });

          setTimeout(() => setDeathNotification(null), 5000);
        } catch (err) {
          console.error("Error removing plant in plasmolysis:", err);
          setDeathNotification(null);
        }
      }, WARNING_DELAY);
    }, PLASMOLYSIS_INTERVAL);

    return () => clearInterval(plasmolysisInterval);
  }, [plasmolysisEnabled, aquariumId, t]);

  // Sprawdź kompatybilność wybranej ryby z akwarium
  useEffect(() => {
    if (!selectedFishId || !aquarium?.fishes || availableFishes.length === 0) {
      setCompatibilityIssues([]);
      return;
    }

    const selectedFish = availableFishes.find(f => f.id === selectedFishId);
    if (selectedFish) {
      const issues = checkFishCompatibilityWithAquarium(selectedFish, aquarium.fishes, availableFishes, aquarium);
      setCompatibilityIssues(issues);
    } else {
      setCompatibilityIssues([]);
    }
  }, [selectedFishId, aquarium, availableFishes]);

  // Sprawdź kompatybilność wybranej rośliny z akwarium
  useEffect(() => {
    if (!selectedPlantId || !aquarium || availablePlants.length === 0) {
      setPlantCompatibilityIssues([]);
      return;
    }

    const selectedPlant = availablePlants.find((p) => String(p.id) === String(selectedPlantId));
    if (!selectedPlant) {
      setPlantCompatibilityIssues([]);
      return;
    }

    const parseRangeString = (rangeString) => {
      if (!rangeString) return null;
      const s = String(rangeString).trim();
      const parts = s.split('-').map((p) => parseFloat(p.trim()));
      if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return null;
      return { min: Math.min(parts[0], parts[1]), max: Math.max(parts[0], parts[1]) };
    };

    const isValueInRange = (value, rangeString) => {
      const range = parseRangeString(rangeString);
      if (!range) return true; // brak danych rośliny = nie egzekwuj
      const v = parseFloat(value);
      if (Number.isNaN(v)) return true; // brak danych akwarium = nie egzekwuj
      return v >= range.min && v <= range.max;
    };

    const aquariumTemperature = aquarium.temperature ?? aquarium.temperatureC ?? null;
    const aquariumPh = aquarium.ph ?? null;
    const aquariumHardness = aquarium.hardness ?? aquarium.hardnessDGH ?? null;
    const aquariumBiotope = aquarium.biotope ?? null;

    const reasons = [];
    if (!isValueInRange(aquariumTemperature, selectedPlant.temperature)) reasons.push("temperatura");
    if (!isValueInRange(aquariumPh, selectedPlant.ph)) reasons.push("pH");
    if (!isValueInRange(aquariumHardness, selectedPlant.hardnessDGH)) reasons.push("twardość");

    const plantBiotope = selectedPlant.biotope ?? null;
    if (aquariumBiotope && plantBiotope) {
      const a = String(aquariumBiotope).toLowerCase().trim();
      const p = String(plantBiotope).toLowerCase().trim();
      if (a && p && a !== p) reasons.push("biotyp");
    }

    if (reasons.length === 0) {
      setPlantCompatibilityIssues([]);
      return;
    }

    const translateReason = (reason) => {
      const map = {
        temperatura: "plant.parameters.temperature",
        "pH": "plant.parameters.ph",
        "twardość": "plant.parameters.hardness",
        biotyp: "plant.parameters.biotope",
      };
      const key = map[reason];
      return key ? t(key, { defaultValue: reason }) : reason;
    };

    const translatedReasons = reasons.map(translateReason).join(", ");
    setPlantCompatibilityIssues([
      {
        type: "PLASMOLYSIS_MISMATCH",
        severity: "ERROR",
        message: t("plasmolysisMismatch", {
          defaultValue: `Plazmoliza: ${translateSpeciesName(selectedPlant.name, "plant")} – niezgodne: ${translatedReasons}.`,
          plantName: translateSpeciesName(selectedPlant.name, "plant"),
          reasons: translatedReasons
        })
      }
    ]);
  }, [selectedPlantId, aquarium, availablePlants, t]);

  async function handleAddFish() {
    if (!selectedFishId || !aquariumId) return;
    
    // Sprawdź limit liczby ryb (maksymalnie 25)
    const MAX_FISH_LIMIT = 25;
    const currentFishesCount = aquarium?.fishes 
      ? aquarium.fishes.reduce((sum, fish) => sum + (fish.count || 1), 0)
      : 0;
    const newTotalCount = currentFishesCount + fishQuantity;
    
    if (newTotalCount > MAX_FISH_LIMIT) {
      setError(`Nie można dodać tylu ryb. Maksymalna liczba ryb w akwarium to ${MAX_FISH_LIMIT}. Aktualnie masz ${currentFishesCount} ryb.`);
      return;
    }
    
    // Sprawdź kompatybilność przed dodaniem
    const selectedFish = availableFishes.find(f => f.id === selectedFishId);
    if (selectedFish && aquarium?.fishes) {
      const issues = checkFishCompatibilityWithAquarium(selectedFish, aquarium.fishes, availableFishes, aquarium);
      const hasErrors = issues.some(issue => issue.severity === "ERROR");
      
      if (hasErrors) {
        // Jeśli są błędy, zapytaj użytkownika czy na pewno chce dodać
        const errorMessages = issues
          .filter(issue => issue.severity === "ERROR")
          .map(issue => issue.message)
          .join("\n");
        
        if (!confirm(`${t("compatibilityWarning", { defaultValue: "Ostrzeżenie o kompatybilności" })}\n\n${errorMessages}\n\n${t("confirmAddIncompatible", { defaultValue: "Czy na pewno chcesz dodać tę rybę mimo niekompatybilności?" })}`)) {
          return;
        }
      }
    }
    
    try {
      setIsAddingFish(true);
      setError(null);
      const result = await addFishToAquarium(aquariumId, selectedFishId, fishQuantity);
      
      // addFishToAquarium zwraca już zaktualizowane akwarium (result.aquarium z API)
      if (result && typeof result === 'object' && result.id) {
        // Normalizuj dane: backend zwraca 'fish', frontend używa 'fishes'
        const normalizedAquarium = {
          ...result,
          fishes: result.fishes || result.fish || [],
          plants: result.plants || [],
          status: result.status // Zachowaj status z backendu
        };
        setAquarium(normalizedAquarium);
        aquariumRef.current = normalizedAquarium; // Aktualizuj ref
      } else {
        // Jeśli nie ma akwarium w odpowiedzi, pobierz je ponownie
        const updatedAquarium = await getAquariumById(aquariumId);
        if (updatedAquarium) {
          // Normalizuj dane: backend zwraca 'fish', frontend używa 'fishes'
          const normalizedAquarium = {
            ...updatedAquarium,
            fishes: updatedAquarium.fishes || updatedAquarium.fish || [],
            plants: updatedAquarium.plants || []
          };
          setAquarium(normalizedAquarium);
          aquariumRef.current = normalizedAquarium; // Aktualizuj ref
        }
      }
      
      // Resetuj formularz
      setSelectedFishId("");
      setFishQuantity(1);
      setCompatibilityIssues([]);
      setAddFishModalOpen(false);
    } catch (err) {
      console.error("Error adding fish:", err);
      setError(err.message || "Nie udało się dodać ryby.");
    } finally {
      setIsAddingFish(false);
    }
  }

  async function handleRemoveFish(fishId) {
    if (!aquariumId || !fishId) {
      console.error('Missing aquariumId or fishId:', { aquariumId, fishId });
      return;
    }
    
    if (!confirm(t("confirmRemoveFish", { defaultValue: "Czy na pewno chcesz usunąć tę rybę?" }))) {
      return;
    }
    
    try {
      console.log('Removing fish:', { aquariumId, fishId });
      await removeFishFromAquarium(aquariumId, fishId);
      console.log('Fish removed successfully');
      
      // Backend zwraca zaktualizowane akwarium, ale może nie być w pełni zaktualizowane
      // Pobierz akwarium ponownie, żeby mieć pewność, że mamy aktualne dane
      console.log('Fetching updated aquarium to ensure we have latest data...');
      await new Promise(resolve => setTimeout(resolve, 200)); // Opóźnienie, żeby backend zdążył zaktualizować
      const updatedAquarium = await getAquariumById(aquariumId);
      if (updatedAquarium) {
        console.log('Updated aquarium fetched:', updatedAquarium);
        // Normalizuj dane: backend zwraca 'fish', frontend używa 'fishes'
        const normalizedFishes = updatedAquarium.fishes || updatedAquarium.fish || [];
        console.log('Fishes array:', normalizedFishes);
        console.log('Fishes count (positions):', normalizedFishes.length || 0);
        const totalCount = normalizedFishes.reduce((sum, fish) => sum + (fish.count || 1), 0);
        console.log('Fishes count (total):', totalCount);
        
        // Utwórz nowy obiekt z nowymi tablicami, żeby wymusić aktualizację React
        // Backend może zwracać temperatureC i hardnessDGH, mapujemy na temperature i hardness
        const freshAquarium = {
          ...updatedAquarium,
          fishes: normalizedFishes.length > 0 ? [...normalizedFishes] : [],
          plants: updatedAquarium.plants ? [...updatedAquarium.plants] : [],
          temperature: updatedAquarium.temperature || updatedAquarium.temperatureC || null,
          hardness: updatedAquarium.hardness || updatedAquarium.hardnessDGH || null,
          status: updatedAquarium.status // Zachowaj status z backendu
        };
        console.log('Setting aquarium state with fresh object');
        setAquarium(freshAquarium);
        aquariumRef.current = freshAquarium; // Aktualizuj ref
        aquariumRef.current = freshAquarium; // Aktualizuj ref
        console.log('Aquarium state updated');
      } else {
        console.error('Failed to fetch updated aquarium');
      }
    } catch (err) {
      console.error("Error removing fish:", err);
      setError(err.message || "Nie udało się usunąć ryby.");
    }
  }

  async function handleAddPlant() {
    if (!selectedPlantId || !aquariumId) return;
    
    // Sprawdź limit liczby roślin (maksymalnie 50)
    const MAX_PLANT_LIMIT = 50;
    const currentPlantsCount = aquarium?.plants 
      ? aquarium.plants.reduce((sum, plant) => sum + (plant.count || 1), 0)
      : 0;
    const newTotalCount = currentPlantsCount + plantQuantity;
    
    if (newTotalCount > MAX_PLANT_LIMIT) {
      setError(`Nie można dodać tylu roślin. Maksymalna liczba roślin w akwarium to ${MAX_PLANT_LIMIT}. Aktualnie masz ${currentPlantsCount} roślin.`);
      return;
    }

    // Sprawdź kompatybilność przed dodaniem (plazmoliza)
    if (plantCompatibilityIssues.length > 0) {
      const hasErrors = plantCompatibilityIssues.some((issue) => issue.severity === "ERROR");
      if (hasErrors) {
        const errorMessages = plantCompatibilityIssues
          .filter((issue) => issue.severity === "ERROR")
          .map((issue) => issue.message)
          .join("\n");

        if (!confirm(`${t("compatibilityWarning", { defaultValue: "Ostrzeżenie o kompatybilności" })}\n\n${errorMessages}\n\n${t("confirmAddIncompatiblePlant", { defaultValue: "Czy na pewno chcesz dodać tę roślinę mimo niekompatybilności?" })}`)) {
          return;
        }
      }
    }
    
    try {
      setIsAddingPlant(true);
      setError(null);
      const result = await addPlantToAquarium(aquariumId, selectedPlantId, plantQuantity);
      
      // Backend zwraca zaktualizowane akwarium w odpowiedzi
      if (result && typeof result === 'object' && result.id) {
        // Normalizuj dane: backend zwraca 'fish', frontend używa 'fishes'
        // Backend może zwracać temperatureC i hardnessDGH, mapujemy na temperature i hardness
        const normalizedAquarium = {
          ...result,
          fishes: result.fishes || result.fish || [],
          plants: result.plants || [],
          temperature: result.temperature || result.temperatureC || null,
          hardness: result.hardness || result.hardnessDGH || null,
          status: result.status // Zachowaj status z backendu
        };
        setAquarium(normalizedAquarium);
      } else {
        // Jeśli nie ma akwarium w odpowiedzi, pobierz je ponownie
        const updatedAquarium = await getAquariumById(aquariumId);
        if (updatedAquarium) {
          // Normalizuj dane: backend zwraca 'fish', frontend używa 'fishes'
          // Backend może zwracać temperatureC i hardnessDGH, mapujemy na temperature i hardness
          const normalizedAquarium = {
            ...updatedAquarium,
            fishes: updatedAquarium.fishes || updatedAquarium.fish || [],
            plants: updatedAquarium.plants || [],
            temperature: updatedAquarium.temperature || updatedAquarium.temperatureC || null,
            hardness: updatedAquarium.hardness || updatedAquarium.hardnessDGH || null
          };
          setAquarium(normalizedAquarium);
        }
      }
      
      // Resetuj formularz
      setSelectedPlantId("");
      setPlantCompatibilityIssues([]);
      setPlantQuantity(1);
      setAddPlantModalOpen(false);
    } catch (err) {
      console.error("Error adding plant:", err);
      setError(err.message || "Nie udało się dodać rośliny.");
    } finally {
      setIsAddingPlant(false);
    }
  }

  async function handleRemovePlant(plantId) {
    if (!aquariumId || !plantId) {
      console.error('Missing aquariumId or plantId:', { aquariumId, plantId });
      return;
    }
    
    if (!confirm(t("confirmRemovePlant", { defaultValue: "Czy na pewno chcesz usunąć tę roślinę?" }))) {
      return;
    }
    
    try {
      console.log('Removing plant:', { aquariumId, plantId });
      const result = await removePlantFromAquarium(aquariumId, plantId);
      console.log('Plant removed successfully, result:', result);
      
      // Backend zwraca zaktualizowane akwarium w odpowiedzi
      if (result && typeof result === 'object' && result.id) {
        // Normalizuj dane: backend zwraca 'fish', frontend używa 'fishes'
        // Backend może zwracać temperatureC i hardnessDGH, mapujemy na temperature i hardness
        const normalizedAquarium = {
          ...result,
          fishes: result.fishes || result.fish || [],
          plants: result.plants || [],
          temperature: result.temperature || result.temperatureC || null,
          hardness: result.hardness || result.hardnessDGH || null
        };
        console.log('Using aquarium from response:', normalizedAquarium);
        setAquarium(normalizedAquarium);
      } else {
        // Jeśli nie ma akwarium w odpowiedzi, pobierz je ponownie
        console.log('Fetching updated aquarium...');
        const updatedAquarium = await getAquariumById(aquariumId);
        if (updatedAquarium) {
          // Normalizuj dane: backend zwraca 'fish', frontend używa 'fishes'
          // Backend może zwracać temperatureC i hardnessDGH, mapujemy na temperature i hardness
          const normalizedAquarium = {
            ...updatedAquarium,
            fishes: updatedAquarium.fishes || updatedAquarium.fish || [],
            plants: updatedAquarium.plants || [],
            temperature: updatedAquarium.temperature || updatedAquarium.temperatureC || null,
            hardness: updatedAquarium.hardness || updatedAquarium.hardnessDGH || null
          };
          console.log('Updated aquarium:', normalizedAquarium);
          setAquarium(normalizedAquarium);
        } else {
          console.error('Failed to fetch updated aquarium');
        }
      }
    } catch (err) {
      console.error("Error removing plant:", err);
      setError(err.message || "Nie udało się usunąć rośliny.");
    }
  }

  useEffect(() => {
    if (!aquarium || !imageContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            
            setImageLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 } 
    );

    observer.observe(imageContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [aquarium]);

  const statistics = useMemo(() => {
    if (!aquarium) return null;

    // API zwraca ryby i rośliny w obiekcie akwarium
    const aquariumFishes = aquarium.fishes || aquarium.fishList || [];
    const aquariumPlants = aquarium.plants || aquarium.plantList || [];

    // Oblicz całkowitą liczbę ryb (suma wszystkich count)
    const totalFishesCount = aquariumFishes.reduce((sum, fish) => sum + (fish.count || 1), 0);
    const totalPlantsCount = aquariumPlants.reduce((sum, plant) => sum + (plant.count || 1), 0);

    // Liczba unikalnych gatunków ryb
    const uniqueFishSpecies = new Set(aquariumFishes.map(fish => fish.fishId));
    const fishSpeciesCount = uniqueFishSpecies.size;

    // Liczba unikalnych gatunków roślin
    const uniquePlantSpecies = new Set(aquariumPlants.map(plant => plant.plantId));
    const plantSpeciesCount = uniquePlantSpecies.size;

    // Grupuj ryby po gatunku (używając fishId) i sumuj count
    const fishBySpecies = aquariumFishes.reduce((acc, fish) => {
      const fishId = fish.fishId;
      if (!acc[fishId]) {
        acc[fishId] = 0;
      }
      acc[fishId] += (fish.count || 1);
      return acc;
    }, {});

    const fishSpeciesData = Object.entries(fishBySpecies)
      .map(([fishId, count]) => {
        // Znajdź nazwę ryby
        const fishDetails = availableFishes.find(f => f.id === fishId);
        const speciesName = fishDetails?.name || fishId;
        
        return {
          species: speciesName,
          count,
          percentage: totalFishesCount > 0 ? (count / totalFishesCount) * 100 : 0
        };
      })
      .sort((a, b) => b.count - a.count); 

    const mostCommonFish = fishSpeciesData.length > 0 ? fishSpeciesData[0] : null;

    // Grupuj rośliny po gatunku (używając plantId) i sumuj count
    const plantsBySpecies = aquariumPlants.reduce((acc, plant) => {
      const plantId = plant.plantId;
      if (!acc[plantId]) {
        acc[plantId] = 0;
      }
      acc[plantId] += (plant.count || 1);
      return acc;
    }, {});

    const plantSpeciesData = Object.entries(plantsBySpecies)
      .map(([plantId, count]) => {
        // Znajdź nazwę rośliny
        const plantDetails = availablePlants.find(p => p.id === plantId);
        const speciesName = plantDetails?.name || plantId;
        
        return {
          species: speciesName,
          count,
          percentage: totalPlantsCount > 0 ? (count / totalPlantsCount) * 100 : 0
        };
      })
      .sort((a, b) => b.count - a.count);

    const mostCommonPlant = plantSpeciesData.length > 0 ? plantSpeciesData[0] : null;
    
    return {
      totalFishes: totalFishesCount, // Suma wszystkich count, nie liczba pozycji
      totalPlants: totalPlantsCount, // Suma wszystkich count, nie liczba pozycji
      fishSpeciesCount,
      plantSpeciesCount,
      mostCommonFish,
      mostCommonPlant,
      fishSpeciesData,
      plantSpeciesData
    };
  }, [aquarium, availableFishes, availablePlants]);

  // Oblicz pozycje wszystkich roślin, unikając kolizji
  const plantPositions = useMemo(() => {
    if (!aquarium?.plants || aquarium.plants.length === 0 || availablePlants.length === 0) {
      return [];
    }

    // Zbierz wszystkie rośliny do renderowania z unikalnym globalnym indeksem
    const allPlants = [];
    let globalIndex = 0;
    
    aquarium.plants.forEach((plant, plantIndex) => {
      const plantDetails = availablePlants.find(p => p.id === plant.plantId);
      if (!plantDetails) return;
      
      const plantName = plantDetails.name || `Roślina ${plantIndex + 1}`;
      const plantCount = plant.count || 1;
      const plantImage = getPlantImage(plantName, plantDetails.iconName);
      
      for (let instanceIndex = 0; instanceIndex < Math.min(plantCount, 10); instanceIndex++) {
        allPlants.push({
          plantId: plant.plantId,
          plantIndex,
          instanceIndex,
          globalIndex: globalIndex++,
          plantName,
          plantImage,
          uniqueKey: `plant-${plant.plantId}-${instanceIndex}`
        });
      }
    });

    // Funkcja sprawdzająca kolizję między roślinami (używając prostokątów)
    const checkCollision = (x, y, width, height, existingPlants) => {
      for (const existing of existingPlants) {
        // Sprawdź kolizję prostokątów z marginesem
        const margin = 70; // Dodatkowy margines między roślinami (70px)
        if (
          x < existing.x + existing.width + margin &&
          x + width + margin > existing.x &&
          y < existing.y + existing.height + margin &&
          y + height + margin > existing.y
        ) {
          return true; // Kolizja wykryta
        }
      }
      return false;
    };

    // Funkcja znajdowania wolnej pozycji
    // Obliczamy pozycje procentowo:
    // - Dolny pasek menu: ~6% wysokości ekranu (78px przy 1312px = 5.95%)
    // - Górny pasek menu: ~16% wysokości ekranu (207px przy 1312px = 15.78%)
    // - Dostępna przestrzeń: 100% - 6% - 16% = 78%
    // - Rośliny: dolne 30% z dostępnej przestrzeni = 23.4% całej wysokości
    // - Ryby: górne 70% z dostępnej przestrzeni = 54.6% całej wysokości
    // - Poziom piasku (sandHorizonY): 30% od dołu dostępnej przestrzeni = 6% + 23.4% = 29.4% od dołu
    const findFreePosition = (globalIndex, existingPlants, containerWidth = 1200, containerHeight = 1000) => {
      const size = 120 + (globalIndex * 13) % 80; // 120-200px
      const height = size * 1.5;
      
      // Procentowe wartości
      const bottomMenuPercent = 0.06; // 6% - dolny pasek menu
      const topMenuPercent = 0.16; // 16% - górny pasek menu
      const availableHeightPercent = 1 - bottomMenuPercent - topMenuPercent; // 78% - dostępna przestrzeń
      const plantZonePercent = 0.30; // 30% z dostępnej przestrzeni dla roślin
      
      // Oblicz pozycje w pikselach
      const bottomMenuHeight = containerHeight * bottomMenuPercent; // ~78px przy 1312px
      const plantZoneHeight = containerHeight * availableHeightPercent * plantZonePercent; // ~308px przy 1312px
      const minBottomOffset = bottomMenuHeight; // Minimalna odległość od dołu (powyżej menu) - ~78px
      const maxBottomOffset = bottomMenuHeight + plantZoneHeight; // Maksymalna wysokość dla roślin - ~386px
      const availableHeight = maxBottomOffset - minBottomOffset; // ~308px
      
      // Próbuj znaleźć wolną pozycję (maksymalnie 300 prób)
      for (let attempt = 0; attempt < 300; attempt++) {
        // Użyj globalnego indeksu i próby do generowania pozycji
        const seed = globalIndex * 1000 + attempt;
        const xPercent = 5 + (seed * 17) % 90; // 5-95% szerokości
        const bottomOffset = minBottomOffset + (seed * 23) % availableHeight;
        
        // Konwertuj x% na piksele
        const xPixels = (xPercent / 100) * containerWidth;
        
        // Sprawdź czy pozycja jest wolna
        if (!checkCollision(xPixels, bottomOffset, size, height, existingPlants)) {
          return { 
            x: xPercent, 
            bottomOffset, 
            size,
            xPixels,
            height
          };
        }
      }
      
      // Jeśli nie znaleziono wolnej pozycji po 300 próbach, użyj pozycji z większym marginesem
      const seed = globalIndex * 1000;
      return {
        x: 5 + (seed * 17) % 90,
        bottomOffset: minBottomOffset + (seed * 23) % availableHeight,
        size,
        xPixels: ((5 + (seed * 17) % 90) / 100) * containerWidth,
        height
      };
    };

    // Umieść wszystkie rośliny, unikając kolizji
    const placedPlants = [];
    const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    // Wysokość kontenera akwarium = wysokość okna minus górny pasek (96px dla sm, 200px dla xs) minus dolny pasek (78px)
    // Używamy średniej wartości dla responsywności: ~96px górny pasek + ~78px dolny pasek = ~174px
    // Więc dostępna wysokość = window.innerHeight - 174px
    const topMenuHeight = typeof window !== 'undefined' && window.innerWidth < 600 ? 200 : 96; // xs: 200px, sm+: 96px
    const bottomMenuHeight = 78; // Dolny pasek menu
    const containerHeight = typeof window !== 'undefined' 
      ? window.innerHeight - topMenuHeight - bottomMenuHeight 
      : 1000;
    
    return allPlants.map((plant) => {
      const position = findFreePosition(
        plant.globalIndex,
        placedPlants,
        containerWidth,
        containerHeight
      );
      
      // Dodaj do listy umieszczonych roślin
      placedPlants.push({
        x: position.xPixels,
        y: position.bottomOffset,
        width: position.size,
        height: position.height
      });
      
      return {
        ...plant,
        position
      };
    });
  }, [aquarium?.plants, availablePlants]);

  // Oblicz całkowitą liczbę ryb i roślin dla wyświetlania w nagłówku
  const totalFishesCount = aquarium ? (aquarium.fishes || []).reduce((sum, fish) => sum + (fish.count || 1), 0) : 0;
  const totalPlantsCount = aquarium ? (aquarium.plants || []).reduce((sum, plant) => sum + (plant.count || 1), 0) : 0;

  const handleOpenStatistics = () => {
    setStatisticsOpen(true);
  };

  const handleCloseStatistics = () => {
    setStatisticsOpen(false);
  };

  if (!aquarium) {
    return (
      <Box sx={{ minHeight: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography suppressHydrationWarning>
          {mounted ? t("loading", { defaultValue: "Ładowanie..." }) : "Loading..."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 96,
        background: 'linear-gradient(to bottom right, #cfeef6 0%, #87cde1 50%, #2e7fa9 100%)',
        zIndex: 5
      }} />
      {darkMode && (
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 96,
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 6
        }} />
      )}

      <Box 
        component="nav"
        role="navigation"
        aria-label={t("mainNavigation", { defaultValue: "Główna nawigacja" })}
        sx={{ 
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 0.5, sm: 2, md: 4 }, 
        py: { xs: 0.5, sm: 1, md: 1.5 }, 
        zIndex: 10,
        height: 96,
        maxWidth: '100%',
        overflow: 'hidden',
        gap: { xs: 0.5, sm: 1, md: 2 }
      }}>
        {}
        <Box sx={{ 
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Link href="/my-aquariums" style={{ textDecoration: 'none' }}>
            <Box sx={{
              bgcolor: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)', 
              p: { xs: 0.4, sm: 0.6, md: 0.8 }, 
              borderRadius: 1.5, 
              boxShadow: 2,
              transition: "all 0.3s", 
              backdropFilter: 'blur(8px)',
              "&:hover": { 
                boxShadow: 4, 
                transform: "translateY(-2px)", 
                bgcolor: darkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.6)' 
              },
              cursor: 'pointer', 
              minHeight: { xs: '52px', sm: '50px', md: '60px' }, 
              minWidth: { xs: '52px', sm: '60px', md: '80px' },
              maxWidth: { xs: '52px', sm: '60px', md: '80px' },
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <KeyboardReturnOutlinedIcon sx={{ fontSize: { xs: 16, sm: 14, md: 16 }, mb: 0.2, color: darkMode ? 'white' : 'inherit' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: darkMode ? 'white' : "text.primary", textAlign: 'center', fontSize: { xs: '0.6rem', sm: '0.55rem', md: '0.65rem' }, lineHeight: 1.1 }}>
                {t("return")}
              </Typography>
            </Box>
          </Link>
        </Box>
        
        {}
        <Box sx={{ 
          display: { xs: 'none', sm: 'flex' },
          justifyContent: 'center',
          flex: '1 1 auto',
          minWidth: 0,
          maxWidth: { sm: 'calc(100% - 200px)', md: 'calc(100% - 300px)' }
        }}>
          <Box sx={{
            bgcolor: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderRadius: 1.5,
            px: { xs: 1, sm: 1.5, md: 2 },
            py: { xs: 0.5, sm: 0.75, md: 1 },
            backdropFilter: 'blur(10px)',
            boxShadow: 2,
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1, md: 2 },
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' }, 
              whiteSpace: { xs: 'normal', sm: 'nowrap' },
              color: darkMode ? 'white' : 'inherit',
              textAlign: { xs: 'center', sm: 'left' },
              width: { xs: '100%', sm: 'auto' }
            }}>
              {aquarium.name}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 0.5, sm: 1, md: 2 }, 
              alignItems: 'center', 
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-start' },
              width: { xs: '100%', sm: 'auto' }
            }}>
              <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                {t("waterType", { defaultValue: "Typ wody" })}: {(() => {
                  const waterType = String(aquarium.waterType || '').toLowerCase().trim();
                  if (waterType === 'freshwater' || waterType === 'słodkowodna') {
                    return t("freshwater", { defaultValue: "Słodkowodne" });
                  } else if (waterType === 'saltwater' || waterType === 'słonowodna') {
                    return t("saltwater", { defaultValue: "Słonowodne" });
                  } else if (waterType === 'brackish' || waterType === 'słonawowodna') {
                    return t("brackish", { defaultValue: "Słonawowodne" });
                  }
                  return aquarium.waterType || '';
                })()}
              </Typography>
              {aquarium.temperature != null && (
                <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                  🌡️ {aquarium.temperature}°C
                </Typography>
              )}
              {aquarium.ph != null && (
                <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                  pH: {aquarium.ph}
                </Typography>
              )}
              {aquarium.hardness != null && (
                <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                  💧 {aquarium.hardness} dGH
                </Typography>
              )}
              <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                🌍 {aquarium.biotope === 'ameryka południowa' ? t("biotopeSouthAmerica", { defaultValue: "Ameryka Południowa" }) :
                    aquarium.biotope === 'ameryka północna' ? t("biotopeNorthAmerica", { defaultValue: "Ameryka Północna" }) :
                    aquarium.biotope === 'azja' ? t("biotopeAsia", { defaultValue: "Azja" }) :
                    aquarium.biotope === 'afryka' ? t("biotopeAfrica", { defaultValue: "Afryka" }) :
                    aquarium.biotope === 'australia/Oceania' ? t("biotopeAustralia", { defaultValue: "Australia/Oceania" }) :
                    aquarium.biotope}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                🐟 {totalFishesCount}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                🌿 {totalPlantsCount}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 0.5, sm: 1 }, 
          justifyContent: 'flex-end',
          flexShrink: 0
        }}>
          {}
          <Box
            onClick={handleOpenStatistics}
            sx={{
              bgcolor: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)', 
              p: { xs: 0.4, sm: 0.6, md: 0.8 }, 
              borderRadius: 1.5, 
              boxShadow: 2,
              transition: "all 0.3s", 
              backdropFilter: 'blur(8px)',
              "&:hover": { 
                boxShadow: 4, 
                transform: "translateY(-2px)", 
                bgcolor: darkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.6)' 
              },
              cursor: 'pointer', 
              minHeight: { xs: '52px', sm: '50px', md: '60px' }, 
              minWidth: { xs: '52px', sm: '60px', md: '80px' },
              maxWidth: { xs: '52px', sm: '60px', md: '80px' },
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <BarChartIcon sx={{ fontSize: { xs: 16, sm: 14, md: 16 }, mb: 0.2, color: darkMode ? 'white' : 'inherit' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: darkMode ? 'white' : "text.primary", textAlign: 'center', fontSize: { xs: '0.6rem', sm: '0.55rem', md: '0.65rem' }, lineHeight: 1.1 }}>
              {t("statistics")}
            </Typography>
          </Box>
          <LanguageSwitcher />
        </Box>
      </Box>

      {}
      <Box sx={{
        display: { xs: 'block', sm: 'none' },
        position: 'absolute',
        top: 96,
        left: 0,
        right: 0,
        zIndex: 10,
        px: 2,
        pt: 1,
        pb: 1
      }}>
        <Box sx={{
          bgcolor: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderRadius: 1.5,
          px: 1.5,
          py: 1,
          backdropFilter: 'blur(10px)',
          boxShadow: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            fontSize: '0.9rem', 
            color: darkMode ? 'white' : 'inherit',
            textAlign: 'center',
            mb: 0.5
          }}>
            {aquarium.name}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'center', 
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: '100%'
          }}>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
              {t("waterType", { defaultValue: "Typ wody" })}: {(() => {
                const waterType = String(aquarium.waterType || '').toLowerCase().trim();
                if (waterType === 'freshwater' || waterType === 'słodkowodna') {
                  return t("freshwater", { defaultValue: "Słodkowodne" });
                } else if (waterType === 'saltwater' || waterType === 'słonowodna') {
                  return t("saltwater", { defaultValue: "Słonowodne" });
                } else if (waterType === 'brackish' || waterType === 'słonawowodna') {
                  return t("brackish", { defaultValue: "Słonawowodne" });
                }
                return aquarium.waterType || '';
              })()}
            </Typography>
            {aquarium.temperature != null && (
              <Typography variant="caption" sx={{ fontSize: '0.7rem', whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                🌡️ {aquarium.temperature}°C
              </Typography>
            )}
            {aquarium.ph != null && (
              <Typography variant="caption" sx={{ fontSize: '0.7rem', whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                pH: {aquarium.ph}
              </Typography>
            )}
            {aquarium.hardness != null && (
              <Typography variant="caption" sx={{ fontSize: '0.7rem', whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                💧 {aquarium.hardness} dGH
              </Typography>
            )}
            <Typography variant="caption" sx={{ fontSize: '0.7rem', whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
              🌍 {aquarium.biotope === 'ameryka południowa' ? t("biotopeSouthAmerica", { defaultValue: "Ameryka Południowa" }) :
                  aquarium.biotope === 'ameryka północna' ? t("biotopeNorthAmerica", { defaultValue: "Ameryka Północna" }) :
                  aquarium.biotope === 'azja' ? t("biotopeAsia", { defaultValue: "Azja" }) :
                  aquarium.biotope === 'afryka' ? t("biotopeAfrica", { defaultValue: "Afryka" }) :
                  aquarium.biotope === 'australia/Oceania' ? t("biotopeAustralia", { defaultValue: "Australia/Oceania" }) :
                  aquarium.biotope}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                🐟 {totalFishesCount}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
              🌿 {totalPlantsCount}
            </Typography>
          </Box>
        </Box>
      </Box>

      {}
      <Box 
        component="main"
        ref={imageContainerRef}
        onClick={() => {
          // Zamknij panel kompatybilności po kliknięciu na akwarium
          if (compatibilityPanelExpanded) {
            setCompatibilityPanelExpanded(false);
          }
        }}
        sx={{ position: 'absolute', left: 0, right: 0, top: { xs: 200, sm: 96 }, bottom: 0, zIndex: 1 }}
      >
        {imageLoaded && (
          <>
          {}
          <Box
            sx={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url("/aquarium.png")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              pointerEvents: 'none'
            }}
          />
          
          {}
          <Box sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden'
          }}>
            {Array.from({ length: 15 }).map((_, i) => {
              const size = 8 + (i % 4) * 3;
              const leftPosition = 5 + (i * 7) % 85;
              const startDelay = i * 0.4;
              const bottomPosition = 5 + (i * 13) % 60;
              
              return (
                <Box
                  key={i} 
                  className="bubble"
                  sx={{
                    position: 'absolute', 
                    bottom: `${bottomPosition}%`, 
                    left: `${leftPosition}%`, 
                    width: `${size}px`, 
                    height: `${size}px`, 
                    borderRadius: '50%', 
                    background: 'rgba(255, 255, 255, 0.25)', 
                    border: '1px solid rgba(255, 255, 255, 0.4)', 
                    animation: 'bubbleRise 4s infinite', 
                    animationDelay: `${startDelay}s`, 
                    filter: 'blur(0.8px)' 
                  }}
                />
              );
            })}
          </Box>
          
          {}
          <Box 
            className="aquarium-light"
            sx={{
              position: 'absolute',
              top: '15%',
              left: '25%',
              width: '200px',
              height: '300px',
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              animation: 'lightShift 8s ease-in-out infinite alternate',
              filter: 'blur(20px)'
            }} 
          />
          
          {/* Animowane ryby pływające w akwarium */}
          {aquarium?.fishes && aquarium.fishes.length > 0 && (
            <Box sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
              clipPath: 'inset(0)' // Ogranicza ryby do obszaru kontenera
            }}>
              {(() => {
                // Oblicz całkowitą liczbę ryb
                const totalFishCount = aquarium.fishes.reduce((sum, fish) => sum + (fish.count || 1), 0);
                // Maksymalnie 25 ryb wizualnie w akwarium
                const MAX_VISUAL_FISH = 25;
                const visualLimit = Math.min(totalFishCount, MAX_VISUAL_FISH);
                
                // Oblicz proporcje dla każdego gatunku
                const visualCounts = aquarium.fishes.map((fish) => {
                  const fishCount = fish.count || 1;
                  const proportion = fishCount / totalFishCount;
                  return Math.max(1, Math.round(proportion * visualLimit));
                });
                
                // Upewnij się, że suma nie przekracza limitu (popraw zaokrąglenia)
                let totalVisual = visualCounts.reduce((sum, count) => sum + count, 0);
                if (totalVisual > visualLimit) {
                  // Zmniejsz proporcjonalnie największe wartości
                  const diff = totalVisual - visualLimit;
                  const sortedIndices = visualCounts.map((count, idx) => ({ count, idx }))
                    .sort((a, b) => b.count - a.count);
                  for (let i = 0; i < diff && i < sortedIndices.length; i++) {
                    if (visualCounts[sortedIndices[i].idx] > 1) {
                      visualCounts[sortedIndices[i].idx]--;
                    }
                  }
                }
                
                return aquarium.fishes.flatMap((fish, fishIndex) => {
                  const fishDetails = availableFishes.find(f => f.id === fish.fishId);
                  if (!fishDetails) return [];
                  
                  const fishName = fishDetails.name || `Ryba ${fishIndex + 1}`;
                  const fishImage = getFishImage(fishName, fishDetails.iconName);
                  
                  // Użyj obliczonej proporcjonalnej liczby
                  const actualVisualCount = visualCounts[fishIndex];
                  
                  // Renderuj ryby proporcjonalnie
                  return Array.from({ length: actualVisualCount }).map((_, instanceIndex) => {
                  const uniqueKey = `fish-${fish.fishId}-${instanceIndex}`;
                  // Losowe pozycje startowe i parametry animacji dla każdej ryby
                  // Ryby w górnych 70% dostępnej przestrzeni (powyżej poziomu piasku)
                  // Górny pasek menu: ~16%, więc ryby od ~16% do ~70% wysokości kontenera
                  const startX = 5 + (fishIndex * 13 + instanceIndex * 7) % 85;
                  // Ryby tylko w górnych 70% dostępnej przestrzeni (0% to góra kontenera, 70% to poziom piasku)
                  const startY = 5 + (fishIndex * 17 + instanceIndex * 11) % 65; // 5% do 70% od góry kontenera
                  // Dłuższe animacje - 12-20 sekund dla bardziej naturalnego ruchu
                  const duration = 12 + (fishIndex * 3 + instanceIndex * 2) % 8;
                  const delay = (fishIndex * 0.7 + instanceIndex * 0.5) % 3;
                  const size = 40 + (fishIndex * 3 + instanceIndex * 2) % 30; // 40-70px
                  
                  return (
                    <Box
                      key={uniqueKey}
                      className="swimming-fish"
                      sx={{
                        position: 'absolute',
                        left: `${startX}%`,
                        top: `${startY}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundImage: `url(${fishImage})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        animation: `fishSwim ${duration}s ease-in-out infinite`,
                        animationDelay: `${delay}s`,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                        zIndex: 2,
                        willChange: 'left, top, transform'
                      }}
                    />
                  );
                });
              });
              })()}
            </Box>
          )}

          {/* Rośliny w obszarze piasku (dolne 30% dostępnej przestrzeni, powyżej dolnego menu) */}
          {plantPositions && plantPositions.length > 0 && (
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '30%', // 30% dostępnej przestrzeni dla roślin (dolne 30% z 78% = 23.4% całej wysokości)
              pointerEvents: 'none',
              overflow: 'visible',
              zIndex: 1 // Rośliny na drugim planie (ryby mają zIndex: 2)
            }}>
              {plantPositions.map((plant) => (
                <Box
                  key={plant.uniqueKey}
                  sx={{
                    position: 'absolute',
                    left: `${plant.position.x}%`,
                    bottom: `${plant.position.bottomOffset}px`, // Pozycja w obszarze piasku (powyżej menu)
                    width: `${plant.position.size}px`,
                    height: `${plant.position.size * 1.5}px`, // Rośliny są wyższe niż szerokie
                    backgroundImage: `url(${plant.plantImage})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'bottom center',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    zIndex: 1 // Rośliny na drugim planie
                  }}
                />
              ))}
            </Box>
          )}
          </>
        )}
      </Box>

      {/* Status akwarium - ostrzeżenia o kompatybilności w prawym górnym rogu */}
      {/* Pokazuj tylko gdy jest co najmniej 2 ryby (wtedy może być niekompatybilność) */}
      {/* Pokazuj tylko dla problemów z temperamentem (agresywne + spokojne) lub typem wody */}
      {(() => {
        const backendIssues = aquarium?.status?.issues || [];
        const mergedIssues = [...backendIssues, ...(frontendStatusIssues || [])];
        const hasAnyIssues = mergedIssues.some((issue) =>
          ["TEMPERAMENT_INCOMPATIBILITY", "WATER_TYPE_MISMATCH", "ENVIRONMENT_MISMATCH", "PLASMOLYSIS_MISMATCH"].includes(issue.type)
        );
        const hasWaterOrEnv = mergedIssues.some((issue) => ["WATER_TYPE_MISMATCH", "ENVIRONMENT_MISMATCH", "PLASMOLYSIS_MISMATCH"].includes(issue.type));
        const fishCount = Array.isArray(aquarium?.fishes) ? aquarium.fishes.length : 0;
        const hasAnyAnimalsOrPlants = (Array.isArray(aquarium?.fishes) && aquarium.fishes.length > 0) || (Array.isArray(aquarium?.plants) && aquarium.plants.length > 0);
        const canShow = hasAnyAnimalsOrPlants && hasAnyIssues && (hasWaterOrEnv || fishCount >= 2);
        if (!canShow) return null;

        const derivedLevel = mergedIssues.some((i) => i.severity === "ERROR") ? "ERROR" : "WARNING";
        const statusLevel = aquarium?.status?.level || derivedLevel;

        return (
        <Box sx={{
          position: 'fixed',
          top: { xs: 100, sm: 110, md: 120 },
          right: { xs: 16, sm: 24, md: 32 },
          zIndex: 16,
          maxWidth: { xs: 'calc(100% - 32px)', sm: 320, md: 380 },
          width: { xs: 'auto', sm: 320, md: 380 }
        }}>
          {!compatibilityPanelExpanded ? (
            // Zwijany widok - tylko ikona z wykrzyknikiem
            (() => {
              const pulse = keyframes`
                0%, 100% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.15);
                }
              `;
              
              return (
                <IconButton
                  onClick={() => setCompatibilityPanelExpanded(true)}
                  sx={{
                    bgcolor: statusLevel === 'ERROR' ? '#f44336' : '#ff9800',
                    color: 'white',
                    width: 48,
                    height: 48,
                    '&:hover': {
                      bgcolor: statusLevel === 'ERROR' ? '#d32f2f' : '#f57c00',
                    },
                    boxShadow: 4,
                    borderRadius: '50%',
                    animation: `${pulse} 2s ease-in-out infinite`,
                  }}
                >
                  <Typography sx={{ fontSize: '1.5rem' }}>!</Typography>
                </IconButton>
              );
            })()
          ) : (
            // Rozwinięty widok - pełny panel
            <Paper 
              onClick={(e) => e.stopPropagation()} // Zapobiegaj zamykaniu panelu po kliknięciu na niego
              sx={{
                p: 2,
                bgcolor: darkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                boxShadow: 4,
                border: statusLevel === 'ERROR' ? '2px solid #f44336' : 
                        statusLevel === 'WARNING' ? '2px solid #ff9800' : 'none'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => setCompatibilityPanelExpanded(false)}
                  sx={{ 
                    mt: -1,
                    ml: -1,
                    color: darkMode ? 'white' : 'inherit'
                  }}
                >
                  ✕
                </IconButton>
                <Typography sx={{ 
                  fontSize: '1.5rem',
                  lineHeight: 1
                }}>
                  {statusLevel === 'ERROR' ? '🔴' : '⚠️'}
                </Typography>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600, 
                    color: darkMode ? 'white' : 'inherit',
                    mb: 1,
                    fontSize: '0.9rem'
                  }}>
                    {t("compatibilityIssues", { defaultValue: "Problemy z kompatybilnością" })}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {(() => {
                      const fishIssues = mergedIssues.filter(issue =>
                        issue.type === 'TEMPERAMENT_INCOMPATIBILITY' ||
                        issue.type === 'WATER_TYPE_MISMATCH' ||
                        issue.type === 'ENVIRONMENT_MISMATCH'
                      );
                      const plantIssues = mergedIssues.filter(issue => issue.type === 'PLASMOLYSIS_MISMATCH');

                      const visibleFish = fishIssues.slice(0, 3);
                      const remainingSlots = Math.max(0, 3 - visibleFish.length);
                      const visiblePlants = plantIssues.slice(0, remainingSlots);

                      const hiddenCount = (fishIssues.length + plantIssues.length) - (visibleFish.length + visiblePlants.length);

                      return (
                        <>
                          {plantIssues.length > 0 && (
                            <Typography variant="caption" sx={{ 
                              fontSize: '0.75rem',
                              color: darkMode ? 'rgba(255,255,255,0.75)' : 'text.secondary',
                              fontWeight: 600
                            }}>
                              {t("plantWarnings", { defaultValue: "Ostrzeżenia (rośliny)" })}
                            </Typography>
                          )}

                          {visiblePlants.map((issue, index) => (
                            <Box
                              key={`plant-issue-${index}`}
                              sx={{
                                p: 1,
                                bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                borderRadius: 1,
                                borderLeft: '3px solid #f44336'
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: '0.8rem',
                                  lineHeight: 1.4,
                                  color: darkMode ? 'rgba(255,255,255,0.9)' : 'text.primary',
                                }}
                              >
                                {issue.message}
                                <Typography component="span" sx={{ 
                                  display: 'block', 
                                  mt: 0.5, 
                                  fontSize: '0.75rem',
                                  color: '#f44336',
                                  fontStyle: 'italic'
                                }}>
                                  {t("plantMayNotSurvive", { defaultValue: "Roślina może nie przeżyć w takich warunkach" })}
                                </Typography>
                              </Typography>
                            </Box>
                          ))}

                          {fishIssues.length > 0 && (
                            <Typography variant="caption" sx={{ 
                              fontSize: '0.75rem',
                              color: darkMode ? 'rgba(255,255,255,0.75)' : 'text.secondary',
                              fontWeight: 600,
                              mt: plantIssues.length > 0 ? 0.25 : 0
                            }}>
                              {t("fishWarnings", { defaultValue: "Ostrzeżenia (ryby)" })}
                            </Typography>
                          )}

                          {visibleFish.map((issue, index) => (
                        <Box 
                          key={`issue-${index}`}
                          sx={{
                            p: 1,
                            bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                            borderRadius: 1,
                            borderLeft: (issue.type === 'WATER_TYPE_MISMATCH' || issue.type === 'ENVIRONMENT_MISMATCH') ? '3px solid #f44336' : 'none'
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontSize: '0.8rem',
                              lineHeight: 1.4,
                              color: darkMode ? 'rgba(255,255,255,0.9)' : 'text.primary',
                              fontWeight: issue.type === 'WATER_TYPE_MISMATCH' ? 600 : 'normal'
                            }}
                          >
                            {(() => {
                              let msg = issue.message || '';
                              
                              // Użyj uniwersalnej funkcji translateSpeciesName
                              const translateFishName = (name) => translateSpeciesName(name, 'fish');
                              
                              // Format 1: "Ostrzeżenie: Nazwa1, Nazwa2 (agresywne) nie mogą być z Nazwa3 (spokojne)..."
                              // Obsługuj zarówno "Ostrzeżenie" jak i "Warning"
                              const aggressiveMatch = msg.match(/(Ostrzeżenie|Warning):\s*([^(]+)\s*\(([^)]+)\)/);
                              const peacefulMatch = msg.match(/(nie mogą być z|cannot be with)\s*([^(]+)\s*\(([^)]+)\)/);
                              
                              if (aggressiveMatch) {
                                const fishNames = aggressiveMatch[2].split(',').map(translateFishName);
                                const temperament = aggressiveMatch[3].trim();
                                const translatedTemperament = t(`fish.temperament.${temperament}`, { defaultValue: temperament });
                                const warningText = t('warning', { defaultValue: 'Ostrzeżenie' });
                                msg = msg.replace(aggressiveMatch[0], `${warningText}: ${fishNames.join(', ')} (${translatedTemperament})`);
                              }
                              
                              if (peacefulMatch) {
                                const peacefulNames = peacefulMatch[2].split(',').map(translateFishName);
                                const temperament = peacefulMatch[3].trim();
                                const translatedTemperament = t(`fish.temperament.${temperament}`, { defaultValue: temperament });
                                const cannotBeWithText = t('cannotBeWith', { defaultValue: 'nie mogą być z' });
                                msg = msg.replace(peacefulMatch[0], `${cannotBeWithText} ${peacefulNames.join(', ')} (${translatedTemperament})`);
                              }
                              
                              // Format 2: "Nazwa1 (agresywne) nie może być z Nazwa2 (spokojne)..."
                              const oldFormatMatch = msg.match(/([A-ZĄĆĘŁŃÓŚŹŻ][^(]+)\s*\(([^)]+)\)\s*(nie może być z|cannot be with)\s*([A-ZĄĆĘŁŃÓŚŹŻ][^(]+)\s*\(([^)]+)\)/);
                              if (oldFormatMatch) {
                                const fish1 = translateFishName(oldFormatMatch[1].trim());
                                const temp1 = t(`fish.temperament.${oldFormatMatch[2].trim()}`, { defaultValue: oldFormatMatch[2].trim() });
                                const fish2 = translateFishName(oldFormatMatch[4].trim());
                                const temp2 = t(`fish.temperament.${oldFormatMatch[5].trim()}`, { defaultValue: oldFormatMatch[5].trim() });
                                const cannotBeWithText = t('cannotBeWith', { defaultValue: 'nie mogą być z' });
                                msg = msg.replace(oldFormatMatch[0], `${fish1} (${temp1}) ${cannotBeWithText} ${fish2} (${temp2})`);
                              }
                              
                              // Format 3: "Nazwa1 i Nazwa2 (oba agresywne, różne gatunki)..."
                              const bothAggressiveMatch = msg.match(/([A-ZĄĆĘŁŃÓŚŹŻ][^i]+)\s*i\s*([A-ZĄĆĘŁŃÓŚŹŻ][^(]+)\s*\(oba\s+([^,]+),\s*różne\s+gatunki\)/);
                              if (bothAggressiveMatch) {
                                const fish1 = translateFishName(bothAggressiveMatch[1].trim());
                                const fish2 = translateFishName(bothAggressiveMatch[2].trim());
                                const temp = t(`fish.temperament.${bothAggressiveMatch[3].trim()}`, { defaultValue: bothAggressiveMatch[3].trim() });
                                msg = msg.replace(bothAggressiveMatch[0], `${fish1} i ${fish2} (oba ${temp}, różne gatunki)`);
                              }
                              
                              // Tłumacz "Ostrzeżenie" / "Warning" na początku komunikatu
                              msg = msg.replace(/^Ostrzeżenie:/, `${t('warning', { defaultValue: 'Ostrzeżenie' })}:`);
                              msg = msg.replace(/^Warning:/, `${t('warning', { defaultValue: 'Ostrzeżenie' })}:`);
                              
                              // Tłumacz "nie mogą być z" / "cannot be with"
                              msg = msg.replace(/nie mogą być z/g, t('cannotBeWith', { defaultValue: 'nie mogą być z' }));
                              msg = msg.replace(/cannot be with/g, t('cannotBeWith', { defaultValue: 'nie mogą być z' }));
                              
                              // Tłumacz wszystkie fragmenty tekstu (case-insensitive, z kropką lub bez)
                              msg = msg.replace(/konflikt może spowodować pożarcie łagodnego osobnika\.?/gi, t('conflictMayCauseEating', { defaultValue: 'konflikt może spowodować pożarcie łagodnego osobnika' }));
                              msg = msg.replace(/conflict may cause the peaceful individual to be eaten\.?/gi, t('conflictMayCauseEating', { defaultValue: 'konflikt może spowodować pożarcie łagodnego osobnika' }));
                              msg = msg.replace(/wymagają dodatkowego sprawdzenia/g, t('conflictMayCauseEating', { defaultValue: 'konflikt może spowodować pożarcie łagodnego osobnika' }));
                              msg = msg.replace(/wymaga dodatkowego sprawdzenia/g, t('conflictMayCauseEating', { defaultValue: 'konflikt może spowodować pożarcie łagodnego osobnika' }));
                              msg = msg.replace(/Ryba spokojna może zostać pożarta/g, t('peacefulFishMayBeEaten', { defaultValue: 'Ryba spokojna może zostać pożarta' }));
                              msg = msg.replace(/Peaceful fish may be eaten/g, t('peacefulFishMayBeEaten', { defaultValue: 'Ryba spokojna może zostać pożarta' }));
                              
                              // Tłumacz temperamenty, które mogą być już w tekście
                              msg = msg.replace(/\b(agresywne|spokojne|pół-agresywne|aggressive|peaceful|semi-aggressive)\b/g, (match) => {
                                const map = {
                                  'agresywne': t('fish.temperament.agresywne', { defaultValue: 'agresywne' }),
                                  'spokojne': t('fish.temperament.spokojne', { defaultValue: 'spokojne' }),
                                  'pol_agresywne': t('fish.temperament.pol_agresywne', { defaultValue: 'pół-agresywne' }),
                                  'aggressive': t('fish.temperament.agresywne', { defaultValue: 'agresywne' }),
                                  'peaceful': t('fish.temperament.spokojne', { defaultValue: 'spokojne' }),
                                  'semi-aggressive': t('fish.temperament.pol_agresywne', { defaultValue: 'pół-agresywne' })
                                };
                                return map[match] || match;
                              });
                              
                              // Tłumacz komunikaty o niezgodności typu wody
                              // Format: "Niezgodność typu wody: akwarium Słodkowodna, ryba Mandaryn wspaniały wymaga Słonowodna."
                              const waterMismatchMatch = msg.match(/Niezgodność typu wody:\s*akwarium\s+([^,]+),\s*ryba\s+([^,]+)\s+wymaga\s+([^.]+)\./);
                              if (waterMismatchMatch) {
                                const aquariumWaterType = waterMismatchMatch[1].trim();
                                const fishName = waterMismatchMatch[2].trim();
                                const requiredWaterType = waterMismatchMatch[3].trim();
                                
                                const translatedAquariumWaterType = t(`fish.values.${aquariumWaterType}`, { defaultValue: aquariumWaterType });
                                const translatedFishName = translateFishName(fishName);
                                const translatedRequiredWaterType = t(`fish.values.${requiredWaterType}`, { defaultValue: requiredWaterType });
                                
                                const template = t('waterTypeMismatch', { defaultValue: 'Niezgodność typu wody: akwarium %s, ryba %s wymaga %s.' });
                                msg = template.replace('%s', translatedAquariumWaterType).replace('%s', translatedFishName).replace('%s', translatedRequiredWaterType);
                              }
                              
                              // Tłumacz angielski format: "Water type mismatch: aquarium Freshwater, fish Mandarin Dragonet requires Saltwater."
                              const waterMismatchMatchEn = msg.match(/Water type mismatch:\s*aquarium\s+([^,]+),\s*fish\s+([^,]+)\s+requires\s+([^.]+)\./);
                              if (waterMismatchMatchEn) {
                                const aquariumWaterType = waterMismatchMatchEn[1].trim();
                                const fishName = waterMismatchMatchEn[2].trim();
                                const requiredWaterType = waterMismatchMatchEn[3].trim();
                                
                                const translatedAquariumWaterType = t(`fish.values.${aquariumWaterType}`, { defaultValue: aquariumWaterType });
                                const translatedFishName = translateFishName(fishName);
                                const translatedRequiredWaterType = t(`fish.values.${requiredWaterType}`, { defaultValue: requiredWaterType });
                                
                                const template = t('waterTypeMismatch', { defaultValue: 'Water type mismatch: aquarium %s, fish %s requires %s.' });
                                msg = template.replace('%s', translatedAquariumWaterType).replace('%s', translatedFishName).replace('%s', translatedRequiredWaterType);
                              }
                              
                              return msg;
                            })()}
                            {(issue.type === 'WATER_TYPE_MISMATCH' || issue.type === 'ENVIRONMENT_MISMATCH' || issue.type === 'PLASMOLYSIS_MISMATCH') && (
                              <Typography component="span" sx={{ 
                                display: 'block', 
                                mt: 0.5, 
                                fontSize: '0.75rem',
                                color: '#f44336',
                                fontStyle: 'italic'
                              }}>
                                {issue.type === 'PLASMOLYSIS_MISMATCH'
                                  ? t("plantMayNotSurvive", { defaultValue: "Roślina może nie przeżyć w takich warunkach" })
                                  : t("fishMayNotSurvive", { defaultValue: "Ryba może nie przeżyć w takich warunkach" })}
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                      ))}

                          {hiddenCount > 0 && (
                      <Typography variant="caption" sx={{
                        color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                        fontStyle: 'italic'
                      }}>
                        + {hiddenCount} {t("more", { defaultValue: "więcej" })}
                      </Typography>
                          )}
                        </>
                      );
                    })()}
                  </Box>
                  
                  {/* Włączniki mechanizmów */}
                  <Divider sx={{ my: 1.5, borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {/* Włącznik łańcucha pokarmowego */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={foodChainEnabled}
                          onChange={(e) => setFoodChainEnabled(e.target.checked)}
                          color="warning"
                          size="small"
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ 
                          fontSize: '0.8rem',
                          color: darkMode ? 'rgba(255,255,255,0.9)' : 'text.primary'
                        }}>
                          {t("foodChain", { defaultValue: "Łańcuch pokarmowy" })}
                        </Typography>
                      }
                      sx={{ 
                        m: 0,
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.8rem'
                        }
                      }}
                    />
                    {foodChainEnabled && (
                      <Typography variant="caption" sx={{ 
                        color: darkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary',
                        fontSize: '0.7rem',
                        display: 'block',
                        mt: 0.5,
                        ml: 4
                      }}>
                        {t("foodChainDescription", { defaultValue: "Agresywne ryby mogą zjeść spokojne" })}
                      </Typography>
                    )}
                    
                    {/* Włącznik szoku osmotycznego */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={osmoticShockEnabled}
                          onChange={(e) => setOsmoticShockEnabled(e.target.checked)}
                          color="error"
                          size="small"
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ 
                          fontSize: '0.8rem',
                          color: darkMode ? 'rgba(255,255,255,0.9)' : 'text.primary'
                        }}>
                          {t("osmoticShock", { defaultValue: "Szok osmotyczny" })}
                        </Typography>
                      }
                      sx={{ 
                        m: 0,
                        mt: 1,
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.8rem'
                        }
                      }}
                    />
                    {osmoticShockEnabled && (
                      <Typography variant="caption" sx={{ 
                        color: darkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary',
                        fontSize: '0.7rem',
                        display: 'block',
                        mt: 0.5,
                        ml: 4
                      }}>
                        {t("osmoticShockDescription", { defaultValue: "Ryby z niezgodnym typem wody zdychają" })}
                      </Typography>
                    )}

                    {/* Włącznik plazmolizy */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={plasmolysisEnabled}
                          onChange={(e) => setPlasmolysisEnabled(e.target.checked)}
                          color="error"
                          size="small"
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ 
                          fontSize: '0.8rem',
                          color: darkMode ? 'rgba(255,255,255,0.9)' : 'text.primary'
                        }}>
                          {t("plasmolysis", { defaultValue: "Plazmoliza (Plasmolysis)" })}
                        </Typography>
                      }
                      sx={{ 
                        m: 0,
                        mt: 1,
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.8rem'
                        }
                      }}
                    />
                    {plasmolysisEnabled && (
                      <Typography variant="caption" sx={{ 
                        color: darkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary',
                        fontSize: '0.7rem',
                        display: 'block',
                        mt: 0.5,
                        ml: 4
                      }}>
                        {t("plasmolysisDescription", { defaultValue: "Rośliny z niezgodnymi parametrami obumierają" })}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>
          )}
        </Box>
        );
      })()}

      {/* Ikony w dolnym lewym rogu do zwijania/rozwijania paneli */}
      <Box sx={{
        position: 'fixed',
        bottom: 80,
        left: 16,
        zIndex: 15,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        {/* Ikona ryb */}
        <IconButton
          onClick={() => setFishPanelExpanded(!fishPanelExpanded)}
          sx={{
            bgcolor: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            color: darkMode ? 'white' : 'inherit',
            width: 56,
            height: 56,
            boxShadow: 4,
            '&:hover': {
              bgcolor: darkMode ? 'rgba(50, 50, 50, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            }
          }}
        >
          <Typography sx={{ fontSize: '1.8rem' }}>🐟</Typography>
          {totalFishesCount > 0 && (
            <Box sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              bgcolor: '#f44336',
              color: 'white',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }}>
              {totalFishesCount}
            </Box>
          )}
        </IconButton>

        {/* Ikona roślin */}
        <IconButton
          onClick={() => setPlantPanelExpanded(!plantPanelExpanded)}
          sx={{
            bgcolor: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            color: darkMode ? 'white' : 'inherit',
            width: 56,
            height: 56,
            boxShadow: 4,
            '&:hover': {
              bgcolor: darkMode ? 'rgba(50, 50, 50, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            }
          }}
        >
          <Typography sx={{ fontSize: '1.8rem' }}>🌿</Typography>
          {totalPlantsCount > 0 && (
            <Box sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              bgcolor: '#4caf50',
              color: 'white',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }}>
              {totalPlantsCount}
            </Box>
          )}
        </IconButton>
      </Box>

      {/* Listy ryb i roślin - zwijane/rozwijane */}
      {aquarium && (
        <Box sx={{
          position: 'fixed',
          left: { xs: 80, sm: 90 },
          right: 0,
          bottom: 60,
          zIndex: 14,
          maxHeight: '40vh',
          overflowY: 'auto',
          px: 2,
          py: 1,
          transform: (fishPanelExpanded || plantPanelExpanded) ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease-in-out',
          pointerEvents: (fishPanelExpanded || plantPanelExpanded) ? 'auto' : 'none',
          opacity: (fishPanelExpanded || plantPanelExpanded) ? 1 : 0
        }}>
          <Grid container spacing={2}>
            {/* Lista ryb */}
            {fishPanelExpanded && (
              <Grid item xs={12} sm={6}>
                <Paper sx={{
                  p: 2,
                  bgcolor: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                      🐟 {t("fishes", { defaultValue: "Ryby" })} ({totalFishesCount})
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setFishPanelExpanded(false)}
                      sx={{ color: darkMode ? 'white' : 'inherit' }}
                    >
                      ✕
                    </IconButton>
                  </Box>
                  {aquarium.fishes && aquarium.fishes.length > 0 ? (
                    <List dense>
                      {aquarium.fishes.map((fish, index) => {
                        // Znajdź szczegóły ryby w dostępnych rybach
                        const fishDetails = availableFishes.find(f => f.id === fish.fishId);
                        const fishNameRaw = fishDetails?.name || `Ryba ${index + 1}`;
                        const fishName = translateSpeciesName(fishNameRaw, 'fish');
                        const fishCount = fish.count || 1;
                        
                        // Użyj unikalnego klucza - fishId + index, żeby uniknąć duplikatów
                        const uniqueKey = `${fish.fishId}-${index}`;
                        
                        return (
                          <ListItem
                            key={uniqueKey}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleRemoveFish(fish.fishId)}
                                size="small"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            }
                            sx={{
                              bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                              mb: 0.5,
                              borderRadius: 1
                            }}
                          >
                            <ListItemText
                              primary={fishCount > 1 ? `${fishName} (${fishCount})` : fishName}
                              secondary={null}
                              slotProps={{ primary: { sx: { fontSize: '0.875rem' } } }}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  ) : (
                    <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                      {t("noFishInAquarium", { defaultValue: "Brak ryb w akwarium" })}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )}

            {/* Lista roślin */}
            {plantPanelExpanded && (
              <Grid item xs={12} sm={6}>
                <Paper sx={{
                  p: 2,
                  bgcolor: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                      🌿 {t("plants", { defaultValue: "Rośliny" })} ({totalPlantsCount})
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setPlantPanelExpanded(false)}
                      sx={{ color: darkMode ? 'white' : 'inherit' }}
                    >
                      ✕
                    </IconButton>
                  </Box>
                  {aquarium.plants && aquarium.plants.length > 0 ? (
                    <List dense>
                      {aquarium.plants.map((plant, index) => {
                        // Znajdź szczegóły rośliny w dostępnych roślinach
                        const plantDetails = availablePlants.find(p => p.id === plant.plantId);
                        const plantNameRaw = plantDetails?.name || `Roślina ${index + 1}`;
                        const plantName = translateSpeciesName(plantNameRaw, 'plant');
                        const plantCount = plant.count || 1;
                        
                        // Użyj unikalnego klucza - plantId + index, żeby uniknąć duplikatów
                        const uniqueKey = `${plant.plantId}-${index}`;
                        
                        return (
                          <ListItem
                            key={uniqueKey}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleRemovePlant(plant.plantId)}
                                size="small"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            }
                            sx={{
                              bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                              mb: 0.5,
                              borderRadius: 1
                            }}
                          >
                            <ListItemText
                              primary={plantCount > 1 ? `${plantName} (${plantCount})` : plantName}
                              secondary={null}
                              slotProps={{ primary: { sx: { fontSize: '0.875rem' } } }}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  ) : (
                    <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                      {t("noPlantsInAquarium", { defaultValue: "Brak roślin w akwarium" })}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      )}


      {}
      <Box sx={{
        position: 'fixed', left: 0, right: 0, bottom: 0,
        display: 'flex', justifyContent: 'center', gap: 2,
        py: 1.5, px: 2,
        backdropFilter: 'blur(8px)',
        background: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255,255,255,0.6)',
        boxShadow: '0 -6px 16px rgba(0,0,0,0.2)',
        zIndex: 20
      }}>
        <Button variant="contained" onClick={() => setAddFishModalOpen(true)}>
          {t("addFish")}
        </Button>
        <Button variant="contained" onClick={() => setAddPlantModalOpen(true)}>
          {t("addPlant")}
        </Button>
      </Box>

      {}
      <Modal
        open={statisticsOpen}
        onClose={handleCloseStatistics}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Paper
          sx={{
            width: { xs: '95%', sm: '90%', md: '800px' },
            maxHeight: '90vh',
            overflow: 'auto',
            p: 3,
            bgcolor: darkMode ? 'rgba(30, 30, 30, 0.95)' : 'background.paper'
          }}
        >
          {}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: darkMode ? 'white' : 'inherit' }}>
              {t("statistics")} - {aquarium.name}
            </Typography>
            <Button onClick={handleCloseStatistics} variant="outlined" size="small">
              {t("close", { defaultValue: "Zamknij" })}
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {}
          {statistics ? (
            <Grid container spacing={3}>
              {}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: darkMode ? 'white' : 'inherit' }}>
                  {t("statsDesc", { defaultValue: "Podsumowanie" })}
                </Typography>
                
                <Grid container spacing={2} sx={{ display: 'flex' }}>
                  {}
                  <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(46, 127, 169, 0.1)',
                        width: '100%',
                        height: '100%',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="h4" sx={{ color: darkMode ? 'white' : '#2e7fa9', fontWeight: 600 }}>
                        {statistics.totalFishes}
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                        🐟 {t("fishes", { defaultValue: "Ryb" })}
                      </Typography>
                    </Paper>
                  </Grid>

                  {}
                  <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(76, 175, 80, 0.1)',
                        width: '100%',
                        height: '100%',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="h4" sx={{ color: darkMode ? 'white' : '#4caf50', fontWeight: 600 }}>
                        {statistics.totalPlants}
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                        🌿 {t("plants", { defaultValue: "Roślin" })}
                      </Typography>
                    </Paper>
                  </Grid>

                  {}
                  <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(156, 39, 176, 0.1)',
                        width: '100%',
                        height: '100%',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="h4" sx={{ color: darkMode ? 'white' : '#9c27b0', fontWeight: 600 }}>
                        {statistics.fishSpeciesCount}
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                        {t("fishSpecies", { defaultValue: "Gatunków ryb" })}
                      </Typography>
                    </Paper>
                  </Grid>

                  {}
                  <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(76, 175, 80, 0.2)',
                        width: '100%',
                        height: '100%',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="h4" sx={{ color: darkMode ? 'white' : '#4caf50', fontWeight: 600 }}>
                        {statistics.plantSpeciesCount}
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                        {t("plantSpecies", { defaultValue: "Gatunków roślin" })}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>

              {}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, color: darkMode ? 'white' : 'inherit' }}>
                  {t("fishDistribution", { defaultValue: "Rozkład gatunków ryb" })}
                </Typography>
                
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(0, 0, 0, 0.02)'
                  }}
                >
                  {statistics.fishSpeciesData.length > 0 ? (
                    <Box>
                      {}
                      {statistics.fishSpeciesData.map((item, index) => {
                        
                        const colors = ['#2e7fa9', '#4caf50', '#ff9800', '#9c27b0', '#f44336', '#00bcd4'];
                        const color = colors[index % colors.length];
                        
                        return (
                          <Box key={item.species} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                                {translateSpeciesName(item.species, 'fish')}:
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: darkMode ? 'white' : 'inherit' }}>
                                {item.count} ({item.percentage.toFixed(1)}%)
                              </Typography>
                            </Box>
                            
                            {}
                            <Box
                              sx={{
                                width: '100%',
                                height: 20,
                                bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                borderRadius: 1,
                                overflow: 'hidden'
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${item.percentage}%`,
                                  height: '100%',
                                  bgcolor: color,
                                  transition: 'width 0.5s ease-in-out'
                                }}
                              />
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary', textAlign: 'center' }}>
                      {t("noFishInAquarium", { defaultValue: "Brak ryb w akwarium" })}
                    </Typography>
                  )}
                </Paper>
              </Grid>

              {}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, color: darkMode ? 'white' : 'inherit' }}>
                  {t("plantDistribution", { defaultValue: "Rozkład gatunków roślin" })}
                </Typography>
                
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(0, 0, 0, 0.02)'
                  }}
                >
                  {statistics.plantSpeciesData.length > 0 ? (
                    <Box>
                      {statistics.plantSpeciesData.map((item, index) => {
                        const colors = ['#4caf50', '#2e7fa9', '#ff9800', '#9c27b0', '#f44336', '#00bcd4'];
                        const color = colors[index % colors.length];
                        
                        return (
                          <Box key={item.species} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                                {translateSpeciesName(item.species, 'plant')}:
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: darkMode ? 'white' : 'inherit' }}>
                                {item.count} ({item.percentage.toFixed(1)}%)
                              </Typography>
                            </Box>
                            
                            <Box
                              sx={{
                                width: '100%',
                                height: 20,
                                bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                borderRadius: 1,
                                overflow: 'hidden'
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${item.percentage}%`,
                                  height: '100%',
                                  bgcolor: color,
                                  transition: 'width 0.5s ease-in-out'
                                }}
                              />
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary', textAlign: 'center' }}>
                      {t("noPlantsInAquarium", { defaultValue: "Brak roślin w akwarium" })}
                    </Typography>
                  )}
                </Paper>
              </Grid>

              {}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: darkMode ? 'white' : 'inherit' }}>
                  {t("mostCommonSpecies", { defaultValue: "Najliczniejszy gatunek" })}
                </Typography>
                
                <Grid container spacing={2} sx={{ display: 'flex' }}>
                  {}
                  <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(46, 127, 169, 0.1)',
                        textAlign: 'center',
                        width: '100%',
                        height: '100%',
                        minHeight: '180px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="body1" sx={{ mb: 2, color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                        🐟 {t("fishes", { defaultValue: "Ryb" })}
                      </Typography>
                      {statistics.mostCommonFish ? (
                        <>
                          <Typography variant="h5" sx={{ color: darkMode ? 'white' : '#2e7fa9', fontWeight: 600, mb: 1 }}>
                            {translateSpeciesName(statistics.mostCommonFish.species, 'fish')}: {statistics.mostCommonFish.count}
                          </Typography>
                          <Typography variant="h6" sx={{ color: darkMode ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}>
                            {t("pieces", { defaultValue: "sztuk" })} ({statistics.mostCommonFish.percentage.toFixed(1)}%)
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                          {t("noFishInAquarium", { defaultValue: "Brak ryb" })}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>

                  {}
                  <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(76, 175, 80, 0.1)',
                        textAlign: 'center',
                        width: '100%',
                        height: '100%',
                        minHeight: '180px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="body1" sx={{ mb: 2, color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                        🌿 {t("plants", { defaultValue: "Roślin" })}
                      </Typography>
                      {statistics.mostCommonPlant ? (
                        <>
                          <Typography variant="h5" sx={{ color: darkMode ? 'white' : '#4caf50', fontWeight: 600, mb: 1 }}>
                            {translateSpeciesName(statistics.mostCommonPlant.species, 'plant')}: {statistics.mostCommonPlant.count}
                          </Typography>
                          <Typography variant="h6" sx={{ color: darkMode ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}>
                            {t("pieces", { defaultValue: "sztuk" })} ({statistics.mostCommonPlant.percentage.toFixed(1)}%)
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                          {t("noPlantsInAquarium", { defaultValue: "Brak roślin" })}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          )}
        </Paper>
      </Modal>

      {/* Modal dodawania ryby */}
      <Modal
        open={addFishModalOpen}
        onClose={() => {
          setAddFishModalOpen(false);
          setSelectedFishId("");
          setPreviewFishId("");
          setFishQuantity(1);
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Paper sx={{
          width: { xs: '90%', sm: 500 },
          maxHeight: '90vh',
          overflow: 'auto',
          p: 3,
          bgcolor: darkMode ? 'rgba(30, 30, 30, 0.95)' : 'background.paper'
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: darkMode ? 'white' : 'inherit' }}>
            {t("addFish", { defaultValue: "Dodaj rybę" })}
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t("selectFish", { defaultValue: "Wybierz rybę" })}</InputLabel>
            <Select
              value={selectedFishId}
              label={t("selectFish", { defaultValue: "Wybierz rybę" })}
              onChange={(e) => {
                setSelectedFishId(e.target.value);
                setPreviewFishId(e.target.value);
              }}
              onOpen={() => setIsFishSelectOpen(true)}
              onClose={() => {
                setIsFishSelectOpen(false);
                setPreviewFishId("");
              }}
              variant="outlined"
            >
              {(() => {
                // Filtruj ryby według kompatybilności, jeśli opcja jest włączona
                let fishesToShow;
                if (showCompatibilityFilter && aquarium?.fishes && aquarium.fishes.length > 0) {
                  const filtered = filterCompatibleFishes(availableFishes, aquarium.fishes, aquarium);
                  // Pokaż kompatybilne i z ostrzeżeniami, ale oznacz niekompatybilne
                  // Użyj Set do uniknięcia duplikatów
                  const fishMap = new Map();
                  
                  // Najpierw dodaj kompatybilne
                  filtered.compatible.forEach(item => {
                    if (!fishMap.has(item.fish.id)) {
                      fishMap.set(item.fish.id, { ...item.fish, _compatible: true, _hasWarning: false });
                    }
                  });
                  
                  // Potem dodaj z ostrzeżeniami (nadpiszą jeśli były w compatible)
                  filtered.warnings.forEach(item => {
                    fishMap.set(item.fish.id, { ...item.fish, _compatible: true, _hasWarning: true });
                  });
                  
                  // Na końcu dodaj niekompatybilne
                  filtered.incompatible.forEach(item => {
                    fishMap.set(item.fish.id, { ...item.fish, _compatible: false, _hasWarning: false });
                  });
                  
                  fishesToShow = Array.from(fishMap.values());
                } else {
                  // Jeśli nie filtrujemy, pokaż wszystkie
                  fishesToShow = availableFishes.map(fish => ({ ...fish, _compatible: true, _hasWarning: false }));
                }
                
                return fishesToShow.map((fish) => {
                  const isIncompatible = fish._compatible === false;
                  const hasWarning = fish._hasWarning === true;
                  return (
                    <MenuItem 
                      key={`fish-${fish.id}`} 
                      value={fish.id}
                      onMouseEnter={() => {
                        if (isFishSelectOpen) setPreviewFishId(fish.id);
                      }}
                      onMouseLeave={() => {
                        if (isFishSelectOpen) setPreviewFishId(selectedFishId);
                      }}
                      sx={{
                        ...(isIncompatible && {
                          bgcolor: 'rgba(244, 67, 54, 0.1)',
                          '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' }
                        }),
                        ...(hasWarning && !isIncompatible && {
                          bgcolor: 'rgba(255, 152, 0, 0.1)',
                          '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.2)' }
                        })
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                        {isIncompatible && <Typography sx={{ color: 'error.main' }}>⚠️</Typography>}
                        {hasWarning && !isIncompatible && <Typography sx={{ color: 'warning.main' }}>⚡</Typography>}
                        <Typography sx={{ flex: 1 }}>{translateSpeciesName(fish.name, 'fish')}</Typography>
                        {isIncompatible && (
                          <Typography variant="caption" sx={{ color: 'error.main', fontSize: '0.7rem' }}>
                            {t("incompatible", { defaultValue: "Niekompatybilne" })}
                          </Typography>
                        )}
                        {hasWarning && !isIncompatible && (
                          <Typography variant="caption" sx={{ color: 'warning.main', fontSize: '0.7rem' }}>
                            {t("warning", { defaultValue: "Ostrzeżenie" })}
                          </Typography>
                        )}
                      </Box>
                    </MenuItem>
                  );
                });
              })()}
            </Select>
          </FormControl>

          {(() => {
            const fishToShow =
              availableFishes.find((f) => String(f.id) === String(previewFishId || selectedFishId)) || null;

            if (!fishToShow) return null;

            const temperature = fishToShow.temperature ?? "-";
            const ph = fishToShow.ph ?? "-";
            const hardness = fishToShow.hardnessDGH ?? "-";
            const biotope = fishToShow.biotope ?? fishToShow.biotype ?? "-";
            const temperament = fishToShow.temperament ?? "-";
            const minSchool =
              fishToShow.minShoalSize ?? fishToShow.minSchoolSize ?? "-";
            const translatedTemperament = t(`fish.temperament.${temperament}`, { defaultValue: temperament });

            return (
              <Box
                sx={{
                  mb: 2,
                  p: 1.5,
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: darkMode ? "rgba(255,255,255,0.15)" : "divider",
                  bgcolor: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                }}
              >
                <Typography sx={{ fontWeight: 700, mb: 0.5, color: darkMode ? "white" : "text.primary" }}>
                  {t("selectedFishParameters", { defaultValue: "Parametry wybranej ryby" })}
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? "rgba(255,255,255,0.85)" : "text.secondary" }}>
                  {t("fish.parameters.temperature", { defaultValue: "Temperatura" })}: <strong>{temperature}</strong> °C
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? "rgba(255,255,255,0.85)" : "text.secondary" }}>
                  {t("fish.parameters.ph", { defaultValue: "pH" })}: <strong>{ph}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? "rgba(255,255,255,0.85)" : "text.secondary" }}>
                  {t("fish.parameters.hardness", { defaultValue: "Twardość" })}: <strong>{hardness}</strong> dGH
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? "rgba(255,255,255,0.85)" : "text.secondary" }}>
                  {t("fish.parameters.biotope", { defaultValue: "Biotyp" })}: <strong>{biotope}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? "rgba(255,255,255,0.85)" : "text.secondary" }}>
                  {t("fish.parameters.temperament", { defaultValue: "Usposobienie" })}: <strong>{translatedTemperament}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? "rgba(255,255,255,0.85)" : "text.secondary" }}>
                  {t("fish.parameters.minSchoolSize", { defaultValue: "Stado (min)" })}: <strong>{minSchool}</strong>
                </Typography>
              </Box>
            );
          })()}

          {/* Wyświetl ostrzeżenia kompatybilności - tylko gdy checkbox "Pokaż ostrzeżenia" jest zaznaczony */}
          {showCompatibilityFilter && compatibilityIssues.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 700, mb: 0.5, color: darkMode ? "white" : "text.primary" }}>
                {t("compatibilityIssues", { defaultValue: "Problemy z kompatybilnością" })}
              </Typography>
              {compatibilityIssues.map((issue, index) => (
                <Alert 
                  key={index}
                  severity={issue.severity === "ERROR" ? "error" : "warning"}
                  sx={{ mb: 1 }}
                >
                  {(() => {
                    let msg = issue.message || '';
                    
                    // Użyj uniwersalnej funkcji translateSpeciesName
                    const translateFishName = (name) => translateSpeciesName(name, 'fish');
                    
                    // Format 1: "Ostrzeżenie: Nazwa1, Nazwa2 (agresywne) nie mogą być z Nazwa3 (spokojne)..."
                    const aggressiveMatch = msg.match(/(Ostrzeżenie|Warning):\s*([^(]+)\s*\(([^)]+)\)/);
                    const peacefulMatch = msg.match(/(nie mogą być z|cannot be with)\s*([^(]+)\s*\(([^)]+)\)/);
                    
                    if (aggressiveMatch) {
                      const fishNames = aggressiveMatch[2].split(',').map(translateFishName);
                      const temperament = aggressiveMatch[3].trim();
                      const translatedTemperament = t(`fish.temperament.${temperament}`, { defaultValue: temperament });
                      const warningText = t('warning', { defaultValue: 'Ostrzeżenie' });
                      msg = msg.replace(aggressiveMatch[0], `${warningText}: ${fishNames.join(', ')} (${translatedTemperament})`);
                    }
                    
                    if (peacefulMatch) {
                      const peacefulNames = peacefulMatch[2].split(',').map(translateFishName);
                      const temperament = peacefulMatch[3].trim();
                      const translatedTemperament = t(`fish.temperament.${temperament}`, { defaultValue: temperament });
                      const cannotBeWithText = t('cannotBeWith', { defaultValue: 'nie mogą być z' });
                      msg = msg.replace(peacefulMatch[0], `${cannotBeWithText} ${peacefulNames.join(', ')} (${translatedTemperament})`);
                    }
                    
                    // Format 2: "Nazwa1 (agresywne) nie może być z Nazwa2 (spokojne)..."
                    const oldFormatMatch = msg.match(/([A-ZĄĆĘŁŃÓŚŹŻ][^(]+)\s*\(([^)]+)\)\s*(nie może być z|cannot be with)\s*([A-ZĄĆĘŁŃÓŚŹŻ][^(]+)\s*\(([^)]+)\)/);
                    if (oldFormatMatch) {
                      const fish1 = translateFishName(oldFormatMatch[1].trim());
                      const temp1 = t(`fish.temperament.${oldFormatMatch[2].trim()}`, { defaultValue: oldFormatMatch[2].trim() });
                      const fish2 = translateFishName(oldFormatMatch[4].trim());
                      const temp2 = t(`fish.temperament.${oldFormatMatch[5].trim()}`, { defaultValue: oldFormatMatch[5].trim() });
                      const cannotBeWithText = t('cannotBeWith', { defaultValue: 'nie mogą być z' });
                      msg = msg.replace(oldFormatMatch[0], `${fish1} (${temp1}) ${cannotBeWithText} ${fish2} (${temp2})`);
                    }
                    
                    // Format 3: "Nazwa1 i Nazwa2 (oba agresywne, różne gatunki)..."
                    const bothAggressiveMatch = msg.match(/([A-ZĄĆĘŁŃÓŚŹŻ][^i]+)\s*i\s*([A-ZĄĆĘŁŃÓŚŹŻ][^(]+)\s*\(oba\s+([^,]+),\s*różne\s+gatunki\)/);
                    if (bothAggressiveMatch) {
                      const fish1 = translateFishName(bothAggressiveMatch[1].trim());
                      const fish2 = translateFishName(bothAggressiveMatch[2].trim());
                      const temp = t(`fish.temperament.${bothAggressiveMatch[3].trim()}`, { defaultValue: bothAggressiveMatch[3].trim() });
                      msg = msg.replace(bothAggressiveMatch[0], `${fish1} i ${fish2} (oba ${temp}, różne gatunki)`);
                    }
                    
                    // Tłumacz "Ostrzeżenie" / "Warning" na początku komunikatu
                    msg = msg.replace(/^Ostrzeżenie:/, `${t('warning', { defaultValue: 'Ostrzeżenie' })}:`);
                    msg = msg.replace(/^Warning:/, `${t('warning', { defaultValue: 'Ostrzeżenie' })}:`);
                    
                    // Tłumacz "nie mogą być z" / "cannot be with"
                    msg = msg.replace(/nie mogą być z/g, t('cannotBeWith', { defaultValue: 'nie mogą być z' }));
                    msg = msg.replace(/cannot be with/g, t('cannotBeWith', { defaultValue: 'nie mogą być z' }));
                    
                    // Tłumacz wszystkie fragmenty tekstu (case-insensitive, z kropką lub bez)
                    msg = msg.replace(/konflikt może spowodować pożarcie łagodnego osobnika\.?/gi, t('conflictMayCauseEating', { defaultValue: 'konflikt może spowodować pożarcie łagodnego osobnika' }));
                    msg = msg.replace(/conflict may cause the peaceful individual to be eaten\.?/gi, t('conflictMayCauseEating', { defaultValue: 'konflikt może spowodować pożarcie łagodnego osobnika' }));
                    msg = msg.replace(/wymagają dodatkowego sprawdzenia/g, t('conflictMayCauseEating', { defaultValue: 'konflikt może spowodować pożarcie łagodnego osobnika' }));
                    msg = msg.replace(/wymaga dodatkowego sprawdzenia/g, t('conflictMayCauseEating', { defaultValue: 'konflikt może spowodować pożarcie łagodnego osobnika' }));
                    msg = msg.replace(/Ryba spokojna może zostać pożarta/g, t('peacefulFishMayBeEaten', { defaultValue: 'Ryba spokojna może zostać pożarta' }));
                    msg = msg.replace(/Peaceful fish may be eaten/g, t('peacefulFishMayBeEaten', { defaultValue: 'Ryba spokojna może zostać pożarta' }));
                    
                    // Tłumacz temperamenty, które mogą być już w tekście
                    msg = msg.replace(/\b(agresywne|spokojne|pół-agresywne|aggressive|peaceful|semi-aggressive)\b/g, (match) => {
                      const map = {
                        'agresywne': t('fish.temperament.agresywne', { defaultValue: 'agresywne' }),
                        'spokojne': t('fish.temperament.spokojne', { defaultValue: 'spokojne' }),
                        'pol_agresywne': t('fish.temperament.pol_agresywne', { defaultValue: 'pół-agresywne' }),
                        'aggressive': t('fish.temperament.agresywne', { defaultValue: 'agresywne' }),
                        'peaceful': t('fish.temperament.spokojne', { defaultValue: 'spokojne' }),
                        'semi-aggressive': t('fish.temperament.pol_agresywne', { defaultValue: 'pół-agresywne' })
                      };
                      return map[match] || match;
                    });
                    
                    return msg;
                  })()}
                </Alert>
              ))}
            </Box>
          )}

          <TextField
            fullWidth
            type="number"
            label={t("quantity", { defaultValue: "Ilość" })}
            value={fishQuantity}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              const MAX_FISH_LIMIT = 25;
              const currentFishesCount = aquarium?.fishes 
                ? aquarium.fishes.reduce((sum, fish) => sum + (fish.count || 1), 0)
                : 0;
              const maxAllowed = Math.max(1, MAX_FISH_LIMIT - currentFishesCount);
              const clampedValue = Math.max(1, Math.min(value, maxAllowed));
              setFishQuantity(clampedValue);
            }}
            slotProps={{
              input: {
                min: 1,
                max: aquarium?.fishes 
                  ? Math.max(1, 25 - aquarium.fishes.reduce((sum, fish) => sum + (fish.count || 1), 0))
                  : 25
              }
            }}
            helperText={(() => {
              const limit = 25;
              if (!aquarium?.fishes) return t("fishFill", { defaultValue: "Zapełnienie: (limit: {{limit}} ryb, aktualnie: {{current}})", limit, current: 0 });
              const currentCount = aquarium.fishes.reduce((sum, fish) => sum + (fish.count || 1), 0);
              return t("fishFill", { defaultValue: "Zapełnienie: (limit: {{limit}} ryb, aktualnie: {{current}})", limit, current: Math.min(currentCount, limit) });
            })()}
            sx={{ mb: 3 }}
          />

          {/* Opcja filtrowania kompatybilnych ryb */}
          {aquarium?.fishes && aquarium.fishes.length > 0 && (
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <input
                type="checkbox"
                id="compatibilityFilter"
                checked={showCompatibilityFilter}
                onChange={(e) => setShowCompatibilityFilter(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="compatibilityFilter" style={{ cursor: 'pointer', fontSize: '0.875rem', color: darkMode ? 'white' : 'inherit' }}>
                {t("showWarnings", { defaultValue: "Pokaż ostrzeżenia" })}
              </label>
            </Box>
          )}

          {/* Panel z rekomendowanymi gatunkami */}
          {aquarium?.fishes && aquarium.fishes.length > 0 && (() => {
            const recommendations = getRecommendedFishes(availableFishes, aquarium, aquarium.fishes);
            const hasRecommendations = recommendations.perfect.length > 0 || recommendations.good.length > 0 || recommendations.withWarning.length > 0;
            
            if (!hasRecommendations) return null;

            return (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: darkMode ? 'white' : 'inherit' }}>
                  {t("recommendedSpecies", { defaultValue: "Rekomendowane gatunki" })}
                </Typography>

                {recommendations.perfect.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600, display: 'block', mb: 1 }}>
                      ✓ {t("perfectMatch", { defaultValue: "Idealnie pasujące" })} (90-100%)
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {recommendations.perfect.map((rec) => (
                        <Card
                          key={rec.fish.id}
                          sx={{
                            cursor: 'pointer',
                            bgcolor: darkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)',
                            border: '1px solid',
                            borderColor: 'success.main',
                            '&:hover': {
                              bgcolor: darkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)'
                            }
                          }}
                          onClick={() => setSelectedFishId(rec.fish.id.toString())}
                        >
                          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? 'white' : 'inherit' }}>
                                {translateSpeciesName(rec.fish.name, 'fish')}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                                {rec.matchScore}%
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}

                {recommendations.good.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 600, display: 'block', mb: 1 }}>
                      ✓ {t("goodMatch", { defaultValue: "Dobrze pasujące" })} (70-89%)
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {recommendations.good.map((rec) => (
                        <Card
                          key={rec.fish.id}
                          sx={{
                            cursor: 'pointer',
                            bgcolor: darkMode ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)',
                            border: '1px solid',
                            borderColor: 'info.main',
                            '&:hover': {
                              bgcolor: darkMode ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)'
                            }
                          }}
                          onClick={() => setSelectedFishId(rec.fish.id.toString())}
                        >
                          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? 'white' : 'inherit' }}>
                                {translateSpeciesName(rec.fish.name, 'fish')}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 600 }}>
                                {rec.matchScore}%
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}

                {recommendations.withWarning.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 600, display: 'block', mb: 1 }}>
                      ⚡ {t("matchWithWarning", { defaultValue: "Pasujące z ostrzeżeniem" })}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {recommendations.withWarning.map((rec) => (
                        <Card
                          key={rec.fish.id}
                          sx={{
                            cursor: 'pointer',
                            bgcolor: darkMode ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 152, 0, 0.05)',
                            border: '1px solid',
                            borderColor: 'warning.main',
                            '&:hover': {
                              bgcolor: darkMode ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)'
                            }
                          }}
                          onClick={() => setSelectedFishId(rec.fish.id.toString())}
                        >
                          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? 'white' : 'inherit' }}>
                                {translateSpeciesName(rec.fish.name, 'fish')}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 600 }}>
                                {rec.matchScore}%
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            );
          })()}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={() => {
              setAddFishModalOpen(false);
              setSelectedFishId("");
              setFishQuantity(1);
              setCompatibilityIssues([]);
            }}>
              {t("cancel", { defaultValue: "Anuluj" })}
            </Button>
            <Button
              variant="contained"
              onClick={handleAddFish}
              disabled={!selectedFishId || isAddingFish}
              color={compatibilityIssues.some(issue => issue.severity === "ERROR") ? "error" : "primary"}
            >
              {isAddingFish ? <CircularProgress size={20} /> : t("add", { defaultValue: "Dodaj" })}
            </Button>
          </Box>
        </Paper>
      </Modal>

      {/* Modal dodawania rośliny */}
      <Modal
        open={addPlantModalOpen}
        onClose={() => {
          setAddPlantModalOpen(false);
          setSelectedPlantId("");
          setPreviewPlantId("");
          setPlantQuantity(1);
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Paper sx={{
          width: { xs: '90%', sm: 500 },
          maxHeight: '90vh',
          overflow: 'auto',
          p: 3,
          bgcolor: darkMode ? 'rgba(30, 30, 30, 0.95)' : 'background.paper'
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: darkMode ? 'white' : 'inherit' }}>
            {t("addPlant", { defaultValue: "Dodaj roślinę" })}
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t("selectPlant", { defaultValue: "Wybierz roślinę" })}</InputLabel>
            <Select
              value={selectedPlantId}
              label={t("selectPlant", { defaultValue: "Wybierz roślinę" })}
              onChange={(e) => {
                setSelectedPlantId(e.target.value);
                setPreviewPlantId(String(e.target.value));
              }}
              onOpen={() => setIsPlantSelectOpen(true)}
              onClose={() => {
                setIsPlantSelectOpen(false);
                setPreviewPlantId("");
              }}
              variant="outlined"
            >
              {availablePlants.map((plant) => (
                <MenuItem
                  key={plant.id}
                  value={plant.id}
                  onMouseEnter={() => {
                    if (isPlantSelectOpen) setPreviewPlantId(String(plant.id));
                  }}
                  onMouseLeave={() => {
                    if (isPlantSelectOpen) setPreviewPlantId("");
                  }}
                >
                  {translateSpeciesName(plant.name, 'plant')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(() => {
            const id = previewPlantId || selectedPlantId;
            const selectedPlant = availablePlants.find((p) => String(p.id) === String(id));
            if (!selectedPlant) return null;

            const plantTemperature = selectedPlant.temperature ?? null;
            const plantPh = selectedPlant.ph ?? null;
            const plantHardness = selectedPlant.hardnessDGH ?? selectedPlant.hardness ?? null;
            const plantBiotope = selectedPlant.biotope ?? null;

            return (
              <Box
                sx={{
                  mb: 2,
                  p: 1.5,
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: darkMode ? "rgba(255,255,255,0.15)" : "divider",
                  bgcolor: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    mb: 0.5,
                    color: darkMode ? "white" : "text.primary"
                  }}
                >
                  {t("selectedPlantParameters", { defaultValue: "Parametry wybranej rośliny" })}
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? "rgba(255,255,255,0.85)" : "text.secondary" }}>
                  {t("plant.parameters.temperature", { defaultValue: "Temperatura" })}: <strong>{plantTemperature ?? "-"}</strong> °C
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? "rgba(255,255,255,0.85)" : "text.secondary" }}>
                  {t("plant.parameters.ph", { defaultValue: "pH" })}: <strong>{plantPh ?? "-"}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? "rgba(255,255,255,0.85)" : "text.secondary" }}>
                  {t("plant.parameters.hardness", { defaultValue: "Twardość" })}: <strong>{plantHardness ?? "-"}</strong> dGH
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? "rgba(255,255,255,0.85)" : "text.secondary" }}>
                  {t("plant.parameters.biotope", { defaultValue: "Biotyp" })}: <strong>{plantBiotope ? t(`plant.biotopes.${plantBiotope}`, { defaultValue: plantBiotope }) : "-"}</strong>
                </Typography>
              </Box>
            );
          })()}

          {/* Ostrzeżenia kompatybilności roślin (plazmoliza) */}
          {showCompatibilityFilter && plantCompatibilityIssues.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 700, mb: 0.5, color: darkMode ? "white" : "text.primary" }}>
                {t("compatibilityIssues", { defaultValue: "Problemy z kompatybilnością" })}
              </Typography>
              {plantCompatibilityIssues.map((issue, index) => (
                <Alert
                  key={index}
                  severity={issue.severity === "ERROR" ? "error" : "warning"}
                  sx={{ mb: 1 }}
                >
                  {issue.message}
                </Alert>
              ))}
            </Box>
          )}

          <TextField
            fullWidth
            type="number"
            label={t("quantity", { defaultValue: "Ilość" })}
            value={plantQuantity}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              const MAX_PLANT_LIMIT = 50;
              const currentPlantsCount = aquarium?.plants 
                ? aquarium.plants.reduce((sum, plant) => sum + (plant.count || 1), 0)
                : 0;
              const maxAllowed = Math.max(1, MAX_PLANT_LIMIT - currentPlantsCount);
              const clampedValue = Math.max(1, Math.min(value, maxAllowed));
              setPlantQuantity(clampedValue);
            }}
            slotProps={{
              input: {
                min: 1,
                max: aquarium?.plants 
                  ? Math.max(1, 50 - aquarium.plants.reduce((sum, plant) => sum + (plant.count || 1), 0))
                  : 50
              }
            }}
            helperText={(() => {
              const limit = 50;
              const currentCount = aquarium?.plants ? aquarium.plants.reduce((sum, plant) => sum + (plant.count || 1), 0) : 0;
              const remaining = Math.max(0, limit - currentCount);

              return t("plantFill", {
                defaultValue: "Maksymalnie {{remaining}} więcej (limit: {{limit}} roślin, aktualnie: {{current}})",
                remaining,
                limit,
                current: currentCount
              });
            })()}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={() => {
              setAddPlantModalOpen(false);
              setSelectedPlantId("");
              setPreviewPlantId("");
              setPlantQuantity(1);
            }}>
              {t("cancel", { defaultValue: "Anuluj" })}
            </Button>
            <Button
              variant="contained"
              onClick={handleAddPlant}
              disabled={!selectedPlantId || isAddingPlant}
            >
              {isAddingPlant ? <CircularProgress size={20} /> : t("add", { defaultValue: "Dodaj" })}
            </Button>
          </Box>
        </Paper>
      </Modal>

      {/* Powiadomienie o śmierci ryby */}
      <Snackbar
        open={deathNotification !== null}
        autoHideDuration={6000}
        onClose={() => setDeathNotification(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: '80px' }}
      >
        <Alert 
          onClose={() => setDeathNotification(null)} 
          severity={deathNotification?.severity || 'error'}
          sx={{ width: '100%' }}
        >
          {deathNotification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

