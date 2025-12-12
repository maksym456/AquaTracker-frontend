"use client";

import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import "./i18n";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useTranslation } from "react-i18next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

function ThemeWrapper({ children }) {
  const { theme } = useTheme();
  
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

function LanguageWrapper({ children }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  
  return (
    <html lang={currentLang}>
      {children}
    </html>
  );
}

export default function RootLayout({ children }) {
  return (
    <LanguageWrapper>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} antialiased`}
        style={{
          backgroundImage: 'url("/background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <AuthProvider>
          <ThemeProvider>
            <ThemeWrapper>
              {children}
            </ThemeWrapper>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </LanguageWrapper>
  );
}
