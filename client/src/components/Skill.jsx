import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

function Skills() {
  const skillItemsRef = useRef([]);
  const hoverAnimations = useRef([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Check mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Skills data with tooltips
  const skillsData = [
    {
      title: "Technical Skills (Full-Stack)",
      items: [
        { name: "JavaScript", tooltip: "Core language for web development" },
        { name: "React.js", tooltip: "Frontend library for building UIs" },
        { name: "Node.js", tooltip: "Backend runtime for JavaScript" },
        {
          name: "Python",
          tooltip: "Versatile language for automation and backend",
        },
        {
          name: "Java",
          tooltip: "Object-oriented programming for enterprise apps",
        },
        { name: "C++", tooltip: "High-performance programming for systems" },
        { name: "SQL", tooltip: "Database querying and management" },
        {
          name: "MongoDB",
          tooltip: "NoSQL database for scalable applications",
        },
        { name: "Tailwind CSS", tooltip: "Utility-first CSS framework" },
        { name: "Express", tooltip: "Node.js framework for RESTful APIs" },
        {
          name: "Git",
          tooltip: "Version control for collaborative development",
        },
      ],
    },
    {
      title: "Data & Analytics",
      items: [
        {
          name: "Tableau",
          tooltip: "Data visualization and business intelligence",
        },
        { name: "Power BI", tooltip: "Interactive data visualization tool" },
        { name: "Microsoft Excel", tooltip: "Advanced data analysis with VBA" },
        {
          name: "Data Visualization",
          tooltip: "Creating insightful visual reports",
        },
        { name: "Performance Metrics", tooltip: "Tracking and analyzing KPIs" },
        { name: "SkyWise", tooltip: "Aviation data analytics platform" },
        { name: "Pandas", tooltip: "Python library for data manipulation" },
        { name: "NumPy", tooltip: "Python library for numerical computations" },
        {
          name: "Statistical Analysis",
          tooltip: "Applying statistical methods to data",
        },
      ],
    },
    {
      title: "Project Management",
      items: [
        {
          name: "Microsoft Projects",
          tooltip: "Project planning and tracking tool",
        },
        {
          name: "Agile Methodologies",
          tooltip: "Iterative project management approach",
        },
        { name: "SCRUM", tooltip: "Agile framework for team collaboration" },
        {
          name: "Resource Allocation",
          tooltip: "Optimizing team and resource use",
        },
        {
          name: "Risk Assessment",
          tooltip: "Identifying and mitigating project risks",
        },
        { name: "Jira", tooltip: "Issue and project tracking software" },
        {
          name: "Confluence",
          tooltip: "Collaboration and documentation platform",
        },
        {
          name: "Budget Forecasting",
          tooltip: "Planning and managing project budgets",
        },
      ],
    },
    {
      title: "Technical Skills (Aviation)",
      items: [
        {
          name: "SAP",
          tooltip: "Enterprise resource planning for aviation operations",
        },
        { name: "Maintenix", tooltip: "MRO software for maintenance tracking" },
        { name: "AMOS", tooltip: "Aviation maintenance management system" },
        {
          name: "OASES",
          tooltip: "Open Aviation Strategic Engineering System",
        },
        {
          name: "Aviation Systems",
          tooltip: "Expertise in avionics and aircraft systems",
        },
        {
          name: "FAA Regulations",
          tooltip: "Compliance with FAA 14 CFR Part 43/91",
        },
        {
          name: "Aircraft Maintenance",
          tooltip: "Planning and execution of aircraft maintenance",
        },
        {
          name: "Safety Compliance",
          tooltip: "Ensuring adherence to safety standards",
        },
        {
          name: "Technical Records",
          tooltip: "Management of aircraft technical documentation",
        },
        {
          name: "Continuing Airworthiness",
          tooltip: "Maintaining airworthiness per EASA Part-M",
        },
        {
          name: "Defect Rectification",
          tooltip: "Rapid resolution of aircraft defects",
        },
        {
          name: "Component Maintenance",
          tooltip: "Maintenance of aircraft components",
        },
      ],
    },
    {
      title: "Soft Skills (Leadership)",
      items: [
        {
          name: "Team Mentoring",
          tooltip: "Guiding and developing team members",
        },
        { name: "Conflict Resolution", tooltip: "Mediating team disputes" },
        {
          name: "Stakeholder Management",
          tooltip: "Engaging with project stakeholders",
        },
        {
          name: "Strategic Planning",
          tooltip: "Setting long-term goals and strategies",
        },
        {
          name: "Decision-Making",
          tooltip: "Making informed and timely decisions",
        },
        {
          name: "Presentations",
          tooltip: "Delivering effective presentations",
        },
        {
          name: "Negotiation",
          tooltip: "Negotiating contracts and agreements",
        },
      ],
    },
    {
      title: "Soft Skills (Engineering/Dev)",
      items: [
        {
          name: "Technical Documentation",
          tooltip: "Creating clear technical docs",
        },
        {
          name: "Cross-Functional Collaboration",
          tooltip: "Working across teams",
        },
        {
          name: "Crisis Management",
          tooltip: "Handling high-pressure situations",
        },
        {
          name: "Precision & Compliance",
          tooltip: "Ensuring accuracy and standards",
        },
        {
          name: "Continuous Learning",
          tooltip: "Staying updated with tech trends",
        },
        {
          name: "Code Reviews",
          tooltip: "Ensuring code quality through reviews",
        },
        {
          name: "Debugging",
          tooltip: "Troubleshooting and fixing code issues",
        },
      ],
    },
    {
      title: "Universal Soft Skills",
      items: [
        { name: "Time Management", tooltip: "Prioritizing tasks efficiently" },
        { name: "Public Speaking", tooltip: "Communicating ideas clearly" },
        { name: "Adaptability", tooltip: "Adjusting to changing environments" },
        { name: "Cultural Awareness", tooltip: "Working in diverse teams" },
        { name: "Remote Work", tooltip: "Effective remote collaboration" },
        {
          name: "Critical Thinking",
          tooltip: "Analyzing and solving problems",
        },
      ],
    },
  ];

  // Filter skills based on search term
  const filteredSkills = skillsData[activeCategory].items.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation setup
  useEffect(() => {
    const handleEnter = (item) => {
      gsap.to(item, {
        scale: 1.05,
        y: -5,
        rotate: 2,
        backgroundColor: "#dbeafe",
        boxShadow: "0 12px 18px -3px rgba(0, 0, 0, 0.2)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleLeave = (item) => {
      gsap.to(item, {
        scale: 1,
        y: 0,
        rotate: 0,
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    skillItemsRef.current.forEach((item) => {
      if (!item) return;

      gsap.set(item, { transformOrigin: "center center" });

      const mouseEnter = () => handleEnter(item);
      const mouseLeave = () => handleLeave(item);
      const focusIn = () => handleEnter(item);
      const focusOut = () => handleLeave(item);

      hoverAnimations.current.push({
        item,
        mouseEnter,
        mouseLeave,
        focusIn,
        focusOut,
      });

      item.addEventListener("mouseenter", mouseEnter);
      item.addEventListener("mouseleave", mouseLeave);
      item.addEventListener("focusin", focusIn);
      item.addEventListener("focusout", focusOut);
    });

    return () => {
      hoverAnimations.current.forEach(
        ({ item, mouseEnter, mouseLeave, focusIn, focusOut }) => {
          if (item) {
            item.removeEventListener("mouseenter", mouseEnter);
            item.removeEventListener("mouseleave", mouseLeave);
            item.removeEventListener("focusin", focusIn);
            item.removeEventListener("focusout", focusOut);
          }
        }
      );
      hoverAnimations.current = [];
    };
  }, [activeCategory, searchTerm]);

  // Add to ref array
  const addToRefs = (el) => {
    if (el && !skillItemsRef.current.includes(el)) {
      skillItemsRef.current.push(el);
    }
  };

  return (
    <section
      id="skills"
      className="py-8 bg-gradient-to-b from-gray-100 to-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-800">
          My Skills
        </h1>

        {/* Search Bar and Download Button */}
        <div className="flex justify-between items-center mb-8">
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-3 rounded-lg bg-white text-black border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* <a
            href="/path/to/skills.pdf" // Replace with actual PDF path
            download
            className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg ml-4"
          >
            Download Skills
          </a> */}
        </div>

        {/* Mobile View */}
        {isMobile ? (
          <div className="space-y-8">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(Number(e.target.value))}
              className="w-full p-3 rounded-lg bg-white text-black border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {skillsData.map((group, index) => (
                <option key={index} value={index}>
                  {group.title}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill, index) => (
                  <div
                    key={index}
                    ref={addToRefs}
                    className="relative bg-white text-black text-center py-3 px-4 rounded-lg font-medium cursor-default shadow-sm hover:shadow-md transition-all border border-blue-200 group"
                    title={skill.tooltip}
                  >
                    <span className="mr-2 text-blue-500">✔</span> {skill.name}
                    <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2 transition-opacity duration-200">
                      {skill.tooltip}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center col-span-full">
                  No skills found.
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Desktop/Tablet View */
          <div className="space-y-8">
            <div className="sticky top-0 bg-gradient-to-b from-gray-100 to-gray-200 pt-4 pb-2 z-10">
              <div className="flex flex-wrap gap-2 mb-6">
                {skillsData.map((group, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCategory(index)}
                    className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      activeCategory === index
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {group.title}
                    {activeCategory === index && (
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-800 rounded animate-slide-in"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill, index) => (
                  <div
                    key={index}
                    ref={addToRefs}
                    className="relative bg-white text-black text-center py-3 px-4 rounded-lg font-medium cursor-default shadow-sm hover:shadow-md transition-all border border-blue-200 group"
                    title={skill.tooltip}
                  >
                    <span className="mr-2 text-blue-500">✔</span> {skill.name}
                    <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2 transition-opacity duration-200">
                      {skill.tooltip}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center col-span-full">
                  No skills found.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom Tailwind animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(0px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-in-out;
        }
      `}</style>
    </section>
  );
}

export default Skills;
