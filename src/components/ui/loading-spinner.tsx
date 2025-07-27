import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <Loader2 
      className={cn("animate-spin", sizeClasses[size], className)} 
    />
  );
}

interface LoadingStateProps {
  children?: React.ReactNode;
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingState({ 
  children, 
  text = "Laden...", 
  size = "md", 
  className 
}: LoadingStateProps) {
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size={size} />
        {children || (
          <p className="text-sm text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  );
}

export function PageLoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingState text="Pagina laden..." size="lg" />
    </div>
  );
}