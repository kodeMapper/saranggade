"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';
import ThemeToggle from './ThemeToggle';

const navItems = ["Home", "About", "Experience", "Projects", "Contact"];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const container = document.querySelector('.snap-container');
    
    const handleScroll = () => {
        // Use container.scrollTop instead of window.scrollY
        if (container && container.scrollTop > window.innerHeight - 100) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    if (container) {
        container.addEventListener('scroll', handleScroll);
    } else {
        // Fallback to window detection if container isn't found (though it should be)
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
      layout
      className={styles.nav}
      data-scrolled={isScrolled}
      initial={{ y: 100, opacity: 0, x: 0 }}
      animate={{ 
          y: 0, 
          opacity: 1, 
      }}
      transition={{ 
          duration: 0.5, 
          ease: "easeInOut",
          layout: { duration: 0.5 }
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
    </motion.nav>
  );
};

export default Navbar;
