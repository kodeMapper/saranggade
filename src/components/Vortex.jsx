"use client";

import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";

export const Vortex = (props) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameId = useRef();
  const particlePropsRef = useRef(null);
  const tickRef = useRef(0);
  const centerRef = useRef([0, 0]);
  const noise3DRef = useRef(null);
  
  const [isDark, setIsDark] = useState(true);

  // Configuration
  const particleCount = props.particleCount || 500;
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const rangeY = props.rangeY || 150;
  const baseTTL = 50;
  const rangeTTL = 150;
  const baseSpeed = props.baseSpeed || 0.1;
  const rangeSpeed = props.rangeSpeed || 0.8;
  const baseRadius = props.baseRadius || 1;
  const rangeRadius = props.rangeRadius || 1.5;
  const baseHue = 220;
  const rangeHue = 60;
  const noiseSteps = 3;
  const xOff = 0.00125;
  const yOff = 0.00125;
  const zOff = 0.0005;

  const TAU = 2 * Math.PI;
  const rand = (n) => n * Math.random();
  const randRange = (n) => n - rand(2 * n);
  const fadeInOut = (t, m) => {
    let hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };
  const lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2;

  // Detect theme changes
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

  const initParticle = (i, canvas) => {
    if (!canvas || !particlePropsRef.current) return;

    const x = rand(canvas.width);
    const y = centerRef.current[1] + randRange(rangeY);
    const vx = 0;
    const vy = 0;
    const life = 0;
    const ttl = baseTTL + rand(rangeTTL);
    const speed = baseSpeed + rand(rangeSpeed);
    const radius = baseRadius + rand(rangeRadius);
    const hue = baseHue + rand(rangeHue);

    particlePropsRef.current.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
  };

  const initParticles = (canvas) => {
    tickRef.current = 0;
    particlePropsRef.current = new Float32Array(particlePropsLength);
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i, canvas);
    }
  };

  const drawParticle = (x, y, x2, y2, life, ttl, radius, hue, ctx) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = radius;
    
    const lightness = isDark ? "60%" : "50%";
    const saturation = isDark ? "100%" : "80%";
    const alpha = fadeInOut(life, ttl) * (isDark ? 1 : 0.8);
    
    ctx.strokeStyle = `hsla(${hue},${saturation},${lightness},${alpha})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  const updateParticle = (i, ctx, canvas) => {
    if (!canvas || !particlePropsRef.current || !noise3DRef.current) return;

    const props = particlePropsRef.current;
    let x = props[i];
    let y = props[i + 1];
    const n = noise3DRef.current(x * xOff, y * yOff, tickRef.current * zOff) * noiseSteps * TAU;
    const vx = lerp(props[i + 2], Math.cos(n), 0.5);
    const vy = lerp(props[i + 3], Math.sin(n), 0.5);
    const life = props[i + 4];
    const ttl = props[i + 5];
    const speed = props[i + 6];
    const x2 = x + vx * speed;
    const y2 = y + vy * speed;
    const radius = props[i + 7];
    const hue = props[i + 8];

    drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);

    props[i] = x2;
    props[i + 1] = y2;
    props[i + 2] = vx;
    props[i + 3] = vy;
    props[i + 4] = life + 1;

    const outOfBounds = x2 > canvas.width || x2 < 0 || y2 > canvas.height || y2 < 0;
    if (outOfBounds || life + 1 > ttl) {
      initParticle(i, canvas);
    }
  };

  const renderGlow = (canvas, ctx) => {
    ctx.save();
    ctx.filter = isDark ? "blur(8px) brightness(200%)" : "blur(6px) brightness(150%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.filter = isDark ? "blur(4px) brightness(200%)" : "blur(3px) brightness(120%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const draw = (canvas, ctx) => {
    tickRef.current++;

    // Clear with transparent background (let CSS handle the bg color)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i, ctx, canvas);
    }

    renderGlow(canvas, ctx);

    // Render to screen
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    animationFrameId.current = window.requestAnimationFrame(() => draw(canvas, ctx));
  };

  const resize = (canvas) => {
    const container = containerRef.current;
    if (!container) return;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    centerRef.current[0] = 0.5 * canvas.width;
    centerRef.current[1] = 0.5 * canvas.height;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    noise3DRef.current = createNoise3D();
    
    resize(canvas);
    initParticles(canvas);
    draw(canvas, ctx);

    const handleResize = () => {
      resize(canvas);
    };

    window.addEventListener("resize", handleResize);
    
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isDark]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </motion.div>
  );
};

export default Vortex;
