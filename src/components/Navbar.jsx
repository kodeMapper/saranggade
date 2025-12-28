"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';
import ThemeToggle from './ThemeToggle';

const navItems = ["Home", "About", "Experience", "Projects", "Contact"];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = document.querySelector('.snap-container');
    
    const handleScroll = () => {
        // Use container.scrollTop instead of window.scrollY
        if (container) {
            if (container.scrollTop > window.innerHeight - 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
            
            // Calculate progress
            const totalScroll = container.scrollHeight - container.clientHeight;
            if (totalScroll > 0) {
                setScrollProgress((container.scrollTop / totalScroll) * 100);
            }
        } else { // Fallback (e.g. if snap-container absent)
           if (window.scrollY > window.innerHeight - 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
             const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
             if (totalScroll > 0) {
                 setScrollProgress((window.scrollY / totalScroll) * 100);
             }
        }
    };

    if (container) {
        container.addEventListener('scroll', handleScroll);
    } else {
        window.addEventListener('scroll', handleScroll);
    }
    
    return () => {
        if (container) {
            container.removeEventListener('scroll', handleScroll);
        } else {
            window.removeEventListener('scroll', handleScroll);
        }
    };
  }, []);

  return (
    <motion.nav 
      className={styles.nav}
      data-scrolled={isScrolled}
      initial={{ opacity: 0, y: 100 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transform: (isScrolled || isMobile) ? 'translateX(-50%)' : 'translateX(0%)',
        left: (isScrolled || isMobile) ? '50%' : '2rem',
        top: isMobile ? 'auto' : (isScrolled ? '1rem' : 'calc(100vh - 6rem)'),
        bottom: isMobile ? '1.5rem' : 'auto' // Ensure bottom is unset on desktop
      }}
      transition={{ 
        duration: 0.8, 
        ease: "easeInOut"
      }}
    >
      {navItems.map((item) => (
        <a key={item} href={`#${item.toLowerCase()}`} className={styles.link}>
          {item}
        </a>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--glass-border)' }}>
        <ThemeToggle />
        
        <AnimatePresence>
            {isScrolled && (
                <motion.a 
                    href="#contact"
                    className={styles.contactBtn}
                    initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                    animate={{ width: "auto", opacity: 1, marginLeft: "0.5rem" }}
                    exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap', display: 'inline-block' }}
                >
                    Get in Touch
                </motion.a>
            )}
        </AnimatePresence>
      </div>
      <motion.div 
        className={styles.progressBar} 
        style={{ scaleX: scrollProgress / 100, originX: 0 }}
        initial={{ scaleX: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, restDelta: 0.001 }}
      />
    </motion.nav>
  );
};

export default Navbar;
