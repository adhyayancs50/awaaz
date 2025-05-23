
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionRoute?: string;
  icon?: React.ReactNode;
  onAction?: () => void;  // Added this property
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  actionLabel, 
  actionRoute,
  icon,
  onAction
}) => {
  const navigate = useNavigate();
  
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionRoute) {
      navigate(actionRoute);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
      {icon && (
        <div className="text-5xl mb-6 text-primary">
          {icon}
        </div>
      )}
      
      <h2 className="text-2xl font-bitter mb-3">{title}</h2>
      <p className="text-muted-foreground max-w-sm mb-8 font-nunito">{description}</p>
      
      {actionLabel && (actionRoute || onAction) && (
        <Button 
          onClick={handleAction}
          className="px-8 py-6 h-auto text-base font-medium"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
