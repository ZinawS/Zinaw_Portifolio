import React from "react";

function Services() {
  return (
    <section id="services" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section title */}
        <h2 className="text-3xl font-bold text-center mb-8">My Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Service 1 */}
          <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
            <i className="fas fa-desktop fa-4x text-blue-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Website Development</h3>
            <p>
              Creating responsive, fast, and secure websites with custom designs
              and SEO-friendly structures.
            </p>
          </div>
          {/* Service 2 */}
          <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
            <i className="fas fa-globe fa-4x text-blue-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">SEO Optimization</h3>
            <p>
              Enhancing website visibility with keyword optimization, technical
              audits, and link-building strategies.
            </p>
          </div>
          {/* Service 3 */}
          <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
            <i className="fas fa-plane fa-4x text-blue-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Aviation Consulting</h3>
            <p>
              Providing expertise in airworthiness management, maintenance
              planning, and regulatory compliance.
            </p>
          </div>
          {/* Service 4 */}
          <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
            <i className="fas fa-plane fa-4x text-blue-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">
              Aircraft Lease Management
            </h3>
            <p>
              Managing lease negotiations, deliveries, and redeliveries to
              optimize fleet utilization.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
