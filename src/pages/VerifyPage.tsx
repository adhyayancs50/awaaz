
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const VerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("Invalid verification token");
        setLoading(false);
        return;
      }
      
      try {
        // 1. Check if token exists and is valid
        const { data: verificationData, error: fetchError } = await supabase
          .from("email_verifications")
          .select("*")
          .eq("token", token)
          .gt("expires_at", new Date().toISOString())
          .is("verified_at", null)
          .single();
        
        if (fetchError || !verificationData) {
          setError("Invalid or expired verification token");
          setLoading(false);
          return;
        }
        
        // 2. Mark the verification as verified
        const { error: updateError } = await supabase
          .from("email_verifications")
          .update({ verified_at: new Date().toISOString() })
          .eq("id", verificationData.id);
          
        if (updateError) {
          setError("Failed to verify email");
          setLoading(false);
          return;
        }
        
        // 3. Create user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .insert([
            { 
              email: verificationData.email,
              display_name: verificationData.display_name
            }
          ])
          .select()
          .single();
        
        if (profileError) {
          setError("Failed to create user account");
          setLoading(false);
          return;
        }
        
        setVerified(true);
        toast({
          title: "Email verified successfully!",
          description: "Your account has been created. You can now sign in.",
        });
        
      } catch (err) {
        console.error("Verification error:", err);
        setError("An unexpected error occurred during verification");
      } finally {
        setLoading(false);
      }
    };
    
    verifyEmail();
  }, [token, toast]);
  
  const handleContinue = () => {
    navigate("/", { state: { openAuthForm: true } });
  };
  
  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-lg">Verifying your email...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto mt-20">
      {verified ? (
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Email Verified Successfully!</AlertTitle>
          <AlertDescription className="text-green-700">
            <p className="mb-4">Your email has been verified and your account has been created.</p>
            <Button onClick={handleContinue} className="w-full bg-primary">
              Continue to Login
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-red-50 border-red-200">
          <AlertTitle className="text-red-800">Verification Failed</AlertTitle>
          <AlertDescription className="text-red-700">
            <p className="mb-4">{error || "Unable to verify your email."}</p>
            <Button onClick={() => navigate("/")} className="w-full bg-primary">
              Return to Homepage
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default VerifyPage;
