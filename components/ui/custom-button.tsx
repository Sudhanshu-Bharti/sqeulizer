import React from "react";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean;
  isPulsing?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  gradientBg?: boolean;
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant = "default", size = "default", isLoading = false, isPulsing = false, 
    loadingText, icon, gradientBg = false, children, ...props }, ref) => {
    
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "rounded-xl transition-all duration-300 hover:scale-105",
          isPulsing && !isLoading && !props.disabled && "pulse-button",
          gradientBg && variant === "default" && "orange-gradient",
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            {loadingText || "Loading..."}
          </>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton"; 