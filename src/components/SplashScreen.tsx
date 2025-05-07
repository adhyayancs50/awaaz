
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onFinished: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  const [showLogo, setShowLogo] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(true);
      
      setTimeout(() => {
        onFinished();
      }, 2000);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [onFinished]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-light tribal-pattern">
      <div className="flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={showLogo ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-6"
        >
          <div className="w-40 h-40 flex items-center justify-center">
            <img 
              src="/lovable-uploads/72311bbf-01ec-4d7d-85b1-df143c27ae7f.png" 
              alt="AWAaz Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={showLogo ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl font-bold font-poppins mb-2 text-primary"
        >
          AWAaz
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={showLogo ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg font-nunito text-secondary italic"
        >
          From Forgotten To Forever
        </motion.p>
      </div>
    </div>
  );
};

export default SplashScreen;
