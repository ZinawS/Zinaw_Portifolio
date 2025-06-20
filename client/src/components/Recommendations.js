import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
// import { baseURL } from "../Utility/Api";

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [expanded, setExpanded] = useState({}); // Track expanded state for each recommendation
  const recRefs = useRef([]);

  useEffect(() => {
    fetch(`/api/recommendations`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecommendations(data.data);
          gsap.from(recRefs.current, {
            opacity: 0,
            y: 20,
            stagger: 0.2,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      })
      .catch((err) => console.error("Fetch recommendations error:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    fetch(`/api/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Recommendation submitted successfully!");
          e.target.reset();
        } else {
          alert("Failed to submit recommendation.");
        }
      })
      .catch((err) => console.error("Submit recommendation error:", err));
  };

  // Toggle expanded state for a specific recommendation
  const toggleExpanded = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="recommendations" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Recommendations</h2>
        <div className="max-w-lg mx-auto bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Submit a Recommendation</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="text"
              name="position"
              placeholder="Your Position"
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="text"
              name="company"
              placeholder="Your Company"
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <textarea
              name="recommendation"
              placeholder="Your Recommendation"
              className="w-full p-2 mb-4 border rounded"
              rows="5"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </div>
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-center mb-4">
            What People Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recommendations.map((rec, index) => (
              <div
                key={rec.id}
                ref={(el) => (recRefs.current[index] = el)}
                className="bg-gray-50 p-6 rounded-lg shadow"
              >
                <div
                  className={`text-gray-600 ${
                    !expanded[rec.id]
                      ? "line-clamp-4 overflow-hidden"
                      : ""
                  }`}
                >
                  {rec.recommendation}
                </div>
                <button
                  onClick={() => toggleExpanded(rec.id)}
                  className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                >
                  {expanded[rec.id] ? "Show Less" : "Show More"}
                </button>
                <p className="mt-4 font-semibold">{rec.name}</p>
                <p className="text-gray-600">
                  {rec.position}, {rec.company}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Recommendations;