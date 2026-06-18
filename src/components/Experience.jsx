"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Experience.module.css';

const ExperienceCard = ({ exp, index, total }) => {
  const isEven = index % 2 === 0;

  return (
    <div className={`${styles.cardWrapper} ${isEven ? styles.rowNormal : styles.rowReverse}`}>
      
      {/* Image / Background Card */}
      <motion.div 
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className={styles.imageColumn}
      >
        <div className={`${styles.imageBox} ${exp.whiteBg ? styles.bgWhite : styles.bgDark}`}>
          {exp.image && (
            <img src={exp.image} alt={exp.company} className={styles.companyImage} />
          )}
          <div className={styles.imageOverlay}>
             <h4 className={styles.overlayText}>{exp.company}</h4>
          </div>
        </div>
      </motion.div>
      
      {/* Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className={styles.infoColumn}
      >
        <div className={styles.infoBox}>
          <p className={styles.duration}>{exp.duration}</p>
          <h3 className={styles.jobTitle}>{exp.title}</h3>
          <p className={styles.location}>{exp.location}</p>
          
          <ul className={styles.highlights}>
            {exp.highlights.map((point, i) => (
              <li key={i} className={styles.highlightItem}>
                <span className={styles.bullet}>✦</span>
                <span dangerouslySetInnerHTML={{ __html: point }} />
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
      
    </div>
  );
};

const Experience = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const visibilityMap = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        let anyVisible = false;
        
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          visibilityMap.set(index, entry.isIntersecting);
          
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        });
        
        // Check if ANY of the experience sections are currently visible
        for (let isVisible of visibilityMap.values()) {
           if (isVisible) anyVisible = true;
        }
        
        setIsInView(anyVisible);
      },
      {
        threshold: 0.4, // Trigger when 40% of the section is visible
      }
    );

    const sections = document.querySelectorAll('.experience-snap-section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <AnimatePresence>
        {isInView && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={styles.timelineSidebar}
          >
            <div className={styles.timelineTrack}>
              <motion.div 
                className={styles.timelineProgress}
                animate={{ height: `${(activeIndex / (data.experience.length - 1)) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              {data.experience.map((_, idx) => (
                <div 
                  key={idx}
                  className={`${styles.timelineNode} ${activeIndex >= idx ? styles.timelineNodeActive : ''}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {data.experience.map((exp, index) => (
        <section 
          key={index} 
          id={index === 0 ? "experience" : `experience-${index}`} 
          data-index={index}
          className="snap-section experience-snap-section"
          style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100vh', backgroundColor: 'var(--background)', overflow: 'hidden' }}
        >
          {index === 0 && (
            <motion.h2 
              className={styles.sectionTitle}
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              EXPERIENCE
            </motion.h2>
          )}

          <ExperienceCard exp={exp} index={index} total={data.experience.length} />
        </section>
      ))}
    </>
  );
};

export default Experience;
