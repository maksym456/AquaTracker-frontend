"use client";

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../contexts/AuthContext";
import { Button, Box, Typography } from "@mui/material";
import { mockAquariums } from "../lib/mockData";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  
  return (
    <Box sx={{ 
      minHeight: "100vh", 
      backgroundImage: 'url("/main-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative'
    }}>
       {/* Navbar */}
       <Box sx={{ 
         position: 'absolute',
         top: 0,
         left: 0,
         right: 0,
         display: "flex", 
         justifyContent: "space-between", 
         alignItems: "center",
         px: 4,
         py: 2,
         zIndex: 10
       }}>
         <Typography variant="h4" component="h1" sx={{ 
           fontWeight: 700, 
           color: "white",
           fontSize: '2.2rem',
           letterSpacing: '1px',
           fontFamily: 'var(--font-caveat)',
           textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
         }}>
           AquaTracker
         </Typography>
         <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
           {/* Secondary Feature Cards in Navbar */}
           <Box sx={{
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
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center'
           }}>
             <Typography sx={{ fontSize: 16, mb: 0.3, textAlign: 'center' }}>📊</Typography>
             <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: '0.65rem' }}>
               {t("statistics")}
             </Typography>
           </Box>

           <Box sx={{
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
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center'
           }}>
             <Typography sx={{ fontSize: 16, mb: 0.3, textAlign: 'center' }}>📋</Typography>
             <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: '0.65rem' }}>
               {t("history")}
             </Typography>
           </Box>

           <Box sx={{
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
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center'
           }}>
             <Typography sx={{ fontSize: 16, mb: 0.3, textAlign: 'center' }}>⚙️</Typography>
             <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: '0.65rem' }}>
               {t("settings")}
             </Typography>
           </Box>

           <Box sx={{ ml: 2, display: "flex", gap: 1, alignItems: "center" }}>
             <LanguageSwitcher />
             <Button 
               variant="contained" 
               size="small" 
               onClick={logout}
               sx={{ 
                 background: 'linear-gradient(90deg, #ff4444 0%, #ff6b35 100%)',
                 color: 'white',
                 width: '50px',
                 height: '50px',
                 borderRadius: '50%',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 minWidth: 'unset',
                 transition: 'all 0.2s ease-in-out',
                 '&:hover': { 
                   background: 'linear-gradient(90deg, #ff3333 0%, #ff5a2a 100%)',
                   transform: 'scale(1.05)',
                   boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                 }
               }}
             >
               <Box sx={{ fontSize: '0.6rem', fontWeight: 600, textAlign: 'center' }}>
                 {t("auth.logout")}
               </Box>
             </Button>
           </Box>
         </Box>
       </Box>

       {/* Main Content */}
       <Box sx={{ 
         position: 'absolute',
         top: '30%',
         left: '8%',
         maxWidth: '550px',
         zIndex: 10
       }}>
         <Box sx={{
           backgroundColor: 'rgba(0, 0, 0, 0.05)',
           padding: '60px',
           borderRadius: '12px',
           backdropFilter: 'blur(15px)'
         }}>
           <Typography 
             variant="h2" 
             component="h2" 
             sx={{ 
               fontWeight: "bold", 
               color: "white", 
               mb: 3,
               fontSize: '2.5rem',
               lineHeight: 1.2
             }}
           >
             {t("mainHeader")}
           </Typography>
           <Typography 
             variant="h6" 
             sx={{ 
               color: "white", 
               lineHeight: 1.6,
               fontSize: '1.1rem'
             }}
           >
             {t("mainSubHeader")}
           </Typography>
         </Box>
       </Box>

       {/* Left Side Cards - Main Features */}
       <Box sx={{ 
         position: 'absolute',
         bottom: '8%',
         left: '5%',
         width: '45%',
         zIndex: 10
       }}>
         <Box sx={{ 
           display: "grid", 
           gridTemplateColumns: "repeat(2, 1fr)",
           gap: 2
         }}>
           {/* Top Row */}
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
             <Typography sx={{ fontSize: 36, mb: 1.5, textAlign: 'center' }}>🏠</Typography>
             <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 1, textAlign: 'center', fontSize: '1rem' }}>
               {t("myAquariums")}
             </Typography>
             <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.8rem', lineHeight: 1.3 }}>
               {t("aquariumsDesc")}
             </Typography>
           </Box>
           
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
             <Typography sx={{ fontSize: 36, mb: 1.5, textAlign: 'center' }}>🐠</Typography>
             <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 1, textAlign: 'center', fontSize: '1rem' }}>
               {t("fishDatabase")}
             </Typography>
             <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.8rem', lineHeight: 1.3 }}>
               {t("fishDesc")}
             </Typography>
           </Box>

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
             <Typography sx={{ fontSize: 36, mb: 1.5, textAlign: 'center' }}>🌿</Typography>
             <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 1, textAlign: 'center', fontSize: '1rem' }}>
               {t("plantsDatabase")}
             </Typography>
             <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.8rem', lineHeight: 1.3 }}>
               {t("plantsDesc")}
             </Typography>
           </Box>
         </Box>
       </Box>

    </Box>
  );
}

