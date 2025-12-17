"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './LiveStatus.module.css';

const LiveStatus = () => {
  return (
    <motion.div 
      className={styles.container}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 2 }}
    >
      <div className={styles.indicator} />
      <div className={styles.content}>
        <span className={styles.text}>Live Code Status</span>
        <span className={styles.sub}>Building Portfolio V1</span>
      </div>
    </motion.div>
  );
};

export default LiveStatus;
