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
              Dynamic and results-driven Aviation Engineering Leader and
              Full-Stack Developer with over 16 years of international
              experience across leading airlines. Demonstrated expertise in CAMO
              management, MRO operations, project management, maintenance
              planning, aircraft systems engineering, and lease/asset
              management. Well-versed in regulatory frameworks including EASA
              Part-M/Part-CAMO and FAA 14 CFR Part 43/91. Credited with
              achieving over $26M in cost savings through strategic lease
              negotiations, digital transformation, and process automation.
            </p>
            <p className="text-lg mb-4 text-justify">
              Equally skilled in software engineering, offering hands-on
              proficiency in the SERN stack (SQL, Express.js, React, Node.js)
              and cloud-based system integration. Adept at building scalable web
              applications, designing robust APIs, and automating workflows that
              bridge aviation and IT. Passionate about driving operational
              excellence, innovation, and compliance in both aviation and tech
              sectors. Open to executive leadership or expert engineering roles
              in airworthiness, avionics, system engineering, or quality
              assurance.
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
