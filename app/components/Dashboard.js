"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../contexts/AuthContext";
import { Button, Box, Typography, Modal, TextField, Alert, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText, Chip, Divider, Switch } from "@mui/material";
import { mockAquariums } from "../lib/mockData";
import { APP_VERSION } from "../version";
import { useTheme } from "../contexts/ThemeContext";
import Link from "next/link";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dataSourceExpanded, setDataSourceExpanded] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [sessionInfoOpen, setSessionInfoOpen] = useState(false);
  const [sessionDuration, setSessionDuration] = useState("");
  const sessionIntervalRef = useRef(null);
  const [activityHistoryOpen, setActivityHistoryOpen] = useState(false);
  const [selectedActionFilter, setSelectedActionFilter] = useState("all");
  const [selectedAquariumFilter, setSelectedAquariumFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  
  const handleOpenSettings = () => setSettingsOpen(true);
  const handleCloseSettings = () => setSettingsOpen(false);
  const toggleDataSource = () => setDataSourceExpanded(!dataSourceExpanded);
  const handleOpenActivityHistory = () => setActivityHistoryOpen(true);
  const handleCloseActivityHistory = () => setActivityHistoryOpen(false);
  
  const mockActivityHistory = [
    { id: '1', type: 'created', aquarium: 'Moje pierwsze akwarium', date: new Date('2024-01-15T10:30:00'), details: 'Akwarium zostało utworzone' },
    { id: '2', type: 'fishAdded', aquarium: 'Moje pierwsze akwarium', date: new Date('2024-01-16T14:20:00'), details: 'Dodano rybę: Gupik' },
    { id: '3', type: 'plantAdded', aquarium: 'Moje pierwsze akwarium', date: new Date('2024-01-17T09:15:00'), details: 'Dodano roślinę: Anubias' },
    { id: '4', type: 'parameterChanged', aquarium: 'Moje pierwsze akwarium', date: new Date('2024-01-18T16:45:00'), details: 'Zmieniono temperaturę: 22°C → 24°C' },
    { id: '5', type: 'created', aquarium: 'Drugie akwarium', date: new Date('2024-01-20T11:00:00'), details: 'Akwarium zostało utworzone' },
    { id: '6', type: 'edited', aquarium: 'Moje pierwsze akwarium', date: new Date('2024-01-21T13:30:00'), details: 'Zaktualizowano parametry akwarium' },
    { id: '7', type: 'fishRemoved', aquarium: 'Moje pierwsze akwarium', date: new Date('2024-01-22T15:20:00'), details: 'Usunięto rybę: Gupik' },
    { id: '8', type: 'parameterChanged', aquarium: 'Drugie akwarium', date: new Date('2024-01-23T10:10:00'), details: 'Zmieniono pH: 7.0 → 7.2' },
    { id: '9', type: 'plantAdded', aquarium: 'Drugie akwarium', date: new Date('2024-01-24T12:00:00'), details: 'Dodano roślinę: Moczarka' },
    { id: '10', type: 'parameterChanged', aquarium: 'Moje pierwsze akwarium', date: new Date('2024-01-25T14:30:00'), details: 'Zmieniono twardość wody: 10 dGH → 12 dGH' },
  ];

  const getActionLabel = (type) => {
    const labels = {
      created: t('actionCreated'),
      edited: t('actionEdited'),
      deleted: t('actionDeleted'),
      fishAdded: t('actionFishAdded'),
      fishRemoved: t('actionFishRemoved'),
      plantAdded: t('actionPlantAdded'),
      plantRemoved: t('actionPlantRemoved'),
      parameterChanged: t('actionParameterChanged'),
    };
    return labels[type] || type;
  };

  const getActionColor = (type) => {
    const colors = {
      created: '#4CAF50',
      edited: '#2196F3',
      deleted: '#F44336',
      fishAdded: '#FF9800',
      fishRemoved: '#E91E63',
      plantAdded: '#9C27B0',
      plantRemoved: '#F44336',
      parameterChanged: '#00BCD4',
    };
    return colors[type] || '#757575';
  };

  const filteredAndSortedActivities = mockActivityHistory
    .filter(activity => {
      const actionMatch = selectedActionFilter === 'all' || activity.type === selectedActionFilter;
      const aquariumMatch = selectedAquariumFilter === 'all' || activity.aquarium === selectedAquariumFilter;
      return actionMatch && aquariumMatch;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.date - a.date;
      } else {
        return a.date - b.date;
      }
    });

  const uniqueAquariums = [...new Set(mockActivityHistory.map(a => a.aquarium))];
  const actionTypes = ['created', 'edited', 'deleted', 'fishAdded', 'fishRemoved', 'plantAdded', 'plantRemoved', 'parameterChanged'];
  
  const calculateSessionDuration = () => {
    const loginTime = localStorage.getItem("sessionLoginTime") || user?.loginTime;
    if (!loginTime) return "";
    
    const loginDate = new Date(loginTime);
    const now = new Date();
    const diffMs = now - loginDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? t("day", { defaultValue: "dzień" }) : t("days", { defaultValue: "dni" })}`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? t("hour", { defaultValue: "godzina" }) : t("hours", { defaultValue: "godzin" })}`;
    } else {
      return `${diffMins} ${diffMins === 1 ? t("minute", { defaultValue: "minuta" }) : t("minutes", { defaultValue: "minut" })}`;
    }
  };
  
  const handleOpenSessionInfo = () => {
    setSessionInfoOpen(true);
    setSessionDuration(calculateSessionDuration());
    sessionIntervalRef.current = setInterval(() => {
      setSessionDuration(calculateSessionDuration());
    }, 1000);
  };
  
  const handleCloseSessionInfo = () => {
    setSessionInfoOpen(false);
    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current);
      sessionIntervalRef.current = null;
    }
  };
  
  useEffect(() => {
    return () => {
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
      }
    };
  }, []);
  
  const handleOpenProfileEdit = () => {
    setProfileEditOpen(true);
    setProfileEmail(user?.email || "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setProfileError("");
    setProfileSuccess("");
  };
  
  const handleCloseProfileEdit = () => {
    setProfileEditOpen(false);
    setProfileError("");
    setProfileSuccess("");
  };
  
  const handleSaveProfile = () => {
    setProfileError("");
    setProfileSuccess("");
    
    if (!profileEmail.includes("@")) {
      setProfileError(t("auth.invalidEmail"));
      return;
    }
    
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setProfileError(t("fillAllPasswordFields", { defaultValue: "Aby zmienić hasło, wypełnij wszystkie pola hasła" }));
        return;
      }
      
      if (newPassword.length < 6) {
        setProfileError(t("auth.passwordTooShort"));
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setProfileError(t("auth.passwordsDontMatch"));
        return;
      }
    }
    
    const updatedUser = {
      ...user,
      email: profileEmail.trim()
    };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    setProfileSuccess(t("profileUpdated", { defaultValue: "Profil został zaktualizowany!" }));
    setTimeout(() => {
      handleCloseProfileEdit();
      window.location.reload();
    }, 1500);
  };
  
  return (
    <Box sx={{ 
      minHeight: "100vh",
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      width: '100%'
    }}>
      {/* Tło wideo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
        onLoadedData={(e) => {
          e.target.play().catch(() => {});
        }}
      >
        <source src="/main-bg-video.mp4" type="video/mp4" />
      </video>
      
      {/* Ciemny overlay dla dark mode */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: darkMode ? 'rgba(0, 0, 0, 0.75)' : 'transparent',
          zIndex: 1,
          transition: 'background-color 0.3s ease',
          pointerEvents: 'none'
        }}
      />
      
       {/* Navbar */}
       <Box sx={{ 
         display: "flex", 
         flexDirection: 'row',
         justifyContent: "space-between", 
         alignItems: "center",
         px: { xs: 1.5, sm: 1.5, md: 2, lg: 4 },
         py: { xs: 0.75, sm: 1, md: 1, lg: 2 },
         zIndex: 10,
         gap: { xs: 1, md: 0 },
         '@media (max-height: 700px)': {
           py: { xs: 0.5, sm: 0.75 }
         }
       }}>
         <Typography variant="h4" component="h1" sx={{ 
           fontWeight: 700, 
           color: "white",
           fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem', lg: '2.2rem' },
           letterSpacing: '1px',
           fontFamily: 'var(--font-caveat)',
           textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
           lineHeight: 1,
           '@media (max-height: 700px)': {
             fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.4rem' }
           }
         }}>
           AquaTracker
         </Typography>
         <Box sx={{ 
           display: "flex", 
           gap: 1, 
           alignItems: "center",
           ml: 'auto'
         }}>
           <LanguageSwitcher />
           {/* Settings button */}
            <Box 
            onClick={handleOpenSettings}
            sx={{
              bgcolor: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)',
              p: 1,
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
              minHeight: { xs: '40px', md: '48px' },
              minWidth: { xs: '40px', md: '48px' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
             <Typography sx={{ fontSize: { xs: 18, md: 20 }, mb: 0.2, textAlign: 'center' }}>⚙️</Typography>
             <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: { xs: '0.5rem', md: '0.6rem' } }}>
               {t("settings")}
             </Typography>
           </Box>
         </Box>
       </Box>

      {/* Main Content - Uproszczona struktura z gridem */}
      <Box sx={{ 
        position: 'absolute',
        top: { xs: '110px', sm: '130px', md: '150px', lg: '170px' },
        left: { xs: '0', sm: '0', md: '0', lg: '15%' },
        zIndex: 10,
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: { xs: 1, sm: 1.5, md: 2, lg: 2 },
        width: { 
          xs: '100%', 
          sm: '476px',
          md: '476px',
          lg: '476px'
        },
        maxWidth: { 
          xs: '100%', 
          sm: '476px', 
          md: '476px', 
          lg: '476px' 
        },
        boxSizing: 'border-box',
        px: { xs: 1, sm: 1.25, md: 1.5, lg: 0 },
        '@media (max-height: 700px)': {
          top: { xs: '80px', sm: '90px', md: '100px' }
        },
        '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 700px)': {
          top: '150px',
          width: '400px',
          maxWidth: '400px'
        },
        '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
          top: '150px',
          width: '400px',
          maxWidth: '400px'
        },
        '@media (min-width: 1368px) and (max-width: 1919px)': {
          top: '30px',
          width: '420px',
          maxWidth: '420px'
        },
        '@media (min-width: 1920px)': {
          top: '170px',
          left: 'calc(15% + 50px)'
        },
        '@media (min-width: 1369px) and (max-width: 1919px)': {
          top: '350px',
          width: '480px',
          maxWidth: '500px'
        },
        '@media (min-width: 1920px) and (min-height: 1312px)': {
          top: '350px',
          width: '480px',
          maxWidth: '500px'
        },
        '@media (min-width: 600px) and (max-width: 1198px)': {
          top: '350px',
          width: '380px',
          maxWidth: '400px',
          left: '50px'
        },
        '@media (max-width: 599px)': {
          top: '200px',
          width: '360px',
          maxWidth: '400px',

          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',

          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
        '@media (min-width: 950px) and (max-width: 1197px)': {
          top: '350px',
          width: '500px',
          maxWidth: '500px',
          left: '50px'
        }
      }}>
        {/* Tekst */}
        <Box sx={{
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.01)',
          padding: { xs: '16px 20px', sm: '24px 28px', md: '32px 36px', lg: '60px' },
          borderRadius: '12px',
          backdropFilter: 'blur(15px)',
          width: '100%',
          boxSizing: 'border-box',
          '@media (max-height: 700px)': {
            padding: { xs: '12px 16px', sm: '18px 22px', md: '24px 28px' }
          },
          '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
            padding: '30px',

          },
          '@media (min-width: 1368px) and (max-width: 1919px)': {
            padding: '28px'
          },
          '@media (min-width: 1372px) and (max-width: 1919px)': {
            padding: '25px'
          },
          '@media (min-width: 1369px) and (max-width: 1919px)': {
            padding: '50px'
          }
        }}>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontWeight: "bold", 
              color: "white", 
              mb: { xs: 0.75, sm: 1, md: 1.25, lg: 2.5 },
              fontSize: { xs: '1.3rem', sm: '1.6rem', md: '1.9rem', lg: '2.8rem' },
              lineHeight: { xs: 1.15, sm: 1.2, md: 1.25, lg: 1.2 },
              textAlign: { xs: 'center', sm: 'center', md: 'center', lg: 'left' },
              '@media (max-height: 700px)': {
                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                mb: { xs: 0.6, sm: 0.75, md: 1 }
              },
              '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
                fontSize: '1.5rem',
                mb: 0.75
              },
              '@media (min-width: 1368px) and (max-width: 1919px)': {
                fontSize: '1.9rem',
                mb: 1
              },
              '@media (min-width: 1372px) and (max-width: 1919px)': {
                fontSize: '2.6rem',
                mb: 1.5
              },
              '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 700px)': {
              fontSize: '2.1rem',
              },
              '@media (max-width: 599px)': {
                fontSize: '1.5rem',
              },
            }}
          >
            {t("mainHeader")}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: "white", 
              lineHeight: { xs: 1.2, sm: 1.25, md: 1.3, lg: 1.5 },
              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.95rem' },
              textAlign: { xs: 'center', sm: 'center', md: 'center', lg: 'left' },
              '@media (max-height: 700px)': {
                fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                lineHeight: { xs: 1.15, sm: 1.2, md: 1.25 }
              },
              '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
                fontSize: '0.65rem',
                lineHeight: 1.2
              },
              '@media (min-width: 1368px) and (max-width: 1919px)': {
                fontSize: '0.75rem',
                lineHeight: 1.3
              },
              '@media (min-width: 1372px) and (max-width: 1919px)': {
              fontSize: '1rem',
              mb: 1.5
              },
              '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 700px)': {
                fontSize: '0.7rem',
              }
            }}
          >
            {t("mainSubHeader")}
          </Typography>
        </Box>

        {/* Karty */}
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(2, 1fr)" },
          gap: { xs: 0.5, sm: 0.75, md: 1, lg: 2 },
          width: '100%',
          boxSizing: 'border-box',
          '@media (max-height: 700px)': {
            gap: { xs: 0.4, sm: 0.5, md: 0.75 }
          },
          '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
            gap: 0.75
          },
          '@media (min-width: 1366px) and (max-width: 1367px) and (max-height: 700px)': {
            gap: 0.75
          },
          '@media (max-width: 599px)': {
          width: '250px',
          maxWidth: '360px',
          gap: 0.6,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
          }
        }}>
           {/* Top Row */}
           <Link href="/my-aquariums" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
           <Box sx={{
             bgcolor: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)',
             p: { xs: 1, sm: 1.25, md: 1.25, lg: 2.5 },
             borderRadius: 2,
             boxShadow: 3,
             transition: "all 0.3s",
             backdropFilter: 'blur(8px)',
             "&:hover": { 
               boxShadow: 5,
               transform: "translateY(-4px)",
               bgcolor: darkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.6)'
             },
             cursor: 'pointer',
             minHeight: { xs: '90px', sm: '100px', md: '100px', lg: '140px' },
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center',
             height: '100%',
             '@media (max-height: 700px)': {
               p: { xs: 0.75, sm: 1, md: 1 },
               minHeight: { xs: '75px', sm: '85px', md: '90px' }
             },
             '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
               p: 1,
               minHeight: '90px'
             }
           }}>
             <Typography sx={{ 
               fontSize: { xs: 24, sm: 26, md: 28, lg: 36 }, 
               mb: { xs: 0.25, sm: 0.5, md: 0.5, lg: 1.5 }, 
               textAlign: 'center',
               '@media (max-height: 700px)': {
                 fontSize: { xs: 20, sm: 22, md: 24 },
                 mb: { xs: 0.25, sm: 0.25, md: 0.5 }
               },
               '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
                 fontSize: 24,
                 mb: 0.5
               }
             }}>🏠</Typography>
             <Typography variant="h6" sx={{ 
               fontWeight: 600, 
                color: "text.primary", 
                mb: { xs: 0.25, sm: 0.5, md: 0.5, lg: 1 }, 
                textAlign: 'center', 
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem', lg: '1rem' },
                '@media (max-height: 700px)': {
                  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                  mb: { xs: 0.25, sm: 0.25, md: 0.5}
               },
               '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
                 fontSize: '0.75rem',
                 mb: 0.5
               }
             }}>
               {t("myAquariums")}
             </Typography>
             <Typography variant="body2" color="text.secondary" sx={{ 
               textAlign: 'center', 
               fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.7rem', lg: '0.8rem' }, 
               lineHeight: 1.3,
               '@media (max-height: 700px)': {
                 fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                 lineHeight: 1.2
               },
               '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
                 fontSize: '0.65rem',
                 lineHeight: 1.25
               }
             }}>
               {t("aquariumsDesc")}
             </Typography>
           </Box>
           </Link>
           
          <Link href="/fish-database" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <Box sx={{
              // darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)' - w dark mode ciemne tło, w light mode jasne
              bgcolor: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)',
              p: { xs: 1, sm: 1.25, md: 1.25, lg: 2.5 },
              borderRadius: 2,
              boxShadow: 3,
              transition: "all 0.3s",
              backdropFilter: 'blur(8px)',
              "&:hover": { 
                boxShadow: 5,
                transform: "translateY(-4px)",
                // darkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.6)' - ciemniejsze przy hover w dark mode
                bgcolor: darkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.6)'
              },
              cursor: 'pointer',
              minHeight: { xs: '90px', sm: '100px', md: '100px', lg: '140px' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              '@media (max-height: 700px)': {
                p: { xs: 0.75, sm: 1, md: 1 },
                minHeight: { xs: '75px', sm: '85px', md: '90px' }
              }
            }}>
              <Typography sx={{ 
                fontSize: { xs: 24, sm: 26, md: 28, lg: 36 }, 
                mb: { xs: 0.25, sm: 0.5, md: 0.5, lg: 1.5 }, 
                textAlign: 'center',
                '@media (max-height: 700px)': {
                  fontSize: { xs: 20, sm: 22, md: 24 },
                  mb: { xs: 0.25, sm: 0.25, md: 0.5 }
                },
                '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
                  fontSize: 24,
                  mb: 0.5
                }
              }}>🐠</Typography>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: "text.primary", 
                mb: { xs: 0.25, sm: 0.5, md: 0.5, lg: 1 }, 
                textAlign: 'center', 
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem', lg: '1rem' },
                '@media (max-height: 700px)': {
                  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                  mb: { xs: 0.25, sm: 0.25, md: 0.5 }
                },
                '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
                  fontSize: '0.75rem',
                  mb: 0.5
                }
              }}>
                {t("fishDatabase")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ 
                textAlign: 'center', 
                fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.7rem', lg: '0.8rem' }, 
                lineHeight: 1.3,
                '@media (max-height: 700px)': {
                  fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                  lineHeight: 1.2
                },
                '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
                  fontSize: '0.65rem',
                  lineHeight: 1.25
                }
              }}>
                {t("fishDesc")}
              </Typography>
            </Box>
          </Link>

           {/* Bottom Row - Contacts */}
           <Link href="/contacts" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
             <Box sx={{
               // darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)' - w dark mode ciemne tło, w light mode jasne
               bgcolor: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)',
               p: { xs: 1, sm: 1.25, md: 1.25, lg: 2.5 },
               borderRadius: 2,
               boxShadow: 3,
               transition: "all 0.3s",
               backdropFilter: 'blur(8px)',
               "&:hover": { 
                 boxShadow: 5,
                 transform: "translateY(-4px)",
                 // darkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.6)' - ciemniejsze przy hover w dark mode
                 bgcolor: darkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.6)'
               },
               cursor: 'pointer',
               minHeight: { xs: '90px', sm: '100px', md: '100px', lg: '140px' },
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               height: '100%',
               '@media (max-height: 700px)': {
                 p: { xs: 0.75, sm: 1, md: 1 },
                 minHeight: { xs: '75px', sm: '85px', md: '90px' }
               }
             }}>
               <Typography sx={{ 
                 fontSize: { xs: 24, sm: 26, md: 28, lg: 36 }, 
                 mb: { xs: 0.25, sm: 0.5, md: 0.5, lg: 1.5 }, 
                 textAlign: 'center',
                 '@media (max-height: 700px)': {
                   fontSize: { xs: 20, sm: 22, md: 24 },
                   mb: { xs: 0.25, sm: 0.25, md: 0.5 }
                 },
                 '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
                   fontSize: 24,
                   mb: 0.5
                 }
               }}>👥</Typography>
               <Typography variant="h6" sx={{ 
                 fontWeight: 600, 
                 color: "text.primary", 
                 mb: { xs: 0.25, sm: 0.5, md: 0.5, lg: 1 }, 
                 textAlign: 'center', 
                 fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem', lg: '1rem' },
                 '@media (max-height: 700px)': {
                   fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                   mb: { xs: 0.25, sm: 0.25, md: 0.5 }
                 },
                 '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
                   fontSize: '0.75rem',
                   mb: 0.5
                 }
               }}>
                 {t("contacts")}
               </Typography>
               <Typography variant="body2" color="text.secondary" sx={{ 
                 textAlign: 'center', 
                 fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.7rem', lg: '0.8rem' }, 
                 lineHeight: 1.3,
                 '@media (max-height: 700px)': {
                   fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                   lineHeight: 1.2
                 },
                 '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
                   fontSize: '0.65rem',
                   lineHeight: 1.25
                 }
               }}>
                 {t("contactsDesc")}
               </Typography>
             </Box>
           </Link>
           
          <Link href="/plant-database" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <Box sx={{
              // darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)' - w dark mode ciemne tło, w light mode jasne
              bgcolor: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)',
              p: { xs: 1, sm: 1.25, md: 1.25, lg: 2.5 },
              borderRadius: 2,
              boxShadow: 3,
              transition: "all 0.3s",
              backdropFilter: 'blur(8px)',
              "&:hover": { 
                boxShadow: 5,
                transform: "translateY(-4px)",
                // darkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.6)' - ciemniejsze przy hover w dark mode
                bgcolor: darkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.6)'
              },
              cursor: 'pointer',
              minHeight: { xs: '90px', sm: '100px', md: '100px', lg: '140px' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              '@media (max-height: 700px)': {
                p: { xs: 0.75, sm: 1, md: 1 },
                minHeight: { xs: '75px', sm: '85px', md: '90px' }
              }
            }}>
              <Typography sx={{ 
                fontSize: { xs: 24, sm: 26, md: 28, lg: 36 }, 
                mb: { xs: 0.25, sm: 0.5, md: 0.5, lg: 1.5 }, 
                textAlign: 'center',
                '@media (max-height: 700px)': {
                  fontSize: { xs: 20, sm: 22, md: 24 },
                  mb: { xs: 0.25, sm: 0.25, md: 0.5 }
                },
                '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
                  fontSize: 24,
                  mb: 0.5
                }
              }}>🌿</Typography>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: "text.primary", 
                mb: { xs: 0.25, sm: 0.5, md: 0.5, lg: 1 }, 
                textAlign: 'center', 
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem', lg: '1rem' },
                '@media (max-height: 700px)': {
                  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                  mb: { xs: 0.25, sm: 0.25, md: 0.5 }
                },
                '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
                  fontSize: '0.75rem',
                  mb: 0.5
                }
              }}>
                {t("plantsDatabase")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ 
                textAlign: 'center', 
                fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.7rem', lg: '0.8rem' }, 
                lineHeight: 1.3,
                '@media (max-height: 700px)': {
                  fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                  lineHeight: 1.2
                },
                '@media (min-width: 1366px) and (max-width: 1367px) and (min-height: 701px) and (max-height: 768px)': {
                  fontSize: '0.65rem',
                  lineHeight: 1.25
                }
              }}>
                {t("plantsDesc")}
              </Typography>
             </Box>
           </Link>
         </Box>
       </Box>

      {/* Settings Panel - Dropdown */}
      {settingsOpen && (
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'fixed',
            top: { xs: 72, md: 80 },
            right: { xs: 16, md: 32 },
            width: { xs: 'calc(100% - 32px)', md: '400px' },
            maxHeight: 'calc(100vh - 100px)',
            bgcolor: darkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(227, 242, 253, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
            animation: 'slideDown 0.3s ease-out',
            borderRadius: '16px',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
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
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: 24 }}>🌙</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {t("darkMode", { defaultValue: "Dark Mode" })}
                </Typography>
              </Box>
              <Switch 
                checked={darkMode}
                onChange={toggleDarkMode}
                color="primary"
              />
            </Box>

            {/* Edycja profilu */}
            <Box 
              onClick={handleOpenProfileEdit}
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
              onClick={handleOpenSessionInfo}
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
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{t("sessionDuration", { defaultValue: "Długość sesji" })}</Typography>
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
              onClick={handleOpenActivityHistory}
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
      )}
      
      {/* Overlay to close settings */}
      {settingsOpen && (
        <Box
          onClick={handleCloseSettings}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            bgcolor: 'rgba(0, 0, 0, 0.1)'
          }}
        />
      )}

      <Modal
        open={profileEditOpen}
        onClose={handleCloseProfileEdit}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box sx={{
          width: { xs: '90%', sm: 500 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 3,
          boxShadow: 24,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            {t("editProfile", { defaultValue: "Edycja profilu" })}
          </Typography>
          
          {profileError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {profileError}
            </Alert>
          )}
          
          {profileSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {profileSuccess}
            </Alert>
          )}
          
          <TextField
            fullWidth
            type="email"
            label={t("auth.email", { defaultValue: "Adres e-mail" })}
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
            {t("changePassword", { defaultValue: "Zmiana hasła (opcjonalnie)" })}
          </Typography>
          
          <TextField
            fullWidth
            type="password"
            label={t("currentPassword", { defaultValue: "Obecne hasło" })}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            type="password"
            label={t("newPassword", { defaultValue: "New Password" })}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
            helperText={t("auth.passwordTooShort", { defaultValue: "Hasło musi mieć co najmniej 6 znaków" })}
          />
          
          <TextField
            fullWidth
            type="password"
            label={t("auth.confirmPassword", { defaultValue: "Potwierdź hasło" })}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseProfileEdit}>
              {t("cancel", { defaultValue: "Anuluj" })}
            </Button>
            <Button variant="contained" onClick={handleSaveProfile}>
              {t("save", { defaultValue: "Zapisz" })}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={sessionInfoOpen}
        onClose={handleCloseSessionInfo}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box sx={{
          width: { xs: '90%', sm: 450 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 3,
          boxShadow: 24
        }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            {t("sessionInfo", { defaultValue: "Informacje o sesji" })}
          </Typography>
          
          {(() => {
            const loginTime = localStorage.getItem("sessionLoginTime") || user?.loginTime;
            if (!loginTime) {
              return (
                <Typography color="text.secondary">
                  {t("noSessionData", { defaultValue: "Brak danych o sesji" })}
                </Typography>
              );
            }
            
            const loginDate = new Date(loginTime);
            const formattedDate = loginDate.toLocaleString('pl-PL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            
            return (
              <>
                <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                    {t("loginTime", { defaultValue: "Data i godzina logowania" })}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formattedDate}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                    {t("sessionDurationLabel", { defaultValue: "Czas trwania sesji" })}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {sessionDuration || calculateSessionDuration()}
                  </Typography>
                </Box>
              </>
            );
          })()}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" onClick={handleCloseSessionInfo}>
              {t("close", { defaultValue: "Zamknij" })}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal z historią aktywności */}
      <Modal
        open={activityHistoryOpen}
        onClose={handleCloseActivityHistory}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box sx={{
          width: { xs: '95%', sm: '90%', md: 800 },
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {t("activityHistory", { defaultValue: "Historia aktywności" })}
          </Typography>
          
          {/* Filtry i sortowanie */}
          <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
              <InputLabel>{t("filterByAction", { defaultValue: "Filtruj po akcji" })}</InputLabel>
              <Select
                value={selectedActionFilter}
                onChange={(e) => setSelectedActionFilter(e.target.value)}
                label={t("filterByAction", { defaultValue: "Filtruj po akcji" })}
              >
                <MenuItem value="all">{t("allActions", { defaultValue: "Wszystkie akcje" })}</MenuItem>
                {actionTypes.map(type => (
                  <MenuItem key={type} value={type}>{getActionLabel(type)}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
              <InputLabel>{t("filterByAquarium", { defaultValue: "Filtruj po akwarium" })}</InputLabel>
              <Select
                value={selectedAquariumFilter}
                onChange={(e) => setSelectedAquariumFilter(e.target.value)}
                label={t("filterByAquarium", { defaultValue: "Filtruj po akwarium" })}
              >
                <MenuItem value="all">{t("allAquariums", { defaultValue: "Wszystkie akwaria" })}</MenuItem>
                {uniqueAquariums.map(aquarium => (
                  <MenuItem key={aquarium} value={aquarium}>{aquarium}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: { xs: '100%', sm: 180 } }}>
              <InputLabel>{t("sortByDate", { defaultValue: "Sortuj po dacie" })}</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                label={t("sortByDate", { defaultValue: "Sortuj po dacie" })}
              >
                <MenuItem value="newest">{t("newestFirst", { defaultValue: "Najnowsze najpierw" })}</MenuItem>
                <MenuItem value="oldest">{t("oldestFirst", { defaultValue: "Najstarsze najpierw" })}</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {/* Lista aktywności */}
          <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
            {filteredAndSortedActivities.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  {t("noActivity", { defaultValue: "Brak aktywności" })}
                </Typography>
              </Box>
            ) : (
              <List>
                {filteredAndSortedActivities.map((activity) => (
                  <ListItem
                    key={activity.id}
                    sx={{
                      mb: 1,
                      bgcolor: 'rgba(0, 0, 0, 0.02)',
                      borderRadius: 1.5,
                      borderLeft: `4px solid ${getActionColor(activity.type)}`,
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Chip
                            label={getActionLabel(activity.type)}
                            size="small"
                            sx={{
                              bgcolor: getActionColor(activity.type),
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {activity.aquarium}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span" sx={{ display: 'block', mb: 0.5 }}>
                            {activity.details}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            {activity.date.toLocaleString('pl-PL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
            <Button variant="contained" onClick={handleCloseActivityHistory}>
              {t("close", { defaultValue: "Zamknij" })}
            </Button>
          </Box>
        </Box>
      </Modal>

    </Box>
  );
}

