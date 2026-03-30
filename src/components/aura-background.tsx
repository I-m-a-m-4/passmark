"use client";

import React from "react";

export const AuraBackground = () => {
  return (
    <>
      <div 
        className="fixed inset-0 z-[-1] pointer-events-none bg-[#030303]" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px)', 
          backgroundSize: '48px 48px' 
        }} 
      />
      <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl border-x border-white/10 pointer-events-none z-0 flex justify-evenly">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-px h-full bg-white/[0.03] relative overflow-hidden">
            <div className="beam-line" style={{ animationDuration: `${3 + i * 1.5}s`, animationDelay: `${i * 0.7}s` }}></div>
            <div className="beam-line" style={{ animationDuration: `${3 + i * 1.5}s`, animationDelay: `${i * 0.7}s` }}></div>
          </div>
        ))}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#030303]" style={{ border: '1px solid rgba(255,255,255,0.2)' }}></div>
        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#030303]" style={{ border: '1px solid rgba(255,255,255,0.2)' }}></div>
        <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-[#030303]" style={{ border: '1px solid rgba(255,255,255,0.2)' }}></div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-[#030303]" style={{ border: '1px solid rgba(255,255,255,0.2)' }}></div>
      </div>
    </>
  );
};
