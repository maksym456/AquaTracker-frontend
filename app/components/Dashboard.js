"use client";

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../contexts/AuthContext";
import { Button, Box, Typography } from "@mui/material";
import { mockAquariums } from "../lib/mockData";
import Link from "next/link";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  
  return (
    <Box sx={{ 
      minHeight: "100vh",
      display: 'flex',
      flexDirection: 'column',
      backgroundImage: 'url("/main-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative'
    }}>
       {/* Navbar */}
       <Box sx={{ 
         display: "flex", 
         flexDirection: 'row',
         justifyContent: "space-between", 
         alignItems: "center",
         px: { xs: 2, md: 4 },
         py: 2,
         zIndex: 10,
         gap: { xs: 1, md: 0 }
       }}>
         <Typography variant="h4" component="h1" sx={{ 
           fontWeight: 700, 
           color: "white",
           fontSize: { xs: '1.8rem', md: '2.2rem' },
           letterSpacing: '1px',
           fontFamily: 'var(--font-caveat)',
           textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
           lineHeight: 1
         }}>
           AquaTracker
         </Typography>
         <Box sx={{ 
           display: "flex", 
           gap: 1, 
           alignItems: "center"
         }}>
           {/* Settings - ukryte na mobile, widoczne na desktop */}
           <Box sx={{
             display: { xs: 'none', md: 'flex' },
             bgcolor: 'rgba(255, 255, 255, 0.4)',
             p: 0.8,
             borderRadius: 1.5,
             boxShadow: 2,
             transition: "all 0.3s",
             backdropFilter: 'blur(8px)',
             "&:hover": { 
               boxShadow: 4,
               transform: "translateY(-2px)",
               bgcolor: 'rgba(255, 255, 255, 0.6)'
             },
             cursor: 'pointer',
             minHeight: '60px',
             minWidth: '80px',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center'
           }}>
             <Typography sx={{ fontSize: 16, mb: 0.3, textAlign: 'center' }}>⚙️</Typography>
             <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: '0.65rem' }}>
               {t("settings")}
             </Typography>
           </Box>


           <LanguageSwitcher />
           <Button 
             variant="contained" 
             size="small" 
             onClick={logout}
             sx={{ 
               bgcolor: '#E3F2FD', 
               color: 'black',
               '&:hover': { bgcolor: '#BBDEFB' }
             }}
           >
             {t("auth.logout")}
           </Button>
         </Box>
       </Box>

       {/* Main Content */}
       <Box sx={{ 
         flex: 1,
         display: 'flex',
         flexDirection: 'column',
         gap: 4,
         px: { xs: 2, md: 4 },
         py: 4,
         mt: { xs: 0, md: 40 },
         ml: { xs: 0, md: '' },
         zIndex: 10,
         maxWidth: '1400px',
         width: '100%',
         mx: 'auto'
       }}>
         {/* Tekst */}
         <Box sx={{
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'flex-start'
         }}>
           <Box sx={{
             backgroundColor: 'rgba(0, 0, 0, 0.05)',
             padding: { xs: '30px', md: '60px' },
             borderRadius: '12px',
             backdropFilter: 'blur(15px)',
             maxWidth: '550px'
           }}>
             <Typography 
               variant="h2" 
               component="h2" 
               sx={{ 
                 fontWeight: "bold", 
                 color: "white", 
                 mb: 3,
                 fontSize: { xs: '1.8rem', md: '2.5rem' },
                 lineHeight: 1.2,
                 textAlign: { xs: 'center', md: 'left' }
               }}
             >
               {t("mainHeader")}
             </Typography>
             <Typography 
               variant="h6" 
               sx={{ 
                 color: "white", 
                 lineHeight: 1.6,
                 fontSize: { xs: '1rem', md: '1.1rem' },
                 textAlign: { xs: 'center', md: 'left' }
               }}
             >
               {t("mainSubHeader")}
             </Typography>
           </Box>
         </Box>

         {/* Karty */}
         <Box sx={{ 
           display: 'flex',
           alignItems: 'flex-start',
           justifyContent: 'flex-start'
         }}>
         <Box sx={{ 
           display: "grid", 
           gridTemplateColumns: "repeat(2, 1fr)",
           gap: 2
         }}>
           {/* Top Row */}
           <Link href="/my-aquariums" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
           <Box sx={{
             bgcolor: 'rgba(255, 255, 255, 0.4)',
             p: 2.5,
             borderRadius: 2,
             boxShadow: 3,
             transition: "all 0.3s",
             backdropFilter: 'blur(8px)',
             "&:hover": { 
               boxShadow: 5,
               transform: "translateY(-4px)",
               bgcolor: 'rgba(255, 255, 255, 0.6)'
             },
             cursor: 'pointer',
             minHeight: '140px',
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center',
             height: '100%'
           }}>
             <Typography sx={{ fontSize: 36, mb: 1.5, textAlign: 'center' }}>🏠</Typography>
             <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 1, textAlign: 'center', fontSize: '1rem' }}>
               {t("myAquariums")}
             </Typography>
             <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.8rem', lineHeight: 1.3 }}>
               {t("aquariumsDesc")}
             </Typography>
           </Box>
           </Link>
           
          <Link href="/fish-database" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <Box sx={{
              bgcolor: 'rgba(255, 255, 255, 0.4)',
              p: 2.5,
              borderRadius: 2,
              boxShadow: 3,
              transition: "all 0.3s",
              backdropFilter: 'blur(8px)',
              "&:hover": { 
                boxShadow: 5,
                transform: "translateY(-4px)",
                bgcolor: 'rgba(255, 255, 255, 0.6)'
              },
              cursor: 'pointer',
              minHeight: '140px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              <Typography sx={{ fontSize: 36, mb: 1.5, textAlign: 'center' }}>🐠</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 1, textAlign: 'center', fontSize: '1rem' }}>
                {t("fishDatabase")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.8rem', lineHeight: 1.3 }}>
                {t("fishDesc")}
              </Typography>
            </Box>
          </Link>

           {/* Bottom Row */}
           <Box sx={{
             bgcolor: 'rgba(255, 255, 255, 0.4)',
             p: 2.5,
             borderRadius: 2,
             boxShadow: 3,
             transition: "all 0.3s",
             backdropFilter: 'blur(8px)',
             "&:hover": { 
               boxShadow: 5,
               transform: "translateY(-4px)",
               bgcolor: 'rgba(255, 255, 255, 0.6)'
             },
             cursor: 'pointer',
             minHeight: '140px',
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center'
           }}>
             <Typography sx={{ fontSize: 36, mb: 1.5, textAlign: 'center' }}>👥</Typography>
             <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 1, textAlign: 'center', fontSize: '1rem' }}>
               {t("collaboration")}
             </Typography>
             <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.8rem', lineHeight: 1.3 }}>
               {t("collaborationDesc")}
             </Typography>
           </Box>
           
          <Link href="/plant-database" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <Box sx={{
              bgcolor: 'rgba(255, 255, 255, 0.4)',
              p: 2.5,
              borderRadius: 2,
              boxShadow: 3,
              transition: "all 0.3s",
              backdropFilter: 'blur(8px)',
              "&:hover": { 
                boxShadow: 5,
                transform: "translateY(-4px)",
                bgcolor: 'rgba(255, 255, 255, 0.6)'
              },
              cursor: 'pointer',
              minHeight: '140px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              <Typography sx={{ fontSize: 36, mb: 1.5, textAlign: 'center' }}>🌿</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 1, textAlign: 'center', fontSize: '1rem' }}>
                {t("plantsDatabase")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.8rem', lineHeight: 1.3 }}>
                {t("plantsDesc")}
              </Typography>
             </Box>
           </Link>
         </Box>
       </Box>
       </Box>

      <Box sx={{ 
        display: { xs: 'flex', md: 'none' },
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        py: 2,
        bgcolor: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.3)',
        zIndex: 10
      }}>
        <Box sx={{
          bgcolor: 'rgba(255, 255, 255, 0.4)',
          p: 1,
          borderRadius: 1.5,
          boxShadow: 2,
          transition: "all 0.3s",
          backdropFilter: 'blur(8px)',
          "&:hover": { 
            boxShadow: 4,
            transform: "translateY(-2px)",
            bgcolor: 'rgba(255, 255, 255, 0.6)'
          },
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography sx={{ fontSize: 16, mb: 0.3, textAlign: 'center' }}>⚙️</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: '0.6rem' }}>
            {t("settings")}
          </Typography>
        </Box>
      </Box>

    </Box>
  );
}

