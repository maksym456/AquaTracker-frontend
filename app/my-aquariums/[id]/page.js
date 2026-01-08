"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Box, Button, Typography, Modal, Paper, Grid, Divider, CircularProgress, Alert, TextField, List, ListItem, ListItemText, IconButton, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "../../contexts/ThemeContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import { getAquariumById, addFishToAquarium, removeFishFromAquarium, addPlantToAquarium, removePlantFromAquarium, getFishes, getPlants } from "../../lib/api";

export default function AquariumDetailPage() {
  
  const { t } = useTranslation();

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
  const imageContainerRef = useRef(null);

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

  async function handleAddFish() {
    if (!selectedFishId || !aquariumId) return;
    
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
          </>
        )}
      </Box>

      {/* Listy ryb i roślin */}
      {aquarium && (
        <Box sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 60,
          zIndex: 15,
          maxHeight: '40vh',
          overflowY: 'auto',
          px: 2,
          py: 1
        }}>
          <Grid container spacing={2}>
            {/* Lista ryb */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{
                p: 2,
                bgcolor: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}>
                <Typography variant="h6" sx={{ mb: 1, color: darkMode ? 'white' : 'inherit' }}>
                  🐟 {t("fishes", { defaultValue: "Ryby" })} ({totalFishesCount})
                </Typography>
                {aquarium.fishes && aquarium.fishes.length > 0 ? (
                  <List dense>
                    {aquarium.fishes.map((fish, index) => {
                      // Znajdź szczegóły ryby w dostępnych rybach
                      const fishDetails = availableFishes.find(f => f.id === fish.fishId);
                      const fishName = fishDetails?.name || `Ryba ${index + 1}`;
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
                    {t("noFishes", { defaultValue: "Brak ryb w akwarium" })}
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Lista roślin */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{
                p: 2,
                bgcolor: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}>
                <Typography variant="h6" sx={{ mb: 1, color: darkMode ? 'white' : 'inherit' }}>
                  🌿 {t("plants", { defaultValue: "Rośliny" })} ({totalPlantsCount})
                </Typography>
                {aquarium.plants && aquarium.plants.length > 0 ? (
                  <List dense>
                    {aquarium.plants.map((plant, index) => {
                      // Znajdź szczegóły rośliny w dostępnych roślinach
                      const plantDetails = availablePlants.find(p => p.id === plant.plantId);
                      const plantName = plantDetails?.name || `Roślina ${index + 1}`;
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
                    {t("noPlants", { defaultValue: "Brak roślin w akwarium" })}
                  </Typography>
                )}
              </Paper>
            </Grid>
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
                                {item.species}:
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
                                {item.species}:
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
                            {statistics.mostCommonFish.species}: {statistics.mostCommonFish.count}
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
                            {statistics.mostCommonPlant.species}: {statistics.mostCommonPlant.count}
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
              {availableFishes.map((fish) => (
                <MenuItem key={fish.id} value={fish.id}>
                  {fish.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            type="number"
            label={t("quantity", { defaultValue: "Ilość" })}
            value={fishQuantity}
            onChange={(e) => setFishQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1 }}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={() => {
              setAddFishModalOpen(false);
              setSelectedFishId("");
              setFishQuantity(1);
            }}>
              {t("cancel", { defaultValue: "Anuluj" })}
            </Button>
            <Button
              variant="contained"
              onClick={handleAddFish}
              disabled={!selectedFishId || isAddingFish}
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
                  {plant.name}
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
    </Box>
  );
}

