"use client";

// Importujemy useState i useEffect z React
// useState - do przechowywania stanu komponentu (np. dane, loading, błędy)
// useEffect - do wykonywania akcji przy załadowaniu komponentu (np. pobieranie danych z API)
import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Button, useTheme, useMediaQuery, List, ListItemButton, ListItemText, Divider, TextField, CircularProgress, Alert, Modal, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme as useCustomTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// Importujemy funkcję do pobierania roślin z API
// Dla początkujących: import pozwala nam używać funkcji z innych plików
import { getPlants, getAquariums, addPlantToAquarium } from "../lib/api";

export default function PlantDatabasePage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { darkMode } = useCustomTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // ============================================
  // STAN KOMPONENTU (STATE)
  // ============================================
  // Dla początkujących: useState to hook React, który pozwala przechowywać dane w komponencie
  // Gdy zmieniamy stan (np. setPlantCards), React automatycznie odświeża komponent
  
  // Stan dla listy roślin - początkowo pusta tablica, bo dane pobierzemy z API
  const [plantCards, setPlantCards] = useState([]);
  
  // Stan dla informacji o ładowaniu - true gdy pobieramy dane z API
  const [isLoading, setIsLoading] = useState(true);
  
  // Stan dla błędów - null gdy wszystko OK, string z komunikatem gdy wystąpi błąd
  const [error, setError] = useState(null);
  
  const [currentCard, setCurrentCard] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageErrors, setImageErrors] = useState({});
  
  // Stany dla modalu wyboru akwarium
  const [aquariumSelectModalOpen, setAquariumSelectModalOpen] = useState(false);
  const [selectedPlantForAquarium, setSelectedPlantForAquarium] = useState(null);
  const [userAquariums, setUserAquariums] = useState([]);
  const [isLoadingAquariums, setIsLoadingAquariums] = useState(false);
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const [addPlantError, setAddPlantError] = useState(null);
  const [addPlantSuccess, setAddPlantSuccess] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();

  // Funkcja pomocnicza do mapowania nazw roślin na ścieżki ikon
  // Dla początkujących: jeśli API zwróci iconName, używamy go, w przeciwnym razie mapujemy nazwę rośliny na plik obrazu
  const getPlantImage = (plantName, iconName) => {
    // Jeśli API zwróciło iconName, używamy go (dodajemy .png jeśli nie ma rozszerzenia)
    if (iconName) {
      const iconPath = iconName.endsWith('.png') ? iconName : `${iconName}.png`;
      return `/plant/${iconPath}`;
    }
    
    // Mapowanie nazw roślin na nazwy plików obrazów
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
    
    // Próbujemy znaleźć dopasowanie w mapie
    if (plantName && plantImageMap[plantName]) {
      return `/plant/${plantImageMap[plantName]}`;
    }
    
    // Jeśli nie ma dopasowania, próbujemy znaleźć plik po nazwie (normalizując spacje na podkreślenia)
    if (plantName) {
      const normalizedName = plantName.replace(/\s+/g, '_') + '.png';
      return `/plant/${normalizedName}`;
    }
    
    // W przeciwnym razie używamy domyślnej ikony
    return "/plant/default.png";
  };

  // ============================================
  // KONWERSJA DANYCH Z API NA FORMAT UI
  // ============================================
  // Dla początkujących: API zwraca dane w jednym formacie, a UI potrzebuje innego
  // Ta funkcja "tłumaczy" dane z formatu API na format używany w UI
  const convertApiPlantToUI = (apiPlant) => {
    // Funkcja pomocnicza do parsowania zakresów (np. "12-20" -> [12, 20])
    const parseRange = (rangeString, defaultValue) => {
      if (typeof rangeString === 'string' && rangeString.includes('-')) {
        const parts = rangeString.split('-').map(Number);
        return parts.length === 2 ? parts : defaultValue;
      }
      return defaultValue;
    };

    // Parsujemy zakresy z API (API zwraca stringi jak "12-20")
    const tempRange = parseRange(apiPlant.temperature, [20, 26]);
    const phRange = parseRange(apiPlant.ph, [6.5, 7.5]);
    const hardness = parseRange(apiPlant.hardnessDGH, [5, 15]);

    // Opis będzie z bazy danych, ale na razie używamy pustego stringa (backend doda to później)
    const description = apiPlant.description || "";

    // Pobieramy ścieżkę do obrazka używając funkcji mapującej
    const image = getPlantImage(apiPlant.name, apiPlant.iconName);
    
    return {
      id: apiPlant.id,
      name: apiPlant.name,
      description: description,
      image: image,
      tempRange: tempRange,
      biotope: apiPlant.biotope || "",
      phRange: phRange,
      hardness: hardness,
      lightRequirements: apiPlant.lightRequirements || "",
      co2Requirements: apiPlant.co2Requirements || "",
      difficulty: apiPlant.difficulty || "",
    };
  };

  // ============================================
  // POBIERANIE DANYCH Z API
  // ============================================
  // Dla początkujących: useEffect wykonuje się automatycznie gdy komponent się załaduje
  // async function - funkcja asynchroniczna, która może czekać na dane z API
  useEffect(() => {
    async function fetchPlantData() {
      try {
        // Ustawiamy loading na true - pokazujemy użytkownikowi, że ładujemy dane
        setIsLoading(true);
        setError(null);
        
        // Pobieramy dane z API używając funkcji getPlants()
        const plants = await getPlants();
        
        // Sprawdzamy czy API zwróciło poprawny format (tablicę)
        if (plants && Array.isArray(plants)) {
          // Konwertujemy każdą roślinę z formatu API na format używany w UI
          const processedPlants = plants.map(convertApiPlantToUI);
          
          // Zapisujemy przetworzone dane w stanie komponentu
          setPlantCards(processedPlants);
          
          // Jeśli nie ma żadnych roślin, pokazujemy komunikat
          if (processedPlants.length === 0) {
            setError("Brak danych z API. Sprawdź czy API jest dostępne.");
          }
        } else {
          setError("Nieprawidłowy format danych z API.");
          setPlantCards([]);
        }
      } catch (err) {
        // Jeśli wystąpi błąd, zapisujemy komunikat błędu
        console.error("Error fetching plants:", err);
        setError(err.message || "Nie udało się załadować danych. Sprawdź czy API jest dostępne.");
        setPlantCards([]);
      } finally {
        // Zawsze ustawiamy loading na false, nawet jeśli wystąpił błąd
        setIsLoading(false);
      }
    }
    
    // Wywołujemy funkcję pobierającą dane
    fetchPlantData();
  }, []); // Pusta tablica [] oznacza, że useEffect wykona się tylko raz przy załadowaniu komponentu

  // Lista przefiltrowana dla panelu bocznego
  // Dla początkujących: filter() tworzy nową tablicę z elementami spełniającymi warunek
  const filteredPlants = plantCards.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    return q === "" || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
  });
  
  // Funkcje do nawigacji między kartami
  const handleNext = () => {
    if (plantCards.length > 0) {
      setCurrentCard((prev) => (prev + 1) % plantCards.length);
    }
  };
  
  const handlePrev = () => {
    if (plantCards.length > 0) {
      setCurrentCard((prev) => (prev - 1 + plantCards.length) % plantCards.length);
    }
  };
  
  // Funkcja do otwierania modalu wyboru akwarium
  const handleAddToAquariumClick = async (plant) => {
    if (!user || !user.id) {
      setAddPlantError(t("pleaseLogin", { defaultValue: "Musisz być zalogowany, aby dodać roślinę do akwarium." }));
      return;
    }
    
    setSelectedPlantForAquarium(plant);
    setAquariumSelectModalOpen(true);
    setAddPlantError(null);
    setAddPlantSuccess(false);
    
    // Pobierz akwaria użytkownika
    setIsLoadingAquariums(true);
    try {
      const aquariums = await getAquariums(user.id);
      setUserAquariums(aquariums || []);
    } catch (err) {
      console.error("Error fetching aquariums:", err);
      setAddPlantError(t("errorLoadingAquariums", { defaultValue: "Nie udało się załadować akwariów." }));
    } finally {
      setIsLoadingAquariums(false);
    }
  };
  
  // Funkcja do dodawania rośliny do wybranego akwarium
  const handleSelectAquarium = async (aquariumId) => {
    if (!selectedPlantForAquarium || !aquariumId) return;
    
    setIsAddingPlant(true);
    setAddPlantError(null);
    setAddPlantSuccess(false);
    
    try {
      await addPlantToAquarium(aquariumId, selectedPlantForAquarium.id, 1);
      setAddPlantSuccess(true);
      
      // Zamknij modal po 1.5 sekundy
      setTimeout(() => {
        setAquariumSelectModalOpen(false);
        setSelectedPlantForAquarium(null);
        setAddPlantSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Error adding plant to aquarium:", err);
      setAddPlantError(err.message || t("errorAddingPlant", { defaultValue: "Nie udało się dodać rośliny do akwarium." }));
    } finally {
      setIsAddingPlant(false);
    }
  };
  
  // Funkcja do obliczania pozycji karty w karuzeli
  const getCardPosition = (index) => {
    const totalCards = plantCards.length;
    const offset = (index - currentCard + totalCards) % totalCards;
    
    // Na mobile: wyświetl tylko jedną kartę (główną)
    if (isMobile) {
      if (offset === 0) {
        return { zIndex: 3, scale: 1, translateX: 0, opacity: 1 }; // Tylko główna karta - wyśrodkowana
      } else {
        return { zIndex: 1, scale: 0.6, translateX: 0, opacity: 0 }; // Wszystkie inne ukryte
      }
    }
    
    // Na desktop: wyświetlanie trzech kart (główna + 2 boczne)
    // translateX w pikselach względem środka
    if (offset === 0) {
      return { zIndex: 3, scale: 1, translateX: 0, opacity: 1 }; // Karta główna (środek)
    } else if (offset === 1) {
      return { zIndex: 2, scale: 0.85, translateX: 180, opacity: 0.7 }; // Karta z prawej (tył)
    } else if (offset === totalCards - 1) {
      return { zIndex: 2, scale: 0.85, translateX: -180, opacity: 0.7 }; // Karta z lewej (tył)
    } else {
      return { zIndex: 1, scale: 0.6, translateX: 0, opacity: 0 }; // Pozostałe karty (ukryte)
    }
  };

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      position: "relative"
    }}>
      {/* Slide-out left panel: search + list of all plants */}
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 80, md: 90 },
          bottom: { xs: 88, md: 0 },
          left: 0,
          width: { xs: 240, md: 300 },
          bgcolor: 'rgba(15, 45, 25, 0.80)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255,255,255,0.12)',
          zIndex: 9,
          transform: panelOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.35s ease',
          display: 'flex',
          flexDirection: 'column',
          pt: 2,
        }}
      >
        <Typography sx={{ color: 'white', px: 2.5, pb: 1.5, fontWeight: 600 }}>
          {t('allPlants', { defaultValue: 'Wszystkie rośliny' })}
        </Typography>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        <Box sx={{ px: 2.5, pt: 1.5 }}>
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            placeholder={t('searchPlants', { defaultValue: 'Szukaj roślin...' })}
            variant="outlined"
            InputProps={{ sx: { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' } }}
            fullWidth
          />
        </Box>
        <Divider sx={{ mt: 1, borderColor: 'rgba(255,255,255,0.2)' }} />
        <Box sx={{ overflowY: 'auto' }}>
          <List>
            {filteredPlants.map((plant) => (
              <ListItemButton
                key={plant.id}
                selected={plantCards[currentCard]?.id === plant.id}
                onClick={() => {
                  const idx = plantCards.findIndex((p) => p.id === plant.id);
                  if (idx >= 0) setCurrentCard(idx);
                  if (isMobile) setPanelOpen(false);
                }}
                sx={{ '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.12)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}
              >
                <ListItemText
                  primary={plant.name}
                  secondary={plant.description}
                  primaryTypographyProps={{ sx: { color: 'white', fontWeight: 600 } }}
                  secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' } }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>

      {/* Panel toggle handle */}
      <Box
        sx={{
          position: 'fixed',
          left: panelOpen ? { xs: 240, md: 300 } : 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 13,
        }}
      >
        <IconButton
          onClick={() => setPanelOpen((v) => !v)}
          sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)', borderRadius: '0 20px 20px 0', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
          aria-label={panelOpen ? t('close', { defaultValue: 'Zamknij' }) : t('open', { defaultValue: 'Otwórz' })}
        >
          {panelOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-label={t("backgroundVideo", { defaultValue: "Dekoracyjne tło wideo z akwarium" })}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
        onLoadedData={(e) => {
          e.target.play().catch(() => {});
        }}
      >
        <source src="/plantPage-bg.mp4" type="video/mp4" />
      </video>
      {/* Top bar z przyciskami */}
      <Box 
        component="nav"
        role="navigation"
        aria-label={t("mainNavigation", { defaultValue: "Główna nawigacja" })}
        sx={{ 
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: 4, py: 2, zIndex: 10
      }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Przycisk powrotu */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{
              bgcolor: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)', 
              p: 0.8, 
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
              minHeight: '60px', 
              minWidth: '80px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <KeyboardReturnOutlinedIcon sx={{ fontSize: 16, mb: 0.3, color: darkMode ? 'white' : 'inherit' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: darkMode ? 'white' : "text.primary", textAlign: 'center', fontSize: '0.65rem' }}>
                {t("return")}
              </Typography>
            </Box>
          </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LanguageSwitcher />
        </Box>
      </Box>

      {/* Główna zawartość */}
      <Box 
        component="main"
        sx={{ 
        position: "relative", 
        zIndex: 2, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        height: '100vh',
        pt: 14,
        pb: 4,
        overflow: 'auto',
        '@media (min-width: 1366px) and (max-width: 1919px)': {
          pt: 12,
          pb: 2
        },
        '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 768px)': {
          pt: 10,
          pb: 1
        }
      }}>
        {/* Karuzela kafelków - kontener flexbox wyśrodkowujący wszystko */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: { xs: '600px', md: '700px' },
          gap: 2,
          py: 2,
          '@media (min-width: 1366px) and (max-width: 1919px)': {
            minHeight: '650px',
            py: 1
          },
          '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 768px)': {
            minHeight: '580px',
            gap: 1
          },
          '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 700px)': {
            minHeight: '520px',
            gap: 0.75,
            py: 0.5
          }
        }}>
          {/* Wewnętrzny kontener z większą szerokością dla kart */}
          <Box sx={{
            position: 'relative',
            width: { xs: '90%', sm: '60%', md: '45%' },
            maxWidth: { xs: '100%', sm: 450, md: 400 },
            height: { xs: '600px', md: '700px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '@media (min-width: 1366px) and (max-width: 1919px)': {
              height: '650px'
            },
            '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 768px)': {
              height: '580px',
              width: '42%'
            },
            '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 700px)': {
              height: '520px',
              width: '42%'
            }
          }}>
            {/* Wyświetlanie stanu ładowania */}
            {isLoading && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress sx={{ color: 'white' }} />
                <Typography sx={{ color: 'white' }}>
                  {t('loading', { defaultValue: 'Ładowanie...' })}
                </Typography>
              </Box>
            )}

            {/* Wyświetlanie błędu */}
            {error && !isLoading && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, px: 4 }}>
                <Alert severity="warning" sx={{ bgcolor: 'rgba(255, 152, 0, 0.2)', color: 'white', border: '1px solid rgba(255, 152, 0, 0.5)' }}>
                  {error}
                </Alert>
              </Box>
            )}

            {/* Renderuj wszystkie karty tylko jeśli nie ma loading i error */}
            {!isLoading && !error && plantCards.map((plant, index) => {
              const position = getCardPosition(index);
              return (
                <Box
                  key={plant.id}
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    top: '50%',
                    left: '50%',
                    transform: position.translateX === 0 
                      ? `translate(-50%, -50%) scale(${position.scale})`
                      : `translate(calc(-50% + ${position.translateX}px), -50%) scale(${position.scale})`,
                    transformOrigin: 'center center',
                    bgcolor: 'rgba(20, 50, 30, 0.95)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    minHeight: { xs: '550px', md: '650px' },
                    maxHeight: { xs: '550px', md: '650px' },
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: position.zIndex,
                    opacity: position.opacity,
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: position.zIndex === 3 ? 'default' : 'pointer',
                    '@media (min-width: 1366px) and (max-width: 1919px)': {
                      minHeight: '600px',
                      maxHeight: '600px'
                    },
                    '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 768px)': {
                      minHeight: '530px',
                      maxHeight: '530px'
                    },
                    '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 700px)': {
                      minHeight: '470px',
                      maxHeight: '470px'
                    },
                    '&:hover': position.zIndex === 3 ? {} : {
                      opacity: 0.85,
                      transform: position.translateX === 0
                        ? `translate(-50%, -50%) scale(${position.scale * 1.05})`
                        : `translate(calc(-50% + ${position.translateX * 0.9}px), -50%) scale(${position.scale * 1.05})`
                    }
                  }}
                  onClick={() => position.zIndex !== 3 && setCurrentCard(index)}
                >
                {/* Strzałki nawigacyjne tylko na głównej karcie */}
                {position.zIndex === 3 && (
            <Box sx={{
              position: 'absolute',
              top: 16,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
                    px: { xs: 1, md: 2 },
              zIndex: 10
            }}>
              <IconButton 
                      onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                      aria-label={t("previousPlant", { defaultValue: "Poprzednia roślina" })}
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.6)' }
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton 
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      aria-label={t("nextPlant", { defaultValue: "Następna roślina" })}
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.6)' }
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
                )}
                
                {/* Obraz rośliny */}
                <Box sx={{
                  width: '100%',
                  height: { xs: '180px', md: '220px' },
                  bgcolor: 'rgba(40, 100, 60, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0,
                  '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 768px)': {
                    height: '150px'
                  },
                  '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 700px)': {
                    height: '140px'
                  }
                }}>
                  {!imageErrors[plant.id] ? (
                    <img
                      src={plant.image}
                      alt={plant.name}
                      loading="lazy"
                      onError={() => {
                        setImageErrors(prev => ({ ...prev, [plant.id]: true }));
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%'
                    }}>
                      <Typography sx={{ color: 'white', opacity: 0.5, fontSize: '3rem', mb: 1 }}>
                        🌿
                      </Typography>
                      <Typography sx={{ color: 'white', opacity: 0.5, fontSize: '0.875rem' }}>
                        {t("imageNotAvailable", { defaultValue: "Obraz niedostępny" })}
                      </Typography>
                    </Box>
                  )}
                </Box>

            {/* Treść kafelka */}
                <Box sx={{ 
                  p: { xs: 2, md: 2.5 }, 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  overflow: 'hidden',
                  minHeight: 0,
                  '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 700px)': {
                    p: 1.5
                  }
                }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'white', 
                  mb: 0.75, 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', md: '1.15rem' },
                  flexShrink: 0,
                  '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 768px)': {
                    fontSize: '0.95rem',
                    mb: 0.5
                  },
                  '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 700px)': {
                    fontSize: '0.9rem',
                    mb: 0.5
                  }
                }}
              >
                {t(`plant.species.${plant.name}.name`, { defaultValue: plant.name })}
              </Typography>
              
              {/* Opis */}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.4,
                  mb: 1,
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  flexShrink: 0,
                  '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 768px)': {
                    fontSize: '0.65rem',
                    mb: 0.75,
                    lineHeight: 1.3
                  },
                  '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 700px)': {
                    fontSize: '0.65rem',
                    mb: 0.5,
                    lineHeight: 1.3
                  }
                }}
              >
                {t(`plant.species.${plant.name}.description`, { defaultValue: plant.description })}
              </Typography>

              {/* Parametry */}
              <Box sx={{ mb: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 0.75 }} />
                
                {/* Temperatura */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                    {t('plant.parameters.temperature')}:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500 }}>
                    {plant.tempRange[0]}-{plant.tempRange[1]} °C
                  </Typography>
                </Box>

                {/* Biotyp */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                    {t('plant.parameters.biotope')}:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500 }}>
                    {t(`plant.biotopes.${plant.biotope}`, { defaultValue: plant.biotope })}
                  </Typography>
                </Box>

                {/* pH */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                    {t('plant.parameters.ph')}:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500 }}>
                    {plant.phRange[0]}-{plant.phRange[1]}
                  </Typography>
                </Box>

                {/* Twardość */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                    {t('plant.parameters.hardness')}:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500 }}>
                    {plant.hardness[0]}-{plant.hardness[1]} °dGH
                  </Typography>
                </Box>

                {/* Wymagania świetlne */}
                {plant.lightRequirements && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                      {t('plant.parameters.lightRequirements')}:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500 }}>
                      {t(`plant.values.light.${plant.lightRequirements}`, { defaultValue: plant.lightRequirements })}
                    </Typography>
                  </Box>
                )}

                {/* Wymagania CO2 */}
                {plant.co2Requirements && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                      {t('plant.parameters.co2Requirements')}:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500 }}>
                      {t(`plant.values.co2.${plant.co2Requirements}`, { defaultValue: plant.co2Requirements })}
                    </Typography>
                  </Box>
                )}

                {/* Trudność */}
                {plant.difficulty && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                      {t('plant.parameters.difficulty')}:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500 }}>
                      {t(`plant.values.difficulty.${plant.difficulty}`, { defaultValue: plant.difficulty })}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mt: 0.75 }} />
              </Box>
              
              {/* Przycisk "Dodaj do akwarium" tylko na głównej karcie */}
              {position.zIndex === 3 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 'auto',
                  pt: 1,
                  flexShrink: 0
                }}>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToAquariumClick(plant);
                    }}
                    variant="contained"
                    sx={{
                      bgcolor: '#FFD700',
                      color: '#000',
                      borderRadius: 3,
                      px: { xs: 3, md: 4 },
                      py: { xs: 0.75, md: 1.25 },
                      fontSize: { xs: '0.75rem', md: '0.9rem' },
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
                      transition: 'all 0.3s',
                      '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 700px)': {
                        py: 0.75,
                        fontSize: '0.7rem',
                        px: 2.5
                      },
                      '&:hover': {
                        bgcolor: '#FFC700',
                        boxShadow: '0 6px 16px rgba(255, 215, 0, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      '&:active': {
                        transform: 'translateY(0)'
                      }
                    }}
                  >
                    {t("addToAquarium", { defaultValue: "Add to Aquarium" })}
                  </Button>
                </Box>
              )}
            </Box>
              </Box>
            );
          })}
          </Box>

          {/* Modal wyboru akwarium */}
          <Modal
            open={aquariumSelectModalOpen}
            onClose={() => {
              setAquariumSelectModalOpen(false);
              setSelectedPlantForAquarium(null);
              setAddPlantError(null);
              setAddPlantSuccess(false);
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
              maxHeight: '80vh',
              overflow: 'auto',
              p: 3,
              bgcolor: darkMode ? '#1e1e1e' : 'background.paper'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {t("selectAquarium", { defaultValue: "Wybierz akwarium" })}
              </Typography>
              
              {selectedPlantForAquarium && (
                <Typography variant="body2" sx={{ mb: 2, color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                  {t("addingPlantToAquarium", { defaultValue: "Dodawanie" })}: <strong>{selectedPlantForAquarium.name}</strong>
                </Typography>
              )}
              
              {addPlantSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {t("plantAddedSuccessfully", { defaultValue: "Roślina została dodana do akwarium!" })}
                </Alert>
              )}
              
              {addPlantError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setAddPlantError(null)}>
                  {addPlantError}
                </Alert>
              )}
              
              {isLoadingAquariums ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : userAquariums.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ mb: 2, color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                    {t("noAquariums", { defaultValue: "Nie masz jeszcze żadnych akwariów." })}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setAquariumSelectModalOpen(false);
                      router.push('/my-aquariums');
                    }}
                  >
                    {t("createAquarium", { defaultValue: "Utwórz akwarium" })}
                  </Button>
                </Box>
              ) : (
                <List>
                  {userAquariums.map((aquarium) => (
                    <ListItemButton
                      key={aquarium.id}
                      onClick={() => handleSelectAquarium(aquarium.id)}
                      disabled={isAddingPlant}
                      sx={{
                        mb: 1,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        '&:hover': {
                          bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                        }
                      }}
                    >
                      <ListItemText
                        primary={aquarium.name}
                        secondary={
                          <>
                            <Typography variant="caption" component="span" sx={{ display: 'block' }}>
                              {t("waterType", { defaultValue: "Typ wody" })}: {aquarium.waterType === 'freshwater' ? t("freshwater", { defaultValue: "Słodkowodne" }) : t("saltwater", { defaultValue: "Słonowodne" })}
                            </Typography>
                            <Typography variant="caption" component="span" sx={{ display: 'block' }}>
                              {t("temperature", { defaultValue: "Temperatura" })}: {aquarium.temperature}°C
                            </Typography>
                          </>
                        }
                      />
                      {isAddingPlant && (
                        <CircularProgress size={20} sx={{ ml: 2 }} />
                      )}
                    </ListItemButton>
                  ))}
                </List>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  onClick={() => {
                    setAquariumSelectModalOpen(false);
                    setSelectedPlantForAquarium(null);
                    setAddPlantError(null);
                    setAddPlantSuccess(false);
                  }}
                >
                  {t("cancel", { defaultValue: "Anuluj" })}
                </Button>
              </Box>
            </Paper>
          </Modal>

          {/* Wskaźnik aktualnego kafelka - ukryty na mobile */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            gap: 1
          }}>
            {plantCards.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: index === currentCard ? 'white' : 'rgba(255, 255, 255, 0.4)',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

