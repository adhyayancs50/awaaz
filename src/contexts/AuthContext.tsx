
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { supabase, cleanupAuthState, safeSignOut, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  updateDisplayName: (displayName: string) => void;
  deleteAccount: () => Promise<void>;
  isLoading: boolean;
  startEmailVerification: (email: string, displayName: string) => Promise<boolean>;
  session: any;
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
  session: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Initialize auth state and set up listener
  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          const userData: User = {
            id: currentSession.user.id,
            name: currentSession.user.user_metadata?.display_name || 'User',
            email: currentSession.user.email || '',
            isLoggedIn: true,
            photoURL: currentSession.user.user_metadata?.avatar_url,
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        
        if (event === 'SIGNED_OUT') {
          cleanupAuthState();
        }
      }
    );
    
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        setSession(existingSession);
        
        if (existingSession?.user) {
          const userData: User = {
            id: existingSession.user.id,
            name: existingSession.user.user_metadata?.display_name || 'User',
            email: existingSession.user.email || '',
            isLoggedIn: true,
            photoURL: existingSession.user.user_metadata?.avatar_url,
          };
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Clean up any existing auth state
      cleanupAuthState();
      
      // First sign out globally to ensure clean state
      await safeSignOut();
      
      // Now try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${data.user.user_metadata?.display_name || data.user.email}!`,
        });
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
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
      // Regular signup is replaced with email verification flow
      // This is kept for compatibility but should not be used directly
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration started",
        description: "Please check your email to verify your account.",
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

  const startEmailVerification = async (email: string, displayName: string) => {
    setIsLoading(true);
    try {
      // Call our edge function to start email verification
      const functionsEndpoint = `${SUPABASE_URL}/functions/v1/send-verification-email`;
      const response = await fetch(functionsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({ 
          email, 
          display_name: displayName 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification email");
      }
      
      toast({
        title: "Verification email sent",
        description: `Please check ${email} for a verification link.`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Email verification request failed:", error);
      toast({
        title: "Verification failed",
        description: error.message || "Failed to send verification email",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await safeSignOut();
      
      // Set user to null
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const updateDisplayName = async (displayName: string) => {
    if (!user) return;
    
    try {
      // Update display_name in user metadata
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });
      
      if (error) throw error;
      
      // Update local user state
      setUser(prev => prev ? { ...prev, name: displayName } : null);
      
      toast({
        title: "Profile updated",
        description: "Your display name has been updated successfully",
      });
    } catch (error) {
      console.error("Profile update failed:", error);
      toast({
        title: "Update failed",
        description: "Failed to update your profile",
        variant: "destructive",
      });
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    
    try {
      // Delete user account
      const { error } = await supabase.rpc('delete_user');
      
      if (error) throw error;
      
      // Sign out and clean up
      await safeSignOut();
      setUser(null);
      
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
      session
    }}>
      {children}
    </AuthContext.Provider>
  );
};
