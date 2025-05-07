
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const defaultUser: User = {
  id: "",
  name: "",
  email: "",
  isLoggedIn: false
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  login: async () => {},
  logout: () => {},
  isLoading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real implementation, we would check localStorage or a token
        const storedUser = localStorage.getItem("awaaz_user");
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async () => {
    setIsLoading(true);
    try {
      // Mock Google auth - in real app, we would use Firebase Auth
      // This would be replaced with actual Google OAuth
      const mockUser: User = {
        id: "user123",
        name: "Demo User",
        email: "demo@example.com",
        photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
        isLoggedIn: true
      };
      
      setUser(mockUser);
      localStorage.setItem("awaaz_user", JSON.stringify(mockUser));
      toast({
        title: "Logged in successfully",
        description: `Welcome ${mockUser.name}!`,
      });
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("awaaz_user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
