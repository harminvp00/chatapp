import { createContext, useContext, useEffect, useState } from "react";
import { contextNotExist } from "../Errors/context.error.js";
import axios from "axios";

// create a context
const AuthContext = createContext(null);

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
});

// create a provider
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function fetchUser() {
    try {
      const response = await api.get("/auth/me");

      setUser(response?.data?.user);
    } catch (error) {
      console.error(error);
      setUser(null);
    }

    console.log(user);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    await api.get("/user/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new contextNotExist();
  return context;
}
