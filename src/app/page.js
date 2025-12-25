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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (or wait for assets)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // return (
  //   <>
  //     {isLoading ? (
  //       <Loader />
  //     ) : (
  //       <main className="snap-container">
  //         <Navbar />
  //         <SocialBar />

  //         <section id="home" className="snap-section">
  //           <Hero data={resumeData.personalInfo} />
  //         </section>

  //         <section id="about" className="snap-section">
  //           <About data={resumeData} />
  //         </section>

  //         <section id="skills" className="snap-section">
  //           <Skills data={resumeData} />
  //         </section>

  //         <section id="experience" className="snap-section">
  //           <Experience data={resumeData} />
  //         </section>

  //         <section id="projects" className="snap-section">
  //           <StackingCarousel data={resumeData} />
  //         </section>

  //         <section className="snap-section">
  //           <CodolioProfile />
  //         </section>

  //         <section className="snap-section">
  //           <Comments />
  //         </section>

  //         <section id="contact" className="snap-section">
  //           <Contact data={resumeData} />
  //         </section>

  //         {/* <LiveStatus /> */}
  //       </main>
  //     )}
  //   </>
  // );
}
