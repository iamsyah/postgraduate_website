import React from "react";
import { Mail, User } from "lucide-react";

// Organizational chart data from FSKM website
const organizationalChart = [
  {
    id: 1,
    name: "Assoc. Prof Ts. Dr. Suhaila Abd Halim",
    role: "Head of Center (Postgraduates)",
    email: "suhaila889@uitm.edu.my",
    category: "leadership",
  },
  {
    id: 2,
    name: "Assoc. Prof. Dr. Shafaf Ibrahim",
    role: "Postgraduate Coordinator (Research)",
    email: "shafaf2429@uitm.edu.my",
    category: "research",
  },
  {
    id: 3,
    name: "Dr. Emma Nuraihan Mior Ibrahim",
    role: "Coordinator (Research Programme)\nPhD of Computing Science",
    email: "emmanuraihan@uitm.edu.my",
    category: "research",
  },
  {
    id: 4,
    name: "Ts. Dr. Ahmad Faiz Ghazali",
    role: "Coordinator (Research Programme)\nMaster of Computing Sciences",
    email: "faizghazali@uitm.edu.my",
    category: "research",
  },
  {
    id: 5,
    name: "Dr. Hazizah Mohd Ijam",
    role: "Coordinator (Research Programme)\nPhD of Mathematical Sciences",
    email: "hazizahijam@uitm.edu.my",
    category: "research",
  },
  {
    id: 6,
    name: "Dr. Nadhirah Abdul Halim",
    role: "Coordinator (Research Programme)\nMaster of Mathematical Sciences",
    email: "nadhirahhalim@uitm.edu.my",
    category: "research",
  },
  {
    id: 7,
    name: "Assoc. Prof. Dr. Norizan Mat Diah",
    role: "Coordinator (Coursework Programme)\nMaster of Computer Science",
    email: null,
    category: "coursework",
  },
  {
    id: 8,
    name: "Dr. Siti Arpah Ahmad",
    role: "Coordinator (Coursework Programme)\nMaster of Computer Science",
    email: "arpah340@uitm.edu.my",
    category: "coursework",
  },
  {
    id: 9,
    name: "Dr. Norkhushaini Awang",
    role: "Coordinator (Coursework Programme)\nMaster of Computer Science",
    email: "nor_awang@uitm.edu.my",
    category: "coursework",
  },
  {
    id: 10,
    name: "Dr. Azlin Ahmad",
    role: "Coordinator (Coursework Programme)\nMaster of Computer Science",
    email: "azlin121@uitm.edu.my",
    category: "coursework",
  },
  {
    id: 11,
    name: "Dr. Nurain Ibrahim",
    role: "Coordinator (Coursework Programme)\nMaster of Mathematical Sciences",
    email: "nurainibrahim@uitm.edu.my",
    category: "coursework",
  },
];

export default function About() {
  const leadership = organizationalChart.filter((p) => p.category === "leadership");
  const research = organizationalChart.filter((p) => p.category === "research");
  const coursework = organizationalChart.filter((p) => p.category === "coursework");

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* About Us Section - Full Width */}
      <section className="bg-purple-900 text-white py-4">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">About Us</h1>
          <div className="text-lg text-purple-100 leading-relaxed space-y-4">
            <p className="text-center">
              <strong className="text-white">Center for Graduate Studies</strong> at the Faculty of Computer and Mathematical Sciences is responsible for offering postgraduate programs, including Coursework Master's, Research Master's, and Doctor of Philosophy programs in various fields under Computer Sciences and Mathematical Sciences.
            </p>
            <p className="text-center">
              These programs are designed holistically, focusing on industry-oriented education and ensuring our students possess the skills and knowledge to thrive in their chosen fields. Our coursework and research programs harness cutting-edge technology to expand the breadth of learning and offer students an outstanding chance to explore new frontiers related to artificial intelligence, analytics, cybersecurity, informatics, and others.
            </p>
            <p className="text-center">
              Advanced facilities are provided to support the teaching and learning activities and implement the integrated curriculum. Among the facilities provided are Science Data Laboratories, a Security Operation Centre, a Digital Forensic Lab, an IoT Lab, an Intelligent Information System Lab, Centre for UiTM – Maple, an Actuary Resource Centre and so on.
            </p>
            <p className="text-center">
              Our programs will provide students with the best tools, skills, and knowledge to excel on a professional level and apply what they have learned in career and life.
            </p>
          </div>
        </div>
      </section>

      {/* Organisational Chart Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-900 mb-12 text-center">
            Organisational Chart
          </h2>

          {/* Leadership */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-purple-800 mb-6 text-center">Leadership</h3>
            <div className="grid md:grid-cols-1 gap-6 max-w-2xl mx-auto">
              {leadership.map((person) => (
                <PersonCard key={person.id} person={person} featured />
              ))}
            </div>
          </div>

          {/* Research Programme Coordinators */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-purple-800 mb-6 text-center">
              Research Programme Coordinators
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {research.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          </div>

          {/* Coursework Programme Coordinators */}
          <div>
            <h3 className="text-xl font-semibold text-purple-800 mb-6 text-center">
              Coursework Programme Coordinators
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {coursework.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigate to FSKM Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-purple-900 mb-8">
            Navigate to FSKM
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-lg">
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
