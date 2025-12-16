import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar - Similar to IPSis */}
      <div className="bg-purple-900 text-white py-2 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a
              href="mailto:fskm.postgrad@uitm.edu.my"
              className="flex items-center gap-2 hover:text-purple-200 transition"
            >
              <Mail size={14} />
              <span>fskm.postgrad@uitm.edu.my</span>
            </a>
            <a
              href="tel:+60355442000"
              className="hidden sm:flex items-center gap-2 hover:text-purple-200 transition"
            >
              <Phone size={14} />
              <span>+60 3-5544 2000</span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs">
            <a
              href="https://ipsis.uitm.edu.my"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-200 transition"
            >
              IPSis Portal
            </a>
            <span className="text-purple-400">|</span>
            <a
              href="https://uitm.edu.my"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-200 transition"
            >
              UiTM Official
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo-fskm.png"
              alt="FSKM Logo"
              className="w-30 h-10 object-contain"
            />
            <span className="font-semibold text-xl text-gray-800">
              FSKM Postgraduate
            </span>
          </div>

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center space-x-8 font-medium text-gray-700">
            <li>
              <nav className="flex gap-6">
                <Link to="/" className="hover:text-purple-700 transition">
                  Home
                </Link>
                <Link to="/about" className="hover:text-purple-700 transition">
                  About Us
                </Link>
                <Link to="/dates" className="hover:text-purple-700 transition">
                  Important Dates
                </Link>
                <Link to="/indoordirectory" className="hover:text-purple-700 transition">
                  Indoor Directory
                </Link>
              </nav>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
