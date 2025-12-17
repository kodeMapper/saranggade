"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './About.module.css';

const About = ({ data }) => {
  return (
    <section id="about" className={styles.about}>
        <div className={styles.sectionTitle}>
             A B O U T
        </div>

        <div className={styles.contentWrapper}>
            {/* Left Column: Image */}
            <motion.div 
                className={styles.imageColumn}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className={styles.imageWrapper}>
                    <img 
                        src={data.personalInfo.image} 
                        alt={data.personalInfo.name} 
                        className={styles.profileImage} 
                    />
                </div>
            </motion.div>

            {/* Right Column: Info */}
            <motion.div 
                className={styles.infoColumn}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className={styles.whoamiHeader}>
                    <span style={{ color: '#22c55e', marginRight: '10px' }}>$:</span> /whoami
                </div>

                <div className={styles.badge}>
                    <div className={styles.pulsingDot}></div>
                    <span>open to opportunities</span>
                </div>

                <div className={styles.bioText}>
                    <p className={styles.greeting}>
                        Welcome to my digital abode!
                    </p>
                    <p>
                        I am a <span className={styles.highlight}>{data.personalInfo.role}</span> based in {data.personalInfo.location}, currently building scalable systems and AI-powered solutions.
                    </p>
                    <p>
                        Previously, I've worked on <span className={styles.highlight}>ReactJS Landing Pages</span> and <span className={styles.highlight}>Admin Panels</span> at AARA Green Infosolutions. 
                        I specialize in creating end-to-end full-stack applications that solve real user problems.
                    </p>
                    <p>
                        I am also the **Software Lead** at Embedded Club, RCOEM, fostering a community of developers and innovators.
                    </p>
                    <p>
                        When I'm not coding, I'm exploring new tech stacks (`{Object.values(data.skills).flat().slice(0, 3).join(', ')}`) or grinding on <a href={data.personalInfo.leetcode || '#'} className={styles.link} target="_blank">LeetCode</a>!
                    </p>
                </div>
            </motion.div>
        </div>
    </section>
  );
};

export default About;
