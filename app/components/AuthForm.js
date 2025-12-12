"use client";

import { useState } from "react";
import { Box, TextField, Button, Typography, Alert, IconButton, ThemeProvider, createTheme } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

// Force light theme for auth form
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

export default function AuthForm() {
  const [isActive, setIsActive] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { t } = useTranslation();

  const handleRegisterClick = () => {
    setIsActive(true);
    setError("");
  };

  const handleLoginClick = () => {
    setIsActive(false);
    setError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!name || !email || !password || !confirmPassword) {
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

      if (password !== confirmPassword) {
        setError(t("auth.passwordsDontMatch"));
        setLoading(false);
        return;
      }

      const result = await register(name, email, password);
      
      if (!result.success) {
        setError(t("auth.registrationError"));
      }
    } catch (err) {
      setError(t("auth.registrationError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Placeholder for social login
    console.log(`Social login with ${provider}`);
    // TODO: Implement OAuth integration
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to right, #e2e2e2, #c9d6ff)",
          padding: 2,
          fontFamily: '"Montserrat", sans-serif',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
      {/* Language Switcher - positioned absolutely */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000
        }}
      >
        <LanguageSwitcher />
      </Box>

      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '30px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          overflow: 'hidden',
          width: { xs: '100%', sm: '768px' },
          maxWidth: '100%',
          minHeight: { xs: '600px', sm: '480px' },
        }}
        className={isActive ? 'active' : ''}
      >
        {/* Sign In Form */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '50%',
            transition: 'all 0.6s ease-in-out',
            zIndex: 2,
            transform: isActive ? 'translateX(100%)' : 'translateX(0)',
          }}
        >
          <Box
            component="form"
            onSubmit={handleLoginSubmit}
            sx={{
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: { xs: '0 30px', sm: '0 40px' },
              height: '100%',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                color: '#333',
              }}
            >
              {t("auth.login")}
            </Typography>

            {/* Social Icons */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <IconButton
                onClick={() => handleSocialLogin('google')}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '20%',
                  width: 40,
                  height: 40,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                }}
                aria-label="Login with Google"
              >
                <GoogleIcon />
              </IconButton>
              <IconButton
                onClick={() => handleSocialLogin('facebook')}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '20%',
                  width: 40,
                  height: 40,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                }}
                aria-label="Login with Facebook"
              >
                <FacebookIcon />
              </IconButton>
            </Box>

            <Typography
              variant="body2"
              sx={{
                fontSize: '12px',
                color: '#666',
                mb: 2,
              }}
            >
              {t("auth.orUseEmail", { defaultValue: "or use your email password" })}
            </Typography>

            {error && !isActive && (
              <Alert severity="error" sx={{ width: '100%', mb: 2, fontSize: '12px' }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              type="email"
              placeholder={t("auth.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#eee',
                  borderRadius: '8px',
                  fontSize: '13px',
                  '& fieldset': { border: 'none' },
                },
              }}
            />
            <TextField
              fullWidth
              type="password"
              placeholder={t("auth.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#eee',
                  borderRadius: '8px',
                  fontSize: '13px',
                  '& fieldset': { border: 'none' },
                },
              }}
            />
            <Button
              type="button"
              variant="text"
              sx={{
                alignSelf: 'flex-start',
                fontSize: '13px',
                color: '#333',
                textTransform: 'none',
                mb: 1,
                p: 0,
                minWidth: 'auto',
              }}
            >
              {t("auth.forgotPassword", { defaultValue: "Forget Your Password?" })}
            </Button>
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: '#2575c5',
                color: '#fff',
                fontSize: '12px',
                padding: '10px 45px',
                border: '1px solid transparent',
                borderRadius: '8px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginTop: '10px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#1e5fa0',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                },
              }}
            >
              {loading ? t("auth.loading") : t("auth.loginButton")}
            </Button>
          </Box>
        </Box>

        {/* Sign Up Form */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '50%',
            opacity: isActive ? 1 : 0,
            zIndex: isActive ? 5 : 1,
            transition: 'all 0.6s ease-in-out',
            transform: isActive ? 'translateX(100%)' : 'translateX(0)',
          }}
        >
          <Box
            component="form"
            onSubmit={handleRegisterSubmit}
            sx={{
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: { xs: '0 30px', sm: '0 40px' },
              height: '100%',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                color: '#333',
              }}
            >
              {t("auth.register")}
            </Typography>

            {/* Social Icons */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <IconButton
                onClick={() => handleSocialLogin('google')}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '20%',
                  width: 40,
                  height: 40,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                }}
                aria-label="Login with Google"
              >
                <GoogleIcon />
              </IconButton>
              <IconButton
                onClick={() => handleSocialLogin('facebook')}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '20%',
                  width: 40,
                  height: 40,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                }}
                aria-label="Login with Facebook"
              >
                <FacebookIcon />
              </IconButton>
            </Box>

            <Typography
              variant="body2"
              sx={{
                fontSize: '12px',
                color: '#666',
                mb: 2,
              }}
            >
              {t("auth.orUseEmailRegister", { defaultValue: "or use your email for registration" })}
            </Typography>

            {error && isActive && (
              <Alert severity="error" sx={{ width: '100%', mb: 2, fontSize: '12px' }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              placeholder={t("auth.name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#eee',
                  borderRadius: '8px',
                  fontSize: '13px',
                  '& fieldset': { border: 'none' },
                },
              }}
            />
            <TextField
              fullWidth
              type="email"
              placeholder={t("auth.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#eee',
                  borderRadius: '8px',
                  fontSize: '13px',
                  '& fieldset': { border: 'none' },
                },
              }}
            />
            <TextField
              fullWidth
              type="password"
              placeholder={t("auth.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#eee',
                  borderRadius: '8px',
                  fontSize: '13px',
                  '& fieldset': { border: 'none' },
                },
              }}
            />
            <TextField
              fullWidth
              type="password"
              placeholder={t("auth.confirmPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#eee',
                  borderRadius: '8px',
                  fontSize: '13px',
                  '& fieldset': { border: 'none' },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: '#2575c5',
                color: '#fff',
                fontSize: '12px',
                padding: '10px 45px',
                border: '1px solid transparent',
                borderRadius: '8px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginTop: '10px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#1e5fa0',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                },
              }}
            >
              {loading ? t("auth.loading") : t("auth.registerButton")}
            </Button>
          </Box>
        </Box>

        {/* Toggle Container */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '50%',
            height: '100%',
            overflow: 'hidden',
            transition: 'all 0.6s ease-in-out',
            borderRadius: isActive ? '0 150px 100px 0' : '150px 0 0 100px',
            zIndex: 1000,
            transform: isActive ? 'translateX(-100%)' : 'translateX(0)',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(to right, #5c6bc0, #2575c5)',
              color: '#fff',
              position: 'relative',
              left: '-100%',
              height: '100%',
              width: '200%',
              transform: isActive ? 'translateX(50%)' : 'translateX(0)',
              transition: 'all 0.6s ease-in-out',
            }}
          >
            {/* Toggle Left Panel (Welcome Back) */}
            <Box
              sx={{
                position: 'absolute',
                width: '50%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '0 30px',
                textAlign: 'center',
                top: 0,
                transform: isActive ? 'translateX(0)' : 'translateX(-200%)',
                transition: 'all 0.6s ease-in-out',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                }}
              >
                {t("auth.welcomeBack", { defaultValue: "Welcome Back!" })}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '0.3px',
                  mb: 3,
                }}
              >
                {t("auth.welcomeBackDesc", { defaultValue: "Enter your personal details to use all of site features" })}
              </Typography>
              <Button
                onClick={handleLoginClick}
                sx={{
                  backgroundColor: 'transparent',
                  border: '1px solid #fff',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '10px 45px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {t("auth.loginButton")}
              </Button>
            </Box>

            {/* Toggle Right Panel (Hello Friend) */}
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                width: '50%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '0 30px',
                textAlign: 'center',
                top: 0,
                transform: isActive ? 'translateX(200%)' : 'translateX(0)',
                transition: 'all 0.6s ease-in-out',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                }}
              >
                {t("auth.helloFriend", { defaultValue: "Hello Friend!" })}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '0.3px',
                  mb: 3,
                }}
              >
                {t("auth.helloFriendDesc", { defaultValue: "Register with your personal details to use all of site features" })}
              </Typography>
              <Button
                onClick={handleRegisterClick}
                sx={{
                  backgroundColor: 'transparent',
                  border: '1px solid #fff',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '10px 45px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {t("auth.registerButton")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      </Box>
    </ThemeProvider>
  );
}

