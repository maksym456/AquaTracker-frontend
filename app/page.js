"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";

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
