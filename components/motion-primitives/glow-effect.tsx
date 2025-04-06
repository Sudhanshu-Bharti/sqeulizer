"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface GlowEffectProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowEffect({
  children,
  className = "",
  glowColor = "rgba(56, 189, 248, 0.3)", // sky-400 with 0.3 opacity
}: GlowEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateGlowPosition = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    container.addEventListener("mousemove", updateGlowPosition);
    return () => container.removeEventListener("mousemove", updateGlowPosition);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0 rounded-inherit"
        animate={{
          background: isHovered
            ? `radial-gradient(circle at ${position.x}px ${position.y}px, ${glowColor} 0%, transparent 70%)`
            : "none",
        }}
        transition={{ duration: 0.3 }}
      />
      {children}
    </motion.div>
  );
}
