"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './Skills.module.css';

const getSkillSlug = (skill) => {
  const map = {
    "React.js": "react",
    "Next.js": "nextdotjs",
    "Node.js": "nodedotjs",
    "TailwindCSS": "tailwindcss",
    "HTML5": "html5",
    "CSS3": "css3",
    "JavaScript": "javascript",
    "TypeScript": "typescript",
    "Prisma": "prisma",
    "Python": "python",
    "Java": "java",
    "C++": "cplusplus",
    "PHP": "php",
    "MySQL": "mysql",
    "PostgreSQL": "postgresql",
    "MongoDB": "mongodb",
    "Git": "git",
    "GitHub": "github",
    "Docker": "docker",
    "AWS": "amazonwebservices",
    "Firebase": "firebase",
    "Redux": "redux",
    "Figma": "figma",
    "Postman": "postman",
    "Vercel": "vercel",
    "Render": "render",
    "Express": "express",
    "Bootstrap": "bootstrap",
    "VS Code": "visualstudiocode",
  };
  
  return map[skill] || skill.toLowerCase().replace(/[\s\.]/g, '');
};

const SkillTag = ({ skill }) => {
  const slug = getSkillSlug(skill);
  const iconUrl = `https://cdn.simpleicons.org/${slug}`;

  // Fallback if generic text
  const isGeneric = !slug;

  return (
    <div className={styles.tag}>
      {!isGeneric && (
        <img 
          src={iconUrl} 
          alt="" 
          className={styles.icon} 
          onError={(e) => { e.target.style.display = 'none'; }} 
        />
      )}
      <span>{skill}</span>
    </div>
  );
};

const Skills = ({ data }) => {
  const allSkills = [
    ...data.skills.languages, 
    ...data.skills.tools, 
    ...data.skills.frameworks
  ];

  const row1 = [...allSkills, ...allSkills];
  const row2 = [...[...allSkills].reverse(), ...[...allSkills].reverse()];

  return (
    <section className={styles.skills}>
      <h2 className={styles.title}>SKILLS</h2>
      
      <div className={styles.marqueeContainer}>
        <motion.div 
          className={styles.marquee}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 50, ease: "linear", repeat: Infinity }}
        >
          {row1.map((skill, i) => (
            <SkillTag key={`${skill}-${i}-1`} skill={skill} />
          ))}
        </motion.div>
        
        <motion.div 
          className={styles.marquee}
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 50, ease: "linear", repeat: Infinity }}
        >
          {row2.map((skill, i) => (
            <SkillTag key={`${skill}-${i}-2`} skill={skill} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
