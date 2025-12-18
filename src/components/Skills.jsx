"use client";
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';
import { useRef, useState } from 'react';
import styles from './Skills.module.css';

// Utility to wrap a number between a range
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

import { Code2 } from 'lucide-react';

const getSkillSlug = (skill) => {
  const map = {
    "JavaScript": "javascript",
    "Node": "nodedotjs",
    "Express": "express",
    "HTML": "html5",
    "CSS": "css3",
    "Bootstrap": "bootstrap",
    "Python": "python",
    "Java": "java",
    "C": "c",
    "PHP": "php",
    "MySQL": "mysql",
    "VS Code": "visualstudiocode",
    "Eclipse": "eclipseide",
    "Intellij": "intellijidea",
    "MIT App Inventor": "android", 
    "Postman": "postman",
    "MongoDB": "mongodb",
    "Vercel": "vercel",
    "Git": "git",
    "GitHub": "github",
    "MS Power BI": "powerbi",
    "Tableau": "tableau",
    "Star UML": "uml", 
    "Render": "render"
  };
  return map[skill] || skill.toLowerCase().replace(/[\s\.]/g, '');
};

const SkillTag = ({ skill }) => {
  const [error, setError] = useState(false);
  const slug = getSkillSlug(skill);
  
  // Explicit local overrides for downloaded icons
  const localMap = {
      "Java": "/images/skills/java.svg",
      "VS Code": "/images/skills/vscode.svg",
      "Tableau": "/images/skills/tableau.svg",
      "CSS": "/images/skills/css.svg",
      "MS Power BI": "/images/skills/powerbi.svg"
  };

  const iconUrl = localMap[skill] || `https://cdn.simpleicons.org/${slug}`;

  return (
    <div className={styles.tag}>
      {!error ? (
        <img 
            src={iconUrl} 
            alt={skill} 
            className={styles.icon} 
            onError={() => setError(true)} 
        />
      ) : (
        <Code2 size={24} className={styles.iconFallback} />
      )}
      <span>{skill}</span>
    </div>
  );
};

function ParallaxMarquee({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const [isHovered, setIsHovered] = useState(false);
  
  // Magic number for spacing
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // If scrolling, add velocity
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    // Smooth Slow Down on Hover logic
    if (isHovered) {
        // Slow down factor (0.2 means 5x slower)
        moveBy *= 0.2; 
    }

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div 
        className={styles.parallax} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div className={styles.scroller} style={{ x }}>
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}

const Skills = ({ data }) => {
  const { languages, tools, frameworks } = data.skills;
  const allSkills = [...languages, ...tools, ...frameworks];
  
  const chunkSize = Math.ceil(allSkills.length / 3);
  const part1 = allSkills.slice(0, chunkSize);
  const part2 = allSkills.slice(chunkSize, chunkSize * 2);
  const part3 = allSkills.slice(chunkSize * 2);

  return (
    <section className={styles.skills}>
      <h2 className={styles.title}>SKILLS</h2>
      
      <div className={styles.fixedContainer}>
        <ParallaxMarquee baseVelocity={-0.5}>
            {part1.map((skill, i) => (
                <span key={i} className={styles.wrapper}>
                    <SkillTag skill={skill} />
                </span>
            ))}
        </ParallaxMarquee>
        
        <ParallaxMarquee baseVelocity={0.4}>
            {part2.map((skill, i) => (
                <span key={i} className={styles.wrapper}>
                    <SkillTag skill={skill} />
                </span>
            ))}
        </ParallaxMarquee>

        <ParallaxMarquee baseVelocity={-0.3}>
            {part3.map((skill, i) => (
                <span key={i} className={styles.wrapper}>
                    <SkillTag skill={skill} />
                </span>
            ))}
        </ParallaxMarquee>
      </div>
    </section>
  );
};

export default Skills;
