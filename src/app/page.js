"use client";
import { useState, useEffect } from "react";
import { resumeData } from "../data/resume";
import Navbar from "../components/Navbar";
import SocialBar from "../components/SocialBar";
import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "../components/Experience";
import StackingCarousel from "../components/StackingCarousel";
import Skills from "../components/Skills";
import Comments from "../components/Comments";
// import LiveStatus from "../components/LiveStatus";
import Contact from "../components/Contact";
import CodolioProfile from "../components/CodolioProfile";
import Loader from "../components/Loader";
import Footer from "../components/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Critical images to preload before showing the page
    const criticalImages = [
      // Hero background
      '/images/hero-new-final.png',
      // Profile image
      resumeData.personalInfo.image,
      // Experience images
      ...resumeData.experience.map(exp => exp.image).filter(Boolean),
      // Project thumbnails
      ...resumeData.projects.map(proj => proj.image).filter(Boolean),
    ];

    // Preload all images
    const preloadImages = () => {
      const promises = criticalImages.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; // Resolve even on error to not block loading
        });
      });
      return Promise.all(promises);
    };

    // Minimum loading time (to show loader animation) + wait for images
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1500));

    Promise.all([preloadImages(), minLoadingTime]).then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <main className="snap-container">
          <Navbar />
          <SocialBar />

          <section id="home" className="snap-section">
            <Hero data={resumeData.personalInfo} />
          </section>

          <section id="about" className="snap-section">
            <About data={resumeData} />
          </section>

          <section id="skills" className="snap-section">
            <Skills data={resumeData} />
          </section>

          <section id="experience" className="snap-section">
            <Experience data={resumeData} />
          </section>

          <section id="projects" className="snap-section">
            <StackingCarousel data={resumeData} />
          </section>

          <section className="snap-section">
            <CodolioProfile />
          </section>

          <section className="snap-section">
            <Comments />
          </section>

          <section id="contact" className="snap-section">
            <Contact data={resumeData} />
          </section>

          <section className="snap-footer">
            <Footer />
          </section>

          {/* <LiveStatus /> */}
        </main>
      )}
    </>
  );

  // Under Maintainance - 
  // return (
  //   <div style={{ textAlign: 'center', fontSize: '2rem', color: 'white', backgroundColor: 'black', padding: '2rem' }}>
  //     Under Maintainance. We'll be live soon!
  //   </div>
  // )
}

