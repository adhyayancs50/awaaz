
import { useState, useEffect } from "react";
import RecordPage from "./RecordPage";
import SplashScreen from "@/components/SplashScreen";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return showSplash ? <SplashScreen onFinished={() => setShowSplash(false)} /> : <RecordPage />;
};

export default Index;
