"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CodolioProfile.module.css';
import { Github, Terminal, BrainCircuit, Trophy, Flame, BookOpen } from 'lucide-react';
import codolioData from '../data/codolio.json';
import { VideoBackground } from './ui/VideoBackground';
import FadeOverlay from './FadeOverlay';

const CodolioProfile = () => {
    const [activeTab, setActiveTab] = useState('development');
    const { profile, development, problemSolving } = codolioData;

    // Platform icons without background, using brand colors
    const platformIcons = {
        leetcode: { label: 'LeetCode', icon: 'https://cdn.simpleicons.org/leetcode/FFA116' },
        geeksforgeeks: { label: 'GeeksforGeeks', icon: 'https://cdn.simpleicons.org/geeksforgeeks/2F8D46' },
        codeforces: { label: 'Codeforces', icon: 'https://cdn.simpleicons.org/codeforces/1F8ACB' },
        codechef: { label: 'CodeChef', icon: 'https://cdn.simpleicons.org/codechef/5B4638' },
        hackerrank: { label: 'HackerRank', icon: 'https://cdn.simpleicons.org/hackerrank/00EA64' },
    };

    const variants = {
        enter: (direction) => {
            return {
                y: 20,
                opacity: 0,
            };
        },
        center: {
            zIndex: 1,
            y: 0,
            opacity: 1,
        },
        exit: (direction) => {
            return {
                zIndex: 0,
                y: -20,
                opacity: 0,
            };
        }
    };

    return (
        <section className={styles.codolio} id="coding-profile">
            <FadeOverlay></FadeOverlay>
            <VideoBackground />
            <motion.h2 
                className={styles.title}
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                Coding Profile
            </motion.h2>

            <motion.div 
                className={styles.widgetContainer}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                {/* LEFT PANE: Profile & Controls */}
                <div className={styles.profileSidebar}>
                    <div className={styles.avatarRing}>
                        <img 
                            src="/images/profile.jpg" 
                            alt={profile.name}
                            className={styles.avatarImg}
                        />
                    </div>
                    <div className={styles.nameSection}>
                        <h3 className={styles.cardName}>{profile.name}</h3>
                        <span className={styles.cardHandle}>@{profile.username}</span>
                    </div>

                    <div className={styles.tabSwitcher}>
                        <button 
                            className={`${styles.tabBtn} ${activeTab === 'development' ? styles.active : ''}`}
                            onClick={() => setActiveTab('development')}
                        >
                            <Terminal size={18} />
                            Development
                        </button>
                        <button 
                            className={`${styles.tabBtn} ${activeTab === 'problem-solving' ? styles.active : ''}`}
                            onClick={() => setActiveTab('problem-solving')}
                        >
                            <BrainCircuit size={18} />
                            Problem Solving
                        </button>
                    </div>
                </div>

                {/* RIGHT PANE: Dynamic Stats */}
                <div className={styles.statsContent}>
                    <AnimatePresence mode="wait">
                        {activeTab === 'development' ? (
                            <motion.div 
                                key="dev"
                                className={styles.tabPanel}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <h4 className={styles.panelTitle}>
                                    <Terminal size={24} color="var(--primary)" />
                                    Development Activity
                                </h4>
                                
                                <div className={styles.statsGrid}>
                                    <div className={styles.statBox}>
                                        <span className={styles.statLabel}>
                                            <Flame size={16} />
                                            Active Days
                                        </span>
                                        <span className={styles.statValue}>
                                            {development.activeDays}
                                        </span>
                                    </div>
                                    <div className={styles.statBox}>
                                        <span className={styles.statLabel}>
                                            <BookOpen size={16} />
                                            Contributions
                                        </span>
                                        <span className={styles.statValue}>
                                            {development.contributions}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.findMeSection}>
                                    <span className={styles.findMeLabel}>You can find me on...</span>
                                    <div>
                                        <a 
                                            href={`https://github.com/${development.githubUsername}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.githubLink}
                                        >
                                            <Github size={20} />
                                            {development.githubUsername}
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="ps"
                                className={styles.tabPanel}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <h4 className={styles.panelTitle}>
                                    <BrainCircuit size={24} color="var(--accent)" />
                                    Problem Solving
                                </h4>
                                
                                <div className={styles.statsGrid}>
                                    <div className={styles.statBox}>
                                        <span className={styles.statLabel}>
                                            <Trophy size={16} />
                                            Questions Solved
                                        </span>
                                        <span className={styles.statValue}>
                                            {problemSolving.questionsSolved}
                                        </span>
                                    </div>
                                    <div className={styles.statBox}>
                                        <span className={styles.statLabel}>
                                            <Flame size={16} />
                                            Active Days
                                        </span>
                                        <span className={styles.statValue}>
                                            {problemSolving.activeDays}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.findMeSection}>
                                    <span className={styles.findMeLabel}>Profiles across platforms</span>
                                    <div className={styles.platformIconRow}>
                                        {problemSolving.platforms.map((p, i) => (
                                            platformIcons[p.name]?.icon && (
                                                <a 
                                                    key={i}
                                                    href={`https://${p.name}.com/${p.handle || ''}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.platformLogo}
                                                    title={`${platformIcons[p.name].label}: ${p.questions} questions`}
                                                >
                                                    <img 
                                                        src={platformIcons[p.name].icon} 
                                                        alt={p.name} 
                                                        width="32" 
                                                        height="32" 
                                                    />
                                                </a>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </section>
    );
};

export default CodolioProfile;
