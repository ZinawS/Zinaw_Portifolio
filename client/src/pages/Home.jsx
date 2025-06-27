// Import all section components to render on the home page
import React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
// import Resume from "../components/Resume";
import Services from "../components/Services";
import Portfolio from "../components/Portfolio";
import Recommendations from "../components/Recommendations";
import Contact from "../components/Contact";
import Blog from "../components/Blog";
import Skills from "../components/Skill";
import HrLine from "../Utility/HrComponent";
// import { Link } from "react-router-dom";

function Home() {
  return (
    // Container for all sections, maintaining order from original index.html
    <div id="home">
      {/* Hero section with introductory content and animations */}
      <Hero />
      {/* About section with personal and professional details */}
      <HrLine />
      <About />
      <HrLine />
      <Skills />

      {/* Resume section with toggleable Aviation/IT content */}
      {/* <HrLine /> */}
      {/* <Link to="/resume">Resume</Link> */}
      {/* Services section listing offered services */}
      <HrLine />
      <Services />
      {/* Portfolio section showcasing projects */}
      <HrLine />
      <Portfolio />
      {/* Recommendations section with form and testimonials */}
      <HrLine />
      <Recommendations />
      {/* Contact section with form and contact info */}
      <HrLine />
      <Contact />
      {/* Blog section displaying blog posts */}
      <HrLine />
      <Blog />
    </div>
  );
}

// Export for use in App.js
export default Home;
