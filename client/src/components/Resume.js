import React, { useState } from "react";

function Resume() {
  // State for toggling between Aviation and IT resume
  const [isAviation, setIsAviation] = useState(true);
  // State for toggling "See More" for each experience
  const [expandedSections, setExpandedSections] = useState({});

  // Toggle function for expanding/collapsing experience details
  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Contact information
  const contactInfo = {
    name: "ZINAW SHIFERAW MEKONNEN",
    phone: "+1 240-425-2343, +1 240-482-6848",
    email: "Zinshol@hotmail.com",
    linkedIn: "https://www.linkedin.com/in/zinaw-shiferaw-mekonnen-799a0934", // Replace with actual LinkedIn URL
    website: "https://www.zesky.net",
    github: "https://github.com/ZinawS",
    location: "Silver Spring, MD, USA",
    whatsapp: "+1 240-425-2343",
  };

  // IT resume data
  const itResume = {
    summary:
      "Full-Stack Developer and IT Consultant with expertise in SERN stack (SQL, Express.js, React, Node.js) and broad experience in web development, automation, and system integration. Brings 16+ years of multi-industry experience, recently focused on full-stack application development, cloud deployment, and backend API design. Strong command of software engineering principles, with working knowledge of legacy and modern programming languages including Java, Python, C++, and jQuery.",
    competencies: [
      "Full-stack Web Development (React, Node.js, Express, jQuery)",
      "Object-Oriented Programming (Java, C++, Python)",
      "RESTful API & Backend Integration",
      "Database Design (MySQL, MongoDB, PostgreSQL)",
      "UI/UX & Responsive Design",
      "Payment Gateway Integration (Stripe)",
      "Agile/Scrum Project Delivery",
      "Technical Documentation & Client Communication",
      "IT Solutions for Aviation (ERP integration, automation, digital records)",
    ],
    techStack: {
      frontend: [
        "HTML5",
        "CSS3",
        "Bootstrap",
        "Tailwind",
        "JavaScript ES6+",
        "React",
        "jQuery",
      ],
      backend: ["Node.js", "Express.js", "REST APIs", "Java", "Python", "C++"],
      database: ["MongoDB", "MySQL", "PostgreSQL", "Firebase"],
      tools: [
        "Git/GitHub",
        "Postman",
        "VS Code",
        "Netlify",
        "GitHub Actions",
        "Figma",
      ],
      others: [
        "Agile Methodologies",
        "CI/CD",
        "JSON",
        "XML",
        "UI Testing",
        "Cross-Browser Compatibility",
        "Cybersecurity Basics",
      ],
    },
    experience: [
      {
        title: "Full-Stack Web Developer",
        company: "Freelance + Aviation Consultant, Silver Spring, MD",
        period: "Oct 2024 – Present",
        achievements: [
          "Delivered several web applications using React, Node.js, jQuery, and MongoDB",
          "Built and deployed customer websites, e-commerce UIs, and portfolio demos",
          "Integrated payment systems like Stripe, and implemented RESTful backend services",
          "Shared tutorials, contributed to open-source projects, and advised clients on MRO/CAMO IT system needs",
        ],
        projects: [
          "zesky.net – Personal full-stack developer portfolio",
          "Apple Clone – Rebuilt Apple.com interface with React & Bootstrap",
          "Netflix Clone – Developed dynamic content UI with genre navigation",
          "Amazon Clone – Designed and developed a full-stack application with dynamic content",
          "Stripe Integration Site – Full-stack billing site with secure payment APIs",
          "Job Tracker – Responsive app using Tailwind CSS, jQuery, and vanilla JS",
        ],
      },
      {
        title: "Senior Manager, Maintenance Planning",
        company: "Jazeera Airways, Kuwait City, Kuwait",
        period: "Oct 2023 – Oct 2024",
        achievements: [
          "Developed internal IT tools to digitize maintenance workflows",
          "Created automated light/base check generation tools integrated with ERP",
          "Used agile practices to enhance cross-functional planning efficiency",
        ],
      },
      {
        title: "Senior Manager, Lease Management",
        company: "Etihad Airways, Abu Dhabi, UAE",
        period: "Feb 2023 – Aug 2023",
        achievements: [
          "Managed lease transitions with custom-built tracking and asset tools",
          "Integrated technical lease data into enterprise systems",
        ],
      },
      {
        title: "Director, Engineering & CAMO",
        company: "Ethiopian Airlines, Addis Ababa, Ethiopia",
        period: "Jan 2019 – Feb 2023",
        achievements: [
          "Led development of digital task card systems and automated reporting",
          "Implemented Wi-Fi retrofit solutions with backend data validation tools",
        ],
      },
      {
        title: "Manager, Lease Management & EIS",
        company: "Ethiopian Airlines, Addis Ababa, Ethiopia",
        period: "Aug 2013 – Dec 2018",
        achievements: ["Delivered A350/B787 records digitally"],
      },
      {
        title: "Avionics Systems Engineer",
        company: "Ethiopian Airlines, Addis Ababa, Ethiopia",
        period: "Aug 2008 – Nov 2012",
        achievements: [
          "Maintained aircraft systems and developed diagnostic tools",
        ],
      },
    ],
    education: [
      "MBA, Business Administration – Jimma University, 2018",
      "B.Sc., Electrical Engineering – Jimma University, 2006",
    ],
    certifications: [
      "Full-Stack Web Development (HTML, CSS, JS, React, Node, Express)",
      "Software Engineering with Java and Python (Independent Study)",
      "Project Management",
      "Aircraft Technical Records & Digital Compliance",
    ],
    personal: {
      dob: "Oct 22, 1982",
      languages: "English, Amharic",
    },
  };

  // Aviation resume data
  const aviationResume = {
    summary:
      "Accomplished Aviation Engineer and Leader with over 16 years of experience in aircraft engineering, CAMO management, MRO operations, and aircraft leasing at Ethiopian Airlines, Etihad Airways, and Jazeera Airways. Delivered $26M+ in cost savings through strategic lease negotiations, process automation, and digital transformation. Expert in EASA Part-M/Part-CAMO, FAA 14 CFR Part 43/91, and fleet airworthiness. Seeking senior aviation roles (VP, Director, Senior Manager) and expert positions in avionics, system, and quality assurance engineering.",
    competencies: [
      "Aviation Maintenance & Airworthiness: EASA Part-M/Part-CAMO, FAA 14 CFR Part 43/91, Maintenance Planning, Technical Records Auditing, Quality Assurance",
      "Aircraft Leasing & Transitions: Lease Management, Entry-into-Service (EIS), Aircraft Transfers, Redelivery Conditions",
      "Regulatory Compliance: EASA, FAA, ICAO Standards, Kuwait DGCA, Quality Assurance, Risk Assessment",
      "Leadership & Strategy: Project Management, Cross-Functional Team Leadership, Lean Methodologies, Digital Transformation, Stakeholder Coordination",
    ],
    technicalSkills: [
      "Aviation Tools: CAMO Management, MRO ERP Systems (Maintenix, SAP, AMOS, OASES), OEM Coordination",
      "Software: Microsoft Project, Excel (VBA, PivotTables), Tableau, Power BI, Skywise",
    ],
    experience: [
      {
        title: "Senior Manager Aircraft Maintenance Planning",
        company: "Jazeera Airways, Kuwait City, Kuwait",
        period: "Oct 2023 – Oct 2024",
        deliverables: [
          "Led short- and long-term maintenance plans for a diverse aircraft fleet",
          "Served as CAMO Postholder, ensuring compliance with Kuwait DGCA regulations",
          "Aligned work packages with AMP and AMM guidelines, minimizing downtime",
          "Implemented rapid rectification plans for TLDL items",
          "Collaborated with Production Planning and MROs for smooth operations",
          "Managed maintenance costs and turnaround time without compromising quality",
          "Developed systems for light checks, base checks, and EOL checks",
          "Enhanced the technical procedure handbook (TPH)",
          "Mitigated human factor issues with comprehensive checklists",
          "Facilitated integration of new aircraft into maintenance programs",
          "Maintained 100% compliance through proactive audits",
          "Led a team of 10+ professionals, fostering safety and quality",
        ],
        achievements: [
          "Transformed maintenance from reactive to proactive operations",
          "Increased planning efficiency from 85% to 90-95%",
          "Developed software for error-free maintenance package creation",
          "Created EOL package generation software, reducing preparation time to one hour",
          "Acted as Kuwaiti DGCA-approved CAMO Postholder",
        ],
      },
      {
        title: "Senior Manager Aircraft Technical Lease Management & Transfers",
        company: "Etihad Airways, Abu Dhabi, UAE",
        period: "Feb 2023 – Aug 2023",
        deliverables: [
          "Managed aircraft leasing and transfer lifecycle",
          "Oversaw LOI and lease agreement reviews",
          "Conducted pre-purchase inspections and lease term audits",
          "Coordinated on-time aircraft deliveries/redeliveries",
          "Reviewed lessee modification requests for airworthiness and value impact",
          "Managed aircraft transfer and phase-out projects",
          "Ensured compliance with regulatory and lease conditions",
          "Handled lease aircraft agreements and documentation",
          "Managed lease requirements during engine, landing gear, and APU shop visits",
          "Facilitated lease return programs",
          "Evaluated technical acceptance of phased-out aircraft",
          "Led a team of 10+ aviation professionals",
        ],
        achievements: [
          "Executed over 7 aircraft transfer projects",
          "Authored department reorganization proposal",
          "Negotiated changes for 20 A321LR aircraft, saving costs",
          "Transferred 4 aircraft to Lessors/Buyers",
        ],
      },
      {
        title: "Head of Design Organization",
        company: "Ethiopian Airlines, Addis Ababa, Ethiopia",
        period: "Aug 2021 – Feb 2023",
        deliverables: [
          "Led EASA DOA project, securing approval in 18 months",
          "Coordinated design organization functions",
          "Managed EASA Part 21J-compliant DO Handbook",
          "Provided strategic directions to 10+ staff",
          "Staffed department to meet operational needs",
        ],
        achievements: [
          "Secured first EASA DOA approval in Ethiopia and Africa",
        ],
      },
      {
        title: "Director of Aircraft Engineering & Planning (CAMO)",
        company: "Ethiopian Airlines, Addis Ababa, Ethiopia",
        period: "Jan 2019 – Feb 2023",
        deliverables: [
          "Spearheaded fleet airworthiness and operational efficiency",
          "Acted as CAMO post holder for Ethiopian CAA compliance",
          "Led CAMO functions including Aircraft System Engineering",
          "Ensured regulatory integration into maintenance",
          "Developed fleet safety and airworthiness standards",
          "Executed dynamic maintenance programs",
          "Introduced lean methodologies and digital solutions",
          "Managed spare parts and contractual arrangements",
          "Implemented digitally enabled technical records",
          "Ensured access to approved maintenance data",
          "Managed technical engineering budgets",
          "Built relationships with OEMs and stakeholders",
          "Directed team training",
          "Enhanced on-time aircraft delivery",
          "Developed reporting for BFE Seats, IFE, and Connectivity",
          "Managed lease requirements during shop visits",
          "Supported lease return programs",
          "Managed CAMO projects like Connectivity Retrofit",
          "Led 100+ personnel",
          "Conducted long-term planning",
        ],
        achievements: [
          "Led Connectivity Retrofit on B777, B787, and A350",
          "Digitized MRO Task Card Executions",
          "Managed transfers of three B767s and B737NGs",
          "Enhanced B787 fleet reliability, recognized by Boeing",
          "Secured maintenance program escalations, saving costs",
        ],
      },
      {
        title: "Manager Aircraft Lease Management & EIS",
        company: "Ethiopian Airlines, Addis Ababa, Ethiopia",
        period: "Aug 2013 – Dec 2018",
        deliverables: [
          "Managed lease management and EIS projects",
          "Administered 40+ lease-in/out planes daily",
          "Oversaw EIS of 40+ aircraft (B737Max, B787-9, A350, B777F)",
          "Managed lease and vendor agreement negotiations",
          "Created Airframe and Engine delivery reporting",
          "Surpassed airline KPIs for EIS and Lease team",
          "Integrated PMA and DER parts into Quality System",
          "Negotiated with lessors like AERCAP and GECAS",
          "Led aircraft transfer/return projects",
          "Represented at Airbus for A350 acceptance",
        ],
        achievements: [
          "Managed 40+ lease-in/out aircraft daily",
          "Renegotiated B787 leases, saving USD 16 million",
          "Saved USD 10 million in MRO costs",
          "Led Africa’s first A350 manufacturing acceptance",
        ],
      },
      {
        title: "Capacity Development Engineer",
        company: "Ethiopian Airlines, Addis Ababa, Ethiopia",
        period: "Nov 2012 – Aug 2013",
        deliverables: [
          "Managed technical issues for leased aircraft",
          "Planned lease-in/lease-out projects",
          "Conducted mid-term aircraft checks",
          "Calculated maintenance reserve rates",
          "Obtained reserve claim reimbursements",
          "Executed transfer/return projects",
          "Automated maintenance reserve computation",
          "Mentored engineers",
        ],
        achievements: [
          "Automated maintenance reserve computation, reducing processing time",
        ],
      },
      {
        title: "Avionics System Engineer",
        company: "Ethiopian Airlines, Addis Ababa, Ethiopia",
        period: "Aug 2008 – Nov 2012",
        deliverables: [
          "Performed maintenance and troubleshooting of avionics systems",
          "Ensured airworthiness with maintenance per OEM manuals",
          "Supported avionics reliability programs",
          "Collaborated on system modifications and upgrades",
          "Conducted inspections during heavy maintenance",
          "Developed documentation for system evaluations",
          "Mentored junior engineers",
        ],
        achievements: [],
      },
      {
        title: "Assistant Lecturer",
        company: "Jimma University, Jimma, Ethiopia",
        period: "Sept 2006 – Dec 2007",
        deliverables: [
          "Prepared and delivered course content",
          "Engaged students with communication",
          "Monitored academic progress",
          "Fostered critical thinking",
        ],
        achievements: [],
      },
    ],
    majorProjects: [
      "10 A330s Transfer projects | Etihad Airways | Transferred three aircraft to buyer",
      "B787 & A350 Wi-Fi internet connectivity retrofit | Ethiopian Airlines | Completed retrofits",
      "EASA DOA approval | Ethiopian Airlines | Secured first approval in Ethiopia and Africa",
    ],
    education: [
      "Master of Business Administration: Business Administration, Jimma University, Ethiopia, August 2018",
      "Bachelor of Science: Electrical Engineering, Jimma University, Ethiopia, July 2006",
    ],
    certifications: [
      "Full-Stack Web Development (HTML, CSS, JavaScript, React, Node.js, Express)",
      "EASA Part-M Compliance",
      "IATA Aircraft Financing and Acquisitions",
      "Boeing Leadership Training",
      "EASA Compliance Management, Auditing & Root Cause Analysis",
      "Aircraft Inspection Techniques",
      "Aircraft Technical Records Management",
      "Airbus Airline Planning & Operations Workshop",
    ],
    personal: {
      dob: "22nd Oct 1982",
      languages: "English and Amharic",
    },
  };

  return (
    <section
      id="resume"
      className="py-8 bg-gradient-to-b from-gray-100 to-gray-200"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Section title */}
        <h2 className="text-4xl font-extrabold text-center mb-10 text-blue-800">
          Professional Resume
        </h2>

        {/* Contact info */}
        <div className="text-center mb-10 bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {contactInfo.name}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span className="mr-2">📞</span> {contactInfo.phone}
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span className="mr-2">📧</span> {contactInfo.email}
            </a>
            <a
              href={contactInfo.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span className="mr-2">🔗</span> LinkedIn
            </a>
            <a
              href={contactInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span className="mr-2">🔍</span> {contactInfo.website}
            </a>
            <a
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span className="mr-2">💻</span> GitHub
            </a>
            <span className="flex items-center text-gray-600">
              <span className="mr-2">📍</span> {contactInfo.location}
            </span>
            <a
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span className="mr-2">📱</span> WhatsApp
            </a>
          </div>
        </div>

        {/* Toggle buttons and Download PDF */}
        <div className="flex justify-center space-x-6 mb-10">
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              isAviation
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
            onClick={() => setIsAviation(true)}
          >
            Aviation Resume
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              !isAviation
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
            onClick={() => setIsAviation(false)}
          >
            IT Resume
          </button>
          <a
            href={
              isAviation
                ? "/documents/Resume_Zinaw Mekonnen_Av.pdf"
                : "/documents/Resume_Zinaw Mekonnen_IT.pdf"
            } // Replace with actual PDF paths
            download
            className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg"
          >
            Download {isAviation ? "Aviation" : "IT"} Resume
          </a>
        </div>

        {/* Resume content */}
        <div className="bg-white p-8 rounded-xl shadow-2xl transition-all duration-500">
          {isAviation ? (
            <>
              <h3 className="text-2xl font-bold mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                Professional Summary
              </h3>
              <p className="mb-8 text-gray-700 leading-relaxed">
                {aviationResume.summary}
              </p>

              <h3 className="text-2xl font-bold mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                Core Competencies
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {aviationResume.competencies.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="mr-2 text-blue-500">✔</span> {item}
                  </li>
                ))}
              </ul>

              <h3 className="text-2xl font-bold mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                Technical Skills
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {aviationResume.technicalSkills.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="mr-2 text-blue-500">✔</span> {item}
                  </li>
                ))}
              </ul>

              <h3 className="text-2xl font-bold mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                Employment Outline
              </h3>
              <div className="space-y-8">
                {aviationResume.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 pl-6 pb-6"
                  >
                    <h4 className="text-xl font-semibold text-gray-900">
                      {exp.title}
                    </h4>
                    <p className="text-gray-600 font-medium">{exp.company}</p>
                    <p className="text-gray-500 mb-4">{exp.period}</p>
                    <button
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      onClick={() => toggleSection(index)}
                    >
                      {expandedSections[index] ? "See Less" : "See More"}
                    </button>
                    {expandedSections[index] && (
                      <div className="mt-4 animate-fade-in">
                        <h5 className="font-semibold text-gray-800 mt-4">
                          Key Deliverables:
                        </h5>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                          {exp.deliverables.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                        {exp.achievements.length > 0 && (
                          <>
                            <h5 className="font-semibold text-gray-800 mt-4">
                              Key Achievements:
                            </h5>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 bg-blue-50 p-4 rounded-lg">
                              {exp.achievements.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold mt-10 mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                Major Projects
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-8 text-gray-700">
                {aviationResume.majorProjects.map((project, index) => (
                  <li key={index}>{project}</li>
                ))}
              </ul>

              <h3 className="text-2xl font-bold mt-10 mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                Education
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-8 text-gray-700">
                {aviationResume.education.map((edu, index) => (
                  <li key={index}>{edu}</li>
                ))}
              </ul>

              <h3 className="text-2xl font-bold mt-10 mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                Certifications/Trainings
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {aviationResume.certifications.map((cert, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="mr-2 text-blue-500">🏆</span> {cert}
                  </li>
                ))}
              </ul>

              <h3 className="text-2xl font-bold mt-10 mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                Personal Dossier
              </h3>
              <p className="text-gray-700">
                Date of Birth: {aviationResume.personal.dob} | Languages:{" "}
                {aviationResume.personal.languages}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                Professional Summary
              </h3>
              <p className="mb-8 text-gray-700 leading-relaxed">
                {itResume.summary}
              </p>

              <h3 className="text-2xl font-bold mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                Core Competencies
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {itResume.competencies.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="mr-2 text-blue-500">✔</span> {item}
                  </li>
                ))}
              </ul>

              <h3 className="text-2xl font-bold mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                Tech Stack
              </h3>
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-800">Frontend</h4>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    {itResume.techStack.frontend.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Backend</h4>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    {itResume.techStack.backend.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Database</h4>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    {itResume.techStack.database.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Tools</h4>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    {itResume.techStack.tools.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mb-8">
                <h4 className="font-semibold text-gray-800">Others</h4>
                <div className="flex flex-wrap gap-3 mt-2">
                  {itResume.techStack.others.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                Professional Experience
              </h3>
              <div className="space-y-8">
                {itResume.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 pl-6 pb-6"
                  >
                    <h4 className="text-xl font-semibold text-gray-900">
                      {exp.title}
                    </h4>
                    <p className="text-gray-600 font-medium">{exp.company}</p>
                    <p className="text-gray-500 mb-4">{exp.period}</p>
                    <button
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      onClick={() => toggleSection(index)}
                    >
                      {expandedSections[index] ? "See Less" : "See More"}
                    </button>
                    {expandedSections[index] && (
                      <div className="mt-4 animate-fade-in">
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                          {exp.achievements.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                        {exp.projects && (
                          <>
                            <h5 className="font-semibold text-gray-800 mt-4">
                              Key Projects:
                            </h5>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 bg-blue-50 p-4 rounded-lg">
                              {exp.projects.map((project, i) => (
                                <li key={i}>{project}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold mt-10 mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                Education
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-8 text-gray-700">
                {itResume.education.map((edu, index) => (
                  <li key={index}>{edu}</li>
                ))}
              </ul>

              <h3 className="text-2xl font-bold mt-10 mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                Certifications
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {itResume.certifications.map((cert, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="mr-2 text-blue-500">🏆</span> {cert}
                  </li>
                ))}
              </ul>

              <h3 className="text-2xl font-bold mt-10 mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                Personal Dossier
              </h3>
              <p className="text-gray-700">
                Date of Birth: {itResume.personal.dob} | Languages:{" "}
                {itResume.personal.languages}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Custom Tailwind animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </section>
  );
}

export default Resume;
