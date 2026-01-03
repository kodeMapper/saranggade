"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';
import ThemeToggle from './ThemeToggle';

const navItems = ["Home", "About", "Experience", "Projects", "Contact"];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = document.querySelector('.snap-container');
    
    const handleScroll = () => {
      if (container) {
        if (container.scrollTop > window.innerHeight - 100) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
        
        const totalScroll = container.scrollHeight - container.clientHeight;
        if (totalScroll > 0) {
          setScrollProgress((container.scrollTop / totalScroll) * 100);
        }
      } else {
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

  const handleNavClick = (item) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(item.toLowerCase());
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Mobile: Minimal floating button + dropdown menu
  if (isMobile) {
    return (
      <>
        {/* Minimal Menu Button - Glassmorphism style */}
        <motion.button
          className={styles.mobileMenuBtn}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={{ rotate: isMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.div>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className={styles.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Menu Panel */}
              <motion.div
                className={styles.mobileMenu}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {navItems.map((item, index) => (
                  <motion.button
                    key={item}
                    className={styles.mobileLink}
                    onClick={() => handleNavClick(item)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    {item}
                  </motion.button>
                ))}
                <div className={styles.mobileThemeRow}>
                  <span className={styles.themeLabel}>Theme</span>
                  <ThemeToggle />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop: Original navbar
  return (
    <motion.nav 
      className={styles.nav}
      data-scrolled={isScrolled}
      initial={{ opacity: 0, y: 100 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transform: isScrolled ? 'translateX(-50%)' : 'translateX(0%)',
        left: isScrolled ? '50%' : '2rem',
        top: isScrolled ? '1rem' : 'calc(100vh - 6rem)',
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
