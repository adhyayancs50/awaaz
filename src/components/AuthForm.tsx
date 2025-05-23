
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
import { LogIn, UserPlus, Mail, Lock, User } from "lucide-react";

const AuthForm: React.FC = () => {
  const { login, isLoading, startEmailVerification } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  
  const [registerForm, setRegisterForm] = useState({
    email: "",
    displayName: "",
  });
  
  const [verificationSent, setVerificationSent] = useState(false);
  
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
  
  const handleStartRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerForm.email.trim()) {
      toast({
        title: t("error"),
        description: t("emailRequired"),
        variant: "destructive",
      });
      return;
    }
    
    if (!registerForm.displayName.trim()) {
      toast({
        title: t("error"),
        description: t("nameRequired"),
        variant: "destructive",
      });
      return;
    }
    
    try {
      const success = await startEmailVerification(
        registerForm.email,
        registerForm.displayName
      );
      
      if (success) {
        setVerificationSent(true);
      }
    } catch (error) {
      // Error is handled in the auth context
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto shadow-card">
        <Tabs defaultValue="login" className="w-full">
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
            {verificationSent ? (
              <div className="p-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">{t("checkYourEmail")}</h3>
                  <p className="text-muted-foreground">
                    {t("verificationEmailSent", { email: registerForm.email })}
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setVerificationSent(false)}
                  >
                    {t("useAnotherEmail")}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleStartRegistration}>
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
                    disabled={isLoading}
                  >
                    {isLoading ? t("sending") : t("getVerificationEmail")}
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
