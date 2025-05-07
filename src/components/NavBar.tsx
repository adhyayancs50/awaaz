
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export const NavBar: React.FC = () => {
  const { user, login, logout } = useAuth();
  
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 flex items-center justify-center">
            <img 
              src="/lovable-uploads/72311bbf-01ec-4d7d-85b1-df143c27ae7f.png" 
              alt="AWAaz Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold font-poppins text-primary">AWAaz</span>
        </Link>
        
        <div>
          {user?.isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm hidden md:inline-block">
                {user.name}
              </span>
              
              <div className="relative">
                <Avatar>
                  <AvatarImage src={user.photoURL} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -bottom-8 -right-2 text-xs"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={login} variant="default">
              Sign In with Google
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
