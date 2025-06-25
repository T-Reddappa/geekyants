import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "engineer" | "manager";
  skills?: string[];
  seniority?: "junior" | "mid" | "senior";
  maxCapacity?: number;
  department?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile on load
  const fetchProfile = async () => {
    try {
      const res = await api.get<User>("/auth/profile");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token", token);
    if (token) {
      fetchProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
