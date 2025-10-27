"use client";

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../contexts/AuthContext";
import { Button, Box, Typography, Container } from "@mui/material";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb" }}>
      {/* Header */}
      <Box sx={{ bgcolor: "white", boxShadow: 1, mb: 2 }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            py: 3
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ 
                width: 36, 
                height: 36, 
                borderRadius: '50%', 
                bgcolor: '#E3F2FD', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🐠
              </Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: "bold", color: "text.primary" }}>
                AquaTracker
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {user?.name}
              </Typography>
              <LanguageSwitcher />
              <Button variant="outlined" size="small" onClick={logout}>
                {t("auth.logout")}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}>
            {t("welcome")}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            {t("description")}
          </Typography>
          
          {/* Cards Grid */}
          <Box sx={{ 
            display: "flex", 
            flexWrap: "wrap", 
            justifyContent: "center", 
            gap: 3,
            mt: 4
          }}>
            <Box sx={{
              bgcolor: "white",
              p: 4,
              borderRadius: 2,
              boxShadow: 2,
              transition: "all 0.3s",
              "&:hover": { 
                boxShadow: 4,
                transform: "translateY(-4px)"
              },
              width: { xs: "100%", sm: "280px" }
            }}>
              <Typography sx={{ fontSize: 48, mb: 2 }}>🏠</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
                {t("myAquariums")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("aquariumsDesc")}
              </Typography>
            </Box>
            
            <Box sx={{
              bgcolor: "white",
              p: 4,
              borderRadius: 2,
              boxShadow: 2,
              transition: "all 0.3s",
              "&:hover": { 
                boxShadow: 4,
                transform: "translateY(-4px)"
              },
              width: { xs: "100%", sm: "280px" }
            }}>
              <Typography sx={{ fontSize: 48, mb: 2 }}>🐠</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
                {t("fishDatabase")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("fishDesc")}
              </Typography>
            </Box>
            
            <Box sx={{
              bgcolor: "white",
              p: 4,
              borderRadius: 2,
              boxShadow: 2,
              transition: "all 0.3s",
              "&:hover": { 
                boxShadow: 4,
                transform: "translateY(-4px)"
              },
              width: { xs: "100%", sm: "280px" }
            }}>
              <Typography sx={{ fontSize: 48, mb: 2 }}>🌿</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
                {t("plantsDatabase")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("plantsDesc")}
              </Typography>
            </Box>
            
            <Box sx={{
              bgcolor: "white",
              p: 4,
              borderRadius: 2,
              boxShadow: 2,
              transition: "all 0.3s",
              "&:hover": { 
                boxShadow: 4,
                transform: "translateY(-4px)"
              },
              width: { xs: "100%", sm: "280px" }
            }}>
              <Typography sx={{ fontSize: 48, mb: 2 }}>📊</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
                {t("statistics")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("statsDesc")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

