"use client";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getTechIcon } from "../utils/techIcons";
import styles from "./StackingCarousel.module.css";

function calculateGap(width) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

const StackingCarousel = ({ data }) => {
  const projects = data.projects;
  const projectsLength = useMemo(() => projects.length, [projects]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);
  const imageContainerRef = useRef(null);
  const autoplayIntervalRef = useRef(null);

  const activeProject = useMemo(
    () => projects[activeIndex],
    [activeIndex, projects]
  );

  // Responsive gap
  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay
  useEffect(() => {
    autoplayIntervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projectsLength);
    }, 6000);
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [projectsLength]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line
  }, [activeIndex, projectsLength]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % projectsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [projectsLength]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + projectsLength) % projectsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [projectsLength]);

  // 3D perspective image transforms (left, center, right visible)
  function getImageStyle(index) {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + projectsLength) % projectsLength === index;
    const isRight = (activeIndex + 1) % projectsLength === index;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  const quoteVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <section id="projects" className={styles.carouselSection}>
      <h2 className={styles.title}>PROJECTS</h2>

      <div className={styles.splitLayout}>
        {/* LEFT: 3D Image Carousel */}
        <div className={styles.imageContainer} ref={imageContainerRef}>
          {projects.map((project, index) => (
            <Link
              key={index}
              href={`/project/${index}`}
              className={styles.imageLink}
              style={getImageStyle(index)}
            >
              {project.image && !project.image.startsWith("linear") ? (
                <img
                  src={project.image}
                  alt={project.name}
                  className={styles.projectImage}
                />
              ) : (
                <div className={styles.imageFallback} />
              )}
            </Link>
          ))}
        </div>

        {/* RIGHT: Project Info */}
        <div className={styles.contentPanel}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={styles.contentInner}
            >
              {/* Project Counter */}
              <span className={styles.counter}>
                {String(activeIndex + 1).padStart(2, "0")} / {String(projectsLength).padStart(2, "0")}
              </span>

              {/* Title */}
              <Link href={`/project/${activeIndex}`} className={styles.projectTitleLink}>
                <h3 className={styles.projectTitle}>{activeProject.name}</h3>
              </Link>

              {/* Date */}
              {activeProject.date && (
                <p className={styles.projectDate}>{activeProject.date}</p>
              )}

              {/* Description with word-by-word blur-in animation */}
              <div className={styles.projectDesc}>
                {activeProject.points[0].split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: "blur(8px)", opacity: 0, y: 4 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut", delay: 0.02 * i }}
                    style={{ display: "inline-block" }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </div>

              {/* Links */}
              <div className={styles.linkGroup}>
                {activeProject.github && (
                  <a href={activeProject.github} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
                    Github <ArrowUpRight size={14} />
                  </a>
                )}
                {activeProject.demo && (
                  <a href={activeProject.demo} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
                    Live Demo <ArrowUpRight size={14} />
                  </a>
                )}
              </div>

              {/* Tech Stack */}
              <div className={styles.footerRow}>
                <span className={styles.label}>tech stack:</span>
                <div className={styles.techIcons}>
                  {activeProject.tech.split(",").slice(0, 5).map((t, i) => (
                    <div key={i} className={styles.techIconWrapper} title={t.trim()}>
                      <img
                        src={getTechIcon(t)}
                        className={styles.techIconImg}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentNode.innerText = t.trim().substring(0, 2);
                        }}
                        alt={t.trim()}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className={styles.controls}>
            <button className={styles.navBtn} onClick={handlePrev} aria-label="Previous project">
              <ArrowLeft size={22} />
            </button>
            <button className={styles.navBtn} onClick={handleNext} aria-label="Next project">
              <ArrowRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StackingCarousel;
