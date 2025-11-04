"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../contexts/AuthContext";
import { Button, Box, Typography, Modal, TextField } from "@mui/material";
import { mockAquariums } from "../lib/mockData";
import { APP_VERSION } from "../version";
import Link from "next/link";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dataSourceExpanded, setDataSourceExpanded] = useState(false);
  const [collaborationFlipped, setCollaborationFlipped] = useState(false);
  const [collaborationEmail, setCollaborationEmail] = useState('');
  
  const handleOpenSettings = () => setSettingsOpen(true);
  const handleCloseSettings = () => setSettingsOpen(false);
  const toggleDataSource = () => setDataSourceExpanded(!dataSourceExpanded);
  const handleCollaborationClick = () => setCollaborationFlipped(!collaborationFlipped);
  const handleSendInvite = () => {
    if (collaborationEmail.trim()) {
      alert(`${t("inviteSent")}: ${collaborationEmail}`);
      setCollaborationEmail('');
      setCollaborationFlipped(false);
    }
  };
  
  return (
    <Box sx={{ 
      minHeight: "100vh",
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Tło wideo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
      >
        <source src="/main-bg-video.mp4" type="video/mp4" />
      </video>
      
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
           <LanguageSwitcher />
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
             backgroundColor: 'rgba(0, 0, 0, 0.01)',
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
           gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
           gap: 2,
           width: { xs: 'calc(100% - 80px)', md: 'auto' },
           maxWidth: { xs: 'none', md: '600px' }
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

           {/* Bottom Row - Collaboration Flip Card */}
           <Box 
             onClick={handleCollaborationClick}
             className="flip-card-container"
             sx={{
               cursor: 'pointer',
               minHeight: '140px',
               height: '100%'
             }}
           >
             <Box className={`flip-card ${collaborationFlipped ? 'flipped' : ''}`}>
               {/* Front side */}
               <Box className="flip-card-front" sx={{
                 bgcolor: 'rgba(255, 255, 255, 0.4)',
                 p: 2.5,
                 borderRadius: 2,
                 boxShadow: 3,
                 transition: "boxShadow 0.3s, bgcolor 0.3s",
                 backdropFilter: 'blur(8px)',
                 "&:hover": { 
                   boxShadow: 5,
                   bgcolor: 'rgba(255, 255, 255, 0.6)'
                 },
                 minHeight: '140px',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'center',
                 height: '100%'
               }}>
                 <Typography sx={{ fontSize: 36, mb: 1.5, textAlign: 'center' }}>👥</Typography>
                 <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 1, textAlign: 'center', fontSize: '1rem' }}>
                   {t("collaboration")}
                 </Typography>
                 <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.8rem', lineHeight: 1.3 }}>
                   {t("collaborationDesc")}
                 </Typography>
               </Box>
               
               {/* Back side */}
               <Box className="flip-card-back" sx={{
                 bgcolor: 'rgba(255, 255, 255, 0.4)',
                 p: 2.5,
                 borderRadius: 2,
                 boxShadow: 3,
                 backdropFilter: 'blur(8px)',
                 minHeight: '140px',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'center',
                 height: '100%',
                 gap: 1.5
               }}>
                 <Typography variant="h6" sx={{ 
                   fontWeight: 600, 
                   color: "text.primary", 
                   textAlign: 'center', 
                   fontSize: '1rem',
                   mb: 0.5
                 }}>
                   {t("inviteToCollaboration")}
                 </Typography>
                 <TextField
                   fullWidth
                   size="small"
                   type="email"
                   placeholder={t("collaborationEmail")}
                   value={collaborationEmail}
                   onChange={(e) => setCollaborationEmail(e.target.value)}
                   onClick={(e) => e.stopPropagation()}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.5)',
                      },
                    },
                  }}
                 />
                 <Box sx={{ display: 'flex', gap: 1, width: '100%', mt: 0.5 }}>
                   <Button
                     size="small"
                     variant="outlined"
                     onClick={(e) => {
                       e.stopPropagation();
                       setCollaborationFlipped(false);
                     }}
                     sx={{ flex: 1, fontSize: '0.75rem' }}
                   >
                     {t("back")}
                   </Button>
                   <Button
                     size="small"
                     variant="contained"
                     onClick={(e) => {
                       e.stopPropagation();
                       handleSendInvite();
                     }}
                     disabled={!collaborationEmail.trim()}
                     sx={{ 
                       flex: 1, 
                       fontSize: '0.75rem',
                       bgcolor: '#1976d2',
                       '&:hover': { bgcolor: '#1565c0' }
                     }}
                   >
                     {t("sendInvite")}
                   </Button>
                 </Box>
               </Box>
             </Box>
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

      {/* Settings button - prawy dolny róg */}
      <Box onClick={handleOpenSettings} sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        bgcolor: 'rgba(255, 255, 255, 0.4)',
        p: 1.5,
        borderRadius: 2,
        boxShadow: 2,
        transition: "all 0.3s",
        backdropFilter: 'blur(8px)',
        "&:hover": { 
          boxShadow: 4,
          transform: "translateY(-2px)",
          bgcolor: 'rgba(255, 255, 255, 0.6)'
        },
        cursor: 'pointer',
        minHeight: { xs: '60px', md: '80px' },
        minWidth: { xs: '60px', md: '80px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
      }}>
        <Typography sx={{ fontSize: { xs: 20, md: 24 }, mb: 0.3, textAlign: 'center' }}>⚙️</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: { xs: '0.55rem', md: '0.7rem' } }}>
          {t("settings")}
        </Typography>
      </Box>

      {/* Settings Panel */}
      <Modal
        open={settingsOpen}
        onClose={handleCloseSettings}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Box sx={{
          width: { xs: '90%', md: '400px' },
          height: 'calc(100vh - 64px)',
          mt: 8,
          bgcolor: 'rgba(227, 242, 253, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
          animation: 'slideInRight 0.3s ease-out',
          borderRadius: '16px 0 0 16px'
        }}>
          {/* Header */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3,
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {t("settings")}
            </Typography>
            <Button onClick={handleCloseSettings} sx={{ minWidth: 'auto' }}>
              ✕
            </Button>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            {/* Dark Mode */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                mb: 1,
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: 24 }}>🌙</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Dark Mode</Typography>
              </Box>
              <Typography sx={{ fontSize: 20 }}>⚪</Typography>
            </Box>

            {/* Edycja profilu */}
            <Box 
              onClick={() => alert('Edycja profilu')}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                mb: 1,
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: 24 }}>👤</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Edycja profilu</Typography>
              </Box>
              <Typography sx={{ fontSize: 20 }}>→</Typography>
            </Box>

            {/* Długość sesji */}
            <Box 
              onClick={() => alert('Długość sesji')}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                mb: 1,
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: 24 }}>⏱️</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Długość sesji</Typography>
              </Box>
              <Typography sx={{ fontSize: 20 }}>→</Typography>
            </Box>

            {/* Źródło danych */}
            <Box sx={{ mb: 1 }}>
              <Box 
                onClick={toggleDataSource}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontSize: 24 }}>💾</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>Źródło danych</Typography>
                </Box>
                <Typography sx={{ fontSize: 20 }}>{dataSourceExpanded ? '▼' : '→'}</Typography>
              </Box>
              
              {/* Rozwinięte informacje o źródle danych */}
              {dataSourceExpanded && (
                <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                  <Box sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.5)', borderRadius: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Typ źródła:</Typography>
                    <Typography variant="body2" color="text.secondary">Mock Data (lokalne)</Typography>
                  </Box>
                  <Box sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.5)', borderRadius: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Środowisko:</Typography>
                    <Typography variant="body2" color="text.secondary">Development</Typography>
                  </Box>
                  <Box sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.5)', borderRadius: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Status:</Typography>
                    <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 600 }}>● Połączono</Typography>
                  </Box>
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.5)', borderRadius: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Ostatnia synchronizacja:</Typography>
                    <Typography variant="body2" color="text.secondary">W trybie offline</Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                      Dane przechowywane lokalnie (mock)
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Historia zmian */}
            <Box 
              onClick={() => alert('Historia zmian')}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                mb: 1,
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: 24 }}>📋</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Historia zmian</Typography>
              </Box>
              <Typography sx={{ fontSize: 20 }}>→</Typography>
            </Box>

            {/* Wersja aplikacji */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              p: 2,
              mb: 1,
              borderRadius: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: 24 }}>ℹ️</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Wersja</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">{APP_VERSION}</Typography>
            </Box>

            {/* Dezaktywacja konta */}
            <Box 
              onClick={() => alert('Dezaktywacja konta - potwierdź')}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                mt: 2,
                borderRadius: 2,
                border: '2px solid #EF5350',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(239, 83, 80, 0.1)' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: 24 }}>⚠️</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#EF5350' }}>Dezaktywuj konto</Typography>
              </Box>
              <Typography sx={{ fontSize: 20, color: '#EF5350' }}>→</Typography>
            </Box>
          </Box>

          {/* Footer z Logout */}
          <Box sx={{
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            p: 3,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Button 
              variant="contained" 
              onClick={logout}
              sx={{ 
                bgcolor: '#EF5350', 
                color: 'white',
                '&:hover': { bgcolor: '#E53935' }
              }}
            >
              {t("auth.logout")}
            </Button>
          </Box>
        </Box>
      </Modal>

    </Box>
  );
}

