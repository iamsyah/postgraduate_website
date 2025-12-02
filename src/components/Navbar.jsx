import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
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
              <Link to="/" className="hover:text-indigo-500 transition">
                Home
              </Link>
              <Link to="/about" className="hover:text-indigo-500 transition">
                About Us
              </Link>
              <Link to="/dates" className="hover:text-indigo-500 transition">
                Important Dates
              </Link>
              <Link to="/indoordirectory" className="hover:text-indigo-500 transition">
                Indoor Directory
              </Link>
            </nav>
          </li>
        </ul>
      </div>
    </nav>
  );
}
