"use client";

import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import {signIn, signOut, useSession} from "next-auth/react";
import {Alert, Box, Button, Modal, Switch, TextField, Typography} from "@mui/material";
import {APP_VERSION} from "../version";
import {useTheme} from "../contexts/ThemeContext";
import Link from "next/link";

export default function Dashboard() {
  const { t } = useTranslation();
    const { data: session } = useSession();
    const user = session?.user;

    useEffect(() => {
        if (session && !localStorage.getItem("sessionLoginTime")) {
            localStorage.setItem("sessionLoginTime", new Date().toISOString());
        }
    }, [session]);

    const logout = async () => {
        localStorage.removeItem("sessionLoginTime");

        // Clear NextAuth session without redirect
        await signOut({ redirect: false });

        const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
        const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
        const redirectUri = process.env.NEXT_PUBLIC_COGNITO_LOGOUT_REDIRECT;

        if (!domain || !clientId || !redirectUri) {
            console.error("Missing Cognito logout env variables");
            return;
        }

        window.location.href = `https://${domain}/logout` +
            `?client_id=${encodeURIComponent(clientId)}` +
            `&logout_uri=${encodeURIComponent(redirectUri)}`;
    };

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
  const handleOpenSettings = () => setSettingsOpen(true);
  const handleCloseSettings = () => setSettingsOpen(false);
  const toggleDataSource = () => setDataSourceExpanded(!dataSourceExpanded);

  const calculateSessionDuration = () => {
    const loginTime = localStorage.getItem("sessionLoginTime");    if (!loginTime) return "";
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
        setProfileSuccess(
            t("profileManagedByCognito", {
                defaultValue:
                    "Profile/email/password changes are managed by Cognito. Implement a Cognito update flow instead of localStorage.",
            })
        );
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
            aria-label={t("backgroundVideo", { defaultValue: "Dekoracyjne tło wideo z akwarium" })}
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
        <Box
            component="nav"
            role="navigation"
            aria-label={t("mainNavigation", { defaultValue: "Główna nawigacja" })}
            sx={{
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

        <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: { xs: 'center', lg: 'flex-start' },
          px: { xs: 2, sm: 4, md: 6, lg: '10%' },
          py: 4,
          '@media (max-height: 750px)': {
            py: 2,
            justifyContent: 'flex-start',
            pt: '100px'
          },
          '@media (max-width: 600px)': {
            justifyContent: 'flex-start',
            pt: '100px',
            pb: '40px'
          },
          zIndex: 10,
          position: 'relative',
          width: '100%',
          overflowY: 'auto',
          maxHeight: '100vh'
        }}
      >
        <Box sx={{
          width: '100%',
          maxWidth: '550px',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, md: 3 },
          '@media (max-height: 750px)': { gap: 1.5 }
        }}>
          
          <Box sx={{
            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.01)',
            padding: { xs: 3, md: 4 },
            '@media (max-height: 750px)': { p: 2.5 },
            borderRadius: '12px',
            backdropFilter: 'blur(15px)',
            width: '100%',
          }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: "bold",
                color: "white",
                mb: 1,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                '@media (max-height: 750px)': { fontSize: '2rem' },
                textAlign: { xs: 'center', lg: 'left' },
                lineHeight: 1.2
              }}
            >
              {t("mainHeader")}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontSize: { xs: '0.9rem', md: '1.1rem' },
                '@media (max-height: 750px)': { fontSize: '0.9rem' },
                textAlign: { xs: 'center', lg: 'left' },
                opacity: 0.9
              }}
            >
              {t("mainSubHeader")}
            </Typography>
          </Box>

          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            '@media (max-height: 750px)': { gap: 1 },
            width: '100%',
          }}>
            <Link href="/my-aquariums" style={{ textDecoration: 'none', display: 'block' }}>
              <Box sx={{
                 bgcolor: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)',
                 p: 2,
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
                 minHeight: { xs: '100px', md: '120px' },
                 '@media (max-height: 750px)': { minHeight: '90px', p: 1 },
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'center',
                 height: '100%'
              }}>
                <Typography sx={{ fontSize: 32, mb: 1, '@media (max-height: 750px)': { fontSize: 24, mb: 0.5 } }}>🏠</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", fontSize: '0.9rem', textAlign: 'center' }}>
                  {t("myAquariums")}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.2, mt: 0.5, display: {xs: 'none', sm: 'block'} }}>
                  {t("aquariumsDesc")}
                </Typography>
              </Box>
            </Link>

            <Link href="/fish-database" style={{ textDecoration: 'none', display: 'block' }}>
               <Box sx={{
                 bgcolor: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)',
                 p: 2,
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
                 minHeight: { xs: '100px', md: '120px' },
                 '@media (max-height: 750px)': { minHeight: '90px', p: 1 },
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'center',
                 height: '100%'
              }}>
                <Typography sx={{ fontSize: 32, mb: 1, '@media (max-height: 750px)': { fontSize: 24, mb: 0.5 } }}>🐠</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", fontSize: '0.9rem', textAlign: 'center' }}>
                  {t("fishDatabase")}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.2, mt: 0.5, display: {xs: 'none', sm: 'block'} }}>
                  {t("fishDesc")}
                </Typography>
              </Box>
            </Link>

            <Link href="/contacts" style={{ textDecoration: 'none', display: 'block' }}>
               <Box sx={{
                 bgcolor: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)',
                 p: 2,
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
                 minHeight: { xs: '100px', md: '120px' },
                 '@media (max-height: 750px)': { minHeight: '90px', p: 1 },
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'center',
                 height: '100%'
              }}>
                <Typography sx={{ fontSize: 32, mb: 1, '@media (max-height: 750px)': { fontSize: 24, mb: 0.5 } }}>👥</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", fontSize: '0.9rem', textAlign: 'center' }}>
                  {t("contacts")}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.2, mt: 0.5, display: {xs: 'none', sm: 'block'} }}>
                  {t("contactsDesc")}
                </Typography>
              </Box>
            </Link>

            <Link href="/plant-database" style={{ textDecoration: 'none', display: 'block' }}>
               <Box sx={{
                 bgcolor: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)',
                 p: 2,
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
                 minHeight: { xs: '100px', md: '120px' },
                 '@media (max-height: 750px)': { minHeight: '90px', p: 1 },
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'center',
                 height: '100%'
              }}>
                <Typography sx={{ fontSize: 32, mb: 1, '@media (max-height: 750px)': { fontSize: 24, mb: 0.5 } }}>🌿</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", fontSize: '0.9rem', textAlign: 'center' }}>
                  {t("plantsDatabase")}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.2, mt: 0.5, display: {xs: 'none', sm: 'block'} }}>
                  {t("plantsDesc")}
                </Typography>
              </Box>
            </Link>
          </Box>
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
                  '&:focus-visible': {
                    outline: '2px solid #1976d2',
                    outlineOffset: '2px'
                  },
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
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{t("dataSource")}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 20 }}>{dataSourceExpanded ? '▼' : '→'}</Typography>
                  </Box>

                  {/* Rozwinięte informacje o źródle danych */}
                  {dataSourceExpanded && (
                      <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                        <Box sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.5)', borderRadius: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{t("dataSourceType")}:</Typography>
                          <Typography variant="body2" color="text.secondary">{t("api")}</Typography>
                        </Box>
                        <Box sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.5)', borderRadius: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{t("environment")}:</Typography>
                          <Typography variant="body2" color="text.secondary">{t("development")}</Typography>
                        </Box>
                        <Box sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.5)', borderRadius: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{t("status")}:</Typography>
                          <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 600 }}>● {t("connected")}</Typography>
                        </Box>
                        <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.5)', borderRadius: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{t("lastSync")}:</Typography>
                          <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                            {new Date().toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                            {t("connected")} - {t("dataSourceType")}: API
                          </Typography>
                        </Box>
                      </Box>
                  )}
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
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{t("version")}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">{APP_VERSION}</Typography>
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
              const loginTime = localStorage.getItem("sessionLoginTime");
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


      </Box>
  );
}