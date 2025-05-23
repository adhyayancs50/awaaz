
import React, { useState } from "react";
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
import { LogIn, UserPlus, Mail, Lock, User, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AuthForm: React.FC = () => {
  const { login, register, isLoading, resendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState<string>("login");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  
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
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      setRegistrationSuccess(true);
      setRegisteredEmail(registerForm.email);
      // Reset the form
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
    try {
      await resendVerificationEmail(registeredEmail);
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      });
    } catch (error) {
      // Error handled in auth context
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto shadow-card">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            {registrationSuccess ? (
              <CardContent className="space-y-4 py-6">
                <Alert className="bg-green-50 border-green-200">
                  <AlertCircle className="h-5 w-5 text-green-500" />
                  <AlertDescription className="text-green-800">
                    Account created successfully! Please check your email to verify your account.
                  </AlertDescription>
                </Alert>
                
                <div className="text-center mt-4">
                  <p className="text-muted-foreground mb-4">
                    Didn't receive the verification email?
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleResendVerification}
                    className="mr-2"
                  >
                    Resend Verification Email
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => setActiveTab("login")}
                  >
                    Return to Login
                  </Button>
                </div>
              </CardContent>
            ) : (
              <form onSubmit={handleRegister}>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5" />
                      {t("password")}
                    </Label>
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
                    <Label htmlFor="register-confirmPassword" className="flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5" />
                      {t("confirmPassword")}
                    </Label>
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
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-600 active:bg-primary-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? t("creating") : t("createAccount")}
                  </Button>
                </CardFooter>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default AuthForm;
