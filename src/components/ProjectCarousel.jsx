"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './ProjectCarousel.module.css';
import { Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const ProjectCarousel = ({ data }) => {
  const carouselRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  return (
    <section id="projects" className={styles.carouselContainer}>
      <motion.h2 
        className={styles.title}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        LATEST WORK
      </motion.h2>

      <motion.div className={styles.wrapper} whileTap={{ cursor: "grabbing" }}>
        <motion.div 
          ref={carouselRef} 
          className={styles.carouselTrack}
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
        >
          {data.projects.map((project, index) => (
            <motion.div 
              key={index} 
              className={styles.card}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Link href={`/project/${index}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div 
                    className={styles.cardHeader} 
                    style={{ background: !project.image ? 'linear-gradient(45deg, #1e293b, #0f172a)' : 'transparent' }}
                  >
                     {project.image && !project.image.startsWith('linear') ? (
                        <img src={project.image} alt={project.name} className={styles.projectImage} />
                     ) : (
                        <div style={{ position: 'absolute', inset: 0, background: project.image }}></div>
                     )}
                    <h3 className={styles.cardTitle}>{project.name}</h3>
                  </div>
              </Link>
              
              <div className={styles.cardBody}>
                <div className={styles.techStack}>
                  {project.tech.split(', ').slice(0,4).map((t, i) => (
                    <span key={i} className={styles.tag}>{t}</span>
                  ))}
                  {project.tech.split(', ').length > 4 && <span className={styles.tag}>+more</span>}
                </div>
                
                <p className={styles.desc}>
                  {project.points[0]}
                </p>

                <div className={styles.links}>
                  <a href={project.demo} target="_blank" className={`${styles.linkBtn} ${styles.demoBtn}`}>
                      View Live
                  </a>
                  <a href={project.github} target="_blank" className={`${styles.linkBtn} ${styles.githubBtn}`}>
                    Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProjectCarousel;
