"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

const Dashboard = dynamic(() => import("./components/Dashboard"), {
  loading: () => <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>Loading...</div>,
  ssr: false
});

function AuthFlow() {
  const [showRegister, setShowRegister] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a loading spinner
  }

  if (user) {
    return <Dashboard />;
  }

  if (showRegister) {
    return <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />;
  }

  return <LoginForm onSwitchToRegister={() => setShowRegister(true)} />;
}

export default function Home() {
  return (
    <AuthProvider>
      <AuthFlow />
    </AuthProvider>
  );
}
