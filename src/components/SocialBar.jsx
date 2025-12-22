"use client";
import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import styles from './SocialBar.module.css';

const SocialBar = () => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const container = document.querySelector('.snap-container');
    const handleScroll = () => {
        const scrollTop = container ? container.scrollTop : window.scrollY;
        if (scrollTop > window.innerHeight - 100) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    };
    
    if (container) {
        container.addEventListener('scroll', handleScroll);
    } else {
        window.addEventListener('scroll', handleScroll);
    }
    
    return () => {
        if (container) container.removeEventListener('scroll', handleScroll);
        else window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.socialBar}>
      <a href="https://github.com/kodeMapper" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
        <Github size={20} />
      </a>
      <a href="https://www.linkedin.com/in/sarang-gade" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
        <Linkedin size={20} />
      </a>
      <a href="https://twitter.com/thesaranggade" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
        <Twitter size={20} />
      </a>
      <a href="mailto:saranganilgade@gmail.com" className={styles.iconLink}>
        <Mail size={20} />
      </a>
    </div>
  );
};

export default SocialBar;
