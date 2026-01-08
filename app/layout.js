"use client";

import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import "./i18n";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

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

function AppThemeWrapper({ children }) {
    const { theme } = useTheme();

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
}

export default function RootLayout({ children }) {
    const { i18n } = useTranslation();
    const currentLang = i18n.language || "en";
    const pathname = usePathname();

    const isAdminPage = pathname?.startsWith("/admin");

    const bodyStyles = isAdminPage
        ? {
            backgroundColor: "#f3f4f6",
            color: "#1f2937",
        }
        : {
            backgroundImage: 'url("/background.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
        };

    return (
        <html lang={currentLang}>
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} antialiased`}
            style={bodyStyles}
        >
        <SessionProvider>
            <ThemeProvider>
                <AppThemeWrapper>
                    {children}
                </AppThemeWrapper>
            </ThemeProvider>
        </SessionProvider>
        </body>
        </html>
    );
}