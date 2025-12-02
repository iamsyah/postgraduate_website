// src/components/Programmes.jsx
import React from "react";

const programmes = [
  {
    title: "Master by Coursework",
    description:
      "Designed for professionals seeking advanced knowledge through structured modules and practical learning experiences.",
    duration: "Full-time: 1.5 years | Part-time: 3 years",
  },
  {
    title: "Master by Research",
    description:
      "Focuses on independent research under supervision, culminating in a dissertation and academic publication.",
    duration: "Full-time: 2 years | Part-time: 4 years",
  },
  {
    title: "Doctor of Philosophy (PhD)",
    description:
      "Offers an opportunity for in-depth research to make a significant contribution to the field of Computer Science.",
    duration: "Full-time: 3 years | Part-time: 6 years",
  },
];

export default function Programmes() {
  return (
    <section id="programmes" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Programmes Offered
        </h2>
        <p className="text-gray-600 mb-12">
          Explore our postgraduate programmes designed to help you advance your academic and professional journey.
        </p>

        {/* Grid of Programmes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {programmes.map((programme, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {programme.title}
              </h3>
              <p className="text-gray-600 mb-4">{programme.description}</p>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Duration:</strong> {programme.duration}
              </p>
              <button className="mt-auto inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
