import React, { useState, useEffect } from "react";
import { Mail, User } from "lucide-react";

// CMS API URL - change this when deploying
const CMS_API = import.meta.env.VITE_CMS_API || "http://localhost:3001/api";

export default function About() {
  const [description, setDescription] = useState('');
  const [organizationalChart, setOrganizationalChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      // Fetch description and org chart in parallel
      const [descRes, orgRes] = await Promise.all([
        fetch(`${CMS_API}/about/description`),
        fetch(`${CMS_API}/about/org-chart`)
      ]);

      if (descRes.ok) {
        const descData = await descRes.json();
        setDescription(descData.description || '');
      }

      if (orgRes.ok) {
        const orgData = await orgRes.json();
        // Filter only active members
        const activeMembers = orgData.filter(member => member.isActive !== false);
        setOrganizationalChart(activeMembers);
      }
    } catch (err) {
      console.error("Failed to fetch about data from CMS:", err);
    } finally {
      setLoading(false);
    }
  };

  const leadership = organizationalChart.filter((p) => p.category === "leadership");
  const research = organizationalChart.filter((p) => p.category === "research");
  const coursework = organizationalChart.filter((p) => p.category === "coursework");

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* About Us Section - Full Width */}
      <section className="bg-purple-900 text-white py-4">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">About Us</h1>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-300 border-t-transparent"></div>
            </div>
          ) : (
            <div className="text-lg text-purple-100 leading-relaxed space-y-4">
              {description.split('\n\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-center">
                    {paragraph.split('\n').map((line, lineIndex) => (
                      <React.Fragment key={lineIndex}>
                        {lineIndex > 0 && <br />}
                        {line}
                      </React.Fragment>
                    ))}
                  </p>
                )
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Organisational Chart Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-900 mb-12 text-center">
            Organisational Chart
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Leadership */}
              {leadership.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-purple-800 mb-6 text-center">Leadership</h3>
                  <div className="grid md:grid-cols-1 gap-6 max-w-2xl mx-auto">
                    {leadership.map((person) => (
                      <PersonCard key={person.id} person={person} featured />
                    ))}
                  </div>
                </div>
              )}

              {/* Research Programme Coordinators */}
              {research.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-purple-800 mb-6 text-center">
                    Research Programme Coordinators
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {research.map((person) => (
                      <PersonCard key={person.id} person={person} />
                    ))}
                  </div>
                </div>
              )}

              {/* Coursework Programme Coordinators */}
              {coursework.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-purple-800 mb-6 text-center">
                    Coursework Programme Coordinators
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {coursework.map((person) => (
                      <PersonCard key={person.id} person={person} />
                    ))}
                  </div>
                </div>
              )}

              {organizationalChart.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No organizational chart data available.
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Navigate to FSKM Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-purple-900 mb-8">
            Navigate to FSKM
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <div className="relative w-full" style={{ paddingBottom: "56.25%", height: 0 }}>
              <iframe
                title="FSKM Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.158052192529!2d101.50471907584394!3d3.068562896913858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4b474d501d57%3A0x2a260f9b2d1acdfb!2sFSKM%20UiTM%20Shah%20Alam!5e0!3m2!1sen!2smy!4v1698485062232!5m2!1sen!2smy"
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Person Card Component
function PersonCard({ person, featured = false }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 text-center ${
        featured ? "border-2 border-purple-200" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center ${
          featured ? "w-20 h-20" : "w-16 h-16"
        }`}
      >
        <User className={`text-purple-600 ${featured ? "w-10 h-10" : "w-8 h-8"}`} />
      </div>

      {/* Name */}
      <h4
        className={`font-semibold text-gray-800 mb-1 ${
          featured ? "text-lg" : "text-sm"
        }`}
      >
        {person.name}
      </h4>

      {/* Role */}
      <p
        className={`text-purple-700 mb-3 whitespace-pre-line ${
          featured ? "text-sm" : "text-xs"
        }`}
      >
        {person.role}
      </p>

      {/* Email */}
      {person.email && (
        <a
          href={`mailto:${person.email}`}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition"
        >
          <Mail size={12} />
          <span className="truncate max-w-[150px]">{person.email}</span>
        </a>
      )}
    </div>
  );
}
