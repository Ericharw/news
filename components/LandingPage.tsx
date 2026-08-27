"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, LogIn } from "lucide-react";

const slides = [
  { src: "/1.jpg", alt: "Latar belakang target NAC 2026" },
  { src: "/2.jpg", alt: "Alur NAC untuk kegiatan operasional PLN" },
  { src: "/3.jpg", alt: "Optimasi NAC dan action plans PLN" },
];

export function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 3000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <main className="landing-page image-carousel-page">
      <header className="landing-header"><Link href="/landing-page" className="landing-logo"><img src="/Logo_PLN.png" alt="PLN" /><span><strong>NE<span>W</span>S</strong><small>NAC Early Warning System</small></span></Link><div className="carousel-header-title"><span>NEWS PLN</span><b>Knowledge Center</b></div><Link className="landing-login-button" href="/user-form/login"><LogIn size={16} /> Login</Link></header>
      <section className="image-carousel" aria-label="Materi NAC PLN" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onFocus={() => setIsPaused(true)} onBlur={() => setIsPaused(false)}>
        <div className="image-frame" key={slides[activeSlide].src}><img src={slides[activeSlide].src} alt={slides[activeSlide].alt} /></div>
        <div className="image-carousel-cta"><Link href="/user-form">Mulai Input Kegiatan <ArrowRight size={16} /></Link></div>
      </section>
      <footer className="landing-footer"><div className="footer-brand"><img src="/Logo_PLN.png" alt="PLN" /><strong>PLN</strong><b>NEWS PLN</b><small>NAC Early Warning System</small></div><span>© 2024 PT PLN (Persero). All rights reserved.</span><b>#PowerBeyondGenerations</b></footer>
    </main>
  );
}
