"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Box, Button, Typography, Modal, Paper, Grid, Divider, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "../../contexts/ThemeContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import { mockAquariums, mockFishes, mockPlants } from "../../lib/mockData";

export default function AquariumDetailPage() {
  
  const { t } = useTranslation();

  const { darkMode } = useTheme();

  const router = useRouter();

  const params = useParams();
  const aquariumId = params?.id;

  const [aquarium, setAquarium] = useState(null);

  const [imageLoaded, setImageLoaded] = useState(false);

  const [statisticsOpen, setStatisticsOpen] = useState(false);

  const imageContainerRef = useRef(null);

  useEffect(() => {

    const foundAquarium = mockAquariums.find(a => a.id === aquariumId);
    
    if (foundAquarium) {
      
      setAquarium(foundAquarium);
    } else {
      
      router.push('/my-aquariums');
    }
  }, [aquariumId, router]);

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

    const aquariumFishes = mockFishes.filter(fish => 
      aquarium.fishes?.includes(fish.id)
    );

    const aquariumPlants = mockPlants.filter(plant => 
      aquarium.plants?.includes(plant.id)
    );

    const uniqueFishSpecies = new Set(aquariumFishes.map(fish => fish.species));
    const fishSpeciesCount = uniqueFishSpecies.size;

    const uniquePlantSpecies = new Set(aquariumPlants.map(plant => plant.species || plant.name));
    const plantSpeciesCount = uniquePlantSpecies.size;

    const fishBySpecies = aquariumFishes.reduce((acc, fish) => {

      acc[fish.species] = (acc[fish.species] || 0) + 1;
      return acc;
    }, {});

    const fishSpeciesData = Object.entries(fishBySpecies)
      .map(([species, count]) => ({
        species,
        count,
        
        percentage: aquariumFishes.length > 0 ? (count / aquariumFishes.length) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count); 

    const mostCommonFish = fishSpeciesData.length > 0 ? fishSpeciesData[0] : null;

    const plantsBySpecies = aquariumPlants.reduce((acc, plant) => {
      const species = plant.species || plant.name;
      acc[species] = (acc[species] || 0) + 1;
      return acc;
    }, {});

    const plantSpeciesData = Object.entries(plantsBySpecies)
      .map(([species, count]) => ({
        species,
        count,
        percentage: aquariumPlants.length > 0 ? (count / aquariumPlants.length) * 100 : 0
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

    const volume = aquarium.volume || 200;

    let totalFishLength = 0;
    aquariumFishes.forEach(fish => {
      
      const length = fishLengthMap[fish.name] || fishLengthMap[fish.species] || 5; 
      totalFishLength += length;
    });

    const occupancy = volume > 0 ? ((totalFishLength / volume) * 100).toFixed(1) : 0;

    const maxFishLength = volume;
    
    return {
      totalFishes: aquariumFishes.length,
      totalPlants: aquariumPlants.length,
      fishSpeciesCount,
      plantSpeciesCount,
      mostCommonFish,
      mostCommonPlant,
      occupancy,
      maxFishLength, 
      totalFishLength, 
      fishSpeciesData,
      plantSpeciesData
    };
  }, [aquarium]);

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

      <Box sx={{ 
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        px: { xs: 2, sm: 4 }, py: 1.5, zIndex: 10,
        gap: 2
      }}>
        {}
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
        
        {}
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
        
        {}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
          {}
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
            <BarChartIcon sx={{ fontSize: { xs: 14, sm: 16 }, mb: 0.3, color: darkMode ? 'white' : 'inherit' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: darkMode ? 'white' : "text.primary", textAlign: 'center', fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
              {t("statistics")}
            </Typography>
          </Box>
          <LanguageSwitcher />
        </Box>
      </Box>

      {}
      <Box 
        ref={imageContainerRef}
        sx={{ position: 'absolute', left: 0, right: 0, top: 96, bottom: 0, zIndex: 1 }}
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
        <Button variant="contained" onClick={() => alert(t("addFish"))}>
          {t("addFish")}
        </Button>
        <Button variant="contained" onClick={() => alert(t("addPlant"))}>
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
                
                <Grid container spacing={2}>
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
                        {statistics.totalFishes}
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
                        {statistics.totalPlants}
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
                        {statistics.fishSpeciesCount}
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
                  {t("overstocking", { defaultValue: "Przerybienie akwarium" })}
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
                        {t("occupancy", { defaultValue: "Zajętość" })}:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: darkMode ? 'white' : 'inherit' }}>
                        {statistics.occupancy}%
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
                          width: `${Math.min(parseFloat(statistics.occupancy), 100)}%`,
                          height: '100%',
                          
                          bgcolor: parseFloat(statistics.occupancy) < 80
                            ? '#4caf50' 
                            : parseFloat(statistics.occupancy) <= 100
                            ? '#ff9800' 
                            : '#f44336', 
                          transition: 'width 0.5s ease-in-out',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {parseFloat(statistics.occupancy) > 15 && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          >
                            {statistics.occupancy}%
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'text.secondary', mt: 1, display: 'block' }}>
                      {statistics.totalFishLength?.toFixed(1) || 0} / {statistics.maxFishLength} cm ({t("overstockingInfo", { defaultValue: "1cm = 1L" })})
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'text.secondary', mt: 0.5, display: 'block' }}>
                      {t("aquariumVolume", { defaultValue: "Objętość akwarium" })}: {aquarium.volume || 200}L
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
    </Box>
  );
}

