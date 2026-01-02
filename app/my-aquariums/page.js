"use client";

import { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography, Modal, TextField, Grid, Card, CardContent, CardActionArea, Select, MenuItem, FormControl, InputLabel, Paper, Divider, CircularProgress, List, ListItem, ListItemText, Chip, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useTheme } from "../contexts/ThemeContext";
import { useSession } from "next-auth/react";

import { getAquariums, createAquarium } from "../lib/api";

export default function MyAquariumsPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { darkMode } = useTheme();
    const [aquariums, setAquariums] = useState([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [statisticsModalOpen, setStatisticsModalOpen] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedActionFilter, setSelectedActionFilter] = useState("all");
    const [selectedAquariumFilter, setSelectedAquariumFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");
    const [newAquariumName, setNewAquariumName] = useState("");
    const [newAquariumWaterType, setNewAquariumWaterType] = useState("freshwater");
    const [newAquariumTemperature, setNewAquariumTemperature] = useState("24");
    const [newAquariumBiotope, setNewAquariumBiotope] = useState("ameryka południowa");
    const [newAquariumPh, setNewAquariumPh] = useState("7.0");
    const [newAquariumHardness, setNewAquariumHardness] = useState("8");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session } = useSession();
    const userId = session?.user?.id;


    useEffect(() => {
        if (!userId) return;

        (async () => {
            try {
                setIsLoading(true);
                setError(null);

                const data = await getAquariums(userId);
                setAquariums(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
                setError(e.message || "Nie udało się załadować akwariów.");
                setAquariums([]);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [userId]);

  function handleCreateAquarium() {
    setCreateModalOpen(true);
  }

  async function handleSaveAquarium() {
    if (!newAquariumName.trim()) return;
    
    try {
      const newAquarium = {
        name: newAquariumName,
        waterType: newAquariumWaterType,
        temperature: parseFloat(newAquariumTemperature),
        biotope: newAquariumBiotope,
        ph: parseFloat(newAquariumPh),
        hardness: parseFloat(newAquariumHardness),
        description: ""
      };
      
      const created = await createAquarium(newAquarium);
      
      // Dodajemy nowe akwarium do listy
      setAquariums([...aquariums, created]);
      
      // Resetujemy formularz
      setNewAquariumName("");
      setNewAquariumWaterType("freshwater");
      setNewAquariumTemperature("24");
      setNewAquariumBiotope("ameryka południowa");
      setNewAquariumPh("7.0");
      setNewAquariumHardness("8");
      setCreateModalOpen(false);
    } catch (err) {
      console.error("Error creating aquarium:", err);
      setError(err.message || "Nie udało się utworzyć akwarium.");
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

  const handleOpenHistory = () => {
    setHistoryModalOpen(true);
  };

  const handleCloseHistory = () => {
    setHistoryModalOpen(false);
  };

  // TODO: Pobierz historię aktywności z API
  const activityHistory = [
    { id: '1', type: 'created', aquarium: 'Moje pierwsze akwarium', date: new Date('2024-01-15T10:30:00'), details: 'Akwarium zostało utworzone' },
    { id: '2', type: 'fishAdded', aquarium: 'Moje pierwsze akwarium', date: new Date('2024-01-16T14:20:00'), details: 'Dodano rybę: Gupik' },
    { id: '3', type: 'plantAdded', aquarium: 'Moje pierwsze akwarium', date: new Date('2024-01-17T09:15:00'), details: 'Dodano roślinę: Anubias' },
    { id: '4', type: 'parameterChanged', aquarium: 'Moje pierwsze akwarium', date: new Date('2024-01-18T16:45:00'), details: 'Zmieniono temperaturę: 22°C → 24°C' },
    { id: '5', type: 'created', aquarium: 'Drugie akwarium', date: new Date('2024-01-20T11:00:00'), details: 'Akwarium zostało utworzone' },
    { id: '6', type: 'edited', aquarium: 'Moje pierwsze akwarium', date: new Date('2024-01-21T13:30:00'), details: 'Zaktualizowano parametry akwarium' },
    { id: '7', type: 'fishRemoved', aquarium: 'Moje pierwsze akwarium', date: new Date('2024-01-22T15:20:00'), details: 'Usunięto rybę: Gupik' },
    { id: '8', type: 'parameterChanged', aquarium: 'Drugie akwarium', date: new Date('2024-01-23T10:10:00'), details: 'Zmieniono pH: 7.0 → 7.2' },
    { id: '9', type: 'plantAdded', aquarium: 'Drugie akwarium', date: new Date('2024-01-24T12:00:00'), details: 'Dodano roślinę: Moczarka' },
    { id: '10', type: 'parameterChanged', aquarium: 'Moje pierwsze akwarium', date: new Date('2024-01-25T14:30:00'), details: 'Zmieniono twardość wody: 10 dGH → 12 dGH' },
  ];

  const getActionLabel = (type) => {
    const labels = {
      created: t('actionCreated'),
      edited: t('actionEdited'),
      deleted: t('actionDeleted'),
      fishAdded: t('actionFishAdded'),
      fishRemoved: t('actionFishRemoved'),
      plantAdded: t('actionPlantAdded'),
      plantRemoved: t('actionPlantRemoved'),
      parameterChanged: t('actionParameterChanged'),
    };
    return labels[type] || type;
  };

  const getActionColor = (type) => {
    const colors = {
      created: '#4CAF50',
      edited: '#2196F3',
      deleted: '#F44336',
      fishAdded: '#FF9800',
      fishRemoved: '#E91E63',
      plantAdded: '#9C27B0',
      plantRemoved: '#F44336',
      parameterChanged: '#00BCD4',
    };
    return colors[type] || '#757575';
  };

  const filteredAndSortedActivities = activityHistory
    .filter(activity => {
      const actionMatch = selectedActionFilter === 'all' || activity.type === selectedActionFilter;
      const aquariumMatch = selectedAquariumFilter === 'all' || activity.aquarium === selectedAquariumFilter;
      return actionMatch && aquariumMatch;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.date - a.date;
      } else {
        return a.date - b.date;
      }
    });

  const uniqueAquariums = [...new Set(activityHistory.map(a => a.aquarium))];
  const actionTypes = ['created', 'edited', 'deleted', 'fishAdded', 'fishRemoved', 'plantAdded', 'plantRemoved', 'parameterChanged'];

  const allStatistics = useMemo(() => {
    if (aquariums.length === 0) return null;

    const allFishes = aquariums.flatMap(aquarium => 
      [] // TODO: Pobierz ryby z API
    );

    const allPlants = aquariums.flatMap(aquarium =>
      [] // TODO: Pobierz rośliny z API
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

    return {
      totalAquariums: aquariums.length,
      totalFishes: allFishes.length,
      totalPlants: allPlants.length,
      fishSpeciesCount,
      plantSpeciesCount,
      mostCommonFish,
      mostCommonPlant,
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

      <Box 
        component="nav"
        role="navigation"
        aria-label={t("mainNavigation", { defaultValue: "Główna nawigacja" })}
        sx={{ 
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: { xs: 0.5, sm: 2, md: 4 }, 
        py: { xs: 1, sm: 1.5, md: 2 }, 
        zIndex: 10,
        height: 96,
        maxWidth: '100%',
        overflow: 'hidden',
        gap: { xs: 0.5, sm: 1 }
      }}>
        <Box sx={{ 
          display: "flex", 
          gap: { xs: 0.25, sm: 0.5, md: 1 },
          alignItems: 'center',
          flexShrink: 0,
          overflow: 'hidden',
          justifyContent: 'flex-start'
        }}>
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
            <Typography sx={{ fontSize: { xs: 16, sm: 14, md: 16 }, mb: 0.2, textAlign: 'center', lineHeight: 1 }}>📊</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: { xs: '0.6rem', sm: '0.55rem', md: '0.65rem' }, lineHeight: 1.1 }}>
              {t("statistics")}
            </Typography>
          </Box>
          <Box 
            onClick={handleOpenHistory}
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
            <Typography sx={{ fontSize: { xs: 16, sm: 14, md: 16 }, mb: 0.2, textAlign: 'center', lineHeight: 1 }}>📋</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: { xs: '0.6rem', sm: '0.55rem', md: '0.65rem' }, lineHeight: 1.1 }}>
              {t("history")}
            </Typography>
          </Box>
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
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
              justifyContent: 'center'
            }}>
              <KeyboardReturnOutlinedIcon sx={{ fontSize: { xs: 16, sm: 14, md: 16 }, mb: 0.2, color: darkMode ? 'white' : 'inherit' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: darkMode ? 'white' : "text.primary", textAlign: 'center', fontSize: { xs: '0.6rem', sm: '0.55rem', md: '0.65rem' }, lineHeight: 1.1 }}>
                {t("return")}
              </Typography>
            </Box>
          </Link>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          ml: { xs: 0.5, sm: 1, md: 2 },
          flexShrink: 0
        }}>
          <LanguageSwitcher />
        </Box>
      </Box>

      {}
      <Box 
        component="main"
        sx={{ position: "relative", zIndex: 2, p: 4, pt: 14, pb: 14 }}>
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
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
            {aquariums.map((aquarium) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={aquarium.id} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' }, alignItems: 'stretch', height: { xs: '200px', sm: '250px', md: '260px', lg: '280px' } }}>
                <Card
                  sx={{
                    width: { xs: '280px', sm: '200px', md: '220px', lg: '250px' },
                    minWidth: { xs: '280px', sm: '200px', md: '220px', lg: '250px' },
                    maxWidth: { xs: '280px', sm: '200px', md: '220px', lg: '250px' },
                    minHeight: { xs: '200px', sm: '250px', md: '260px', lg: '280px' },
                    height: { xs: '200px', sm: '250px', md: '260px', lg: '280px' },
                    maxHeight: { xs: '200px', sm: '250px', md: '260px', lg: '280px' },
                    display: 'flex',
                    flexDirection: 'row',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    },
                    '@media (max-width: 599px)': {
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '140px',
                      minWidth: '140px',
                      maxWidth: '200px',
                      minHeight: '200px',
                      height: '200px',
                      maxHeight: '200px',
                    }
                  }}
                  onClick={() => handleOpenAquarium(aquarium.id)}
                >
                  <CardActionArea sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%', minHeight: 0, maxHeight: '100%', overflow: 'hidden' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: { xs: '90px', sm: '120px', md: '130px', lg: '140px' },
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
                      <Typography sx={{ fontSize: { xs: 32, sm: 40, md: 44, lg: 48 }, opacity: 0.6 }}>🐠</Typography>
                    </Box>
                    <CardContent sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column',
                      py: { xs: 0.75, sm: 1.25, md: 1.5 },
                      px: { xs: 1.25, sm: 1.5, md: 2 },
                      overflow: 'hidden',
                      minHeight: 0,
                      maxHeight: '100%',
                      '&.MuiCardContent-root': {
                        paddingBottom: { xs: '12px', sm: '16px', md: '24px' }
                      }
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: { xs: 0.5, sm: 1 },
                          fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          flexShrink: 0
                        }}
                      >
                        {aquarium.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: { xs: 0.5, sm: 1 },
                          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                          flex: 1,
                          minHeight: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {aquarium.description || t("noDescription", { defaultValue: "Brak opisu" })}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: { xs: 0.75, sm: 1.5, md: 2 }, 
                        mt: 'auto', 
                        pt: { xs: 0.5, sm: 1 }, 
                        flexWrap: 'wrap', 
                        flexShrink: 0,
                        maxHeight: { xs: '32px', sm: '40px' },
                        overflow: 'hidden',
                        alignItems: 'center'
                      }}>
                        {}
                        {aquarium.temperature && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                            🌡️ {aquarium.temperature}°C
                          </Typography>
                        )}
                        {aquarium.ph && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                            pH {aquarium.ph}
                          </Typography>
                        )}
                        {aquarium.hardness && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                            🔷 {aquarium.hardness} dGH
                          </Typography>
                        )}
                        {}
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                          🐟 {aquarium.fishes?.length || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
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

      {/* Modal z historią zmian */}
      <Modal
        open={historyModalOpen}
        onClose={handleCloseHistory}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Paper sx={{
          width: { xs: '95%', sm: '90%', md: 800 },
          maxHeight: '90vh',
          bgcolor: darkMode ? 'rgba(30, 30, 30, 0.95)' : 'background.paper',
          borderRadius: 2,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: darkMode ? 'white' : 'inherit' }}>
            {t("activityHistory", { defaultValue: "Historia aktywności" })}
          </Typography>
          
          {/* Filtry i sortowanie */}
          <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
              <InputLabel>{t("filterByAction", { defaultValue: "Filtruj po akcji" })}</InputLabel>
              <Select
                value={selectedActionFilter}
                onChange={(e) => setSelectedActionFilter(e.target.value)}
                label={t("filterByAction", { defaultValue: "Filtruj po akcji" })}
              >
                <MenuItem value="all">{t("allActions", { defaultValue: "Wszystkie akcje" })}</MenuItem>
                {actionTypes.map(type => (
                  <MenuItem key={type} value={type}>{getActionLabel(type)}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
              <InputLabel>{t("filterByAquarium", { defaultValue: "Filtruj po akwarium" })}</InputLabel>
              <Select
                value={selectedAquariumFilter}
                onChange={(e) => setSelectedAquariumFilter(e.target.value)}
                label={t("filterByAquarium", { defaultValue: "Filtruj po akwarium" })}
              >
                <MenuItem value="all">{t("allAquariums", { defaultValue: "Wszystkie akwaria" })}</MenuItem>
                {uniqueAquariums.map(aquarium => (
                  <MenuItem key={aquarium} value={aquarium}>{aquarium}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: { xs: '100%', sm: 180 } }}>
              <InputLabel>{t("sortByDate", { defaultValue: "Sortuj po dacie" })}</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                label={t("sortByDate", { defaultValue: "Sortuj po dacie" })}
              >
                <MenuItem value="newest">{t("newestFirst", { defaultValue: "Najnowsze najpierw" })}</MenuItem>
                <MenuItem value="oldest">{t("oldestFirst", { defaultValue: "Najstarsze najpierw" })}</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {/* Lista aktywności */}
          <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
            {filteredAndSortedActivities.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                  {t("noActivity", { defaultValue: "Brak aktywności" })}
                </Typography>
              </Box>
            ) : (
              <List>
                {filteredAndSortedActivities.map((activity) => (
                  <ListItem
                    key={activity.id}
                    sx={{
                      mb: 1,
                      bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      borderRadius: 1.5,
                      borderLeft: `4px solid ${getActionColor(activity.type)}`,
                      '&:hover': { bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Chip
                            label={getActionLabel(activity.type)}
                            size="small"
                            sx={{
                              bgcolor: getActionColor(activity.type),
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                          <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                            {activity.aquarium}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span" sx={{ display: 'block', mb: 0.5, color: darkMode ? 'rgba(255,255,255,0.9)' : 'inherit' }}>
                            {activity.details}
                          </Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'text.disabled' }}>
                            {activity.date.toLocaleString('pl-PL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
            <Button variant="contained" onClick={handleCloseHistory}>
              {t("close", { defaultValue: "Zamknij" })}
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}
