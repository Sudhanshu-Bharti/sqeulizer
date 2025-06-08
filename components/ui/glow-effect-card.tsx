"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlowEffectCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hoverScale?: number;
}

export function GlowEffectCard({
  children,
  className,
  glowColor = "rgba(16, 185, 129, 0.15)", // emerald-500 with 0.15 opacity
  hoverScale = 1.02,
}: GlowEffectCardProps) {
  return (
    <motion.div
      className={cn(
        "group relative rounded-2xl bg-slate-900/80 border border-slate-700 backdrop-blur-xl",
        className
      )}
      whileHover={{ scale: hoverScale }}
      transition={{ duration: 0.2 }}
    >
      {/* Glow Gradient */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-slate-700 to-slate-800 opacity-0 group-hover:opacity-100 blur-0 transition-opacity" />

      {/* Inner Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-emerald-500/10" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"
        style={{
          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),
                           linear-gradient(to bottom, #fff 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Content */}
      <div className="relative">{children}</div>

      {/* Hover Glow Effect */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity"
        style={{
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor} 0%, transparent 60%)`,
        }}
      />
    </motion.div>
  );
}
