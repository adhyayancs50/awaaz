
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionRoute?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  actionLabel, 
  actionRoute,
  icon
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
      {icon && (
        <div className="text-5xl mb-6 text-primary">
          {icon}
        </div>
      )}
      
      <h2 className="text-2xl font-bitter mb-3">{title}</h2>
      <p className="text-muted-foreground max-w-sm mb-8 font-nunito">{description}</p>
      
      {actionLabel && actionRoute && (
        <Button 
          onClick={() => navigate(actionRoute)}
          className="px-8 py-6 h-auto text-base font-medium"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
