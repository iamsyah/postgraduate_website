import React from "react";

export default function Hero() {
  return (
    <section
      className="relative h-[80vh] bg-cover bg-center flex items-center justify-center text-center text-white"
      style={{
        backgroundImage: "url('/2019_uitm_03.jpg')", // <-- Replace with your background image
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          FSKM Postgraduate Centre
        </h1>
        <p className="text-lg md:text-2xl font-light max-w-2xl mx-auto">
          Empowering postgraduate research and academic excellence at UiTM.
        </p>
        <a
          href="#announcements"
          className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
        >
          View Announcements
        </a>
      </div>
    </section>
  );
}
