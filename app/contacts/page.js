"use client";

import { useState } from "react";
import { Box, Typography, TextField, Button, Card, CardContent, List, ListItem, ListItemText, Avatar, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import LanguageSwitcher from "../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from "../contexts/ThemeContext";

export default function ContactsPage() {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const [inviteEmail, setInviteEmail] = useState("");
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Jan Kowalski', email: 'jan.kowalski@example.com', status: 'accepted' },
    { id: '2', name: 'Anna Nowak', email: 'anna.nowak@example.com', status: 'pending' },
    { id: '3', name: 'Piotr Wiśniewski', email: 'piotr.wisniewski@example.com', status: 'accepted' },
  ]);

  const handleSendInvite = () => {
    if (inviteEmail.trim()) {
      // Dodaj nowy kontakt jako pending
      const newContact = {
        id: `${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        status: 'pending'
      };
      setContacts([...contacts, newContact]);
      setInviteEmail("");
      alert(`${t("inviteSent", { defaultValue: "Zaproszenie wysłane na" })}: ${inviteEmail}`);
    }
  };

  const handleRemoveContact = (contactId) => {
    setContacts(contacts.filter(c => c.id !== contactId));
  };

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {/* Górny pasek z gradientem */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 96,
        background: 'linear-gradient(to bottom right, #cfeef6 0%, #87cde1 50%, #2e7fa9 100%)',
        zIndex: 5
      }} />
      
      {/* Ciemny overlay dla dark mode */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: darkMode ? 'rgba(0, 0, 0, 0.25)' : 'transparent',
          zIndex: 4,
          transition: 'background-color 0.3s ease',
          pointerEvents: 'none'
        }}
      />
      
      {/* Ciemny overlay na górny pasek dla dark mode */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 96,
          bgcolor: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
          zIndex: 6,
          transition: 'background-color 0.3s ease',
          pointerEvents: 'none'
        }}
      />

      {/* Top bar */}
      <Box sx={{ 
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: { xs: 2, sm: 4 }, py: 2, zIndex: 10
      }}>
        <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 } }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{
              bgcolor: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)', 
              p: { xs: 0.5, sm: 0.8 }, 
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
              minHeight: { xs: '50px', sm: '60px' }, 
              minWidth: { xs: '60px', sm: '80px' }, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <KeyboardReturnOutlinedIcon sx={{ fontSize: { xs: 14, sm: 16 }, mb: 0.3, color: darkMode ? 'white' : 'inherit' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: darkMode ? 'white' : "text.primary", textAlign: 'center', fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
                {t("return")}
              </Typography>
            </Box>
          </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 1, sm: 2 } }}>
          <LanguageSwitcher />
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ position: "relative", zIndex: 2, p: 4, pt: 14, pb: 14 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          maxWidth: '800px',
          mx: 'auto'
        }}>
          {/* Formularz zaproszenia - wyśrodkowany */}
          <Card sx={{
            width: '100%',
            maxWidth: '500px',
            bgcolor: darkMode ? 'rgba(30, 30, 30, 0.95)' : '#ffffff',
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-2px)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                {t("inviteToCollaboration", { defaultValue: "Zaproś do współpracy" })}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  type="email"
                  label={t("collaborationEmail", { defaultValue: "Adres e-mail" })}
                  placeholder={t("collaborationEmail", { defaultValue: "Adres e-mail" })}
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  onClick={handleSendInvite}
                  disabled={!inviteEmail.trim()}
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  {t("sendInvite", { defaultValue: "Wyślij zaproszenie" })}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Lista znajomych */}
          <Card sx={{
            width: '100%',
            maxWidth: '700px',
            bgcolor: darkMode ? 'rgba(30, 30, 30, 0.95)' : '#ffffff',
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-2px)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                {t("contactsList", { defaultValue: "Lista znajomych" })}
              </Typography>
              {contacts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  {t("noContacts", { defaultValue: "Brak znajomych" })}
                </Typography>
              ) : (
                <List>
                  {contacts.map((contact) => (
                    <ListItem
                      key={contact.id}
                      sx={{
                        bgcolor: contact.status === 'pending' ? 'rgba(255, 193, 7, 0.08)' : 'rgba(0, 0, 0, 0.02)',
                        borderRadius: 2,
                        mb: 1.5,
                        border: '1px solid',
                        borderColor: contact.status === 'pending' ? 'rgba(255, 193, 7, 0.2)' : 'rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: contact.status === 'pending' ? 'rgba(255, 193, 7, 0.15)' : 'rgba(0, 0, 0, 0.04)',
                          borderColor: contact.status === 'pending' ? 'rgba(255, 193, 7, 0.3)' : 'rgba(0, 0, 0, 0.12)',
                          transform: 'translateX(4px)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                        }
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveContact(contact.id)}
                          sx={{ 
                            color: 'error.main',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: 'rgba(211, 47, 47, 0.1)',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <Avatar sx={{ bgcolor: contact.status === 'pending' ? '#FFC107' : '#1976d2', mr: 2 }}>
                        {contact.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <ListItemText
                        primary={contact.name}
                        secondary={
                          <>
                            <Box component="span" sx={{ display: 'block', mb: contact.status === 'pending' ? 0.5 : 0 }}>
                              {contact.email}
                            </Box>
                            {contact.status === 'pending' && (
                              <Box component="span" sx={{ display: 'block', color: '#FF9800', fontWeight: 600, fontSize: '0.75rem' }}>
                                {t("pending", { defaultValue: "Oczekuje na akceptację" })}
                              </Box>
                            )}
                          </>
                        }
                        secondaryTypographyProps={{
                          component: 'div'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

