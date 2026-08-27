"use client";

import Link from "next/link";
import { Activity, ArrowRight, BarChart3, Bell, ClipboardList, Clock3, Database, FileText, GraduationCap, KeyRound, LayoutDashboard, Menu, Network, ShieldCheck, Sparkles, Users, Zap } from "lucide-react";

const audience = [
  { title: "Admin", text: "Mengelola sistem, master data, dan konfigurasi.", icon: Users, tone: "blue" },
  { title: "PKU", subtitle: "Pelayanan dan Keuangan", text: "Melaporkan dan memonitor kegiatan terkait pelayanan dan keuangan.", icon: Database, tone: "yellow" },
  { title: "JAR", subtitle: "Pembelajaran", text: "Melaporkan dan memonitor kegiatan terkait pembelajaran dan pengembangan kompetensi.", icon: GraduationCap, tone: "green" },
  { title: "Operasional", text: "Melaporkan dan memonitor kegiatan terkait operasional dan pelayanan lapangan.", icon: Users, tone: "purple" },
];

function MiniDashboard() {
  return (
    <div className="landing-dashboard" aria-label="Pratinjau dashboard NEWS PLN">
      <div className="dashboard-sidebar">
        <div className="dashboard-brand"><span>NE<span>W</span>S</span><small>PLN</small></div>
        {[LayoutDashboard, FileText, Activity, Database, KeyRound].map((Icon, index) => (
          <div className={`dashboard-nav ${index === 0 ? "selected" : ""}`} key={index}><Icon size={11} /><span>{["Dashboard", "Laporan", "Monitoring", "Data Master", "Pengaturan"][index]}</span></div>
        ))}
      </div>
      <div className="dashboard-content">
        <div className="dashboard-heading"><div><span className="tiny-label">NEWS PLN</span><h3>Dashboard</h3></div><div className="dashboard-avatar"><Bell size={10} /></div></div>
        <div className="stat-grid"><div><span>Total Laporan</span><strong>128</strong><em>↑ 12%</em></div><div><span>Dalam Proses</span><strong className="orange">36</strong><em className="orange">↑ 5%</em></div><div><span>Selesai</span><strong className="teal">92</strong><em className="teal">↑ 18%</em></div></div>
        <div className="chart-row"><div className="line-chart"><span>Tren Laporan NAC</span><svg viewBox="0 0 230 75" role="img" aria-label="Grafik tren laporan"><path d="M4 63 C24 58 20 39 40 44 S62 17 84 31 S112 53 132 29 S153 51 174 28 S198 24 226 8 L226 75 L4 75Z" /><path className="line" d="M4 63 C24 58 20 39 40 44 S62 17 84 31 S112 53 132 29 S153 51 174 28 S198 24 226 8" /></svg></div><div className="donut-chart"><span>Kategori NAC</span><div className="donut"><i /></div><ul><li><b /> PURNA <small>45%</small></li><li><b className="cyan" /> LCM <small>30%</small></li><li><b className="yellow-dot" /> LAINNYA <small>25%</small></li></ul></div></div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header"><Link href="/landing-page" className="landing-logo"><img src="/logo_pln.webp" alt="PLN" /><span><strong>NE<span>W</span>S</strong><small>NAC Early Warning System</small></span></Link><nav><a className="active" href="#beranda">Beranda</a><a href="#tentang">Tentang NEWS</a><a href="#informasi">Informasi</a><a href="#kontak">Kontak</a></nav><div className="header-actions"><span className="server-status"><Zap size={12} fill="currentColor" /> Server PLN Online</span><button className="icon-button" aria-label="Notifikasi"><Bell size={16} /><b /></button><Link className="login-button" href="/user-form/login"><Users size={15} /> Login</Link></div><button className="mobile-menu" aria-label="Buka menu"><Menu size={20} /></button></header>
      <section className="landing-hero" id="beranda"><div className="hero-copy"><span className="eyebrow"><Sparkles size={13} /> Sistem Peringatan Dini NAC</span><h1>NEWS <span>PLN</span></h1><h2>NAC Early Warning System</h2><p>Sistem informasi terintegrasi untuk pelaporan, monitoring, dan penanganan potensi Non-Technical Loss (NAC) secara cepat, tepat, dan terukur.</p><div className="hero-actions"><Link href="/user-form" className="primary-button">Mulai Melaporkan <ArrowRight size={16} /></Link><a href="#tentang" className="secondary-button">Pelajari NEWS</a></div><div className="feature-list"><div><span className="feature-icon blue"><ShieldCheck /></span><strong>Deteksi Dini</strong><small>Identifikasi potensi masalah sejak awal</small></div><div><span className="feature-icon yellow"><BarChart3 /></span><strong>Monitoring Real-time</strong><small>Pantau laporan dan tindak lanjut secara real-time</small></div><div><span className="feature-icon green"><Users /></span><strong>Kolaborasi</strong><small>Kolaborasi antar unit secara terintegrasi</small></div><div><span className="feature-icon purple"><Database /></span><strong>Keamanan Data</strong><small>Data terjamin aman dengan sistem autentikasi</small></div></div></div><div className="hero-visual"><div className="visual-glow" /><div className="tower"><Network size={116} strokeWidth={0.7} /></div><div className="landscape" /><MiniDashboard /></div></section>
      <section className="benefits" id="tentang"><div className="benefit-lead"><span className="benefit-mark"><ClipboardList /></span><div><h3>Mudah, Cepat, Terintegrasi</h3><p>Laporan NAC dapat diinput dan dipantau melalui sistem dengan akses yang aman sesuai peran masing-masing.</p></div></div><div className="benefit"><FileText /><strong>Pelaporan Mudah</strong><small>Input laporan NAC dengan formulir yang terstruktur</small></div><div className="benefit"><Clock3 /><strong>Respon Cepat</strong><small>Tindak lanjut laporan lebih cepat dan tepat sasaran</small></div><div className="benefit"><ShieldCheck /><strong>Data Aman</strong><small>Keamanan data terjamin dengan sistem autentikasi berlapis</small></div><div className="benefit"><BarChart3 /><strong>Laporan & Analitik</strong><small>Visualisasi data dan laporan untuk mendukung pengambilan keputusan</small></div></section>
      <section className="audience-section" id="informasi"><div className="audience-intro"><h2>Untuk Siapa Sistem Ini?</h2><p>NEWS PLN digunakan oleh berbagai unit untuk mendukung pengelolaan NAC yang lebih efektif.</p></div><div className="audience-grid">{audience.map(({ title, subtitle, text, icon: Icon, tone }) => <Link href="/user-form" className={`audience-card ${tone}`} key={title}><Icon size={22} /><span className="arrow"><ArrowRight size={12} /></span><strong>{title}</strong>{subtitle && <b>({subtitle})</b>}<small>{text}</small></Link>)}</div></section>
      <footer className="landing-footer" id="kontak"><div className="footer-brand"><img src="/logo_pln.webp" alt="PLN" /><strong>PLN</strong><b>NEWS PLN</b><small>NAC Early Warning System</small></div><span>© 2024 PT PLN (Persero). All rights reserved.</span><b>#PowerBeyondGenerations</b></footer>
    </main>
  );
}
