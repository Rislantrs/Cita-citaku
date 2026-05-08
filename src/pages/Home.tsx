import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Map, ShieldCheck, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import * as motion from "motion/react-client";
import SEO from "../components/SEO";
import { careerCatalog, CAREER_CATEGORIES } from '../lib/careerCatalog';

const FEATURE_POINTS = [
  { title: "Tes jati diri lebih dalam", text: "RIASEC + vibe MBTI untuk menangkap minat, gaya kerja, dan preferensi interaksi." },
  { title: "Roadmap yang konkret", text: "Setiap cita-cita punya langkah belajar, skill, sertifikasi, dan milestone." },
  { title: "Aman dan terukur", text: "Fokus pada aksesibilitas, validasi, dan struktur data yang siap berkembang." },
];

export default function Home() {
  const { t } = useTranslation();
  const [parallaxY, setParallaxY] = useState(0);

  // Parallax on scroll
  useEffect(() => {
    const onScroll = () => setParallaxY(window.scrollY * 0.3);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-triggered reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col">
      <SEO
        title="Beranda"
        description="Temukan jati diri melalui kuis psikometrik, eksplorasi ribuan cita-cita, dan ikuti peta jalan (roadmap) belajar yang konkret sampai ke industri."
        keywords="cita-citaku, eksplorasi karir, tes riasec indonesia, roadmap belajar, masa depan"
        url="https://cita-citaku.id"
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-slate-50">
        {/* Background Photo with Parallax */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="/images/hero-modern.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>

        {/* Animated Mesh Gradient Background */}
        <div className="mesh-gradient-container opacity-60">
          <div className="mesh-gradient-blob w-[600px] h-[600px] bg-blue-400/30 top-[-10%] left-[-10%]" />
          <div className="mesh-gradient-blob w-[500px] h-[500px] bg-indigo-400/20 bottom-[10%] right-[0%]" style={{ animationDelay: '-5s' }} />
          <div className="mesh-gradient-blob w-[400px] h-[400px] bg-purple-400/10 top-[20%] right-[10%]" style={{ animationDelay: '-10s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-bold tracking-widest uppercase text-blue-600 mb-8"
            >
              Platform Eksplorasi Karir Indonesia
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl sm:text-7xl lg:text-[7rem] font-black leading-[0.95] tracking-tighter mb-10"
              style={{ color: 'var(--text-primary)' }}
            >
              Arah Masa Depan, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
                Lebih Jelas.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-14 leading-relaxed"
            >
              Temukan jati diri melalui kuis psikometrik, eksplorasi cita-cita, dan ikuti peta jalan belajar yang konkret sampai ke industri.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Link
                to="/test"
                className="group relative flex items-center gap-3 rounded-full bg-blue-600 px-12 py-5 text-[15px] font-bold text-white shadow-2xl shadow-blue-600/30 transition-all hover:-translate-y-1 hover:scale-105 active:scale-95"
              >
                Mulai Tes Sekarang
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/roadmap"
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm px-12 py-5 text-[15px] font-bold text-slate-700 transition-all hover:bg-white hover:border-slate-300 hover:-translate-y-1"
              >
                Cari Profesi
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-32 px-6 reveal-on-scroll">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-16 md:grid-cols-3">
            {FEATURE_POINTS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12 }}
                className="space-y-4"
              >
                <div className="w-10 h-[2px] bg-blue-600 rounded-full" />
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-[15px] leading-relaxed opacity-50" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 w-full"><div className="fluid-separator" /></div>

      {/* WHY SECTION */}
      <section className="py-32 px-6 reveal-on-scroll">
        <div className="max-w-5xl mx-auto">
          <p className="text-[12px] font-semibold tracking-[0.25em] uppercase text-blue-600 mb-4">Mengapa Cita-citaku</p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15] max-w-2xl" style={{ color: 'var(--text-primary)' }}>
            Bukan sekadar<br />daftar profesi.
          </h2>

          <div className="mt-20 grid gap-12 md:grid-cols-3">
            {[
              { title: 'Eksplorasi yang luas', text: 'Lebih banyak pilihan jalur, dan lebih banyak konteks untuk tiap profesi.' },
              { title: 'Roadmap Manusiawi', text: 'Setiap tahap dijelaskan singkat, jelas, dan terasa bisa dikerjakan.' },
              { title: 'Rekomendasi Pintar', text: 'Hasil kuis langsung dikaitkan ke profesi dan jalur belajar yang relevan.' },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-4"
              >
                <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-blue-600 opacity-60">0{idx + 1}</span>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-[15px] leading-relaxed opacity-50" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="relative py-32 px-6">
        <div className="relative z-10 max-w-5xl mx-auto mb-16 text-center">
          <p className="text-[12px] font-semibold tracking-[0.25em] uppercase text-blue-600 mb-3">Bidang Karir</p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Eksplorasi duniamu.
          </h2>
          <p className="mt-6 text-[15px] max-w-2xl mx-auto opacity-50" style={{ color: 'var(--text-secondary)' }}>
            Pilih bidang yang paling sesuai dengan minat dan bakatmu, lalu temukan roadmap karir yang tepat.
          </p>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAREER_CATEGORIES.slice(0, 6).map((category) => {
            return (
              <Link
                key={category.id}
                to={`/roadmap`}
                className="group relative overflow-hidden rounded-[2rem] aspect-[4/3] sm:aspect-square md:aspect-[4/3] flex flex-col justify-end p-8 hover-lift click-feedback shadow-xl"
                style={{ backgroundColor: 'var(--card-bg)' }}
              >
                {/* Background Photo */}
                <img
                  src={`/images/cat-${category.id}.png`}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  aria-hidden="true"
                />

                {/* Gradient Overlay for Text Readability */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-60`}
                />

                <div className="relative z-10 text-white">
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-70 mb-2 block">
                    {careerCatalog.filter(c => c.categoryId === category.id).length} Profesi Tersedia
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black mb-2 leading-tight">{category.label}</h3>
                  <div className="flex items-center text-[13px] font-semibold opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Jelajahi <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {CAREER_CATEGORIES.length > 6 && (
          <div className="relative z-10 mt-12 flex justify-center">
            <Link
              to="/roadmap"
              className="click-feedback inline-flex items-center gap-2 rounded-full px-8 py-4 text-[13px] font-semibold transition-all hover:-translate-y-0.5"
              style={{
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                backgroundColor: 'rgba(255,255,255,0.6)'
              }}
            >
              Lihat Semua Kategori <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>

      {/* STEPS SECTION */}
      <section className="py-32 px-6 reveal-on-scroll">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[12px] font-semibold tracking-[0.25em] uppercase text-blue-600 mb-4">Cara Kerja</p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              3 langkah untuk memulai.
            </h2>
          </div>

          <div className="space-y-16">
            {[
              { num: '01', title: 'Kenali Dirimu', desc: 'Ikuti tes berbasis RIASEC untuk memahami minat dan potensi terpendam.' },
              { num: '02', title: 'Temukan Karir', desc: 'Jelajahi banyak cita-cita yang dirancang lengkap dengan kurikulum industri.' },
              { num: '03', title: 'Ikuti Roadmap', desc: 'Dapatkan panduan bertahap dari sekolah hingga dunia kerja.' },
            ].map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex gap-8 items-start"
              >
                <span className="text-5xl sm:text-6xl font-black text-blue-600 opacity-15 shrink-0 leading-none select-none">{step.num}</span>
                <div className="pt-2 space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                  <p className="text-[15px] leading-relaxed opacity-50 max-w-md" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-32 overflow-hidden">
        <div className="photo-overlay absolute inset-0">
          <img
            src="/images/hero-student.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Sudah siap menemukan<br />potensimu?
          </h2>
          <p className="mt-6 text-lg opacity-40" style={{ color: 'var(--text-secondary)' }}>
            Tes ini gratis dan akan menjadi langkah awal perubahan besarmu.
          </p>
          <Link
            to="/test"
            className="click-feedback mt-10 inline-flex items-center gap-3 rounded-full bg-blue-600 px-10 py-4 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/15 transition-all hover:-translate-y-1"
          >
            Mulai Sekarang
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
