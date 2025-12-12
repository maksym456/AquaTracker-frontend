"use client";

import { createContext, useContext, useState, useEffect } from "react";

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
    // TODO: Replace with actual API call when backend is ready
    // Example backend integration:
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    // if (!response.ok) throw new Error('Login failed');
    // const data = await response.json();
    
    // For now, simulate API call
    const loginTime = new Date().toISOString();
    const mockUser = {
      id: 1,
      email: email,
      name: email.split("@")[0],
      token: "mock-token-" + Date.now(),
      loginTime: loginTime,
      role: 'user'
    };
    
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("sessionLoginTime", loginTime);
    setUser(mockUser);
    
    return { success: true, user: mockUser };
  };

  const register = async (name, email, password) => {
    // TODO: Replace with actual API call when backend is ready
    // Example backend integration:
    // const response = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, password })
    // });
    // if (!response.ok) throw new Error('Registration failed');
    // const data = await response.json();
    
    // For now, simulate API call
    const loginTime = new Date().toISOString();
    const mockUser = {
      id: 1,
      email: email,
      name: name,
      token: "mock-token-" + Date.now(),
      loginTime: loginTime,
      role: 'user'
    };
    
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("sessionLoginTime", loginTime);
    setUser(mockUser);
    
    return { success: true, user: mockUser };
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

