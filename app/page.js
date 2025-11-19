"use client";

import dynamic from "next/dynamic";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthForm from "./components/AuthForm";

const Dashboard = dynamic(() => import("./components/Dashboard"), {
  loading: () => <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>Loading...</div>,
  ssr: false
});

function AuthFlow() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a loading spinner
  }

  if (user) {
    return <Dashboard />;
  }

  return <AuthForm />;
}

export default function Home() {
  return (
    <AuthProvider>
      <AuthFlow />
    </AuthProvider>
  );
}
