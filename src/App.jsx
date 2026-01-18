import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Announcements from "./components/Announcements";
import Programmes from "./components/Programmes";
import Footer from "./components/Footer";
import About from "./pages/About";
import IndoorDirectory from "./pages/IndoorDirectory";
import ImportantDates from "./pages/ImportantDates";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminProgrammes from "./pages/admin/AdminProgrammes";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminOrgChart from "./pages/admin/AdminOrgChart";
import AdminFooter from "./pages/admin/AdminFooter";

export default function App() {
  const location = useLocation();
  const isIndoorDirectory = location.pathname === "/indoordirectory";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isIndoorDirectory && !isAdminPage && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Announcements />
              <Programmes />
            </>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/dates" element={<ImportantDates />} />
        <Route path="/indoordirectory" element={<IndoorDirectory />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <AdminProtectedRoute>
              <AdminAnnouncements />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/programmes"
          element={
            <AdminProtectedRoute>
              <AdminProgrammes />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/about"
          element={
            <AdminProtectedRoute>
              <AdminAbout />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/org-chart"
          element={
            <AdminProtectedRoute>
              <AdminOrgChart />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/footer"
          element={
            <AdminProtectedRoute>
              <AdminFooter />
            </AdminProtectedRoute>
          }
        />
      </Routes>
      {!isIndoorDirectory && !isAdminPage && <Footer />}
    </>
  );
}
