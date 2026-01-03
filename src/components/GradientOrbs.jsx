"use client";
import React, { useEffect, useRef, useState } from "react";

// Floating gradient orbs animation - visible in both dark and light modes
export const GradientOrbs = () => {
  const [isDark, setIsDark] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDark(theme !== 'light');
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Main gradient orbs - more visible colors */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: isDark 
            ? 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%)',
          filter: isDark ? 'blur(50px)' : 'blur(60px)',
          animation: 'float1 20s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: isDark 
            ? 'radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
          filter: isDark ? 'blur(50px)' : 'blur(60px)',
          animation: 'float2 25s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '25%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: isDark 
            ? 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)',
          filter: isDark ? 'blur(50px)' : 'blur(60px)',
          animation: 'float3 18s ease-in-out infinite',
        }}
      />
      {/* Extra orb for more coverage */}
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '60%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: isDark 
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
          filter: isDark ? 'blur(50px)' : 'blur(60px)',
          animation: 'float4 22s ease-in-out infinite',
        }}
      />
      
      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(60px, -40px) scale(1.1); }
          50% { transform: translate(30px, 50px) scale(0.95); }
          75% { transform: translate(-40px, 25px) scale(1.05); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 40px) scale(1.1); }
          66% { transform: translate(40px, -50px) scale(0.9); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -60px) scale(1.15); }
        }
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-60px, -30px) scale(1.08); }
          80% { transform: translate(30px, 40px) scale(0.92); }
        }
      `}</style>
    </div>
  );
};

export default GradientOrbs;
