"use client";

import type { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong";
}

export default function GlassCard({
  variant = "default",
  className = "",
  children,
  ...rest
}: GlassCardProps) {
  const glassClass = variant === "strong" ? "glass-strong" : "glass";
  return (
    <div
      className={`rounded-2xl ${glassClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
