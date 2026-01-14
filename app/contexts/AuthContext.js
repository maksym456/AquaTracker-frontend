"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../lib/api";

const AuthContext = createContext();

/**
 * Generuje UUID v4
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Konwertuje stary ID (liczba) na UUID, jeśli potrzeba
 */
function normalizeUserId(userData) {
  // Jeśli ID jest liczbą lub stringiem liczby, generuj UUID
  if (userData.id && (typeof userData.id === 'number' || (typeof userData.id === 'string' && /^\d+$/.test(userData.id)))) {
    // Generuj UUID tylko jeśli nie ma już UUID
    if (!userData.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
      userData.id = generateUUID();
      localStorage.setItem("user", JSON.stringify(userData));
    }
  }
  // Jeśli nie ma ID, generuj UUID
  if (!userData.id) {
    userData.id = generateUUID();
    localStorage.setItem("user", JSON.stringify(userData));
  }
  return userData;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Normalizuj ID użytkownika (konwertuj liczbę na UUID)
        const normalizedUser = normalizeUserId(userData);
        if (!normalizedUser.loginTime) {
          const loginTime = new Date().toISOString();
          normalizedUser.loginTime = loginTime;
          localStorage.setItem("user", JSON.stringify(normalizedUser));
          localStorage.setItem("sessionLoginTime", loginTime);
        }
        setUser(normalizedUser);
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem("user");
      }
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

