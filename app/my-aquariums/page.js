"use client";

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import LanguageSwitcher from "../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';

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

      {hasAquarium && (
        <Box sx={{ position: 'absolute', left: 0, right: 0, top: 96, bottom: 0, zIndex: 1 }}>
          {/* warstwa obrazu */}
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
              
              return (
                <Box
                  key={i} 
                  className="bubble"
                  sx={{
                    
                    position: 'absolute', 
                    bottom: '5%', 
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
            <Button variant="outlined" color="error" onClick={() => setHasAquarium(false)}>{t("remove")}</Button>
          </>
        )}
      </Box>
    </Box>
  );
}
