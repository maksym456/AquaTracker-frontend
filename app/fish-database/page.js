"use client";

import { useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import LanguageSwitcher from "../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function FishDatabasePage() {
  const { t } = useTranslation();
  
  // Przykładowe dane kafelków (później zastąpisz prawdziwymi danymi)
  const fishCards = [
    { id: 1, name: "Goldfish", description: "Popularna ryba akwariowa", image: "/fish1.jpg" },
    { id: 2, name: "Guppy", description: "Kolorowa, łatwa w hodowli", image: "/fish2.jpg" },
    { id: 3, name: "Betta", description: "Piękna ryba bojowa", image: "/fish3.jpg" },
  ];
  
  const [currentCard, setCurrentCard] = useState(0);
  
  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % fishCards.length);
  };
  
  const handlePrev = () => {
    setCurrentCard((prev) => (prev - 1 + fishCards.length) % fishCards.length);
  };

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      position: "relative",
      backgroundImage: 'url("/fishPage-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
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
        {/* Karuzela kafelków */}
        <Box sx={{
          position: 'relative',
          width: { xs: '85%', sm: '60%', md: '40%' },
          maxWidth: 450,
        }}>
          {/* Kafelek z informacjami o rybie */}
          <Box sx={{
            position: 'relative',
            bgcolor: 'rgba(20, 30, 50, 0.9)',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Strzałki nawigacyjne wewnątrz kafelka */}
            <Box sx={{
              position: 'absolute',
              top: 16,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              zIndex: 10
            }}>
              <IconButton 
                onClick={handlePrev}
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.6)' }
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton 
                onClick={handleNext}
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.6)' }
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
            {/* Obraz ryby */}
            <Box sx={{
              width: '100%',
              height: '250px',
              bgcolor: 'rgba(40, 60, 100, 0.8)',
              backgroundImage: `url("${fishCards[currentCard].image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Placeholder jeśli brak obrazu */}
              <Typography sx={{ color: 'white', opacity: 0.5 }}>
                {fishCards[currentCard].image || 'Image'}
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
                {fishCards[currentCard].name}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.6,
                  mb: 'auto'
                }}
              >
                {fishCards[currentCard].description}
              </Typography>
              
              {/* Przycisk "Dodaj do akwarium" */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 3, 
                pt: 3 
              }}>
                <Button
                  onClick={() => alert(`Dodano ${fishCards[currentCard].name} do akwarium!`)}
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
            </Box>
          </Box>

          {/* Wskaźnik aktualnego kafelka */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mt: 2
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

