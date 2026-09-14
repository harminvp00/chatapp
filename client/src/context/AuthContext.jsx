import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const uri = `${import.meta.env.VITE_SERVER_URI}/auth/me`;
        const response = await axios.get(uri, { withCredentials: true });
        setUser(response.data.user);
      } catch (err) {
        setUser(null);
        console.log(err);
      } finally {
        setloading(false);
      }
    }

    getCurrentUser();
  }, []);

  async function logout() {
    try {
      const uri = `${import.meta.env.VITE_SERVER_URI}/auth/logout`;
      await axios.get(uri, { withCredentials: true });
      setUser(null);
    } catch (e) {}
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.log("context is not available");
  }
  return context;
};
