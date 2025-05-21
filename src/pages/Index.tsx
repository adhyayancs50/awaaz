
import { useState, useEffect } from "react";
import RecordPage from "./RecordPage";
import SplashScreen from "@/components/SplashScreen";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }
  
  return user?.isLoggedIn ? <RecordPage /> : <AuthForm />;
};

export default Index;
