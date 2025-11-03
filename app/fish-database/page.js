"use client";

import { useState } from "react";
import { Box, Typography, IconButton, Button, useTheme, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import LanguageSwitcher from "../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function FishDatabasePage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Przykładowe dane kafelków 
  const fishCards = [
    { id: 1, name: "Goldfish", description: "Popularna ryba akwariowa", image: "/fish1.jpg" },
    { id: 2, name: "Guppy", description: "Kolorowa, łatwa w hodowli", image: "/fish2.jpg" },
    { id: 3, name: "Betta", description: "Piękna ryba bojowa", image: "/fish3.jpg" },
    { id: 4, name: "RybaX", description: "Tutaj będzie opis ryby", image: "/fish4.jpg" },
    { id: 5, name: "Tetra", description: "Mała, kolorowa ryba", image: "/fish5.jpg" },
  ];
  
  const [currentCard, setCurrentCard] = useState(0);
  
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

