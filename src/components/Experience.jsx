"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './Experience.module.css';

const Experience = ({ data }) => {
  return (
    <section id="experience" className={styles.experience}>
      <motion.h2 
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Experience
      </motion.h2>

      <div className={styles.timeline}>
        {data.experience.map((exp, index) => (
          <motion.div 
            key={index} 
            className={styles.item}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className={styles.dot} />
            <div className={styles.card}>
              <h3 className={styles.role}>{exp.title}</h3>
              <div className={styles.company}>{exp.company} | {exp.location}</div>
              <span className={styles.date}>{exp.duration}</span>
              <ul className={styles.list}>
                {exp.highlights.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
