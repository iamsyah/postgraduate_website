import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Announcements from "./components/Announcements";
import Programmes from "./components/Programmes";
import Footer from "./components/Footer";
import About from "./pages/About";
import IndoorDirectory from "./pages/IndoorDirectory";
import ImportantDates from "./pages/ImportantDates";

export default function App() {
  return (
    <>
      <Navbar />
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
      </Routes>
      <Footer />
    </>
  );
}
