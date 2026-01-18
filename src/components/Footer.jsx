// src/components/Footer.jsx
import React, { useState, useEffect } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const CMS_API = import.meta.env.VITE_CMS_API || "http://localhost:3001/api";

export default function Footer() {
  const [footerData, setFooterData] = useState({
    about: '',
    contact: {
      address: '',
      phone: '',
      email: ''
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      const res = await fetch(`${CMS_API}/footer`);
      if (res.ok) {
        const data = await res.json();
        setFooterData(data);
      }
    } catch (err) {
      console.error("Failed to fetch footer:", err);
      // Keep fallback data if CMS is unavailable
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-indigo-900 text-gray-200 py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Column 1: About */}
        <div>
          <h2 className="text-xl font-semibold mb-3">FSKM Postgraduate Studies</h2>
          {loading ? (
            <div className="animate-pulse bg-indigo-800 h-20 rounded"></div>
          ) : (
            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
              {footerData.about}
            </p>
          )}
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
          {loading ? (
            <div className="space-y-3">
              <div className="animate-pulse bg-indigo-800 h-16 rounded"></div>
              <div className="animate-pulse bg-indigo-800 h-8 rounded"></div>
              <div className="animate-pulse bg-indigo-800 h-8 rounded"></div>
            </div>
          ) : (
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-400 mt-0.5" />
                <span className="whitespace-pre-line">{footerData.contact?.address || ''}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-indigo-400" />
                <span>{footerData.contact?.phone || ''}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-indigo-400" />
                <span>{footerData.contact?.email || ''}</span>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-indigo-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} FSKM Postgraduate Studies — All rights reserved.
      </div>
    </footer>
  );
}
