"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './Projects.module.css';

const Projects = ({ data }) => {
  return (
    <section id="projects" className={styles.projects}>
      <motion.h2 
        className={styles.title}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Latest Work
      </motion.h2>

      <div className={styles.grid}>
        {data.projects.map((project, index) => (
          <motion.div 
            key={index}
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className={styles.content}>
              <h3 className={styles.projectName}>{project.name}</h3>
              <span className={styles.tech}>{project.tech}</span>
              <ul className={styles.description}>
                {project.points.slice(0, 3).map((point, i) => (
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

export default Projects;
