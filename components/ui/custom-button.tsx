"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GlowEffect } from "../motion-primitives/glow-effect";
import { HTMLMotionProps } from "framer-motion";

interface CustomButtonProps extends HTMLMotionProps<"button"> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
  glowColor?: string;
}

export function CustomButton({
  className,
  variant = "default",
  size = "default",
  children,
  glowColor,
  ...props
}: CustomButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-sky-600 text-white hover:bg-sky-600/90",
    outline:
      "border border-slate-800 bg-slate-900/50 text-slate-200 hover:bg-slate-800/50",
    ghost: "text-slate-200 hover:bg-slate-800/50",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-12 rounded-lg px-8",
  };

  return (
    <GlowEffect glowColor={glowColor}>
      <motion.button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {variant === "default" && (
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 via-sky-500/10 to-blue-500/10" />
            <div className="absolute inset-0 bg-[length:10px_10px] bg-grid-white/[0.02] blur-[1px]" />
          </div>
        )}
      </motion.button>
    </GlowEffect>
  );
}
