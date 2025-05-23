import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/contexts/TranslationContext";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock, User } from "lucide-react";
import { useLocation } from "react-router-dom";

const AuthForm: React.FC = () => {
  const location = useLocation();
  const { login, register, isLoading, startEmailVerification, checkEmailExists } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState<string>("login");
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  
  const [verificationStep, setVerificationStep] = useState<boolean>(false);
  
  // Handle routing state for after verification
  useEffect(() => {
    const state = location.state as { 
      openAuthForm?: boolean, 
      verifiedEmail?: boolean,
      resendVerification?: boolean 
    } | undefined;
    
    if (state?.verifiedEmail) {
      setActiveTab("register");
      setVerificationStep(true);
      // We would set the email here if we passed it in the state
    }
    
    if (state?.resendVerification) {
      setActiveTab("register");
      // We would display a resend form here
    }
  }, [location.state]);
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(loginForm.email, loginForm.password);
    } catch (error) {
      // Error is handled in the auth context
    }
  };
  
  const handleInitiateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerForm.displayName.trim()) {
      toast({
        title: t("error"),
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }
    
    if (!registerForm.email.trim()) {
      toast({
        title: t("error"),
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }
    
    const emailExists = await checkEmailExists(registerForm.email);
    if (emailExists) {
      toast({
        title: t("error"),
        description: "This email is already registered",
        variant: "destructive",
      });
      return;
    }
    
    // Send verification email
    const success = await startEmailVerification({ 
      email: registerForm.email,
      displayName: registerForm.displayName
    });
    
    if (success) {
      setVerificationStep(true);
    }
  };
  
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password.length < 6) {
      toast({
        title: t("error"),
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: t("error"),
        description: t("passwordsDoNotMatch"),
        variant: "destructive",
      });
      return;
    }
    
    try {
      await register(registerForm.email, registerForm.password, registerForm.displayName);
      // Reset form and verification step
      setVerificationStep(false);
      setRegisterForm({
        email: "",
        password: "",
        confirmPassword: "",
        displayName: "",
      });
    } catch (error) {
      // Error is handled in the auth context
    }
  };
  
  const handleResendVerification = async () => {
    if (!registerForm.email || !registerForm.displayName) {
      toast({
        title: "Missing Information",
        description: "Please provide your email and name to resend the verification",
        variant: "destructive",
      });
      return;
    }
    
    const success = await startEmailVerification({ 
      email: registerForm.email,
      displayName: registerForm.displayName
    });
    
    if (success) {
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox for the verification link",
      });
    }
  };
  
  const renderVerificationStep = () => (
    <CardContent className="space-y-4 pt-6">
      <div className="text-center mb-6">
        <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Verification Email Sent</h3>
        <p className="text-sm text-gray-600">
          Please check your inbox at <span className="font-semibold">{registerForm.email}</span> and click the verification link.
        </p>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          After verifying your email, return here to set your password and complete your registration.
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            name="password"
            type="password"
            value={registerForm.password}
            onChange={handleRegisterChange}
            required
            minLength={6}
            placeholder="••••••••"
            className="border-input focus-ring bg-background"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="register-confirmPassword">{t("confirmPassword")}</Label>
          <Input
            id="register-confirmPassword"
            name="confirmPassword"
            type="password"
            value={registerForm.confirmPassword}
            onChange={handleRegisterChange}
            required
            minLength={6}
            placeholder="••••••••"
            className="border-input focus-ring bg-background"
          />
        </div>
      </div>
      
      <Button 
        type="button" 
        onClick={handleSetPassword}
        className="w-full bg-primary hover:bg-primary-600 active:bg-primary-700" 
        disabled={isLoading || !registerForm.password || !registerForm.confirmPassword}
      >
        {isLoading ? "Setting up account..." : "Complete Registration"}
      </Button>
      
      <div className="text-center mt-4 space-y-2">
        <p className="text-sm text-gray-600">Didn't receive the verification email?</p>
        <button 
          type="button" 
          onClick={handleResendVerification} 
          className="text-sm text-primary hover:text-primary-700 font-medium"
        >
          Resend verification email
        </button>
        <div className="pt-2">
          <button 
            type="button" 
            onClick={() => setVerificationStep(false)} 
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Use different email
          </button>
        </div>
      </div>
    </CardContent>
  );
  
  const renderInitialRegistrationStep = () => (
    <>
      <CardHeader>
        <CardTitle>{t("createAccount")}</CardTitle>
        <CardDescription>{t("joinAWAaz")}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="register-displayName" className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {t("whatToCallYou")}
          </Label>
          <Input
            id="register-displayName"
            name="displayName"
            type="text"
            value={registerForm.displayName}
            onChange={handleRegisterChange}
            required
            placeholder={t("yourName")}
            className="border-input focus-ring bg-background"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="register-email" className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            {t("email")}
          </Label>
          <Input
            id="register-email"
            name="email"
            type="email"
            value={registerForm.email}
            onChange={handleRegisterChange}
            required
            placeholder="you@example.com"
            className="border-input focus-ring bg-background"
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-600 active:bg-primary-700" 
          disabled={isLoading || !registerForm.email || !registerForm.displayName}
        >
          {isLoading ? "Sending verification..." : "Send Verification Email"}
        </Button>
      </CardFooter>
    </>
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto shadow-card">
        <Tabs defaultValue="login" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <LogIn className="mr-2 h-4 w-4" />
              {t("login")}
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <UserPlus className="mr-2 h-4 w-4" />
              {t("register")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle>{t("welcomeBack")}</CardTitle>
                <CardDescription>{t("loginToContinue")}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {t("email")}
                  </Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    required
                    placeholder="you@example.com"
                    className="border-input focus-ring bg-background"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    {t("password")}
                  </Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    required
                    placeholder="••••••••"
                    className="border-input focus-ring bg-background"
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-600 active:bg-primary-700" 
                  disabled={isLoading}
                >
                  {isLoading ? t("loggingIn") : t("login")}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleInitiateRegistration}>
              {verificationStep ? renderVerificationStep() : renderInitialRegistrationStep()}
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default AuthForm;
