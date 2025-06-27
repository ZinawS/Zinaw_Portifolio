// Import React for component creation
import React from "react";

function About() {
  return (
    // About section with personal and professional details
    <section id="about" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 mt-5">About Me</h2>
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            {/* Image sourced from public/img/, served at /img/myphoto.jpg */}
            <img
              src="/img/myphoto.jpg" // Use public path, no import needed
              alt="Zinaw Shiferaw Mekonnen"
              className="w-64 h-64 rounded-full mx-auto object-cover"
            />
          </div>
          <div className="md:w-1/2 md:pl-8">
            <p className="text-lg mb-4 text-justify">
              Full-stack Software Engineer and Aviation Systems Expert with
              proven hands-on experience in the MERN stack (MongoDB/MySQL,
              Express.js, React, Node.js), RESTful API development, and
              cloud-native deployments. Specialized in building scalable, secure
              web applications that streamline aviation workflows—bridging
              traditional airworthiness engineering with modern IT
              infrastructure. Skilled in automation, DevOps practices, and
              systems integration, with a passion for delivering innovative
              digital tools that enhance compliance, reliability, and user
              experience across enterprise platforms.
            </p>
            <p className="text-lg mb-4 text-justify">
              Globally experienced Aviation Engineering Leader with 16+ years of
              operational and strategic expertise across top-tier airlines. Deep
              proficiency in CAMO and MRO environments, aircraft system
              engineering, predictive maintenance, and digital transformation
              initiatives. Expert in regulatory compliance under EASA
              Part-M/Part-CAMO and FAA Part 43/91, with a consistent track
              record of leading high-impact projects. Delivered over $26M in
              cost savings via lease optimization, lifecycle asset management,
              and IT-driven process automation. Open to senior roles in systems
              engineering, digital transformation, quality assurance, or
              avionics software integration.
            </p>
            <div className="relative inline-block text-left group">
              <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Download CV
              </button>

              {/* Dropdown options (hidden by default, visible on hover) */}
              <div className="absolute left-0 mt-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  <a
                    href="/documents/Resume_Zinaw Mekonnen_IT.pdf"
                    download
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                  >
                    Resume for IT
                  </a>
                  <a
                    href="/documents/Resume_Zinaw Mekonnen_Av.pdf"
                    download
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                  >
                    Resume for Aviation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Export for use in Home.js and App.js
export default About;
