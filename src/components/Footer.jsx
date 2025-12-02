// src/components/Footer.jsx
import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-indigo-900 text-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: About */}
        <div>
          <h2 className="text-xl font-semibold mb-3">FSKM Postgraduate Studies</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Empowering postgraduate students to achieve academic excellence through
            innovative research, professional development, and collaboration.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#programmes" className="hover:text-white transition">
                Programmes Offered
              </a>
            </li>
            <li>
              <a href="#announcements" className="hover:text-white transition">
                Announcements
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-white transition">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-indigo-400 mt-0.5" />
              <span>
                Faculty of Computer and Mathematical Sciences (FSKM),
                Universiti Teknologi MARA (UiTM)
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-indigo-400" />
              <span>+60 3-5544 2000</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-indigo-400" />
              <span>fskm.postgrad@uitm.edu.my</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-indigo-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} FSKM Postgraduate Studies — All rights reserved.
      </div>
    </footer>
  );
}
