"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Hero.module.css';
import LightRays from './LightRays';

const INTRO_LINES = [
    "Full-Stack Developer & Creative Technologist",
    "Building Scalable Web Apps with Next.js & Node.js",
    "Engineering AI-Powered Solutions & Real-Time Systems",
    "Crafting Immersive Digital Experiences that Perform"
];

const Hero = ({ data }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % INTRO_LINES.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

  return (
    <section className={styles.hero}>
        <div className={styles.backgroundLayer}>
            <img src="/images/hero-new-final.png" alt="Sarang Gade" className={styles.heroImage} />
            <div className={styles.overlayGradient}></div>
            
            <LightRays 
                raysColor="#8b5cf6" 
                raysSpeed={0.5} 
                rayLength={1.5} 
                lightSpread={0.8}
                mouseInfluence={0.2}
                className={styles.raysWrapper}
            />
            
            {/* SVG Filter for Melting Liquid Effect */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
              <defs>
                <filter id="liquid-melt" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.02 0.5" numOctaves="3" result="noise">
                    <animate attributeName="baseFrequency" values="0.02 0.5; 0.03 0.6; 0.01 0.4; 0.02 0.5" dur="10s" repeatCount="indefinite" />
                  </feTurbulence>
                  <feGenericMatrix in="noise" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="colMat"/>
                  <feDisplacementMap in="SourceGraphic" in2="colMat" scale="20" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
            </svg>
        </div>

        {/* Marathi Logo Top Right */}
        <div className={styles.marathiLogo}>सारंग</div>

        <div className={styles.container}>
            {/* Text backdrop - provides light grey bg for intro lines only */}
            <div className={styles.textBackdrop}>
                <div className={styles.introWrapper}>
                    <AnimatePresence mode="wait">
                        <motion.p 
                            key={index}
                            className={styles.introLine}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                        >
                            {INTRO_LINES[index]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
            
            {/* Name without backdrop */}
            <h1 className={styles.bigName}>
                <motion.span 
                    className={styles.namePart}
                    data-text="Sarang"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    Sarang
                </motion.span>
                <motion.span 
                    className={styles.namePart}
                    data-text="Gade"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                    Gade
                </motion.span>
            </h1>
        </div>
        
        <motion.div 
            className={styles.scrollIndicator}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
        >
            <span>Scroll</span>
            <div className={styles.line}></div>
        </motion.div>
    </section>
  );
};

export default Hero;
