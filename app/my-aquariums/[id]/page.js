"use client";

import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "../../contexts/ThemeContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import { mockAquariums } from "../../lib/mockData";

export default function AquariumDetailPage() {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const router = useRouter();
  const params = useParams();
  const aquariumId = params?.id;
  const [aquarium, setAquarium] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Znajdź akwarium po ID
    const foundAquarium = mockAquariums.find(a => a.id === aquariumId);
    if (foundAquarium) {
      setAquarium(foundAquarium);
      // Lazy loading - wczytaj obraz dopiero po wejściu na stronę
      setImageLoaded(true);
    } else {
      // Jeśli nie znaleziono, przekieruj do listy
      router.push('/my-aquariums');
    }
  }, [aquariumId, router]);

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

      <Box sx={{ 
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        px: { xs: 2, sm: 4 }, py: 1.5, zIndex: 10,
        gap: 2
      }}>
        {/* Lewa strona - przycisk Return */}
        <Box>
          <Link href="/my-aquariums" style={{ textDecoration: 'none' }}>
            <Box sx={{
              bgcolor: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)', 
              p: { xs: 0.5, sm: 0.8 }, 
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
              minHeight: { xs: '50px', sm: '60px' }, 
              minWidth: { xs: '60px', sm: '80px' }, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <KeyboardReturnOutlinedIcon sx={{ fontSize: { xs: 14, sm: 16 }, mb: 0.3, color: darkMode ? 'white' : 'inherit' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: darkMode ? 'white' : "text.primary", textAlign: 'center', fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
                {t("return")}
              </Typography>
            </Box>
          </Link>
        </Box>
        
        {/* Środek - Informacje o akwarium wyśrodkowane */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{
            bgcolor: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderRadius: 1.5,
            px: 2,
            py: 1,
            backdropFilter: 'blur(10px)',
            boxShadow: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
              {aquarium.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                {t("waterType", { defaultValue: "Typ wody" })}: {aquarium.waterType === 'freshwater' ? t("freshwater", { defaultValue: "Słodkowodne" }) : t("saltwater", { defaultValue: "Słonowodne" })}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                🌡️ {aquarium.temperature}°C
              </Typography>
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                pH: {aquarium.ph}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                💧 {aquarium.hardness} dGH
              </Typography>
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                🌍 {aquarium.biotope === 'ameryka południowa' ? t("biotopeSouthAmerica", { defaultValue: "Ameryka Południowa" }) :
                    aquarium.biotope === 'ameryka północna' ? t("biotopeNorthAmerica", { defaultValue: "Ameryka Północna" }) :
                    aquarium.biotope === 'azja' ? t("biotopeAsia", { defaultValue: "Azja" }) :
                    aquarium.biotope === 'afryka' ? t("biotopeAfrica", { defaultValue: "Afryka" }) :
                    aquarium.biotope === 'australia/Oceania' ? t("biotopeAustralia", { defaultValue: "Australia/Oceania" }) :
                    aquarium.biotope}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                🐟 {aquarium.fishes?.length || 0}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, whiteSpace: 'nowrap', color: darkMode ? 'white' : 'inherit' }}>
                🌿 {aquarium.plants?.length || 0}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Prawa strona - Language Switcher */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <LanguageSwitcher />
        </Box>
      </Box>

      {/* Lazy loading obrazu akwarium - tylko gdy imageLoaded === true */}
      {imageLoaded && (
        <Box sx={{ position: 'absolute', left: 0, right: 0, top: 96, bottom: 0, zIndex: 1 }}>
          {/* Warstwa obrazu */}
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
          
          {/* Bąbelki */}
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
          
          {/* Światło */}
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
        </Box>
      )}


      {/* Footer z przyciskami */}
      <Box sx={{
        position: 'fixed', left: 0, right: 0, bottom: 0,
        display: 'flex', justifyContent: 'center', gap: 2,
        py: 1.5, px: 2,
        backdropFilter: 'blur(8px)',
        background: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255,255,255,0.6)',
        boxShadow: '0 -6px 16px rgba(0,0,0,0.2)',
        zIndex: 20
      }}>
        <Button variant="contained" onClick={() => alert(t("addFish"))}>
          {t("addFish")}
        </Button>
        <Button variant="contained" onClick={() => alert(t("addPlant"))}>
          {t("addPlant")}
        </Button>
      </Box>
    </Box>
  );
}

