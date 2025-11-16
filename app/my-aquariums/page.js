"use client";

import { useState, useEffect } from "react";
import { Box, Button, Typography, Modal, TextField, Grid, Card, CardContent, CardActionArea, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { mockAquariums, addAquarium } from "../lib/mockData";
import { useTheme } from "../contexts/ThemeContext";

export default function MyAquariumsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { darkMode } = useTheme();
  const [aquariums, setAquariums] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newAquariumName, setNewAquariumName] = useState("");
  const [newAquariumWaterType, setNewAquariumWaterType] = useState("freshwater");
  const [newAquariumTemperature, setNewAquariumTemperature] = useState("24");
  const [newAquariumBiotope, setNewAquariumBiotope] = useState("ameryka południowa");
  const [newAquariumPh, setNewAquariumPh] = useState("7.0");
  const [newAquariumHardness, setNewAquariumHardness] = useState("8");

  useEffect(() => {
    // Załaduj akwaria z mockData
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

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {/* Górny pasek z gradientem */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 96,
        background: 'linear-gradient(to bottom right, #cfeef6 0%, #87cde1 50%, #2e7fa9 100%)',
        zIndex: 5
      }} />
      
      {/* Ciemny overlay dla dark mode */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: darkMode ? 'rgba(0, 0, 0, 0.25)' : 'transparent',
          zIndex: 4,
          transition: 'background-color 0.3s ease',
          pointerEvents: 'none'
        }}
      />
      
      {/* Ciemny overlay na górny pasek dla dark mode */}
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
              <KeyboardReturnOutlinedIcon sx={{ fontSize: { xs: 14, sm: 16 }, mb: 0.3 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
                {t("return")}
              </Typography>
            </Box>
          </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 1, sm: 2 } }}>
          <LanguageSwitcher />
        </Box>
      </Box>

      {/* Główna sekcja z kafelkami akwariów */}
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
                      <Box sx={{ display: 'flex', gap: 2, mt: 'auto', pt: 1 }}>
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

      {/* Footer z przyciskami */}
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

      {/* Modal do tworzenia akwarium */}
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
    </Box>
  );
}
