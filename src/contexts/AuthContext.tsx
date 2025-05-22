import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  updateDisplayName: (displayName: string) => void;
  deleteAccount: () => Promise<void>;
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
  register: async () => {},
  logout: () => {},
  updateDisplayName: () => {},
  deleteAccount: async () => {},
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("awaaz_users") || "[]");
      const foundUser = users.find((u: any) => u.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      // Check password
      if (foundUser.password !== password) {
        throw new Error("Invalid credentials");
      }
      
      const loggedInUser: User = {
        id: foundUser.id,
        name: foundUser.displayName,
        email: foundUser.email,
        isLoggedIn: true
      };
      
      setUser(loggedInUser);
      localStorage.setItem("awaaz_user", JSON.stringify(loggedInUser));
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${loggedInUser.name}!`,
      });
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      // Get existing users or initialize empty array
      const existingUsers = JSON.parse(localStorage.getItem("awaaz_users") || "[]");
      
      // Check if email already exists
      if (existingUsers.some((user: any) => user.email === email)) {
        throw new Error("Email already in use");
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password, // In a real app, this would be hashed
        displayName,
        createdAt: new Date().toISOString()
      };
      
      // Add to users array
      existingUsers.push(newUser);
      localStorage.setItem("awaaz_users", JSON.stringify(existingUsers));
      
      // Auto login after registration
      const loggedInUser: User = {
        id: newUser.id,
        name: newUser.displayName,
        email: newUser.email,
        isLoggedIn: true
      };
      
      setUser(loggedInUser);
      localStorage.setItem("awaaz_user", JSON.stringify(loggedInUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome to AWAaz, ${displayName}!`,
      });
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Only remove the current user session, not the user data
    setUser(null);
    localStorage.removeItem("awaaz_user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const updateDisplayName = (displayName: string) => {
    if (!user) return;
    
    // Update current user object
    const updatedUser = { ...user, name: displayName };
    setUser(updatedUser);
    localStorage.setItem("awaaz_user", JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem("awaaz_users") || "[]");
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, displayName } : u
    );
    localStorage.setItem("awaaz_users", JSON.stringify(updatedUsers));
    
    toast({
      title: "Profile updated",
      description: "Your display name has been updated successfully",
    });
  };

  const deleteAccount = async () => {
    if (!user) return;
    
    try {
      // Remove from users array
      const users = JSON.parse(localStorage.getItem("awaaz_users") || "[]");
      const filteredUsers = users.filter((u: any) => u.id !== user.id);
      localStorage.setItem("awaaz_users", JSON.stringify(filteredUsers));
      
      // Remove current user session
      setUser(null);
      localStorage.removeItem("awaaz_user");
      
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted",
      });
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      logout, 
      updateDisplayName,
      deleteAccount,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
