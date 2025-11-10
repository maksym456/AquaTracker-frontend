"use client";

import { useState, useEffect } from "react";
import { Box, Button, Typography, Modal, TextField, Grid, Card, CardContent, CardActionArea } from "@mui/material";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import { mockAquariums, addAquarium } from "../lib/mockData";

export default function MyAquariumsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [aquariums, setAquariums] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newAquariumName, setNewAquariumName] = useState("");
  const [newAquariumVolume, setNewAquariumVolume] = useState("");

  useEffect(() => {
    // Załaduj akwaria z mockData
    setAquariums(mockAquariums);
  }, []);

  function handleCreateAquarium() {
    setCreateModalOpen(true);
  }

  function handleSaveAquarium() {
    if (newAquariumName.trim() && newAquariumVolume.trim()) {
      const newAquarium = {
        name: newAquariumName,
        volume: parseInt(newAquariumVolume),
        description: ""
      };
      addAquarium(newAquarium);
      setAquariums([...mockAquariums]);
      setNewAquariumName("");
      setNewAquariumVolume("");
      setCreateModalOpen(false);
    }
  }

  function handleOpenAquarium(aquariumId) {
    router.push(`/my-aquariums/${aquariumId}`);
  }

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 96,
        background: 'linear-gradient(to bottom right, #cfeef6 0%, #87cde1 50%, #2e7fa9 100%)',
        zIndex: 5
      }} />

      <Box sx={{ 
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: { xs: 2, sm: 4 }, py: 2, zIndex: 10
      }}>
        <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 } }}>
          <Box sx={{
            bgcolor: 'rgba(255, 255, 255, 0.4)', p: { xs: 0.5, sm: 0.8 }, borderRadius: 1.5, boxShadow: 2,
            transition: "all 0.3s", backdropFilter: 'blur(8px)',
            "&:hover": { boxShadow: 4, transform: "translateY(-2px)", bgcolor: 'rgba(255, 255, 255, 0.6)' },
            cursor: 'pointer', minHeight: { xs: '50px', sm: '60px' }, minWidth: { xs: '60px', sm: '80px' }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            <Typography sx={{ fontSize: { xs: 14, sm: 16 }, mb: 0.3, textAlign: 'center' }}>📊</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
              {t("statistics")}
            </Typography>
          </Box>
          <Box sx={{
            bgcolor: 'rgba(255, 255, 255, 0.4)', p: { xs: 0.5, sm: 0.8 }, borderRadius: 1.5, boxShadow: 2,
            transition: "all 0.3s", backdropFilter: 'blur(8px)',
            "&:hover": { boxShadow: 4, transform: "translateY(-2px)", bgcolor: 'rgba(255, 255, 255, 0.6)' },
            cursor: 'pointer', minHeight: { xs: '50px', sm: '60px' }, minWidth: { xs: '60px', sm: '80px' }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            <Typography sx={{ fontSize: { xs: 14, sm: 16 }, mb: 0.3, textAlign: 'center' }}>📋</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
              {t("history")}
            </Typography>
          </Box>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{
              bgcolor: 'rgba(255, 255, 255, 0.4)', p: { xs: 0.5, sm: 0.8 }, borderRadius: 1.5, boxShadow: 2,
              transition: "all 0.3s", backdropFilter: 'blur(8px)',
              "&:hover": { boxShadow: 4, transform: "translateY(-2px)", bgcolor: 'rgba(255, 255, 255, 0.6)' },
              cursor: 'pointer', minHeight: { xs: '50px', sm: '60px' }, minWidth: { xs: '60px', sm: '80px' }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
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

      <Box sx={{
        position: 'fixed', left: 0, right: 0, bottom: 0,
        display: 'flex', justifyContent: 'center', gap: 2,
        py: 1.5, px: 2,
        backdropFilter: 'blur(8px)',
        background: 'rgba(255,255,255,0.6)',
        boxShadow: '0 -6px 16px rgba(0,0,0,0.2)',
        zIndex: 20
      }}>
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
          <TextField
            fullWidth
            type="number"
            label={t("volume", { defaultValue: "Pojemność (litry)" })}
            value={newAquariumVolume}
            onChange={(e) => setNewAquariumVolume(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={() => setCreateModalOpen(false)}>
              {t("cancel", { defaultValue: "Anuluj" })}
            </Button>
            <Button variant="contained" onClick={handleSaveAquarium} disabled={!newAquariumName.trim() || !newAquariumVolume.trim()}>
              {t("create", { defaultValue: "Utwórz" })}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
