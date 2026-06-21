import React from 'react';
import styles from './VideoBackground.module.css';

const VideoBackground = ({ className = '' }) => {
  return (
    <div className={`${styles.container} ${className}`}>
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.video}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
      />

      {/* Noise overlay */}
      <div className={styles.noiseOverlay} />

      {/* Gradient overlay */}
      <div className={styles.gradientOverlay} />
    </div>
  );
};

export { VideoBackground };
