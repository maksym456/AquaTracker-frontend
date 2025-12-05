"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  Link
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function LoginForm({ onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Basic validation
      if (!email || !password) {
        setError(t("auth.fillAllFields"));
        setLoading(false);
        return;
      }

      if (!email.includes("@")) {
        setError(t("auth.invalidEmail"));
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError(t("auth.passwordTooShort"));
        setLoading(false);
        return;
      }

      const result = await login(email, password);
      
      if (!result.success) {
        setError(t("auth.loginError"));
      }
    } catch (err) {
      setError(t("auth.loginError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        overflow: 'hidden'
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-label={t("backgroundVideo", { defaultValue: "Dekoracyjne tło wideo z akwarium" })}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
        onLoadedData={(e) => {
          e.target.play().catch(() => {});
      }}
    >
        <source src="/loginPage-bg.mp4" type="video/mp4" />
      </video>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={3} sx={{ width: "100%", padding: 4, position: "relative", zIndex: 1, bgcolor: darkMode ? 'rgba(30, 30, 30, 0.95)' : '#E3F2FD' }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <LanguageSwitcher />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 2 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              bgcolor: darkMode ? 'rgba(50, 50, 50, 0.8)' : '#E3F2FD', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🐠
            </Box>
            <Typography variant="h4" component="h1" sx={{ color: darkMode ? 'white' : 'inherit' }}>
              AquaTracker
            </Typography>
          </Box>
          <Typography variant="h6" component="h2" gutterBottom align="center" sx={{ mb: 1, color: darkMode ? 'white' : 'inherit' }}>
            {t("auth.doYouHaveAccount")}
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3, color: darkMode ? 'white' : 'inherit' }}>
            {t("auth.logIn")}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t("auth.email")}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t("auth.password")}
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? t("auth.loading") : t("auth.loginButton")}
            </Button>
            <Box textAlign="center">
              <Link
                component="button"
                variant="body2"
                onClick={onSwitchToRegister}
                disabled={loading}
                sx={{ cursor: "pointer" }}
              >
                {t("auth.dontHaveAccount")}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

