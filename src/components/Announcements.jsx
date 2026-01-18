import React, { useState, useEffect } from "react";

// CMS API URL - change this when deploying
const CMS_API = import.meta.env.VITE_CMS_API || "http://localhost:3001/api";

// Get base URL for images (remove /api from CMS_API)
const getImageBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_CMS_API || "http://localhost:3001/api";
  // Remove /api from the end if present
  return apiUrl.replace(/\/api\/?$/, '');
};

export default function Announcements() {
  const [filter, setFilter] = useState("All");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/announcement/default.jpg";
    
    // If it's already a full URL (http:// or https://), use it as-is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    
    // If it starts with /uploads, prepend the base URL
    if (imageUrl.startsWith("/uploads")) {
      return `${getImageBaseUrl()}${imageUrl}`;
    }
    
    // Otherwise, assume it's a relative path
    return imageUrl;
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${CMS_API}/announcements`);
      if (res.ok) {
        const data = await res.json();
        console.log('Announcements data received:', data);
        // Transform CMS data to match component format
        const formatted = data.map((item) => {
          // Handle both imageUrl (camelCase) and image_url (snake_case) for compatibility
          const imageUrl = item.imageUrl || item.image_url;
          const finalImageUrl = getImageUrl(imageUrl);
          console.log(`Announcement "${item.title}":`, {
            originalImageUrl: imageUrl,
            finalImageUrl: finalImageUrl,
            baseUrl: getImageBaseUrl()
          });
          
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            date: new Date(item.createdAt || item.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            image: finalImageUrl,
            category: item.category || "Notices",
            link: item.link,
          };
        });
        setAnnouncements(formatted);
      } else {
        console.error("Failed to fetch announcements:", res.status, res.statusText);
        setAnnouncements([]);
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setAnnouncements([]);
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
                <div className="relative w-full" style={{ paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      // Log error for debugging
                      console.error(`Failed to load image for "${item.title}":`, item.image);
                      // Fallback to default image if image fails to load
                      if (e.target.src !== `${getImageBaseUrl()}/announcement/default.jpg`) {
                        e.target.src = "/announcement/default.jpg";
                      }
                    }}
                    onLoad={() => {
                      console.log(`Successfully loaded image for "${item.title}":`, item.image);
                    }}
                  />
                </div>
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
