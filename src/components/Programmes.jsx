// src/components/Programmes.jsx
import React, { useState, useEffect } from "react";

const CMS_API = import.meta.env.VITE_CMS_API || "http://localhost:3001/api";

// Fallback data if CMS is unavailable
const fallbackProgrammes = [
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
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const fetchProgrammes = async () => {
    try {
      const res = await fetch(`${CMS_API}/programmes`);
      if (res.ok) {
        const data = await res.json();
        const formatted = data.map((item) => ({
          id: item.id,
          code: item.code,
          title: item.name,
          description: item.description || "",
          duration: `${item.mode}: ${item.duration}`,
          level: item.level,
        }));
        setProgrammes(formatted);
      } else {
        setProgrammes(fallbackProgrammes);
      }
    } catch (err) {
      console.error("Failed to fetch programmes:", err);
      setProgrammes(fallbackProgrammes);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : (
          /* Grid of Programmes */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {programmes.map((programme, index) => (
              <div
                key={programme.id || index}
                className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                {programme.level && (
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full mb-3">
                    {programme.level}
                  </span>
                )}
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
        )}
      </div>
    </section>
  );
}
