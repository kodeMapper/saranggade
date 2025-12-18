"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './About.module.css';

const About = ({ data }) => {
  return (
    <section id="about" className={styles.about}>
        {/* <div className={styles.sectionTitle}>
             A B O U T
        </div> */}

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
                        Previously, I've worked on ReactJS Landing Pages and Admin Panels at <span className={styles.highlight}>AARA Green Infosolutions. </span> 
                        I specialize in creating end-to-end full-stack applications that solve real user problems.
                    </p>
                    <p>
                        I am also the <span className={styles.highlight}>Software Lead</span> at Embedded Club, RCOEM, fostering a community of developers and innovators.
                    </p>
                    <p>
                        Software engineer by profession, problem-solver by passion — <span className={styles.highlight}>powered by code and coffee.</span>
                    </p>
                </div>
            </motion.div>
        </div>
    </section>
  );
};

export default About;
