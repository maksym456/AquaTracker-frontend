"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Box, Button, Typography, Modal, Paper, Grid, Divider, CircularProgress, Alert, TextField, List, ListItem, ListItemText, IconButton, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Snackbar } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "../../contexts/ThemeContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import { getAquariumById, addFishToAquarium, removeFishFromAquarium, addPlantToAquarium, removePlantFromAquarium, getFishes, getPlants } from "../../lib/api";
import { checkFishCompatibilityWithAquarium, filterCompatibleFishes } from "../../lib/fishCompatibility";

export default function AquariumDetailPage() {
  
  const { t, i18n } = useTranslation();
  
  // Uniwersalna funkcja do tłumaczenia nazw ryb i roślin (działa dwukierunkowo: polski ↔ angielski)
  const translateSpeciesName = (name, type = 'fish') => {
    if (!name) return name;
    
    const currentLanguage = i18n.language || 'en';
    const isEnglish = currentLanguage === 'en';
    
    let trimmed = name.trim();
    // Obsłuż nazwy z nawiasami, np. "Pyszczak (Malawi)" lub "Malawi Cichlid (Malawi)"
    let namePart = trimmed;
    let bracketPart = '';
    const bracketMatch = trimmed.match(/^(.+?)\s*\(([^)]+)\)$/);
    if (bracketMatch) {
      namePart = bracketMatch[1].trim();
      bracketPart = bracketMatch[2].trim();
    }
    
    // Pobierz wszystkie gatunki
    const allSpecies = t(`${type}.species`, { returnObjects: true });
    if (!allSpecies || typeof allSpecies !== 'object') {
      // Jeśli nie ma tłumaczeń, zwróć oryginalną nazwę (bez polskich nazw w nawiasach dla angielskiego)
      return isEnglish ? namePart : (bracketPart ? `${namePart} (${bracketPart})` : namePart);
    }
    
    // 1. Sprawdź czy namePart jest kluczem (polska nazwa)
    if (allSpecies[namePart]) {
      const translated = t(`${type}.species.${namePart}.name`, { defaultValue: namePart });
      // Dla wersji angielskiej nie dodawaj polskich nazw w nawiasach
      // Dodaj bracketPart tylko jeśli to nie jest polska nazwa (np. "Malawi" w "Pyszczak (Malawi)")
      if (isEnglish) {
        // Sprawdź czy bracketPart to część nazwy gatunku czy dodatkowa informacja
        const isBracketPartSpeciesName = Object.keys(allSpecies).some(key => 
          key.toLowerCase().includes(bracketPart.toLowerCase()) || 
          bracketPart.toLowerCase().includes(key.toLowerCase())
        );
        return isBracketPartSpeciesName ? translated : (bracketPart ? `${translated} (${bracketPart})` : translated);
      }
      return bracketPart ? `${translated} (${bracketPart})` : translated;
    }
    
    // 2. Sprawdź czy namePart jest wartością name (angielska nazwa) - znajdź odpowiedni klucz
    const foundKey = Object.keys(allSpecies).find(key => {
      const speciesName = t(`${type}.species.${key}.name`, { defaultValue: key });
      return speciesName === namePart || speciesName.toLowerCase() === namePart.toLowerCase();
    });
    
    if (foundKey) {
      const translated = t(`${type}.species.${foundKey}.name`, { defaultValue: namePart });
      // Dla wersji angielskiej nie dodawaj polskich nazw w nawiasach
      if (isEnglish) {
        const isBracketPartSpeciesName = Object.keys(allSpecies).some(key => 
          key.toLowerCase().includes(bracketPart.toLowerCase()) || 
          bracketPart.toLowerCase().includes(key.toLowerCase())
        );
        return isBracketPartSpeciesName ? translated : (bracketPart ? `${translated} (${bracketPart})` : translated);
      }
      return bracketPart ? `${translated} (${bracketPart})` : translated;
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
      const translated = t(`${type}.species.${foundKeyPartial}.name`, { defaultValue: namePart });
      // Dla wersji angielskiej nie dodawaj polskich nazw w nawiasach
      if (isEnglish) {
        const isBracketPartSpeciesName = Object.keys(allSpecies).some(key => 
          key.toLowerCase().includes(bracketPart.toLowerCase()) || 
          bracketPart.toLowerCase().includes(key.toLowerCase())
        );
        return isBracketPartSpeciesName ? translated : (bracketPart ? `${translated} (${bracketPart})` : translated);
      }
      return bracketPart ? `${translated} (${bracketPart})` : translated;
    }
    
    // Jeśli nie znaleziono, zwróć oryginalną nazwę (bez polskich nazw w nawiasach dla angielskiego)
    return isEnglish ? namePart : (bracketPart ? `${namePart} (${bracketPart})` : namePart);
  };

  const { darkMode } = useTheme();

  const router = useRouter();

  const params = useParams();
  const aquariumId = params?.id;

  const [aquarium, setAquarium] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [statisticsOpen, setStatisticsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addFishModalOpen, setAddFishModalOpen] = useState(false);
  const [addPlantModalOpen, setAddPlantModalOpen] = useState(false);
  const [availableFishes, setAvailableFishes] = useState([]);
  const [availablePlants, setAvailablePlants] = useState([]);
  const [selectedFishId, setSelectedFishId] = useState("");
  const [selectedPlantId, setSelectedPlantId] = useState("");
  const [fishQuantity, setFishQuantity] = useState(1);
  const [plantQuantity, setPlantQuantity] = useState(1);
  const [isAddingFish, setIsAddingFish] = useState(false);
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const [compatibilityIssues, setCompatibilityIssues] = useState([]);
  const [showCompatibilityFilter, setShowCompatibilityFilter] = useState(true);
  const [fishPanelExpanded, setFishPanelExpanded] = useState(false);
  const [plantPanelExpanded, setPlantPanelExpanded] = useState(false);
  const [compatibilityPanelExpanded, setCompatibilityPanelExpanded] = useState(false);
  const [deathNotification, setDeathNotification] = useState(null);
  const lastLogIdsRef = useRef(new Set());
  const imageContainerRef = useRef(null);

  // Funkcja pomocnicza do mapowania nazw ryb na ścieżki ikon
  const getFishImage = (fishName, iconName) => {
    if (iconName) {
      return `/fish/${iconName}`;
    }
    const imageMap = {
      "Welonka (Złota rybka)": "/fish/Welonka__Złota_rybka.png",
      "Gupik (Głupik)": "/fish/Gupik__Głupik.png",
      "Bojownik syjamski": "/fish/Bojownik_syjamski.png",
      "Neon Innesa": "/fish/Neon_Innesa.png",
      "Skalar (Żaglowiec)": "/fish/Skalar__Żaglowiec.png",
      "Mieczyk Hellera": "/fish/Mieczyk_Hellera.png",
      "Molinezja": "/fish/Molinezja.png",
      "Gurami mozaikowy": "/fish/Gurami_mozaikowy.png",
      "Danio pręgowany": "/fish/Danio_pręgowany.png",
      "Kardynałek chiński": "/fish/Kardynałek_chiński.png",
      "Razbora klinowa": "/fish/Razbora_klinowa.png",
      "Tęczanka neonowa": "/fish/Tęczanka_neonowa.png",
      "Kirys pstry": "/fish/Kirys_pstry.png",
      "Glonojad (Zbrojnik)": "/fish/GlonojadZbrojnik-.png",
      "Błazenek pomarańczowy": "/fish/Błazenek_pomarańczowy.png",
      "Pirania czerwona": "/fish/Pirania_czerwona.png",
      "Pokolec królewski": "/fish/Pokolec_królewski.png",
      "Proporczykowiec": "/fish/Proporczykowiec.png",
      "Pyszczak (Malawi)": "/fish/Pyszczak__Malawi.png",
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
          setAquarium(foundAquarium);
          
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
    
    fetchAquarium();
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
          setAquarium(foundAquarium);
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
                  message: latestLog.message || latestLog.title || 'Ryba zdechła',
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
  }, [aquariumId]);

  // Pobierz dostępne ryby i rośliny
  useEffect(() => {
    async function fetchAvailableData() {
      try {
        const [fishes, plants] = await Promise.all([
          getFishes(),
          getPlants()
        ]);
        setAvailableFishes(fishes || []);
        setAvailablePlants(plants || []);
      } catch (err) {
        console.error("Error fetching available fishes/plants:", err);
      }
    }
    fetchAvailableData();
  }, []);

  // Sprawdź kompatybilność wybranej ryby z akwarium
  useEffect(() => {
    if (!selectedFishId || !aquarium?.fishes || availableFishes.length === 0) {
      setCompatibilityIssues([]);
      return;
    }

    const selectedFish = availableFishes.find(f => f.id === selectedFishId);
    if (selectedFish) {
      const issues = checkFishCompatibilityWithAquarium(selectedFish, aquarium.fishes, availableFishes);
      setCompatibilityIssues(issues);
    } else {
      setCompatibilityIssues([]);
    }
  }, [selectedFishId, aquarium?.fishes, availableFishes]);

  async function handleAddFish() {
    if (!selectedFishId || !aquariumId) return;
    
    // Sprawdź kompatybilność przed dodaniem
    const selectedFish = availableFishes.find(f => f.id === selectedFishId);
    if (selectedFish && aquarium?.fishes) {
      const issues = checkFishCompatibilityWithAquarium(selectedFish, aquarium.fishes, availableFishes);
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
      const result = await addFishToAquarium(aquariumId, selectedFishId, fishQuantity);
      
      // Backend zwraca zaktualizowane akwarium w odpowiedzi
      if (result && typeof result === 'object' && result.id) {
        // result jest już zaktualizowanym akwarium
        setAquarium(result);
      } else {
        // Jeśli nie ma akwarium w odpowiedzi, pobierz je ponownie
        const updatedAquarium = await getAquariumById(aquariumId);
        if (updatedAquarium) {
          setAquarium(updatedAquarium);
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
        console.log('Fishes array:', updatedAquarium.fishes);
        console.log('Fishes count (positions):', updatedAquarium.fishes?.length || 0);
        const totalCount = (updatedAquarium.fishes || []).reduce((sum, fish) => sum + (fish.count || 1), 0);
        console.log('Fishes count (total):', totalCount);
        
        // Utwórz nowy obiekt z nowymi tablicami, żeby wymusić aktualizację React
        const freshAquarium = {
          ...updatedAquarium,
          fishes: updatedAquarium.fishes ? [...updatedAquarium.fishes] : [],
          plants: updatedAquarium.plants ? [...updatedAquarium.plants] : []
        };
        console.log('Setting aquarium state with fresh object');
        setAquarium(freshAquarium);
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
    
    try {
      setIsAddingPlant(true);
      const result = await addPlantToAquarium(aquariumId, selectedPlantId, plantQuantity);
      
      // Backend zwraca zaktualizowane akwarium w odpowiedzi
      if (result && typeof result === 'object' && result.id) {
        // result jest już zaktualizowanym akwarium
        setAquarium(result);
      } else {
        // Jeśli nie ma akwarium w odpowiedzi, pobierz je ponownie
        const updatedAquarium = await getAquariumById(aquariumId);
        if (updatedAquarium) {
          setAquarium(updatedAquarium);
        }
      }
      
      // Resetuj formularz
      setSelectedPlantId("");
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
        // result jest już zaktualizowanym akwarium
        console.log('Using aquarium from response:', result);
        setAquarium(result);
      } else {
        // Jeśli nie ma akwarium w odpowiedzi, pobierz je ponownie
        console.log('Fetching updated aquarium...');
        const updatedAquarium = await getAquariumById(aquariumId);
        if (updatedAquarium) {
          console.log('Updated aquarium:', updatedAquarium);
          setAquarium(updatedAquarium);
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
    const findFreePosition = (globalIndex, existingPlants, containerWidth = 1200) => {
      const size = 120 + (globalIndex * 13) % 80; // 120-200px
      const height = size * 1.5;
      const minBottomOffset = 80; // Minimalna odległość od dołu (powyżej menu)
      const maxBottomOffset = 350; // Maksymalna wysokość piasku
      const availableHeight = maxBottomOffset - minBottomOffset;
      
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
    
    return allPlants.map((plant) => {
      const position = findFreePosition(
        plant.globalIndex,
        placedPlants,
        containerWidth
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
        <Typography>{t("loading", { defaultValue: "Ładowanie..." })}</Typography>
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
                {t("waterType", { defaultValue: "Typ wody" })}: {aquarium.waterType === 'freshwater' ? t("freshwater", { defaultValue: "Słodkowodne" }) : t("saltwater", { defaultValue: "Słonowodne" })}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                🌡️ {aquarium.temperature}°C
              </Typography>
              <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                pH: {aquarium.ph}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                💧 {aquarium.hardness} dGH
              </Typography>
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
              {t("waterType", { defaultValue: "Typ wody" })}: {aquarium.waterType === 'freshwater' ? t("freshwater", { defaultValue: "Słodkowodne" }) : t("saltwater", { defaultValue: "Słonowodne" })}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
              🌡️ {aquarium.temperature}°C
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
              pH: {aquarium.ph}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
              💧 {aquarium.hardness} dGH
            </Typography>
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
              {aquarium.fishes.flatMap((fish, fishIndex) => {
                const fishDetails = availableFishes.find(f => f.id === fish.fishId);
                if (!fishDetails) return [];
                
                const fishName = fishDetails.name || `Ryba ${fishIndex + 1}`;
                const fishCount = fish.count || 1;
                const fishImage = getFishImage(fishName, fishDetails.iconName);
                
                // Renderuj każdą rybę osobno (dla fishCount > 1)
                return Array.from({ length: Math.min(fishCount, 10) }).map((_, instanceIndex) => {
                  const uniqueKey = `fish-${fish.fishId}-${instanceIndex}`;
                  // Losowe pozycje startowe i parametry animacji dla każdej ryby
                  // Większy zakres pozycji - od 5% do 95% (prawie całe akwarium)
                  const startX = 5 + (fishIndex * 13 + instanceIndex * 7) % 85;
                  const startY = 10 + (fishIndex * 17 + instanceIndex * 11) % 75;
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
              })}
            </Box>
          )}

          {/* Rośliny w obszarze piasku (do 350px od dołu, ale powyżej dolnego menu) */}
          {plantPositions && plantPositions.length > 0 && (
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '350px', // Wysokość piasku
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
      {aquarium?.status && 
       aquarium.status.issues && 
       aquarium.status.issues.length > 0 && 
       aquarium?.fishes && 
       aquarium.fishes.length >= 2 && (
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
            <IconButton
              onClick={() => setCompatibilityPanelExpanded(true)}
              sx={{
                bgcolor: aquarium.status.level === 'ERROR' ? '#f44336' : '#ff9800',
                color: 'white',
                width: 48,
                height: 48,
                '&:hover': {
                  bgcolor: aquarium.status.level === 'ERROR' ? '#d32f2f' : '#f57c00',
                },
                boxShadow: 4,
                borderRadius: '50%'
              }}
            >
              <Typography sx={{ fontSize: '1.5rem' }}>!</Typography>
            </IconButton>
          ) : (
            // Rozwinięty widok - pełny panel
            <Paper sx={{
              p: 2,
              bgcolor: darkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              boxShadow: 4,
              border: aquarium.status.level === 'ERROR' ? '2px solid #f44336' : 
                      aquarium.status.level === 'WARNING' ? '2px solid #ff9800' : 'none'
            }}>
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
                  {aquarium.status.level === 'ERROR' ? '🔴' : '⚠️'}
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
                    {aquarium.status.issues
                      .filter(issue => issue.type === 'TEMPERAMENT_INCOMPATIBILITY' || issue.type === 'WATER_TYPE_MISMATCH')
                      .slice(0, 3) // Pokaż maksymalnie 3 pierwsze problemy
                      .map((issue, index) => (
                        <Box 
                          key={`issue-${index}`}
                          sx={{
                            p: 1,
                            bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                            borderRadius: 1,
                            borderLeft: issue.type === 'WATER_TYPE_MISMATCH' ? '3px solid #f44336' : 'none'
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
                                  'pół-agresywne': t('fish.temperament.pół-agresywne', { defaultValue: 'pół-agresywne' }),
                                  'aggressive': t('fish.temperament.agresywne', { defaultValue: 'agresywne' }),
                                  'peaceful': t('fish.temperament.spokojne', { defaultValue: 'spokojne' }),
                                  'semi-aggressive': t('fish.temperament.pół-agresywne', { defaultValue: 'pół-agresywne' })
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
                            {issue.type === 'WATER_TYPE_MISMATCH' && (
                              <Typography component="span" sx={{ 
                                display: 'block', 
                                mt: 0.5, 
                                fontSize: '0.75rem',
                                color: '#f44336',
                                fontStyle: 'italic'
                              }}>
                                {t("fishWillBeRemoved", { defaultValue: "⚠️ Ryba zostanie automatycznie usunięta po kilku sekundach!" })}
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                      ))}
                    {aquarium.status.issues.filter(issue => issue.type === 'TEMPERAMENT_INCOMPATIBILITY' || issue.type === 'WATER_TYPE_MISMATCH').length > 3 && (
                      <Typography variant="caption" sx={{
                        color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                        fontStyle: 'italic'
                      }}>
                        + {aquarium.status.issues.filter(issue => issue.type === 'TEMPERAMENT_INCOMPATIBILITY' || issue.type === 'WATER_TYPE_MISMATCH').length - 3} {t("more", { defaultValue: "więcej" })}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>
          )}
        </Box>
      )}

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
                              primaryTypographyProps={{ fontSize: '0.875rem' }}
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
                              primaryTypographyProps={{ fontSize: '0.875rem' }}
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
              onChange={(e) => setSelectedFishId(e.target.value)}
            >
              {(() => {
                // Filtruj ryby według kompatybilności, jeśli opcja jest włączona
                let fishesToShow = [];
                if (showCompatibilityFilter && aquarium?.fishes && aquarium.fishes.length > 0) {
                  const filtered = filterCompatibleFishes(availableFishes, aquarium.fishes);
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

          {/* Wyświetl ostrzeżenia kompatybilności */}
          {compatibilityIssues.length > 0 && (
            <Box sx={{ mb: 2 }}>
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
                        'pół-agresywne': t('fish.temperament.pół-agresywne', { defaultValue: 'pół-agresywne' }),
                        'aggressive': t('fish.temperament.agresywne', { defaultValue: 'agresywne' }),
                        'peaceful': t('fish.temperament.spokojne', { defaultValue: 'spokojne' }),
                        'semi-aggressive': t('fish.temperament.pół-agresywne', { defaultValue: 'pół-agresywne' })
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
            onChange={(e) => setFishQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1 }}
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
                {t("showOnlyCompatible", { defaultValue: "Pokaż tylko kompatybilne ryby" })}
              </label>
            </Box>
          )}

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
              onChange={(e) => setSelectedPlantId(e.target.value)}
            >
              {availablePlants.map((plant) => (
                <MenuItem key={plant.id} value={plant.id}>
                  {translateSpeciesName(plant.name, 'plant')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            type="number"
            label={t("quantity", { defaultValue: "Ilość" })}
            value={plantQuantity}
            onChange={(e) => setPlantQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1 }}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={() => {
              setAddPlantModalOpen(false);
              setSelectedPlantId("");
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

