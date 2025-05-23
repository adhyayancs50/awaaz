import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateVerificationToken, getVerificationExpiry, sendVerificationEmail } from "@/utils/emailUtils";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  updateDisplayName: (displayName: string) => void;
  deleteAccount: () => Promise<void>;
  isLoading: boolean;
  startEmailVerification: (options: { email: string; displayName: string }) => Promise<boolean>;
  checkEmailExists: (email: string) => Promise<boolean>;
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
  isLoading: true,
  startEmailVerification: async () => false,
  checkEmailExists: async () => false
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

  const startEmailVerification = async ({ email, displayName }: { email: string; displayName: string }) => {
    try {
      // Check if email exists in profiles table
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email)
        .single();
      
      if (existingProfile) {
        toast({
          title: "Email already registered",
          description: "This email is already associated with an account",
          variant: "destructive",
        });
        return false;
      }
      
      // Generate verification token
      const token = generateVerificationToken();
      const expiryDate = getVerificationExpiry();
      
      // Delete any existing verification requests for this email
      await supabase
        .from("email_verifications")
        .delete()
        .eq("email", email);
        
      // Store verification request
      const { error: insertError } = await supabase
        .from("email_verifications")
        .insert([
          {
            email,
            token,
            display_name: displayName,
            expires_at: expiryDate.toISOString()
          }
        ]);
        
      if (insertError) {
        console.error("Error creating verification:", insertError);
        toast({
          title: "Verification Error",
          description: "Could not start verification process",
          variant: "destructive",
        });
        return false;
      }
      
      // Send verification email
      const baseUrl = window.location.origin;
      const emailSent = await sendVerificationEmail({ 
        to: email, 
        name: displayName, 
        token, 
        baseUrl 
      });
      
      if (!emailSent) {
        toast({
          title: "Email Sending Failed",
          description: "Could not send verification email. Please try again.",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Verification Email Sent",
        description: "Please check your email to verify your account",
      });
      
      return true;
      
    } catch (error) {
      console.error("Verification process failed:", error);
      toast({
        title: "Verification Error",
        description: "Could not start verification process",
        variant: "destructive",
      });
      return false;
    }
  };

  const checkEmailExists = async (email: string) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email);
        
      return data && data.length > 0;
    } catch (error) {
      console.error("Check email failed:", error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if email exists in profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (profileError || !profile) {
        throw new Error("Email not registered or not verified");
      }
      
      // Get users from localStorage for demo auth
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
        id: profile.id,
        name: profile.display_name,
        email: profile.email,
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
        description: error instanceof Error ? error.message : "Invalid email or password",
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
      // In our new flow, users should only be able to register after email verification
      // Check if the email exists in profiles
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();
        
      if (!existingProfile) {
        throw new Error("Email not verified. Please verify your email first.");
      }
      
      // Get existing users or initialize empty array
      const existingUsers = JSON.parse(localStorage.getItem("awaaz_users") || "[]");
      
      // Check if email already exists in localStorage
      if (existingUsers.some((user: any) => user.email === email)) {
        throw new Error("Email already in use");
      }
      
      // Create new user
      const newUser = {
        id: existingProfile.id,
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
        id: existingProfile.id,
        name: displayName,
        email: email,
        isLoggedIn: true
      };
      
      setUser(loggedInUser);
      localStorage.setItem("awaaz_user", JSON.stringify(loggedInUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome to Awaaz, ${displayName}!`,
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
    
    // Update in profiles table
    supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", user.id)
      .then(({ error }) => {
        if (error) {
          console.error("Failed to update profile:", error);
        }
      });
    
    toast({
      title: "Profile updated",
      description: "Your display name has been updated successfully",
    });
  };

  const deleteAccount = async () => {
    if (!user) return;
    
    try {
      // Remove from profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);
        
      if (profileError) {
        throw profileError;
      }
      
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
      isLoading,
      startEmailVerification,
      checkEmailExists
    }}>
      {children}
    </AuthContext.Provider>
  );
};
