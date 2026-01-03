"use client";
import React, { useEffect, useState, useRef } from "react";

const getRandomStartPoint = () => {
  const side = Math.floor(Math.random() * 4);
  const offset = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000);

  switch (side) {
    case 0:
      return { x: offset, y: 0, angle: 45 };
    case 1:
      return { x: typeof window !== 'undefined' ? window.innerWidth : 1000, y: offset, angle: 135 };
    case 2:
      return { x: offset, y: typeof window !== 'undefined' ? window.innerHeight : 800, angle: 225 };
    case 3:
      return { x: 0, y: offset, angle: 315 };
    default:
      return { x: 0, y: 0, angle: 45 };
  }
};

export const ShootingStars = ({
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = "#9E00FF",
  trailColor = "#2EB9DF",
  starWidth = 10,
  starHeight = 1,
  className = "",
}) => {
  const [star, setStar] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const svgRef = useRef(null);
  const timeoutRef = useRef(null);

  // Detect theme
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

  useEffect(() => {
    const createStar = () => {
      const { x, y, angle } = getRandomStartPoint();
      const newStar = {
        id: Date.now(),
        x,
        y,
        angle,
        scale: 1,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        distance: 0,
      };
      setStar(newStar);

      const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
      timeoutRef.current = setTimeout(createStar, randomDelay);
    };

    createStar();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [minSpeed, maxSpeed, minDelay, maxDelay]);

  useEffect(() => {
    const moveStar = () => {
      if (star) {
        setStar((prevStar) => {
          if (!prevStar) return null;
          const newX = prevStar.x + prevStar.speed * Math.cos((prevStar.angle * Math.PI) / 180);
          const newY = prevStar.y + prevStar.speed * Math.sin((prevStar.angle * Math.PI) / 180);
          const newDistance = prevStar.distance + prevStar.speed;
          const newScale = 1 + newDistance / 100;
          
          const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
          const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
          
          if (newX < -20 || newX > windowWidth + 20 || newY < -20 || newY > windowHeight + 20) {
            return null;
          }
          return {
            ...prevStar,
            x: newX,
            y: newY,
            distance: newDistance,
            scale: newScale,
          };
        });
      }
    };

    const animationFrame = requestAnimationFrame(moveStar);
    return () => cancelAnimationFrame(animationFrame);
  }, [star]);

  // Theme-based colors
  const currentStarColor = isDark ? starColor : "#7c3aed";
  const currentTrailColor = isDark ? trailColor : "#60a5fa";

  return (
    <svg 
      ref={svgRef} 
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {star && (
        <rect
          key={star.id}
          x={star.x}
          y={star.y}
          width={starWidth * star.scale}
          height={starHeight}
          fill="url(#shooting-gradient)"
          transform={`rotate(${star.angle}, ${star.x + (starWidth * star.scale) / 2}, ${star.y + starHeight / 2})`}
        />
      )}
      <defs>
        <linearGradient id="shooting-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: currentTrailColor, stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: currentStarColor, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ShootingStars;
