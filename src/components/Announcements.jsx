import React, { useState, useEffect } from "react";

// CMS API URL - change this when deploying
const CMS_API = import.meta.env.VITE_CMS_API || "http://localhost:3001/api";

export default function Announcements() {
  const [filter, setFilter] = useState("All");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${CMS_API}/announcements`);
      if (res.ok) {
        const data = await res.json();
        // Transform CMS data to match component format
        const formatted = data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          date: new Date(item.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          image: item.imageUrl?.startsWith("/uploads")
            ? `http://localhost:3001${item.imageUrl}`
            : item.imageUrl || "/announcement/default.jpg",
          category: "Notices", // Default category
          link: item.link,
        }));
        setAnnouncements(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      // Fallback to static data if CMS is unavailable
      setAnnouncements([
        {
          id: 1,
          title: "Returned Student Registration",
          date: "October 10, 2025",
          image: "/announcement/returned_student.jpg",
          category: "Notices",
        },
        {
          id: 2,
          title: "Briefing Session for New Postgraduate Students",
          date: "October 30, 2025",
          image: "/announcement/brief_session.jpg",
          category: "Academic",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    filter === "All"
      ? announcements
      : announcements.filter((a) => a.category === filter);

  return (
    <section id="announcements" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Important Announcements
          </h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mt-4 md:mt-0 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>All</option>
            <option>Academic</option>
            <option>Events</option>
            <option>Workshops</option>
            <option>Notices</option>
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          /* Announcements Grid */
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-100 object-cover"
                />
                <div className="p-5">
                  <p className="text-sm text-gray-500">{item.date}</p>
                  <h3 className="text-lg font-semibold text-gray-800 mt-2 hover:text-blue-600 transition">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
