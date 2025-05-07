
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-light tribal-pattern">
      <NavBar />
      
      {user?.isLoggedIn && (
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <Tabs 
            defaultValue={location.pathname} 
            className="w-full max-w-md"
            onValueChange={(value) => navigate(value)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="/">Record</TabsTrigger>
              <TabsTrigger value="/archive">Archive</TabsTrigger>
              <TabsTrigger value="/settings">Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>AWAaz - Preserving Cultural Heritage</p>
      </footer>
    </div>
  );
};

export default Layout;
