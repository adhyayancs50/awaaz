
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/contexts/TranslationContext";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";

const VerifyPage: React.FC = () => {
  const { verifyEmail, resendVerificationEmail } = useAuth();
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const errorCode = queryParams.get("error_code");
    const errorDescription = queryParams.get("error_description");
    
    // Extract email from URL if available (for resending verification)
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
    
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false);
        setError("Missing verification token");
        return;
      }
      
      try {
        const result = await verifyEmail(token);
        setIsVerifying(false);
        
        if (result) {
          setIsSuccess(true);
          toast({
            title: "Email verified",
            description: "Your email has been successfully verified. You will be redirected shortly.",
          });
          
          // Auto-redirect to home after successful verification
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          setError("Verification failed. The link may be invalid or expired.");
        }
      } catch (err: any) {
        setIsVerifying(false);
        setError(err.message || "Verification failed");
      }
    };
    
    if (token) {
      verifyToken();
    } else {
      setIsVerifying(false);
      setError("Missing verification token");
    }
  }, [location, verifyEmail, navigate, toast]);
  
  const handleResendVerification = async () => {
    if (!email) {
      setError("Email address is required to resend verification");
      return;
    }
    
    try {
      await resendVerificationEmail(email);
      toast({
        title: "Verification email sent",
        description: "A new verification email has been sent to your inbox from 'meri awaaz'.",
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
          <h2 className="text-2xl font-semibold mb-2">Email Verified!</h2>
          <p className="mb-6 text-muted-foreground">
            Your email has been successfully verified. You will be redirected to the home page shortly.
          </p>
          <Button onClick={() => navigate("/")}>
            Go to Home Page
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
        <h2 className="text-2xl font-semibold mb-2 text-center">Verification Failed</h2>
        
        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <p className="mb-6 text-center text-muted-foreground">
          We couldn't verify your email address. The link may have expired or is invalid.
        </p>
        
        <div className="space-y-4">
          {email ? (
            <Button 
              onClick={handleResendVerification} 
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Resend Verification Email
            </Button>
          ) : (
            <div className="text-center space-y-4">
              <p>Please try signing in again to receive a new verification email.</p>
              <Button 
                onClick={() => navigate("/")} 
                className="bg-green-600 hover:bg-green-700"
              >
                Go to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VerifyPage;
