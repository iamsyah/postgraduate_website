import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar - Similar to IPSis */}
      <div className="bg-purple-900 text-white py-2 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs md:text-sm">
          <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
            <a
              href="mailto:fskm.postgrad@uitm.edu.my"
              className="flex items-center gap-1.5 md:gap-2 hover:text-purple-200 transition truncate min-w-0"
            >
              <Mail size={12} className="md:w-[14px] md:h-[14px] flex-shrink-0" />
              <span className="truncate hidden xs:inline">fskm.postgrad@uitm.edu.my</span>
              <span className="truncate xs:hidden">Email</span>
            </a>
            <a
              href="tel:+60355442000"
              className="hidden sm:flex items-center gap-2 hover:text-purple-200 transition flex-shrink-0"
            >
              <Phone size={14} />
              <span>+60 3-5544 2000</span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs flex-shrink-0">
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1 md:flex-none">
            <img
              src="/logo-fskm.png"
              alt="FSKM Logo"
              className="h-8 md:h-10 w-auto object-contain flex-shrink-0"
            />
            <span className="font-semibold text-lg md:text-xl text-gray-800 truncate">
              <span className="hidden sm:inline">FSKM Postgraduate</span>
              <span className="sm:hidden">FSKM</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center space-x-8 font-medium text-gray-700">
            <li>
              <nav className="flex gap-6">
                <Link to="/" className="hover:text-purple-700 transition-colors">
                  Home
                </Link>
                <Link to="/about" className="hover:text-purple-700 transition-colors">
                  About Us
                </Link>
                <Link to="/dates" className="hover:text-purple-700 transition-colors">
                  Important Dates
                </Link>
                <Link to="/indoordirectory" className="hover:text-purple-700 transition-colors">
                  Indoor Directory
                </Link>
              </nav>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-3 space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 font-medium transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/dates"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 font-medium transition-colors"
              >
                Important Dates
              </Link>
              <Link
                to="/indoordirectory"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 font-medium transition-colors"
              >
                Indoor Directory
              </Link>
            </nav>
          </div>
        )}
      </nav>
    </header>
  );
}
