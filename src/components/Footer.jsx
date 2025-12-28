"use client";
import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Pages',
      links: [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Experience', href: '#experience' },
        { name: 'Projects', href: '#projects' },
      ],
    },
    {
      title: 'Socials',
      links: [
        { name: "GitHub", href: "https://github.com/kodeMapper" }, 
        { name: "LinkedIn", href: "https://www.linkedin.com/in/sarang-gade/" },
        { name: "Twitter", href: "https://twitter.com/thesaranggade" }, 
        { name: "Instagram", href: "https://instagram.com/iamsaranggade" },
      ],
    },
    {
        title: 'Contact',
        links: [
          { name: 'Email Me', href: 'mailto:saranganilgade@gmail.com' },
          { name: 'Collaboration', href: '#comments' },
        ],
      },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms', href: '#' },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.logo}>सारंग</div>
            <p className={styles.copyright}>
              &copy; {currentYear} Sarang Gade.<br />
              All rights reserved.
            </p>
          </div>

          {/* Links Section */}
          <div className={styles.linksWrapper}>
            {footerSections.map((section) => (
              <div key={section.title} className={styles.column}>
                <h3>{section.title}</h3>
                <ul className={styles.linkList}>
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href}
                        target={link.href.startsWith('http') || link.href.startsWith('mailto') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Big Background Decoration */}
        <div className={styles.backgroundDecoration}>
            <div className={styles.bigLogo}>सारंग </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
