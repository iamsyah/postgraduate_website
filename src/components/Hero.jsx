import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// IPSis hero images - directly from ipsis.uitm.edu.my
const IPSIS_HERO_IMAGES = [
  "https://ipsis.uitm.edu.my/images/2025/intake-march-2026-web-01.jpg",
  "https://ipsis.uitm.edu.my/images/1Home/rss5-01.jpg",
  "https://ipsis.uitm.edu.my/images/1Home/raya/web-banner-intake-oct25-01.jpg",
  "https://ipsis.uitm.edu.my/images/daus/Registration_Oct_2025web-01.jpg",
  "https://ipsis.uitm.edu.my/images/Admission/fastrack2020-01.jpg",
  "https://ipsis.uitm.edu.my/images/2025/BESPOKE/Bespoke_web-01.jpg",
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});

  // Auto-rotate slides
  useEffect(() => {
    if (IPSIS_HERO_IMAGES.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % IPSIS_HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Preload images
  useEffect(() => {
    IPSIS_HERO_IMAGES.forEach((imageUrl, index) => {
      const img = new Image();
      img.onload = () => {
        setImagesLoaded((prev) => ({ ...prev, [index]: true }));
      };
      img.src = imageUrl;
    });
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + IPSIS_HERO_IMAGES.length) % IPSIS_HERO_IMAGES.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % IPSIS_HERO_IMAGES.length);
  };

  return (
    <section className="relative w-full" style={{ aspectRatio: "1920 / 700" }}>
      {/* Background slides with crossfade effect - using img for proper sizing */}
      {IPSIS_HERO_IMAGES.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt={`IPSis UiTM Banner ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Subtle overlay for button visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

      {/* Navigation arrows */}
      {IPSIS_HERO_IMAGES.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Slide indicators */}
      {IPSIS_HERO_IMAGES.length > 1 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {IPSIS_HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/40 w-2 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
