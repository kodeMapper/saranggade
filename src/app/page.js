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

export default function Home() {
  return (
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

      {/* Grouping Comments and Contact if they are small, or separate? 
          User said "each section should cover 100% vh". 
          Comments might be small. Contact is a form. 
          I'll separate them for now to strictly follow "each section". 
      */}
      <section className="snap-section">
        <Comments />
      </section>

      <section id="contact" className="snap-section">
        <Contact data={resumeData} />
      </section>

      {/* <LiveStatus /> */}
    </main>
  );
}
