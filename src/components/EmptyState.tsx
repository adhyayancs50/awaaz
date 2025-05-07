
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
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && (
        <div className="text-5xl mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      
      {actionLabel && actionRoute && (
        <Button onClick={() => navigate(actionRoute)}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
