import { createContext, useContext, useState, ReactNode } from "react";
import { authAPI } from "@/api";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "PROCTOR" | "ORGANIZER" | "ADMIN" | string;
  college?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role?: string, college?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("hackselect_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(email, password);
      const userData: User = response.user;
      
      setUser(userData);
      localStorage.setItem("hackselect_user", JSON.stringify(userData));
      localStorage.setItem("token", response.token);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role?: string, college?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(email, password, name, role, college);
      const userData: User = response.user;
      
      setUser(userData);
      localStorage.setItem("hackselect_user", JSON.stringify(userData));
      localStorage.setItem("token", response.token);
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hackselect_user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
