import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExternalLinkAlt, FaTimes } from "react-icons/fa";

/**
 * Portfolio Component
 * This component displays a portfolio section with filterable and searchable
 * project items, featuring animations with Framer Motion and a modal for
 * detailed project views. It includes a custom Tailwind animation for filters.
 */
function Portfolio() {
  // State for filter, search, and modal
  const [filter, setFilter] = useState("all"); // State to manage filter category
  const [searchTerm, setSearchTerm] = useState(""); // State to manage search term
  const [selectedProject, setSelectedProject] = useState(null); // State to manage selected project for modal

  // Portfolio items data with additional details
  const portfolioItems = [
    {
      id: 1,
      category: "web",
      title: "Apple.com Cloning",
      description:
        "A responsive clone of Apple’s homepage built with HTML, CSS, and Tailwind CSS. Focused on pixel-perfect design and smooth animations.",
      image: "/img/projects/Apple.png", // Update paths as needed
      link: "https://zinaws.github.io/appleClone/",
      technologies: ["HTML5", "CSS3", "Bootsrap CSS", "JavaScript"],
      featured: true,
    },
    {
      id: 2,
      category: "data",
      title: "Excel Data Analysis",
      description:
        "Developed Excel templates for Jazeera Airways’ maintenance planning, automating data processing and visualization with VBA.",
      image: "/img/projects/excel_data_review.jpeg",
      technologies: ["Excel", "VBA", "Data Visualization"],
    },
    {
      id: 3,
      category: "web",
      title: "YouTube.com Cloning",
      description:
        "Recreated YouTube’s homepage with responsive design using CSS & Javascript, featuring dynamic video thumbnails.",
      image: "/img/projects/Youtube.png",
      link: "https://youtube1982.netlify.app/",
      technologies: ["HTML5", "CSS3", "JavaScript"],
    },
    {
      id: 4,
      category: "web",
      title: "Netflex.com Cloning",
      description:
        "Recreated Netflex’s homepage with responsive design using React and CSS3, featuring dynamic video thumbnails.",
      image: "/img/projects/Netflix3.png",
      link: "https://zinaws.github.io/Netflix-Clone-2024/",
      technologies: ["HTML5", "CSS3", "React"],
    },
    {
      id: 5,
      category: "web",
      title: "Amazon.com Cloning",
      description:
        "Recreated Amazon’s homepage with responsive design using React and  CSS, featuring dynamic video thumbnails.",
      image: "/img/projects/Amazon.png",
      link: "https://amazon-fronend-deployment.netlify.app/",
      technologies: [
        "HTML5",
        "CSS3",
        "React",
        "NodeJS",
        "Firebase",
        "Stripe.js",
      ],
    },
    {
      id: 6,
      category: "web",
      title: "Melkahiwot.com",
      description:
        "Recreated customer’s homepage with responsive design using Javascript and CSS, featuring dynamic video thumbnails.",
      image: "/img/projects/Melkahiwot.png",
      link: "https://www.melkahiwot.com/",
      technologies: ["HTML5", "CSS3", "JavaScript", "NodeJS", "Stripe.js"],
    },
    {
      id: 7,
      category: "aviation",
      title: "B767 Cargo Conversion",
      description:
        "Led the conversion of passenger aircraft to cargo for Ethiopian Airlines, managing technical specifications and compliance.",
      image: "/img/projects/cargo_conversion_project.jpeg",
      technologies: [
        "Project Management",
        "Aviation Systems",
        "EASA Compliance",
      ],
      // caseStudy: "/case-studies/b767-cargo-conversion", // Optional: link to detailed write-up
      featured: true,
    },
    {
      id: 8,
      category: "web",
      title: "Evangadi Forum",
      description:
        "The Evangadi Forum platform with a responsive design using React, Node.js, and MySQL/PostgreSQL. Features include user authentication, question and answer threads, and a clean UI.",
      image: "/img/projects/Evanadi_Forum.png",
      link: "https://evangadi-forum-d2024.netlify.app/",
      technologies: [
        "HTML5",
        "CSS3",
        "React",
        "Node.js",
        "Express",
        "MySQL/PostgreSQL",
      ],
    },
  ];

  // Filter and search items
  const filteredItems = portfolioItems
    .filter((item) => filter === "all" || item.category === filter) // Filter by category
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || // Filter by title
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by description
    );

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 }, // Initial state
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, // Visible state with transition
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }, // Exit state with transition
  };

  return (
    <section
      id="portfolio"
      className="py-16 bg-gradient-to-b from-gray-100 to-gray-200"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section title */}
        <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-800">
          My Portfolio
        </h2>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-3 rounded-lg bg-white text-black border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search projects"
          />
          <div className="flex flex-wrap justify-center gap-2 sticky top-0 bg-gradient-to-b from-gray-100 to-gray-200 pt-4 pb-2 z-10">
            {["all", "web", "data", "aviation"].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  filter === category
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
                aria-label={`Filter by ${category}`}
              >
                {category === "all"
                  ? "All"
                  : category.charAt(0).toUpperCase() + category.slice(1)}
                {filter === category && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-800 rounded animate-slide-in"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio items */}
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedProject(item)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${item.title}`}
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => (e.target.src = "/img/placeholder.jpg")} // Fallback image
                    />
                    {item.featured && (
                      <span className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View Details
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex gap-2">
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`View live demo of ${item.title}`}
                        >
                          <FaExternalLinkAlt className="mr-1" /> Live Demo
                        </a>
                      )}
                      {item.caseStudy && (
                        <a
                          href={item.caseStudy}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`View case study for ${item.title}`}
                        >
                          <FaExternalLinkAlt className="mr-1" /> Case Study
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600 text-center col-span-full">
                No projects found.
              </p>
            )}
          </div>
        </AnimatePresence>

        {/* Download Portfolio Button */}
        {/* <div className="text-center mt-12">
          <a
            href="/path/to/portfolio.pdf" // Replace with actual PDF path
            download
            className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg"
            aria-label="Download portfolio PDF"
          >
            Download Portfolio
          </a>
        </div> */}

        {/* Modal for Project Details */}
        {selectedProject && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProject(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Project details modal"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
              >
                <FaTimes size={24} />
              </button>
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-48 object-cover rounded-lg mb-6"
                loading="lazy"
              />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedProject.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {selectedProject.description}
              </p>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Technologies
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProject.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    aria-label={`View live demo of ${selectedProject.title}`}
                  >
                    <FaExternalLinkAlt className="mr-2" /> Live Demo
                  </a>
                )}
                {selectedProject.caseStudy && (
                  <a
                    href={selectedProject.caseStudy}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    aria-label={`View case study for ${selectedProject.title}`}
                  >
                    <FaExternalLinkAlt className="mr-2" /> Case Study
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Custom Tailwind animation */}
      <style>{`
        @keyframes slideIn {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-in-out;
        }
      `}</style>
    </section>
  );
}

export default Portfolio;
