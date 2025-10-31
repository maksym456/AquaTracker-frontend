"use client";

import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import LanguageSwitcher from "../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';

export default function FishDatabasePage() {
  const { t } = useTranslation();

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
      <Box sx={{ position: "relative", zIndex: 2, p: 4, pt: 14 }}>
        {/* Tutaj później dodasz listę ryb */}
      </Box>
    </Box>
  );
}

