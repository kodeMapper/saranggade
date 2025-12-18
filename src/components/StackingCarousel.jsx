"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import styles from './StackingCarousel.module.css';
import Link from 'next/link';

const StackingCarousel = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const projects = data.projects;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const getCardStyle = (index) => {
    const total = projects.length;
    let dist = (index - activeIndex + total) % total;
    if (dist > total / 2) dist -= total;
    
    if (dist === 0) {
        return {
            x: 0,
            scale: 1,
            opacity: 1,
            zIndex: 10,
            filter: 'blur(0px)'
        };
    } else if (dist === 1 || dist === -total + 1) { 
        return {
            x: '60%', 
            scale: 0.85,
            opacity: 0.5,
            zIndex: 5,
            filter: 'blur(1px)'
        };
    } else if (dist === -1 || dist === total - 1) { 
        return {
            x: '-60%',
            scale: 0.85,
            opacity: 0.5,
            zIndex: 5,
            filter: 'blur(1px)'
        };
    } else {
        return {
            x: dist > 0 ? '120%' : '-120%',
            scale: 0.6,
            opacity: 0,
            zIndex: 1,
            filter: 'blur(5px)'
        };
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section id="projects" className={styles.carouselSection}>
      <h2 className={styles.title}>PROJECTS</h2>

      <div className={styles.carouselContainer}>
        {projects.map((project, index) => {
            const variantValues = getCardStyle(index);

            return (
                <motion.div
                    key={index}
                    className={styles.card}
                    animate={variantValues}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            handleNext();
                        } else if (swipe > swipeConfidenceThreshold) {
                            handlePrev();
                        }
                    }}
                >
                    {/* Image Area */}
                    <div className={styles.imageArea}>
                       <Link href={`/project/${index}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                           {project.image && !project.image.startsWith('linear') ? (
                              <img src={project.image} alt={project.name} className={styles.projectImage} />
                           ) : (
                              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #1e293b, #0f172a)' }} />
                           )}
                       </Link>
                    </div>

                    {/* Info Area - Quickflow Style: Vertical Stack */}
                    <div className={styles.infoArea}>
                        
                        <div className={styles.headerRow}>
                            <Link href={`/project/${index}`} className={styles.projectTitleLink}>
                                <h3 className={styles.projectTitle}>{project.name}</h3>
                            </Link>
                            <div className={styles.linkGroup}>
                                <a href={project.github} target="_blank" className={styles.textLink}>
                                    Github <ArrowUpRight size={14} />
                                </a>
                                <a href={project.demo} target="_blank" className={styles.textLink}>
                                    Live <ArrowUpRight size={14} />
                                </a>
                            </div>
                        </div>

                        <div className={styles.bodyContent}>
                            <p className={styles.projectDesc}>
                                {project.points[0]} {project.points[1] && project.points[1]}
                            </p>
                        </div>

                        <div className={styles.footerRow}>
                             <span className={styles.label}>tech stack used:</span>
                             <div className={styles.techIcons}>
                                {project.tech.split(',').slice(0, 4).map((t, i) => (
                                    <div key={i} className={styles.techIconWrapper} title={t.trim()}>
                                        {/* Using Simple Icons CDN for logos based on tech name */}
                                        <img 
                                            src={`https://cdn.simpleicons.org/${t.trim().toLowerCase().replace(/[\s\.]/g, '')}`}
                                            className={styles.techIconImg}
                                            onError={(e) => {
                                                e.target.style.display = 'none'; 
                                                // Fallback to text if icon fails
                                                e.target.parentNode.innerText = t.trim().substring(0,2);
                                            }}
                                            alt=""
                                        />
                                    </div>
                                ))}
                             </div>
                        </div>

                    </div>
                </motion.div>
            );
        })}
      </div>

      <div className={styles.controls}>
        <button onClick={handlePrev} className={styles.navBtn}>
            <ChevronLeft size={24} />
        </button>
        <button onClick={handleNext} className={styles.navBtn}>
            <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default StackingCarousel;
