// Import all section components to render on the home page
import React from "react";
import Hero from "./Hero";
import About from "./About";
import Resume from "./Resume";
import Services from "./Services";
import Portfolio from "./Portfolio";
import Recommendations from "./Recommendations";
import Contact from "./Contact";
import Blog from "./Blog";
import Skills from "./Skill";
import HrLine from "../Utility/HrComponent";

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
      <HrLine />
      <Resume />
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
