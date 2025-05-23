
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Define the interface for user profile data
interface UserProfile {
  id?: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  [key: string]: any; // Allow for additional properties
}

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  isLoading: boolean;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<void>;
};

const defaultUser: User = {
  id: "",
  email: "",
  name: "",
  isLoggedIn: false,
  isVerified: false,
  photoURL: "",
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  resetPassword: async () => {},
  updateDisplayName: async () => {},
  updatePassword: async () => {},
  deleteAccount: async () => {},
  isLoading: false,
  verifyEmail: async () => false,
  resendVerificationEmail: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Utility function to clean up Supabase auth state
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          return;
        }
        
        if (data.session) {
          const userDetails = data.session.user;
          await refreshUserData(userDetails);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await refreshUserData(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(defaultUser);
        } else if (event === 'USER_UPDATED' && session) {
          await refreshUserData(session.user);
        }
      }
    );
    
    // Clean up the subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const refreshUserData = async (userDetails: any) => {
    try {
      if (!userDetails) return;
      
      // Fetch user metadata from Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userDetails.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is 'not found' - this is a new user without a profile yet
        console.error("Error fetching user profile:", error);
        return;
      }
      
      // Create a default empty object if data is null
      const userProfile: UserProfile = data || {};
      
      // Create user object
      setUser({
        id: userDetails.id,
        email: userDetails.email || '',
        name: userProfile.display_name || userDetails.user_metadata?.name || 'User',
        isLoggedIn: true,
        isVerified: userDetails.email_confirmed_at !== null,
        photoURL: userProfile.avatar_url || '',
      });
      
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };
  
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
        if (!data.user.email_confirmed_at) {
          toast({
            title: "Email not verified",
            description: "Please check your inbox and verify your email before logging in.",
          });
        }
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors
      }
      
      // Reset user state
      setUser(defaultUser);
      
      // Force page reload for a clean state
      window.location.href = '/';
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "Could not sign out",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
          // Use the full domain for email verification - update to myawaaz.com
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
  
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for instructions.",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error.message || "Could not send reset email",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateDisplayName = async (name: string) => {
    if (!user.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: name })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUser(prev => ({ ...prev, name }));
      
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
  
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      
      if (signInError) throw new Error("Current password is incorrect");
      
      // If sign in was successful, update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password update failed",
        description: error.message || "Could not update password",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteAccount = async () => {
    if (!user.id) return;
    
    setIsLoading(true);
    try {
      // Delete user data from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // Delete auth user
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;
      
      // Sign out
      await logout();
      
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
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
  
  const verifyEmail = async (token: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Verify the token
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });
      
      if (error) throw error;
      
      if (data && data.user) {
        await refreshUserData(data.user);
        
        toast({
          title: "Email verified",
          description: "Your email has been verified. You can now log in.",
        });
        
        return true;
      }
      
      return false;
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error.message || "Could not verify email",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const resendVerificationEmail = async (email: string) => {
    setIsLoading(true);
    try {
      // Update the redirect URL to use the production domain
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
        description: "Please check your inbox.",
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
        login,
        logout,
        register,
        resetPassword,
        updateDisplayName,
        updatePassword,
        deleteAccount,
        isLoading,
        verifyEmail,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
