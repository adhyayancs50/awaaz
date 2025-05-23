
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";

// Define types for our context
type AuthUser = {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  isLoggedIn: boolean;
};

type AuthContextType = {
  user: AuthUser;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<void>;
};

// Create a default user
const defaultUser: AuthUser = {
  id: "",
  email: "",
  name: "",
  isLoggedIn: false,
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  session: null,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateDisplayName: async () => {},
  updatePassword: async () => {},
  deleteAccount: async () => {},
  verifyEmail: async () => false,
  resendVerificationEmail: async () => {},
});

// Utility function to clean up auth state
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

// Create the provider component
export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(defaultUser);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        // Update user state when session changes
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || "",
            photoURL: session.user.user_metadata?.avatar_url || "",
            isLoggedIn: true,
          });
        } else {
          setUser(defaultUser);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || "",
          photoURL: session.user.user_metadata?.avatar_url || "",
          isLoggedIn: true,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Clean up existing auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data && data.user) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.user.user_metadata?.name || data.user.email}!`,
        });
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Could not log in",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Clean up existing auth state first
      cleanupAuthState();
      
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          // Use the full domain for email verification
          emailRedirectTo: `https://myawaaz.com/verify`,
        },
      });
      
      if (error) throw error;
      
      if (data && data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            display_name: name,
          });
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
        
        toast({
          title: "Account created",
          description: "Please check your email to verify your account.",
        });
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Could not create account",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      setUser(defaultUser);
      setSession(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "Could not log out",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update display name
  const updateDisplayName = async (name: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name }
      });
      
      if (error) throw error;
      
      setUser((prev) => ({ ...prev, name }));
      
      toast({
        title: "Profile updated",
        description: "Your display name has been updated.",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Could not update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update password
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      
      if (signInError) {
        throw new Error("Current password is incorrect");
      }
      
      // If sign-in successful, update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Could not update password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete account
  const deleteAccount = async () => {
    setIsLoading(true);
    try {
      // First delete from the profiles table
      if (user.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', user.id);
          
        if (profileError) {
          console.error("Error deleting profile:", profileError);
        }
      }
      
      // Then delete the auth user
      const { error } = await supabase.auth.admin.deleteUser(
        user.id
      );
      
      if (error) throw error;
      
      // Clean up auth state
      cleanupAuthState();
      
      // Sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      setUser(defaultUser);
      setSession(null);
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message || "Could not delete account",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Email verification
  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      // Attempt to verify the email using the token
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });
      
      if (error) {
        console.error("Email verification error:", error);
        throw error;
      }
      
      // If successful, return true
      return true;
    } catch (error: any) {
      console.error("Error verifying email:", error);
      // Return false if verification failed
      return false;
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `https://myawaaz.com/verify`,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification email sent",
        description: "A new verification email has been sent to your inbox from 'meri awaaz'.",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to send verification email",
        description: error.message || "Could not send verification email",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        login,
        register,
        logout,
        updateDisplayName,
        updatePassword,
        deleteAccount,
        verifyEmail,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create the hook for using auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
