
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/contexts/TranslationContext";
import { useToast } from "@/hooks/use-toast";

const VerifyPage: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  useEffect(() => {
    const handleVerification = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");
      const type = queryParams.get("type");
      const errorCode = queryParams.get("error_code");
      const errorDescription = queryParams.get("error_description");
      const userEmail = queryParams.get("email");
      
      if (userEmail) {
        setEmail(userEmail);
      }
      
      // If there are error parameters in the URL, handle them
      if (errorCode || errorDescription) {
        setIsVerifying(false);
        setError(errorDescription || "Verification failed. The link may be invalid or expired.");
        return;
      }
      
      // Check current session first
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at) {
        setIsVerifying(false);
        setIsSuccess(true);
        toast({
          title: "Email verified successfully",
          description: "Your email has been verified. You can now use the site.",
        });
        return;
      }
      
      // Set up auth state listener to detect verification success
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Auth state change:", event, session?.user?.email_confirmed_at);
          
          if (event === 'SIGNED_IN' && session?.user) {
            // Check if email is confirmed
            if (session.user.email_confirmed_at) {
              setIsVerifying(false);
              setIsSuccess(true);
              toast({
                title: "Email verified successfully",
                description: "Your email has been verified. You can now use the site.",
              });
            }
          } else if (event === 'TOKEN_REFRESHED' && session?.user?.email_confirmed_at) {
            setIsVerifying(false);
            setIsSuccess(true);
            toast({
              title: "Email verified successfully",
              description: "Your email has been verified. You can now use the site.",
            });
          }
        }
      );
      
      // If we have a token, try to verify it
      if (token) {
        try {
          console.log("Attempting to verify email with token");
          
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: (type as any) || 'signup',
          });
          
          if (error) {
            console.error("Email verification error:", error);
            setIsVerifying(false);
            setError(error.message || "Email verification failed. The link may be invalid or expired.");
            subscription.unsubscribe();
            return;
          }
          
          if (data?.user?.email_confirmed_at) {
            setIsVerifying(false);
            setIsSuccess(true);
            toast({
              title: "Email verified successfully",
              description: "Your email has been verified. You can now use the site.",
            });
            subscription.unsubscribe();
          }
          
        } catch (err: any) {
          console.error("Verification error:", err);
          setIsVerifying(false);
          setError(err.message || "Email verification failed. Please try again.");
          subscription.unsubscribe();
        }
      } else {
        // No token, but still wait a bit to see if auth state changes
        setTimeout(() => {
          setIsVerifying(false);
          setError("Missing verification token. Please check your email for the verification link.");
          subscription.unsubscribe();
        }, 3000);
      }
      
      // Cleanup subscription after 10 seconds to avoid hanging
      setTimeout(() => {
        if (isVerifying) {
          setIsVerifying(false);
          setError("Verification timed out. Please try again.");
        }
        subscription.unsubscribe();
      }, 10000);
    };
    
    handleVerification();
  }, [location, toast, isVerifying]);
  
  const handleResendVerification = async () => {
    if (!email) {
      setError("Email address is required to resend verification");
      return;
    }
    
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
        description: "A new verification email has been sent to your inbox.",
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email");
    }
  };
  
  if (isVerifying) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Verifying your email...</h2>
        <p className="text-muted-foreground">Please wait while we verify your account.</p>
      </div>
    );
  }
  
  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[70vh] flex flex-col items-center justify-center p-4"
      >
        <div className="max-w-md w-full bg-card rounded-xl shadow-sm p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">✅ Verification Successful!</h2>
          <p className="mb-6 text-muted-foreground">
            Your email has been successfully verified. You can now use all features of the site.
          </p>
          <Button 
            onClick={() => navigate("/")} 
            className="bg-green-600 hover:bg-green-700 w-full"
          >
            Continue to App
          </Button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[70vh] flex flex-col items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-card rounded-xl shadow-sm p-8">
        <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-center">❌ Verification Failed</h2>
        
        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <p className="mb-6 text-center text-muted-foreground">
          Email verification failed. The link may be invalid or expired.
        </p>
        
        <div className="space-y-4">
          {email ? (
            <Button 
              onClick={handleResendVerification} 
              className="w-full flex items-center justify-center gap-2"
              variant="outline"
            >
              <RefreshCcw className="h-4 w-4" />
              Resend Verification Email
            </Button>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm">Please try signing up again to receive a new verification email.</p>
            </div>
          )}
          
          <Button 
            onClick={() => navigate("/")} 
            className="bg-green-600 hover:bg-green-700 w-full"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default VerifyPage;
