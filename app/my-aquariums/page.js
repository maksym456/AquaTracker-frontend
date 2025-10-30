"use client";

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function MyAquariumsPage() {
  const { t } = useTranslation();
  const [hasAquarium, setHasAquarium] = useState(false);

  function handleCreateAquarium() {
    setHasAquarium(true);
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
        px: 4, py: 2, zIndex: 10
      }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box sx={{
            bgcolor: 'rgba(255, 255, 255, 0.4)', p: 0.8, borderRadius: 1.5, boxShadow: 2,
            transition: "all 0.3s", backdropFilter: 'blur(8px)',
            "&:hover": { boxShadow: 4, transform: "translateY(-2px)", bgcolor: 'rgba(255, 255, 255, 0.6)' },
            cursor: 'pointer', minHeight: '60px', minWidth: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            <Typography sx={{ fontSize: 16, mb: 0.3, textAlign: 'center' }}>📊</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: '0.65rem' }}>
              {t("statistics")}
            </Typography>
          </Box>
          <Box sx={{
            bgcolor: 'rgba(255, 255, 255, 0.4)', p: 0.8, borderRadius: 1.5, boxShadow: 2,
            transition: "all 0.3s", backdropFilter: 'blur(8px)',
            "&:hover": { boxShadow: 4, transform: "translateY(-2px)", bgcolor: 'rgba(255, 255, 255, 0.6)' },
            cursor: 'pointer', minHeight: '60px', minWidth: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            <Typography sx={{ fontSize: 16, mb: 0.3, textAlign: 'center' }}>📋</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: '0.65rem' }}>
              {t("history")}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LanguageSwitcher />
        </Box>
      </Box>

      {hasAquarium && (
        <Box sx={{ position: 'absolute', left: 0, right: 0, top: 96, bottom: 0, zIndex: 1 }}>
          {/* warstwa obrazu */}
          <Box
            sx={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url("/aquarium.jpg")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              pointerEvents: 'none'
            }}
          />
        </Box>
      )}

      {}
      <Box sx={{ position: "relative", zIndex: 2, p: 4, pt: 14, pb: 14 }}>
        {/* Główna sekcja */}
        {!hasAquarium ? (
          <></>
        ) : (
          <></>
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
        {!hasAquarium ? (
          <Button variant="contained" color="primary" onClick={handleCreateAquarium}>
            {t("createAquarium")}
          </Button>
        ) : (
          <>
            <Button variant="contained" onClick={() => alert(t("addFish"))}>{t("addFish")}</Button>
            <Button variant="contained" onClick={() => alert(t("addPlant"))}>{t("addPlant")}</Button>
            <Button variant="outlined" color="error" onClick={() => setHasAquarium(false)}>Remove</Button>
          </>
        )}
      </Box>
    </Box>
  );
}
