import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();
import api from '../api/api.js';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const uri = `${import.meta.env.VITE_SERVER_URI}/auth/me`;
        const response = await api.get(uri, { withCredentials: true });
        setUser(response.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setloading(false);
      }
    }

    getCurrentUser();
  }, []);

  const login = async (formData) => {
    const uri = `${import.meta.env.VITE_SERVER_URI}/auth/login`;

    const response = await api.post(uri, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    setUser(response.data.user);

    return response.data.user;
  };

  const logout = async () => {
    try {
      const uri = `${import.meta.env.VITE_SERVER_URI}/auth/logout`;
      await api.get(uri, { withCredentials: true });
      setUser(null);
    } catch (e) {
      console.error(e.message)
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};