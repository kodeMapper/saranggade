"use client";
import React, { useState, useEffect } from 'react';
import { resumeData } from '../../../data/resume';
import { notFound } from 'next/navigation';
import styles from './project.module.css';
import Link from 'next/link';
import { ChevronLeft, ArrowUpRight, Github, ExternalLink, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../../../components/ThemeToggle';

// This is a dynamic route: /project/[id]

export default function ProjectDetail({ params }) {
    // Unwrap params using React.use() for Next.js 15+ support
    const unwrappedParams = React.use(params);
    const id = parseInt(unwrappedParams.id);

    if (isNaN(id) || id < 0 || id >= resumeData.projects.length) {
        return notFound();
    }

    const project = resumeData.projects[id];
    const { caseStudy } = project;

    // If no case study data, fallback or show basics? 
    // We added mock data for all, so it should be fine.

    // Gallery State
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const gallery = caseStudy?.gallery || [project.image]; // Fallback to main image

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    };

    // Auto-slide
    useEffect(() => {
        const timer = setInterval(nextImage, 4000); // 4 seconds
        return () => clearInterval(timer);
    }, [gallery.length]);

    return (
        <div className={styles.container}>
            {/* Navbar / Top Bar */}
            <nav className={styles.navBar}>
                <Link href="/" className={styles.backLink}>
                    <ChevronLeft size={16} /> Back to home
                </Link>
                <div className={styles.navLinks}>
                    <a href={project.github} target="_blank" className={styles.navItem}>Github</a>
                    <a href={project.demo} target="_blank" className={styles.navItem}>Live</a>
                    <ThemeToggle />
                </div>
            </nav>

            {/* Hero Grid */}
            <div className={styles.gridContainer}>
                {/* Main Hero Card */}
                <div className={`${styles.card} ${styles.heroCard}`}>
                    <span className={styles.label}>CASE STUDY</span>
                    <h1 className={styles.title}>{project.name}</h1>
                    <p className={styles.summary}>
                        {caseStudy?.summary || project.points.join(' ')}
                    </p>

                    <div className={styles.highlightsGrid}>
                        {caseStudy?.features?.slice(0, 3).map((feature, i) => (
                            <div key={i} className={styles.highlightItem}>
                                <span className={styles.highlightNumber}>Feature {i + 1}</span>
                                <p className={styles.highlightText}>{feature}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className={styles.sidebar}>
                    <div className={styles.actionsCard}>
                        <span className={styles.actionTitle}>PROJECT LINKS</span>

                        <div className={styles.statsGrid}>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>KEY FEATURES</span>
                                <span className={styles.statValue}>{caseStudy?.features?.length || 0}</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>TECH USED</span>
                                <span className={styles.statValue}>{project.tech.split(',').length}</span>
                            </div>
                        </div>

                        <div className={styles.techList}>
                            {project.tech.split(',').slice(0, 5).map((t, i) => {
                                const raw = t.trim();
                                const map = {
                                    "Node.js": "nodedotjs",
                                    "React": "react",
                                    "Flask": "flask",
                                    "Python": "python",
                                    "MongoDB": "mongodb",
                                    "Express": "express",
                                    "Next.js": "nextdotjs",
                                    "Socket.io": "socketdotio",
                                    "ESP32": "espressif",
                                    "Arduino": "arduino",
                                    "Google Maps": "googlemaps",
                                    "IoT": "internetofthings", // fallback/best guess
                                    "HTML5": "html5",
                                    "CSS3": "css3",
                                    "JavaScript": "javascript",
                                    "Framer Motion": "framer"
                                };
                                const slug = map[raw] || raw.toLowerCase().replace(/[\s\.]/g, '');

                                return (
                                    <div key={i} className={styles.techIcon} title={raw}>
                                        <img
                                            src={`https://cdn.simpleicons.org/${slug}`}
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                            alt={raw}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Gallery Section */}
            <div className={styles.gallerySection}>
                <div className={styles.galleryTrack}>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentImageIndex}
                            className={styles.galleryImageContainer}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Check if gradient or image url */}
                            {gallery[currentImageIndex].startsWith('linear') ? (
                                <div style={{ width: '100%', height: '100%', background: gallery[currentImageIndex] }} />
                            ) : (
                                <img src={gallery[currentImageIndex]} className={styles.galleryImage} alt="UI Screenshot" />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className={styles.galleryControls}>
                    <button onClick={prevImage} className={styles.galleryBtn}>
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextImage} className={styles.galleryBtn}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>


            {/* Deep Dive Content Row */}
            <div className={styles.contentRow}>

                {/* Left: Key Features List */}
                <div className={styles.contentCard}>
                    <span className={styles.label}>PRODUCT STORY</span>
                    <h2 className={styles.sectionHeading}>Key features shipped</h2>

                    <div className={styles.featureList}>
                        {caseStudy?.features?.map((feature, i) => (
                            <div key={i} className={styles.featureItem}>
                                <span className={styles.featureIndex}>{String(i + 1).padStart(2, '0')}</span>
                                <span className={styles.featureText}>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Stack Reasoning */}
                <div className={styles.contentCard}>
                    <span className={styles.label}>STACK REASONING</span>
                    <h2 className={styles.sectionHeading}>Why these tools</h2>
                    <p style={{ color: '#737373', marginBottom: '2rem', fontSize: '0.9rem' }}>
                        Pulled straight from the engineering decisions.
                    </p>

                    <div className={styles.stackGrid}>
                        {caseStudy?.stackReasoning?.map((item, i) => (
                            <div key={i} className={styles.stackItem}>
                                <div className={styles.stackHeader}>
                                    <span className={styles.stackName}>{item.tool}</span>
                                </div>
                                <p className={styles.stackReason}>
                                    {item.reason}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
