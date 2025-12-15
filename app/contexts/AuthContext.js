"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (!userData.loginTime) {
        const loginTime = new Date().toISOString();
        userData.loginTime = loginTime;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("sessionLoginTime", loginTime);
      }
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      
      // API zwraca token i dane użytkownika
      const loginTime = new Date().toISOString();
      const userData = {
        id: response.user?.id || response.id,
        email: response.user?.email || email,
        name: response.user?.name || response.name || email.split("@")[0],
        token: response.token || response.user?.token,
        loginTime: loginTime,
        role: response.user?.role || 'user'
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("sessionLoginTime", loginTime);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await registerUser(name, email, password);
      
      // API zwraca token i dane użytkownika
      const loginTime = new Date().toISOString();
      const userData = {
        id: response.user?.id || response.id,
        email: response.user?.email || email,
        name: response.user?.name || response.name || name,
        token: response.token || response.user?.token,
        loginTime: loginTime,
        role: response.user?.role || 'user'
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("sessionLoginTime", loginTime);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

