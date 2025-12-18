"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CodolioProfile.module.css';
import { Github, Code2, ExternalLink, Terminal, BrainCircuit } from 'lucide-react';

const CodolioProfile = () => {
    const [activeTab, setActiveTab] = useState('development'); // 'development' or 'problem-solving'

    const platforms = [
        {
            name: "GitHub",
            detail: "Contributions & Repos",
            icon: <Github strokeWidth={1.5} />,
            url: "https://github.com/kodeMapper"
        },
        {
            name: "Codolio",
            detail: "Problem Solving & contest Ratings",
            icon: <Code2 strokeWidth={1.5} />,
            url: "https://codolio.com/profile/kodeMapper/"
        },
    ];

    return (
        <section className={styles.codolio} id="coding-profile">
            <div className={styles.contentGrid}>
                {/* LEFT: Card Toggle & Image */}
                <div className={styles.cardColumn}>
                    {/* Visual Toggle Buttons */}
                    <div className={styles.toggleContainer}>
                        {/* Development Toggle */}
                        <button 
                            className={`${styles.toggleBtn} ${activeTab === 'development' ? styles.active : ''}`}
                            onClick={() => setActiveTab('development')}
                        >
                            <span className={styles.toggleText}>
                                <Terminal size={14} />
                                Development
                            </span>
                        </button>

                        {/* Problem Solving Toggle */}
                        <button 
                            className={`${styles.toggleBtn} ${activeTab === 'problem-solving' ? styles.active : ''}`}
                            onClick={() => setActiveTab('problem-solving')}
                        >
                            <span className={styles.toggleText}>
                                <BrainCircuit size={14} />
                                Problem Solving
                            </span>
                        </button>
                    </div>

                    <div className={styles.flipContainer}>
                        <motion.div 
                            className={styles.flipper}
                            initial={false}
                            animate={{ rotateY: activeTab === 'development' ? 0 : 180 }}
                            transition={{ duration: 1.5, type: "spring", stiffness: 100, damping: 20 }}
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            {/* Front: Development */}
                            <div className={styles.cardFront} style={{ backfaceVisibility: 'hidden', position: 'absolute', width: '100%', height: '100%' }}>
                                <img 
                                    src='/images/codolio-dev.png'
                                    alt="Development Stats"
                                    className={styles.cardImage}
                                />
                            </div>

                            {/* Back: Problem Solving */}
                            <div className={styles.cardBack} style={{ backfaceVisibility: 'hidden', position: 'absolute', width: '100%', height: '100%', transform: 'rotateY(180deg)' }}>
                                <img 
                                    src='/images/codolio-problem.png'
                                    alt="Problem Solving Stats"
                                    className={styles.cardImage}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* RIGHT: Platforms Info */}
                <motion.div 
                    className={styles.infoColumn}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                     <motion.h2 
                        className={styles.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        Coding Profile
                    </motion.h2>

                    <p className={styles.subHelp}>
                        Check out my coding journey and statistics across various platforms. 
                        Tracking progress and consistency is key.
                    </p>

                    <div className={styles.platformList}>
                        {platforms.map((platform, idx) => (
                            <motion.a 
                                key={idx}
                                href={platform.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.platformCard}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 + (idx * 0.1) }}
                                viewport={{ once: true }}
                            >
                                <div className={styles.platformIcon}>{platform.icon}</div>
                                <div className={styles.platformInfo}>
                                    <span className={styles.platformName}>{platform.name}</span>
                                    <span className={styles.platformDetail}>{platform.detail}</span>
                                </div>
                                <ExternalLink size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CodolioProfile;
