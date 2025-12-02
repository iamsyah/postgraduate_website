import React from "react";

export default function About() {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-indigo-900 text-white text-center py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-gray-200">
            Faculty of Computer and Mathematical Sciences (FSKM)
          </p>
        </div>
      </section>

      {/* Facilities and Services Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-indigo-800">
            Facilities and Services
          </h2>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View More →
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Research Labs",
              desc: "FSKM provides advanced computing and research laboratories for postgraduate studies and research innovation.",
            },
            {
              title: "Student Support",
              desc: "Comprehensive support system for postgraduate students including supervision guidance, counselling, and technical assistance.",
            },
            {
              title: "Workshops & Seminars",
              desc: "Frequent seminars, conferences, and workshops to enhance research exposure and networking among scholars.",
            },
            {
              title: "Library & Resources",
              desc: "Access to digital libraries, online journals, and reference databases to support academic excellence.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-3 text-indigo-700">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-indigo-800 mb-8">
            Navigate to FSKM
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-md">
            <iframe
              title="FSKM Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.158052192529!2d101.50471907584394!3d3.068562896913858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4b474d501d57%3A0x2a260f9b2d1acdfb!2sFSKM%20UiTM%20Shah%20Alam!5e0!3m2!1sen!2smy!4v1698485062232!5m2!1sen!2smy"
              width="100%"
              height="400"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
