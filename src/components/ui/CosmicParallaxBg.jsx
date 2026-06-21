import React, { useEffect, useState } from 'react';
import styles from './CosmicParallaxBg.module.css';

/**
 * A cosmic parallax background component with animated stars and text
 */
const CosmicParallaxBg = ({
  head,
  text,
  loop = true,
  className = '',
}) => {
  const [smallStars, setSmallStars] = useState('');
  const [mediumStars, setMediumStars] = useState('');
  const [bigStars, setBigStars] = useState('');
  
  // Split the text by commas and trim whitespace
  const textParts = text ? text.split(',').map(part => part.trim()) : [];
  
  // Generate random star positions
  const generateStarBoxShadow = (count) => {
    let shadows = [];
    
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * 2000);
      const y = Math.floor(Math.random() * 2000);
      // Use CSS variable for color so we can adapt to light/dark mode
      shadows.push(`${x}px ${y}px var(--star-color, #FFF)`);
    }
    
    return shadows.join(', ');
  };
  
  useEffect(() => {
    // Generate star shadows when component mounts
    setSmallStars(generateStarBoxShadow(700));
    setMediumStars(generateStarBoxShadow(200));
    setBigStars(generateStarBoxShadow(100));
  }, []);
  
  return (
    <div 
      className={`${styles.container} ${className}`}
      style={{ '--animation-iteration': loop ? 'infinite' : '1' }}
    >
      {/* Stars layers */}
      <div 
        className={styles.stars}
        style={{ boxShadow: smallStars }}
      ></div>
      <div 
        className={styles.starsMedium}
        style={{ boxShadow: mediumStars }}
      ></div>
      <div 
        className={styles.starsLarge}
        style={{ boxShadow: bigStars }}
      ></div>
      
      {/* Horizon and Earth (simplified abstract glows) */}
      <div className={styles.horizon}>
        <div className={styles.glow}></div>
      </div>
      
      {/* Optional Title and Subtitle - we might not use these if we just want the bg, 
          but keeping them to match the provided structure. */}
      {head && <div className={styles.title}>{head.toUpperCase()}</div>}
      
      {textParts.length > 0 && (
        <div className={styles.subtitle}>
          {textParts.map((part, index) => (
            <React.Fragment key={index}>
              <span className={styles[`subtitlePart${index + 1}`] || styles.subtitlePart}>
                {part.toUpperCase()}
              </span>
              {index < textParts.length - 1 && ' '}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export { CosmicParallaxBg };
