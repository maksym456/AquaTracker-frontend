"use client";
import { useState, useEffect, useCallback } from "react";
import { Box, Typography, IconButton, Button, useTheme, useMediaQuery, List, ListItemButton, ListItemText, Divider, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Modal, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme as useCustomTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { getFishes, getAquariums, addFishToAquarium } from "../lib/api";

export default function FishDatabasePage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { darkMode } = useCustomTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Funkcja pomocnicza do usuwania wszystkich treści w nawiasach z nazw ryb
  const cleanFishName = (name) => {
    if (!name) return name;
    // Usuń wszystkie wystąpienia (tekst) z nazwy
    return name.replace(/\s*\([^)]*\)/g, '').trim();
  };
  
  // Funkcja pomocnicza do mapowania nazw ryb na ścieżki ikon
  const getFishImage = (fishName) => {
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

  // Funkcja pomocnicza do tłumaczenia typu wody
  const getWaterTypeLabel = (waterType) => {
    return t(`fish.values.${waterType}`, { defaultValue: waterType });
  };

  // Funkcja pomocnicza do tłumaczenia usposobienia
  const getTemperamentLabel = (temperament) => {
    const map = {
      "spokojne": "calm",
      "pol_agresywne": "semiAggressive",
      "umiarkowane": "calm",
      "agresywne": "aggressive",
      "bardzo agresywne": "veryAggressive"
    };
    const key = map[temperament] || temperament;
    return t(`fish.values.${key}`, { defaultValue: temperament });
  };

  // Funkcja pomocnicza do tłumaczenia biotopu
  const getBiotopeLabel = (biotope) => {
    return t(`fish.biotopes.${biotope}`, { defaultValue: biotope });
  };

  // ============================================
  // UWAGA: USUNIĘTO HARDCODED DANE
  // ============================================
  // Wcześniej tutaj była duża tablica fishCards z hardcoded danymi (około 370 linii)
  // Teraz dane są pobierane z API w useEffect powyżej
  
  // ============================================
  // STAN KOMPONENTU (STATE)
  // ============================================
  // Dla początkujących: useState to hook React, który pozwala przechowywać dane w komponencie
  // Gdy zmieniamy stan (np. setFishCards), React automatycznie odświeża komponent
  
  // Stan dla listy ryb - początkowo pusta tablica, bo dane pobierzemy z API
  const [fishCards, setFishCards] = useState([]);
  
  // Stan dla informacji o ładowaniu - true gdy pobieramy dane z API
  const [isLoading, setIsLoading] = useState(true);
  
  // Stan dla błędów - null gdy wszystko OK, obiekt z błędem gdy coś poszło nie tak
  const [error, setError] = useState(null);
  
  // Pozostałe stany (nie zmieniamy ich, bo nie są związane z API)
  const [currentCard, setCurrentCard] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [waterFilter, setWaterFilter] = useState("all"); // all | freshwater | brackish | saltwater
  const [sortAggressiveness, setSortAggressiveness] = useState("none"); // none | asc | desc
  const [failedImages, setFailedImages] = useState(new Set()); // Track failed image loads
  
  // Stany dla modalu wyboru akwarium
  const [aquariumSelectModalOpen, setAquariumSelectModalOpen] = useState(false);
  const [selectedFishForAquarium, setSelectedFishForAquarium] = useState(null);
  const [userAquariums, setUserAquariums] = useState([]);
  const [isLoadingAquariums, setIsLoadingAquariums] = useState(false);
  const [isAddingFish, setIsAddingFish] = useState(false);
  const [addFishError, setAddFishError] = useState(null);
  const [addFishSuccess, setAddFishSuccess] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();

  // Funkcja pomocnicza do konwersji formatu API v1 na format używany w UI
  // Dla początkujących: API zwraca dane w jednym formacie, a UI potrzebuje w innym
  // Ta funkcja "tłumaczy" dane z formatu API na format UI
  const convertApiFishToUI = useCallback((fish) => {
    // Konwersja waterType z polskiego na angielski (dla filtrowania)
    // API zwraca: "Słodkowodna", UI potrzebuje: "freshwater"
    const waterTypeMap = {
      "slodkowodna": "freshwater",
      "slonowodna": "saltwater",
      "slonawa": "brackish"
    };
    const waterType = waterTypeMap[fish.waterType] || "freshwater";
    
    // Konwersja temperature z stringa "22-26" na tablicę [22, 26]
    // Dla początkujących: split dzieli string na części, map konwertuje na liczby
    let tempRange = [22, 26]; // domyślne wartości
    if (fish.temperature) {
      const tempParts = fish.temperature.split('-').map(t => parseFloat(t.trim()));
      if (tempParts.length === 2 && !isNaN(tempParts[0]) && !isNaN(tempParts[1])) {
        tempRange = tempParts;
      }
    }
    
    // Konwersja ph z stringa "6.5-7.5" na tablicę [6.5, 7.5]
    let phRange = [6.5, 7.5]; // domyślne wartości
    if (fish.ph) {
      const phParts = fish.ph.split('-').map(p => parseFloat(p.trim()));
      if (phParts.length === 2 && !isNaN(phParts[0]) && !isNaN(phParts[1])) {
        phRange = phParts;
      }
    }
    
    // Konwersja hardnessDGH z stringa "1-12" na tablicę [1, 12]
    let hardness = [5, 15]; // domyślne wartości
    if (fish.hardnessDGH) {
      const hardnessParts = fish.hardnessDGH.split('-').map(h => parseFloat(h.trim()));
      if (hardnessParts.length === 2 && !isNaN(hardnessParts[0]) && !isNaN(hardnessParts[1])) {
        hardness = hardnessParts;
      }
    }
    
    // Konwersja iconName na pełną ścieżkę do obrazka
    // API zwraca: "neon_innesa.png", UI potrzebuje: "/fish/Neon_Innesa.png"
    const image = fish.iconName 
      ? `/fish/${fish.iconName}` 
      : getFishImage(fish.name);
    
    return {
      id: fish.id,
      name: fish.name,
      description: fish.description || "", // API v1 nie ma description, ale zostawiamy dla kompatybilności
      image: image,
      waterType: waterType,
      waterTypeLabel: getWaterTypeLabel(waterType),
      tempRange: tempRange,
      biotope: fish.biotope || "",
      phRange: phRange,
      hardness: hardness,
      temperament: fish.temperament || "spokojne",
      minSchoolSize: fish.minShoalSize || fish.minSchoolSize || 1, // API v1 używa minShoalSize
      lifespan: fish.lifeSpan || fish.lifespan || "3-5 lat" // API v1 używa lifeSpan
    };
  }, []);

  useEffect(() => {
    async function fetchFishData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Pobieramy dane z API
        const fishes = await getFishes();
        
        if (fishes && Array.isArray(fishes)) {
          // Konwertujemy każdą rybę z formatu API v1 na format używany w UI
          const processedFishes = fishes.map(convertApiFishToUI);
          
          setFishCards(processedFishes);
          
          // Jeśli nie ma żadnych ryb, pokazujemy komunikat
          if (processedFishes.length === 0) {
            setError("Brak danych z API. Sprawdź czy API jest dostępne.");
          }
        } else {
          setError("Nieprawidłowy format danych z API.");
          setFishCards([]);
        }
      } catch (err) {
        console.error("Error fetching fishes:", err);
        setError(err.message || "Nie udało się załadować danych. Sprawdź czy API jest dostępne.");
        setFishCards([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    void fetchFishData();
  }, [convertApiFishToUI]);

  // Lista przefiltrowana i posortowana dla panelu
  const filteredFish = fishCards
    .filter((f) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery = q === "" || f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q);
      const matchesWater = waterFilter === "all" || f.waterType === waterFilter;
      return matchesQuery && matchesWater;
    })
    .sort((a, b) => {
      if (sortAggressiveness === "asc") {
        const order = { "spokojne": 1, "pol_agresywne": 2, "umiarkowane": 3, "agresywne": 4, "bardzo agresywne": 5 };
        return (order[a.temperament] || 0) - (order[b.temperament] || 0);
      }
      if (sortAggressiveness === "desc") {
        const order = { "spokojne": 1, "pol_agresywne": 2, "umiarkowane": 3, "agresywne": 4, "bardzo agresywne": 5 };
        return (order[b.temperament] || 0) - (order[a.temperament] || 0);
      }
      return 0;
    });
  
  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % fishCards.length);
  };
  
  const handlePrev = () => {
    setCurrentCard((prev) => (prev - 1 + fishCards.length) % fishCards.length);
  };
  
  // Funkcja do otwierania modalu wyboru akwarium
  const handleAddToAquariumClick = async (fish) => {
    if (!user || !user.id) {
      setAddFishError(t("pleaseLogin", { defaultValue: "Musisz być zalogowany, aby dodać rybę do akwarium." }));
      return;
    }
    
    setSelectedFishForAquarium(fish);
    setAquariumSelectModalOpen(true);
    setAddFishError(null);
    setAddFishSuccess(false);
    
    // Pobierz akwaria użytkownika
    setIsLoadingAquariums(true);
    try {
      const aquariums = await getAquariums(user.id);
      setUserAquariums(aquariums || []);
    } catch (err) {
      console.error("Error fetching aquariums:", err);
      setAddFishError(t("errorLoadingAquariums", { defaultValue: "Nie udało się załadować akwariów." }));
    } finally {
      setIsLoadingAquariums(false);
    }
  };
  
  // Funkcja do dodawania ryby do wybranego akwarium
  const handleSelectAquarium = async (aquariumId) => {
    if (!selectedFishForAquarium || !aquariumId) return;
    
    setIsAddingFish(true);
    setAddFishError(null);
    setAddFishSuccess(false);
    
    try {
      await addFishToAquarium(aquariumId, selectedFishForAquarium.id, 1);
      setAddFishSuccess(true);
      
      // Zamknij modal po 1.5 sekundy
      setTimeout(() => {
        setAquariumSelectModalOpen(false);
        setSelectedFishForAquarium(null);
        setAddFishSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Error adding fish to aquarium:", err);
      setAddFishError(err.message || t("errorAddingFish", { defaultValue: "Nie udało się dodać ryby do akwarium." }));
    } finally {
      setIsAddingFish(false);
    }
  };
  
  // Funkcja do obliczania pozycji karty w karuzeli
  const getCardPosition = (index) => {
    const totalCards = fishCards.length;
    const offset = (index - currentCard + totalCards) % totalCards;
    
    // Na mobile: wyświetl tylko jedną kartę (główną)
    if (isMobile) {
      if (offset === 0) {
        return { zIndex: 3, scale: 1, translateX: 0, opacity: 1 }; // Tylko główna karta - wyśrodkowana
      } else {
        return { zIndex: 1, scale: 0.6, translateX: 0, opacity: 0 }; // Wszystkie inne ukryte
      }
    }
    
    // Na desktop: wyświetl 3 karty (główna + 2 boczne)
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

  // ============================================
  // RENDEROWANIE KOMPONENTU
  // ============================================
  // Dla początkujących: return zwraca JSX (HTML w JavaScript), który React wyświetli na stronie
  
  // Jeśli dane się ładują, pokazujemy wskaźnik ładowania
  if (isLoading) {
    return (
      <Box sx={{ 
        minHeight: "100vh",
        height: "100vh",
        position: "relative",
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress sx={{ color: 'white', zIndex: 10 }} />
        <Typography sx={{ color: 'white', mt: 2, zIndex: 10 }}>
          {t("loadingFishes", { defaultValue: "Ładowanie ryb..." })}
        </Typography>
      </Box>
    );
  }
  
  // Jeśli wystąpił błąd, pokazujemy komunikat błędu
  if (error) {
    return (
      <Box sx={{ 
        minHeight: "100vh",
        height: "100vh",
        position: "relative",
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        p: 4
      }}>
        <Alert severity="error" sx={{ mb: 2, maxWidth: 600, zIndex: 10 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t("errorLoadingFishes", { defaultValue: "Błąd ładowania danych" })}
          </Typography>
          <Typography>
            {error}
          </Typography>
          <Button 
            onClick={() => window.location.reload()} 
            sx={{ mt: 2 }}
            variant="contained"
          >
            {t("retry", { defaultValue: "Spróbuj ponownie" })}
          </Button>
        </Alert>
      </Box>
    );
  }
  
  // Jeśli nie ma ryb (pusta tablica), pokazujemy odpowiedni komunikat
  if (fishCards.length === 0) {
    return (
      <Box sx={{ 
        minHeight: "100vh",
        height: "100vh",
        position: "relative",
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography sx={{ color: 'white', zIndex: 10 }}>
          {t("noFishesFound", { defaultValue: "Nie znaleziono żadnych ryb" })}
        </Typography>
      </Box>
    );
  }

  // Jeśli wszystko OK, renderujemy normalny widok
  return (
    <Box sx={{ 
      minHeight: "100vh",
      height: "100vh",
      position: "relative",
      overflow: 'hidden'
    }}>
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
      <source src="/fishPage-bg.mp4" type="video/mp4" />
    </video>

      {/* Slide-out left panel: filters + list of all fish */}
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 80, md: 90 },
          bottom: { xs: 88, md: 0 },
          left: 0,
          width: { xs: 240, md: 300 },
          bgcolor: 'rgba(15, 25, 45, 0.80)',
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
          {t('allFish', { defaultValue: 'Wszystkie ryby' })}
        </Typography>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        {/* Filters */}
        <Box sx={{ px: 2.5, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            placeholder={t('searchFish', { defaultValue: 'Szukaj ryb...' })}
            variant="outlined"
            slotProps={{
              input: { sx: { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' } }
            }}
          />
          <FormControl size="small">
            <InputLabel sx={{ color: 'white' }}>{t('waterType', { defaultValue: 'Typ wody' })}</InputLabel>
            <Select
              value={waterFilter}
              label={t('waterType', { defaultValue: 'Typ wody' })}
              onChange={(e) => setWaterFilter(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              variant="outlined"
            >
              <MenuItem value="all">{t('all', { defaultValue: 'Wszystkie' })}</MenuItem>
              <MenuItem value="freshwater">{t('freshwater', { defaultValue: 'Słodka' })}</MenuItem>
              <MenuItem value="saltwater">{t('saltwater', { defaultValue: 'Słona' })}</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel sx={{ color: 'white' }}>{t('temperament', { defaultValue: 'Usposobienie' })}</InputLabel>
            <Select
              value={sortAggressiveness}
              label={t('temperament', { defaultValue: 'Usposobienie' })}
              onChange={(e) => setSortAggressiveness(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              variant="outlined"
            >
              <MenuItem value="none">{t('noSort', { defaultValue: 'Bez sortowania' })}</MenuItem>
              <MenuItem value="asc">{t('leastAggressive', { defaultValue: 'Spokojne' })}</MenuItem>
              <MenuItem value="desc">{t('mostAggressive', { defaultValue: 'Agresywne' })}</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider sx={{ mt: 1, borderColor: 'rgba(255,255,255,0.2)' }} />
        <Box sx={{ overflowY: 'auto' }}>
          <List>
            {filteredFish.map((fish) => (
              <ListItemButton
                key={fish.id}
                selected={fishCards[currentCard]?.id === fish.id}
                onClick={() => {
                  const idx = fishCards.findIndex((f) => f.id === fish.id);
                  if (idx >= 0) setCurrentCard(idx);
                  if (isMobile) setPanelOpen(false);
                }}
                sx={{
                  '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.12)' },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                }}
              >
                <ListItemText
                  primary={t(`fish.species.${fish.name}.name`, { defaultValue: cleanFishName(fish.name) })}
                  secondary={`${getWaterTypeLabel(fish.waterType)} • ${getTemperamentLabel(fish.temperament)}`}
                  slotProps={{ 
                    primary: { sx: { color: 'white', fontWeight: 600 } },
                    secondary: { sx: { color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' } }
                  }}
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
          sx={{
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            borderRadius: '0 20px 20px 0',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
          }}
          aria-label={panelOpen ? t('close', { defaultValue: 'Zamknij' }) : t('open', { defaultValue: 'Otwórz' })}
        >
          {panelOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

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
            {/* Renderuj wszystkie karty */}
            {fishCards.map((fish, index) => {
              const position = getCardPosition(index);
              return (
                <Box
                  key={fish.id}
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    top: '50%',
                    left: '50%',
                    transform: position.translateX === 0 
                      ? `translate(-50%, -50%) scale(${position.scale})`
                      : `translate(calc(-50% + ${position.translateX}px), -50%) scale(${position.scale})`,
                    transformOrigin: 'center center',
                    bgcolor: 'rgba(20, 30, 50, 0.95)',
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
                      aria-label={t("previousFish", { defaultValue: "Poprzednia ryba" })}
                      sx={{
                        color: 'white',
                        bgcolor: 'rgba(0, 0, 0, 0.4)',
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.6)' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        '& svg': {
                          display: 'block',
                          margin: '0 0 0 7px',
                          fontSize: '1.25rem'
                        }
                      }}
                    >
                      <ArrowBackIosIcon sx={{ fontSize: '1.25rem' }} />
                    </IconButton>
                    <IconButton 
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      aria-label={t("nextFish", { defaultValue: "Następna ryba" })}
                      sx={{
                        color: 'white',
                        bgcolor: 'rgba(0, 0, 0, 0.4)',
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.6)' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        '& svg': {
                          display: 'block',
                          margin: '0 auto',
                          fontSize: '1.25rem'
                        }
                      }}
                    >
                      <ArrowForwardIosIcon sx={{ fontSize: '1.25rem' }} />
                    </IconButton>
                  </Box>
                )}
                
                {/* Obraz ryby */}
                <Box sx={{
                  width: '100%',
                  height: { xs: '180px', md: '220px' },
                  bgcolor: 'rgba(40, 60, 100, 0.8)',
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
                  {fish.image && !failedImages.has(fish.id) ? (
                    <Image 
                      src={fish.image}
                      alt={fish.name}
                      fill
                      unoptimized
                      onError={() => {
                        console.error(`Failed to load image: ${fish.image} for fish: ${fish.name}`);
                        setFailedImages(prev => new Set([...prev, fish.id]));
                      }}
                      style={{
                        objectFit: 'contain'
                      }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <Box 
                      sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      <Typography sx={{ color: 'white', opacity: 0.5, fontSize: '3rem', mb: 1 }}>
                        🐠
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
                    {t(`fish.species.${fish.name}.name`, { defaultValue: cleanFishName(fish.name) })}
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
                    {t(`fish.species.${fish.name}.description`, { defaultValue: fish.description })}
                  </Typography>

                  {/* Parametry */}
                  <Box sx={{ mb: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 0.75 }} />
                    
                    {/* Typ wody */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                        {t('fish.parameters.waterType')}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500 }}>
                        {getWaterTypeLabel(fish.waterType)}
                      </Typography>
                    </Box>

                    {/* Temperatura */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                        {t('fish.parameters.temperature')}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500 }}>
                        {fish.tempRange[0]}-{fish.tempRange[1]} °C
                      </Typography>
                    </Box>

                    {/* Biotyp */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                        {t('fish.parameters.biotope')}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500 }}>
                        {getBiotopeLabel(fish.biotope)}
                      </Typography>
                    </Box>

                    {/* pH */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                        {t('fish.parameters.ph')}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500 }}>
                        {fish.phRange[0]}-{fish.phRange[1]}
                      </Typography>
                    </Box>

                    {/* Twardość */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                        {t('fish.parameters.hardness')}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500 }}>
                        {fish.hardness[0]}-{fish.hardness[1]} °dGH
                      </Typography>
                    </Box>

                    {/* Usposobienie */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                        {t('fish.parameters.temperament')}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500 }}>
                        {getTemperamentLabel(fish.temperament)}
                      </Typography>
                    </Box>

                    {/* Ilość w stadzie */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                        {t('fish.parameters.minSchoolSize')}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500 }}>
                        {fish.minSchoolSize} {t(`fish.values.${fish.minSchoolSize === 1 ? 'piece' : 'pieces'}`)}
                      </Typography>
                    </Box>

                    {/* Długość życia */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                        {t('fish.parameters.lifespan')}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500 }}>
                        {fish.lifespan}
                      </Typography>
                    </Box>

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
                          void handleAddToAquariumClick(fish);
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
              setSelectedFishForAquarium(null);
              setAddFishError(null);
              setAddFishSuccess(false);
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
              
              {selectedFishForAquarium && (
                <Typography variant="body2" sx={{ mb: 2, color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                  {t("addingFishToAquarium", { defaultValue: "Dodawanie" })}: <strong>{selectedFishForAquarium.name}</strong>
                </Typography>
              )}
              
              {addFishSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {t("fishAddedSuccessfully", { defaultValue: "Ryba została dodana do akwarium!" })}
                </Alert>
              )}
              
              {addFishError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setAddFishError(null)}>
                  {addFishError}
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
                      disabled={isAddingFish}
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
                      {isAddingFish && (
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
                    setSelectedFishForAquarium(null);
                    setAddFishError(null);
                    setAddFishSuccess(false);
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
            {fishCards.map((_, index) => (
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

