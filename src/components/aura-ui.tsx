"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const AuraButton = ({
  children,
  className,
  type = "button",
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative group px-8 py-3.5 rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100",
        className,
      )}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        e.currentTarget.style.setProperty("--x", `${x}%`);
        e.currentTarget.style.setProperty("--y", `${y}%`);
      }}
      style={
        {
          background:
            "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
          backdropFilter: "blur(20px)",
        } as any
      }
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at var(--x) var(--y), rgba(16, 185, 129, 0.3) 0%, transparent 60%)",
        }}
      ></div>
      <span className="relative z-10 font-bold text-black dark:text-white flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export const AuraCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col z-10 bg-white/70 dark:bg-[#0a0a0a]/60 backdrop-blur-3xl border-black/5 dark:border-white/10 relative shadow-xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-xl",
        className,
      )}
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-black/10 dark:border-white/30 z-20"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-black/10 dark:border-white/30 z-20"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-black/10 dark:border-white/30 z-20"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-black/10 dark:border-white/30 z-20"></div>

      {children}
    </div>
  );
};
