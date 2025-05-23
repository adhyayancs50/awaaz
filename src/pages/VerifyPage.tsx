
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/contexts/TranslationContext";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Lock } from "lucide-react";

const VerifyPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get("token");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError(t("missingToken"));
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: t("error"),
        description: t("passwordTooShort"),
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: t("error"),
        description: t("passwordsDoNotMatch"),
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifying(true);
    setError("");
    
    try {
      const functionsEndpoint = `${supabase.supabaseUrl}/functions/v1/verify-email`;
      const response = await fetch(functionsEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }
      
      setIsVerified(true);
      
      // Log in the user after verification
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: data.user.email,
        password,
      });
      
      if (loginError) {
        console.error("Auto-login failed:", loginError);
        toast({
          title: t("accountCreated"),
          description: t("pleaseLoginWithYourNewAccount"),
        });
        
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate("/settings");
        }, 2000);
      } else {
        toast({
          title: t("success"),
          description: t("accountCreatedAndLoggedIn"),
        });
        
        // Redirect to home after successful login
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError(error instanceof Error ? error.message : String(error));
      toast({
        title: t("verificationFailed"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError(t("missingToken"));
    }
  }, [token, t]);

  return (
    <div className="container max-w-md mx-auto py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">
              {isVerified ? t("emailVerified") : t("verifyYourEmail")}
            </CardTitle>
            <CardDescription className="text-center">
              {isVerified
                ? t("yourAccountHasBeenCreated")
                : t("completeYourRegistration")}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error ? (
              <div className="flex flex-col items-center p-4 bg-destructive/10 rounded-md text-destructive">
                <XCircle className="h-12 w-12 mb-2" />
                <p className="text-center">{error}</p>
              </div>
            ) : isVerified ? (
              <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md text-primary">
                <CheckCircle className="h-12 w-12 mb-2" />
                <p className="text-center">{t("redirecting")}</p>
              </div>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    {t("createPassword")}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                    placeholder="••••••••"
                    className="border-input focus-visible:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    {t("confirmPassword")}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={6}
                    required
                    placeholder="••••••••"
                    className="border-input focus-visible:ring-primary"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isVerifying}
                >
                  {isVerifying ? t("verifying") : t("completeVerification")}
                </Button>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")} 
              className="text-muted-foreground"
            >
              {t("backToHome")}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyPage;
