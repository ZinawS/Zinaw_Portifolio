import React, { useState } from "react";
// import { baseURL } from "../Utility/Api";

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  // Handle contact form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Disable button
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    fetch(`/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Message sent successfully!");
          e.target.reset();
        } else {
          alert(data.error || "Failed to send message.");
        }
      })
      .catch((err) => {
        console.error("Submit contact error:", err);
        alert("An unexpected error occurred.");
      })
      .finally(() => {
        setIsSubmitting(false); // Re-enable button
      });
  };

  return (
    <section id="contact" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Section title */}
        <h2 className="text-3xl font-bold text-center mb-4">Contact Me</h2>

        {/* Contact info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
{/*           <div className="text-center">
            <i className="fas fa-phone fa-3x text-blue-600 mb-2"></i>
            <p className="font-semibold">+1 240-425-2343</p>
          </div> */}
          <div className="text-center">
            <i className="far fa-envelope fa-3x text-blue-600 mb-2"></i>
            <p className="font-semibold">
              <a href="mailto:zinshol@hotmail.com">zinshol@hotmail.com</a>
            </p>
          </div>
{/*           <div className="text-center">
            <i className="fas fa-map-marker-alt fa-3x text-blue-600 mb-2"></i>
            <p className="font-semibold">Maryland, USA</p>
          </div> */}
        </div>

        {/* Contact form */}
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="p-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="p-2 border rounded"
                required
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <textarea
              name="message"
              placeholder="Message"
              className="w-full p-2 mb-4 border rounded"
              rows="5"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
