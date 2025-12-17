"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import styles from './Contact.module.css';

const Contact = ({ data }) => {
  const socialLinks = [
    { name: 'GitHub', icon: <Github />, url: data.personalInfo.github },
    { name: 'LinkedIn', icon: <Linkedin />, url: data.personalInfo.linkedin },
    { name: 'Twitter', icon: <Twitter />, url: data.personalInfo.twitter || '#' }, // Placeholder if not in resume
    { name: 'Email', icon: <Mail />, url: `mailto:${data.personalInfo.email}` },
  ];

  return (
    <section id="contact" className={styles.contact}>
      <motion.h2 
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Let's Connect
      </motion.h2>

      <motion.p 
        className={styles.desc}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
      >
        I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
      </motion.p>

      <div className={styles.links}>
        {socialLinks.map((link, index) => (
          <motion.a 
            key={index} 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.iconLink}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className={styles.iconCircle}>
              {link.icon}
            </div>
            <span className={styles.label}>{link.name}</span>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default Contact;
