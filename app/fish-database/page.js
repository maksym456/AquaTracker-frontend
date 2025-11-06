"use client";

import { useState } from "react";
import { Box, Typography, IconButton, Button, useTheme, useMediaQuery, List, ListItemButton, ListItemText, Divider, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import LanguageSwitcher from "../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export default function FishDatabasePage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Przykładowe dane kafelków (rozszerzone o parametry środowiskowe)
  const fishCards = [
    { id: 1, name: "Goldfish", description: "Popularna ryba akwariowa", image: "/fish1.jpg", aggressiveness: 1, waterType: "freshwater", tempRange: [18, 22], phRange: [7.0, 7.8], hardness: [5, 19] },
    { id: 2, name: "Guppy", description: "Kolorowa, łatwa w hodowli", image: "/fish2.jpg", aggressiveness: 1, waterType: "freshwater", tempRange: [22, 28], phRange: [6.8, 7.8], hardness: [8, 12] },
    { id: 3, name: "Betta", description: "Piękna ryba bojowa", image: "/fish3.jpg", aggressiveness: 3, waterType: "freshwater", tempRange: [24, 30], phRange: [6.5, 7.5], hardness: [3, 5] },
    { id: 4, name: "RybaX", description: "Tutaj będzie opis ryby", image: "/fish4.jpg", aggressiveness: 2, waterType: "brackish", tempRange: [20, 26], phRange: [7.2, 8.2], hardness: [10, 20] },
    { id: 5, name: "Tetra", description: "Mała, kolorowa ryba", image: "/fish5.jpg", aggressiveness: 1, waterType: "freshwater", tempRange: [22, 26], phRange: [5.5, 7.0], hardness: [2, 10] },
  ];
  
  const [currentCard, setCurrentCard] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [waterFilter, setWaterFilter] = useState("all"); // all | freshwater | brackish | saltwater
  const [sortAggressiveness, setSortAggressiveness] = useState("none"); // none | asc | desc

  // Lista przefiltrowana i posortowana dla panelu
  const filteredFish = fishCards
    .filter((f) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery = q === "" || f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q);
      const matchesWater = waterFilter === "all" || f.waterType === waterFilter;
      return matchesQuery && matchesWater;
    })
    .sort((a, b) => {
      if (sortAggressiveness === "asc") return a.aggressiveness - b.aggressiveness;
      if (sortAggressiveness === "desc") return b.aggressiveness - a.aggressiveness;
      return 0;
    });
  
  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % fishCards.length);
  };
  
  const handlePrev = () => {
    setCurrentCard((prev) => (prev - 1 + fishCards.length) % fishCards.length);
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

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      position: "relative",
    }}>
      <video
      autoPlay
      loop
      muted
      playsInline
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0
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
            InputProps={{ sx: { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' } }}
          />
          <FormControl size="small">
            <InputLabel sx={{ color: 'white' }}>{t('waterType', { defaultValue: 'Typ wody' })}</InputLabel>
            <Select
              value={waterFilter}
              label={t('waterType', { defaultValue: 'Typ wody' })}
              onChange={(e) => setWaterFilter(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
            >
              <MenuItem value="all">{t('all', { defaultValue: 'Wszystkie' })}</MenuItem>
              <MenuItem value="freshwater">{t('freshwater', { defaultValue: 'Słodka' })}</MenuItem>
              <MenuItem value="brackish">{t('brackish', { defaultValue: 'Słonawa' })}</MenuItem>
              <MenuItem value="saltwater">{t('saltwater', { defaultValue: 'Słona' })}</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel sx={{ color: 'white' }}>{t('aggressiveness', { defaultValue: 'Agresywność' })}</InputLabel>
            <Select
              value={sortAggressiveness}
              label={t('aggressiveness', { defaultValue: 'Agresywność' })}
              onChange={(e) => setSortAggressiveness(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
            >
              <MenuItem value="none">{t('noSort', { defaultValue: 'Bez sortowania' })}</MenuItem>
              <MenuItem value="asc">{t('leastAggressive', { defaultValue: 'Najmniej agresywne' })}</MenuItem>
              <MenuItem value="desc">{t('mostAggressive', { defaultValue: 'Najbardziej agresywne' })}</MenuItem>
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
                  primary={fish.name}
                  secondary={`${fish.description} • ${t('water', { defaultValue: 'Woda' })}: ${fish.waterType} • ${t('agg', { defaultValue: 'Agres.' })}: ${fish.aggressiveness}`}
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
      <Box sx={{ 
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: 4, py: 2, zIndex: 10
      }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Przycisk powrotu */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{
              bgcolor: 'rgba(255, 255, 255, 0.4)', p: 0.8, borderRadius: 1.5, boxShadow: 2,
              transition: "all 0.3s", backdropFilter: 'blur(8px)',
              "&:hover": { boxShadow: 4, transform: "translateY(-2px)", bgcolor: 'rgba(255, 255, 255, 0.6)' },
              cursor: 'pointer', minHeight: '60px', minWidth: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <KeyboardReturnOutlinedIcon sx={{ fontSize: 16, mb: 0.3 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: '0.65rem' }}>
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
      <Box sx={{ 
        position: "relative", 
        zIndex: 2, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        pt: 14,
        pb: 4
      }}>
        {/* Karuzela kafelków - kontener flexbox wyśrodkowujący wszystko */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: '650px',
          gap: 2
        }}>
          {/* Wewnętrzny kontener z większą szerokością dla kart */}
          <Box sx={{
            position: 'relative',
            width: { xs: '90%', md: '45%' },
            maxWidth: { xs: '100%', md: 350 },
            height: '650px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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
                    minHeight: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: position.zIndex,
                    opacity: position.opacity,
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: position.zIndex === 3 ? 'default' : 'pointer',
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
                
                {/* Obraz ryby */}
                <Box sx={{
                  width: '100%',
                  height: '250px',
                  bgcolor: 'rgba(40, 60, 100, 0.8)',
                  backgroundImage: `url("${fish.image}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Placeholder jeśli brak obrazu */}
                  <Typography sx={{ color: 'white', opacity: 0.5 }}>
                    {fish.image || 'Image'}
                  </Typography>
                </Box>

                {/* Treść kafelka */}
                <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'white', 
                      mb: 2, 
                      fontWeight: 600 
                    }}
                  >
                    {fish.name}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.6,
                      mb: 'auto'
                    }}
                  >
                    {fish.description}
                  </Typography>
                  
                  {/* Przycisk "Dodaj do akwarium" tylko na głównej karcie */}
                  {position.zIndex === 3 && (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      mt: 3, 
                      pt: 3 
                    }}>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Dodano ${fish.name} do akwarium!`);
                        }}
                        variant="contained"
                        sx={{
                          bgcolor: '#FFD700',
                          color: '#000',
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600,
                          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
                          transition: 'all 0.3s',
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

