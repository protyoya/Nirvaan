import React from "react";
import { cn } from "../lib/utils";

interface GradientBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950" {...props}>
      {/* Static Gradient Blobs */}
      <div className="absolute -top-20 sm:-top-40 -left-20 sm:-left-40 h-64 sm:h-96 w-64 sm:w-96 rounded-full bg-purple-500/30 blur-3xl" />
      <div className="absolute top-1/2 -translate-y-1/2 -right-20 sm:-right-40 h-64 sm:h-96 w-64 sm:w-96 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="absolute bottom-20 sm:bottom-40 left-20 sm:left-40 h-64 sm:h-96 w-64 sm:w-96 rounded-full bg-sky-500/30 blur-3xl" />

      {/* Content */}
      <div className={cn(
        "relative z-10 flex min-h-screen flex-col items-center justify-center max-w-7xl mx-auto",
        className
      )}>
        {children}
      </div>
    </div>
  );
}; 