"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, LogIn } from "lucide-react";

const slides = [
  { src: "/1.jpg", alt: "Latar belakang target NAC 2026" },
  { src: "/2.jpg", alt: "Alur NAC untuk kegiatan operasional PLN" },
  { src: "/3.jpg", alt: "Optimasi NAC dan action plans PLN" },
  { src: "/4.jpg", alt: "Komponen NAC" },
];

export function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 3000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const moveSlide = (direction: number) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <main className="landing-page image-carousel-page">
      <header className="landing-header"><Link href="/landing-page" className="landing-logo"><img src="/Logo_PLN.png" alt="PLN" /><span><strong>NE<span>W</span>S</strong><small>NAC Early Warning System</small></span></Link><div className="carousel-header-title"><span>NEWS PLN</span><b>Knowledge Center</b></div><Link className="landing-login-button" href="/user-form/login"><LogIn size={16} /> Login</Link></header>
      <section className="image-carousel" aria-label="Materi NAC PLN" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onFocus={() => setIsPaused(true)} onBlur={() => setIsPaused(false)}>
        <div className="image-frame" key={slides[activeSlide].src}><img src={slides[activeSlide].src} alt={slides[activeSlide].alt} /></div>
        <div className="image-carousel-controls" aria-label="Kontrol carousel">
          <button type="button" aria-label="Slide sebelumnya" onClick={() => moveSlide(-1)}><ArrowLeft size={16} /></button>
          <span>{activeSlide + 1} / {slides.length}</span>
          <button type="button" aria-label="Slide berikutnya" onClick={() => moveSlide(1)}><ArrowRight size={16} /></button>
        </div>
      </section>
    </main>
  );
}
