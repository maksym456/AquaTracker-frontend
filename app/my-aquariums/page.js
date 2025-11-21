"use client";

import { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography, Modal, TextField, Grid, Card, CardContent, CardActionArea, Select, MenuItem, FormControl, InputLabel, Paper, Divider, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { mockAquariums, addAquarium, mockFishes, mockPlants } from "../lib/mockData";
import { useTheme } from "../contexts/ThemeContext";

export default function MyAquariumsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { darkMode } = useTheme();
  const [aquariums, setAquariums] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [statisticsModalOpen, setStatisticsModalOpen] = useState(false);
  const [newAquariumName, setNewAquariumName] = useState("");
  const [newAquariumWaterType, setNewAquariumWaterType] = useState("freshwater");
  const [newAquariumTemperature, setNewAquariumTemperature] = useState("24");
  const [newAquariumBiotope, setNewAquariumBiotope] = useState("ameryka południowa");
  const [newAquariumPh, setNewAquariumPh] = useState("7.0");
  const [newAquariumHardness, setNewAquariumHardness] = useState("8");

  useEffect(() => {
    
    setAquariums(mockAquariums);
  }, []);

  function handleCreateAquarium() {
    setCreateModalOpen(true);
  }

  function handleSaveAquarium() {
    if (newAquariumName.trim()) {
      const newAquarium = {
        name: newAquariumName,
        waterType: newAquariumWaterType,
        temperature: parseFloat(newAquariumTemperature),
        biotope: newAquariumBiotope,
        ph: parseFloat(newAquariumPh),
        hardness: parseFloat(newAquariumHardness),
        description: ""
      };
      addAquarium(newAquarium);
      setAquariums([...mockAquariums]);
      setNewAquariumName("");
      setNewAquariumWaterType("freshwater");
      setNewAquariumTemperature("24");
      setNewAquariumBiotope("ameryka południowa");
      setNewAquariumPh("7.0");
      setNewAquariumHardness("8");
      setCreateModalOpen(false);
    }
  }

  function handleOpenAquarium(aquariumId) {
    router.push(`/my-aquariums/${aquariumId}`);
  }

  const handleOpenStatistics = () => {
    setStatisticsModalOpen(true);
  };

  const handleCloseStatistics = () => {
    setStatisticsModalOpen(false);
  };

  const allStatistics = useMemo(() => {
    if (aquariums.length === 0) return null;

    const allFishes = aquariums.flatMap(aquarium => 
      mockFishes.filter(fish => aquarium.fishes?.includes(fish.id))
    );

    const allPlants = aquariums.flatMap(aquarium =>
      mockPlants.filter(plant => aquarium.plants?.includes(plant.id))
    );

    const uniqueFishSpecies = new Set(allFishes.map(fish => fish.species));
    const fishSpeciesCount = uniqueFishSpecies.size;

    const uniquePlantSpecies = new Set(allPlants.map(plant => plant.species || plant.name));
    const plantSpeciesCount = uniquePlantSpecies.size;

    const fishBySpecies = allFishes.reduce((acc, fish) => {
      acc[fish.species] = (acc[fish.species] || 0) + 1;
      return acc;
    }, {});

    const fishSpeciesData = Object.entries(fishBySpecies)
      .map(([species, count]) => ({
        species,
        count,
        percentage: allFishes.length > 0 ? (count / allFishes.length) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count); 

    const mostCommonFish = fishSpeciesData.length > 0 ? fishSpeciesData[0] : null;

    const plantsBySpecies = allPlants.reduce((acc, plant) => {
      const species = plant.species || plant.name;
      acc[species] = (acc[species] || 0) + 1;
      return acc;
    }, {});

    const plantSpeciesData = Object.entries(plantsBySpecies)
      .map(([species, count]) => ({
        species,
        count,
        percentage: allPlants.length > 0 ? (count / allPlants.length) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);

    const mostCommonPlant = plantSpeciesData.length > 0 ? plantSpeciesData[0] : null;

    const fishLengthMap = {
      "Neon Innesa": 3.5, 
      "Gupik": 4.5, 
      "Mieczyk Hellera": 11, 
      "Danio pręgowany": 4.5, 
      "Kardynałek chiński": 3.5, 
      "Bojownik syjamski": 6.5, 
      "Gurami mozaikowy": 11, 
      "Kirys pstry": 6.5, 
      "Zbrojnik / Glonojad": 12.5, 
      "Pyszczak Malawi": 12.5, 
      "Pirania czerwona": 27.5, 
      "Księżniczka z Burundi": 8.5, 
      "Welonka (Złota rybka)": 20, 
      "Razbora klinowa": 4.5, 
      "Skalar": 15, 
      "Tęczanka neonowa": 7, 
      "Proporczykowiec": 5, 
      "Molinezja": 7, 
      "Kolcobrzuch karłowaty": 3, 
      "Babka złota": 6, 
      "Błazenek pomarańczowy": 9.5, 
      "Pokolec królewski": 22.5, 
      "Mandaryn wspaniały": 7.5, 
      "Ustnik słoneczny": 27.5, 
      "Poecilia reticulata": 4.5 
    };

    let totalOverstocking = 0;

    aquariums.forEach(aquarium => {
      
      const volume = aquarium.volume || 200;

      const aquariumFishes = mockFishes.filter(fish => aquarium.fishes?.includes(fish.id));

      let totalFishLength = 0;
      aquariumFishes.forEach(fish => {
        
        const length = fishLengthMap[fish.name] || fishLengthMap[fish.species] || 5; 
        totalFishLength += length;
      });

      const occupancy = volume > 0 ? (totalFishLength / volume) * 100 : 0;
      
      totalOverstocking += occupancy;
    });

    const averageOccupancy = aquariums.length > 0 
      ? (totalOverstocking / aquariums.length).toFixed(1)
      : 0;

    return {
      totalAquariums: aquariums.length,
      totalFishes: allFishes.length,
      totalPlants: allPlants.length,
      fishSpeciesCount,
      plantSpeciesCount,
      mostCommonFish,
      mostCommonPlant,
      averageOccupancy,
      fishSpeciesData,
      plantSpeciesData
    };
  }, [aquariums]);

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 96,
        background: 'linear-gradient(to bottom right, #cfeef6 0%, #87cde1 50%, #2e7fa9 100%)',
        zIndex: 5
      }} />
      
      {}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: darkMode ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
          zIndex: 4,
          transition: 'background-color 0.3s ease',
          pointerEvents: 'none'
        }}
      />
      
      {}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 96,
          bgcolor: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
          zIndex: 6,
          transition: 'background-color 0.3s ease',
          pointerEvents: 'none'
        }}
      />

      <Box sx={{ 
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: { xs: 2, sm: 4 }, py: 2, zIndex: 10
      }}>
        <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 } }}>
          <Box 
            onClick={handleOpenStatistics}
            sx={{
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
            }}
          >
            <Typography sx={{ fontSize: { xs: 14, sm: 16 }, mb: 0.3, textAlign: 'center' }}>📊</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
              {t("statistics")}
            </Typography>
          </Box>
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
            <Typography sx={{ fontSize: { xs: 14, sm: 16 }, mb: 0.3, textAlign: 'center' }}>📋</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
              {t("history")}
            </Typography>
          </Box>
          <Link href="/" style={{ textDecoration: 'none' }}>
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
        <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 1, sm: 2 } }}>
          <LanguageSwitcher />
        </Box>
      </Box>

      {}
      <Box sx={{ position: "relative", zIndex: 2, p: 4, pt: 14, pb: 14 }}>
        {aquariums.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '400px',
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
              {t("noAquariums", { defaultValue: "Nie masz jeszcze żadnych akwariów" })}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              {t("createFirstAquarium", { defaultValue: "Kliknij przycisk poniżej, aby utworzyć swoje pierwsze akwarium" })}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {aquariums.map((aquarium) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={aquarium.id} sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    width: '250px',
                    height: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                  onClick={() => handleOpenAquarium(aquarium.id)}
                >
                  <CardActionArea sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '140px',
                        flexShrink: 0,
                        bgcolor: 'rgba(46, 127, 169, 0.2)',
                        backgroundImage: 'linear-gradient(135deg, #cfeef6 0%, #87cde1 50%, #2e7fa9 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <Typography sx={{ fontSize: 48, opacity: 0.6 }}>🐠</Typography>
                    </Box>
                    <CardContent sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column',
                      py: 1.5,
                      overflow: 'hidden'
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {aquarium.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 1,
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {aquarium.description || t("noDescription", { defaultValue: "Brak opisu" })}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 'auto', pt: 1, flexWrap: 'wrap' }}>
                        {}
                        {aquarium.temperature && (
                          <Typography variant="caption" color="text.secondary">
                            🌡️ {aquarium.temperature}°C
                          </Typography>
                        )}
                        {aquarium.ph && (
                          <Typography variant="caption" color="text.secondary">
                            pH {aquarium.ph}
                          </Typography>
                        )}
                        {aquarium.hardness && (
                          <Typography variant="caption" color="text.secondary">
                            🔷 {aquarium.hardness} dGH
                          </Typography>
                        )}
                        {}
                        <Typography variant="caption" color="text.secondary">
                          🐟 {aquarium.fishes?.length || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          🌿 {aquarium.plants?.length || 0}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {}
      <Box sx={{
        position: 'fixed', 
        left: 0, 
        right: 0, 
        bottom: 0,
        display: 'flex', 
        justifyContent: 'center', 
        gap: 2,
        py: 1.5, 
        px: 2,
        backdropFilter: 'blur(8px)',
        background: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255,255,255,0.6)',
        boxShadow: '0 -6px 16px rgba(0,0,0,0.2)',
        zIndex: 20
      }}>
        <Button 
          variant="outlined" 
          startIcon={<PersonAddIcon />}
          onClick={() => router.push('/contacts')}
          sx={{
            borderColor: '#1976d2',
            color: '#1976d2',
            '&:hover': {
              borderColor: '#1565c0',
              bgcolor: 'rgba(25, 118, 210, 0.08)'
            }
          }}
        >
          {t("inviteFriend", { defaultValue: "Zaproś przyjaciela" })}
        </Button>
        <Button variant="contained" color="primary" onClick={handleCreateAquarium}>
          {t("createAquarium")}
        </Button>
      </Box>

      {}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box sx={{
          width: { xs: '90%', sm: 400 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 3,
          boxShadow: 24
        }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            {t("createAquarium")}
          </Typography>
          <TextField
            fullWidth
            label={t("aquariumName", { defaultValue: "Nazwa akwarium" })}
            value={newAquariumName}
            onChange={(e) => setNewAquariumName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t("waterType", { defaultValue: "Typ wody" })}</InputLabel>
            <Select
              value={newAquariumWaterType}
              label={t("waterType", { defaultValue: "Typ wody" })}
              onChange={(e) => setNewAquariumWaterType(e.target.value)}
            >
              <MenuItem value="freshwater">{t("freshwater", { defaultValue: "Słodkowodne" })}</MenuItem>
              <MenuItem value="saltwater">{t("saltwater", { defaultValue: "Słonowodne" })}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="number"
            label={t("temperature", { defaultValue: "Temperatura wody (°C)" })}
            value={newAquariumTemperature}
            onChange={(e) => setNewAquariumTemperature(e.target.value)}
            inputProps={{ min: 18, max: 30, step: 0.5 }}
            sx={{ mb: 2 }}
            helperText={t("temperatureRange", { defaultValue: "Zakres: 18-30°C" })}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t("biotope", { defaultValue: "Biotop" })}</InputLabel>
            <Select
              value={newAquariumBiotope}
              label={t("biotope", { defaultValue: "Biotop" })}
              onChange={(e) => setNewAquariumBiotope(e.target.value)}
            >
              <MenuItem value="ameryka południowa">{t("biotopeSouthAmerica", { defaultValue: "Ameryka Południowa" })}</MenuItem>
              <MenuItem value="ameryka północna">{t("biotopeNorthAmerica", { defaultValue: "Ameryka Północna" })}</MenuItem>
              <MenuItem value="azja">{t("biotopeAsia", { defaultValue: "Azja" })}</MenuItem>
              <MenuItem value="afryka">{t("biotopeAfrica", { defaultValue: "Afryka" })}</MenuItem>
              <MenuItem value="australia/Oceania">{t("biotopeAustralia", { defaultValue: "Australia/Oceania" })}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="number"
            label={t("ph", { defaultValue: "pH wody" })}
            value={newAquariumPh}
            onChange={(e) => setNewAquariumPh(e.target.value)}
            inputProps={{ min: 5.5, max: 9.0, step: 0.1 }}
            sx={{ mb: 2 }}
            helperText={t("phRange", { defaultValue: "Zakres: 5.5-9.0" })}
          />
          <TextField
            fullWidth
            type="number"
            label={t("hardness", { defaultValue: "Twardość wody (dGH)" })}
            value={newAquariumHardness}
            onChange={(e) => setNewAquariumHardness(e.target.value)}
            inputProps={{ min: 1, max: 30, step: 1 }}
            sx={{ mb: 3 }}
            helperText={t("hardnessRange", { defaultValue: "Zakres: 1-30 dGH" })}
          />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={() => setCreateModalOpen(false)}>
              {t("cancel", { defaultValue: "Anuluj" })}
            </Button>
            <Button variant="contained" onClick={handleSaveAquarium} disabled={!newAquariumName.trim()}>
              {t("create", { defaultValue: "Utwórz" })}
            </Button>
          </Box>
        </Box>
      </Modal>

      {}
      <Modal
        open={statisticsModalOpen}
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
              {t("statistics")} - {t("allAquariums", { defaultValue: "Wszystkie akwaria" })}
            </Typography>
            <Button onClick={handleCloseStatistics} variant="outlined" size="small">
              {t("close", { defaultValue: "Zamknij" })}
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {}
          {allStatistics ? (
            <Grid container spacing={3}>
              {}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: darkMode ? 'white' : 'inherit' }}>
                  {t("statsDesc", { defaultValue: "Podsumowanie" })}
                </Typography>
                
                <Grid container spacing={2}>
                  {}
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(33, 150, 243, 0.1)'
                      }}
                    >
                      <Typography variant="h4" sx={{ color: darkMode ? 'white' : '#2196f3', fontWeight: 600 }}>
                        {allStatistics.totalAquariums}
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                        🏠 {t("myAquariums", { defaultValue: "Akwariów" })}
                      </Typography>
                    </Paper>
                  </Grid>

                  {}
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(46, 127, 169, 0.1)'
                      }}
                    >
                      <Typography variant="h4" sx={{ color: darkMode ? 'white' : '#2e7fa9', fontWeight: 600 }}>
                        {allStatistics.totalFishes}
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                        🐟 {t("fishes", { defaultValue: "Ryb" })}
                      </Typography>
                    </Paper>
                  </Grid>

                  {}
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(76, 175, 80, 0.1)'
                      }}
                    >
                      <Typography variant="h4" sx={{ color: darkMode ? 'white' : '#4caf50', fontWeight: 600 }}>
                        {allStatistics.totalPlants}
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                        🌿 {t("plants", { defaultValue: "Roślin" })}
                      </Typography>
                    </Paper>
                  </Grid>

                  {}
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(156, 39, 176, 0.1)'
                      }}
                    >
                      <Typography variant="h4" sx={{ color: darkMode ? 'white' : '#9c27b0', fontWeight: 600 }}>
                        {allStatistics.fishSpeciesCount}
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                        {t("fishSpecies", { defaultValue: "Gatunków ryb" })}
                      </Typography>
                    </Paper>
                  </Grid>

                  {}
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(76, 175, 80, 0.2)'
                      }}
                    >
                      <Typography variant="h4" sx={{ color: darkMode ? 'white' : '#4caf50', fontWeight: 600 }}>
                        {allStatistics.plantSpeciesCount}
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
                  {t("overstocking", { defaultValue: "Przerybienie akwariów" })}
                </Typography>
                
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                        {t("averageOccupancy", { defaultValue: "Średnia zajętość" })}:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: darkMode ? 'white' : 'inherit' }}>
                        {allStatistics.averageOccupancy}%
                      </Typography>
                    </Box>
                    
                    {}
                    <Box
                      sx={{
                        width: '100%',
                        height: 30,
                        bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        borderRadius: 2,
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      <Box
                        sx={{
                          width: `${Math.min(parseFloat(allStatistics.averageOccupancy), 100)}%`,
                          height: '100%',
                          
                          bgcolor: parseFloat(allStatistics.averageOccupancy) < 80
                            ? '#4caf50' 
                            : parseFloat(allStatistics.averageOccupancy) <= 100
                            ? '#ff9800' 
                            : '#f44336', 
                          transition: 'width 0.5s ease-in-out',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {parseFloat(allStatistics.averageOccupancy) > 15 && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          >
                            {allStatistics.averageOccupancy}%
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'text.secondary', mt: 1, display: 'block' }}>
                      {t("overstockingInfo", { defaultValue: "Zasada: 1cm ryby = 1 litr wody" })}
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'text.secondary', mt: 0.5, display: 'block' }}>
                      {t("aquariumVolume", { defaultValue: "Objętość akwarium" })}: 200L
                    </Typography>
                  </Box>
                </Paper>
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
                  {allStatistics.fishSpeciesData.length > 0 ? (
                    <Box>
                      {allStatistics.fishSpeciesData.map((item, index) => {
                        const colors = ['#2e7fa9', '#4caf50', '#ff9800', '#9c27b0', '#f44336', '#00bcd4'];
                        const color = colors[index % colors.length];
                        
                        return (
                          <Box key={item.species} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                                {item.species}::
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
                      {t("noFishInAquarium", { defaultValue: "Brak ryb w akwariach" })}
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
                  {allStatistics.plantSpeciesData.length > 0 ? (
                    <Box>
                      {allStatistics.plantSpeciesData.map((item, index) => {
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
                      {t("noPlantsInAquarium", { defaultValue: "Brak roślin w akwariach" })}
                    </Typography>
                  )}
                </Paper>
              </Grid>

              {}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: darkMode ? 'white' : 'inherit' }}>
                  {t("mostCommonSpecies", { defaultValue: "Najliczniejszy gatunek" })}
                </Typography>
                
                <Grid container spacing={2}>
                  {}
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(46, 127, 169, 0.1)',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="body1" sx={{ mb: 2, color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                        🐟 {t("fishes", { defaultValue: "Ryb" })}
                      </Typography>
                      {allStatistics.mostCommonFish ? (
                        <>
                          <Typography variant="h5" sx={{ color: darkMode ? 'white' : '#2e7fa9', fontWeight: 600, mb: 1 }}>
                            {allStatistics.mostCommonFish.species}: {allStatistics.mostCommonFish.count}
                          </Typography>
                          <Typography variant="h6" sx={{ color: darkMode ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}>
                            {t("pieces", { defaultValue: "sztuk" })} ({allStatistics.mostCommonFish.percentage.toFixed(1)}%)
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
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        bgcolor: darkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(76, 175, 80, 0.1)',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="body1" sx={{ mb: 2, color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                        🌿 {t("plants", { defaultValue: "Roślin" })}
                      </Typography>
                      {allStatistics.mostCommonPlant ? (
                        <>
                          <Typography variant="h5" sx={{ color: darkMode ? 'white' : '#4caf50', fontWeight: 600, mb: 1 }}>
                            {allStatistics.mostCommonPlant.species}: {allStatistics.mostCommonPlant.count}
                          </Typography>
                          <Typography variant="h6" sx={{ color: darkMode ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}>
                            {t("pieces", { defaultValue: "sztuk" })} ({allStatistics.mostCommonPlant.percentage.toFixed(1)}%)
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
    </Box>
  );
}
