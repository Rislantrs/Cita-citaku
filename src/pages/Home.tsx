import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Map, ShieldCheck, Sparkles, ChevronRight, ChevronLeft, Star } from "lucide-react";
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
  const carouselRef = useRef<HTMLDivElement>(null);

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

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.offsetWidth * 0.7;
    carouselRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <SEO
        title="Beranda"
        description="Temukan jati diri melalui kuis psikometrik, eksplorasi ribuan cita-cita, dan ikuti peta jalan (roadmap) belajar yang konkret sampai ke industri."
        keywords="cita-citaku, eksplorasi karir, tes riasec indonesia, roadmap belajar, masa depan"
        url="https://cita-citaku.id"
      />

      {/* HERO SECTION - Balanced & Clean */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        {/* Subtle Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-modern.png"
            alt="Cita-citaku Platform Eksplorasi Karir"
            width={1920}
            height={1080}
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale-[0.5]"
            aria-hidden="true"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, var(--bg-secondary), transparent, var(--bg-secondary))` }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-bold tracking-widest uppercase text-blue-600 mb-8">
              Platform Eksplorasi Karir Indonesia
            </div>

            <h1 className="text-4xl sm:text-7xl font-black leading-[1.15] sm:leading-[1.1] tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>
              Arah Masa Depan, <br className="hidden sm:block" />
              <span className="text-blue-600"> Lebih Jelas.</span>
            </h1>

            <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
              Temukan jati diri melalui kuis psikometrik profesional dan ikuti peta jalan belajar yang konkret hingga ke industri.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
              <Link
                to="/test"
                className="w-full sm:w-auto group flex items-center justify-center gap-3 rounded-full bg-blue-600 px-10 py-5 text-[15px] font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 hover:scale-105"
              >
                Mulai Tes Sekarang
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/roadmap"
                className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-full px-10 py-5 text-[15px] font-bold transition-all hover:-translate-y-1"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              >
                Cari Profesi
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES - Clean Grid, No Heavy Boxes */}
      <section className="py-20 sm:py-32 px-5 sm:px-6 reveal-on-scroll" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-16 md:grid-cols-3">
            {FEATURE_POINTS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-5"
              >
                <h3 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-[15px] leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY SECTION - High Contrast, Minimalist */}
      <section className="py-20 sm:py-32 px-5 sm:px-6 reveal-on-scroll" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/2">
              <p className="text-[12px] font-bold tracking-[0.3em] uppercase text-blue-600 mb-4">Mengapa Cita-citaku</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] mb-8" style={{ color: 'var(--text-primary)' }}>
                Bukan sekadar<br />daftar profesi.
              </h2>
              <p className="text-lg leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                Kami merancang setiap fitur untuk memastikan kamu tidak hanya tahu "apa" cita-citamu, tapi juga "bagaimana" cara mencapainya.
              </p>
            </div>

            <div className="lg:w-1/2 grid gap-10">
              {[
                { title: 'Eksplorasi yang luas', text: 'Lebih banyak pilihan jalur, dan lebih banyak konteks untuk tiap profesi.' },
                { title: 'Roadmap Manusiawi', text: 'Setiap tahap dijelaskan singkat, jelas, dan terasa bisa dikerjakan.' },
              ].map((item, idx) => (
                <div key={item.title} className="flex gap-6">
                  <span className="text-3xl font-black text-blue-600 opacity-20">0{idx + 1}</span>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                    <p className="text-[15px] leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SECTION — Premium 3-Column Grid */}
      <section className="py-20 sm:py-32 px-5 sm:px-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-5xl mx-auto mb-20 text-center">
          <p className="text-[12px] font-bold tracking-[0.25em] uppercase text-blue-600 mb-3">Bidang Karir</p>
          <h2 className="text-3xl sm:text-6xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Eksplorasi duniamu.
          </h2>
          <p className="mt-6 text-lg max-w-2xl mx-auto font-medium" style={{ color: 'var(--text-secondary)' }}>
            Pilih bidang yang paling sesuai dengan minat dan bakatmu, lalu temukan roadmap karir yang tepat.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CAREER_CATEGORIES.slice(0, 9).map((category) => {
            const count = careerCatalog.filter(c => c.categoryId === category.id).length;
            
            return (
              <Link
                key={category.id}
                to={`/roadmap`}
                className="group relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] aspect-[4/3] flex flex-col justify-end p-6 sm:p-8 hover-lift shadow-xl transition-all duration-500"
              >
                <img
                  src={`/images/cat-${category.id}.png`}
                  alt={category.label}
                  width={400}
                  height={300}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="relative z-10 text-white">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-70 mb-2 block">
                    {count} Profesi Tersedia
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black mb-2 leading-tight">{category.label}</h3>
                  <div className="flex items-center text-[13px] font-bold opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Jelajahi <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-20 flex justify-center">
          <Link 
            to="/roadmap" 
            className="group flex items-center gap-3 rounded-full bg-slate-950 px-12 py-5 text-[15px] font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95"
          >
            Lihat Semua Kategori
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* STEPS SECTION - Clean & Simple */}
      <section className="py-20 sm:py-32 px-5 sm:px-6 reveal-on-scroll" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[12px] font-bold tracking-[0.25em] uppercase text-blue-600 mb-4">Cara Kerja</p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              3 langkah untuk memulai.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { num: '01', title: 'Kenali Dirimu', desc: 'Ikuti kuis berbasis RIASEC untuk memahami minat dan potensi terpendam.' },
              { num: '02', title: 'Temukan Karir', desc: 'Jelajahi banyak cita-cita yang dirancang lengkap dengan kurikulum industri.' },
              { num: '03', title: 'Ikuti Roadmap', desc: 'Dapatkan panduan bertahap dari sekolah hingga dunia kerja.' },
            ].map((step) => (
              <div
                key={step.num}
                className="relative p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
              >
                <span className="text-5xl font-black text-blue-600 opacity-10 absolute top-6 right-8">{step.num}</span>
                <div className="space-y-4 relative z-10">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                  <p className="text-[15px] leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 sm:py-32 px-5 sm:px-6 text-center overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] opacity-50 -z-10" />
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>
            Sudah siap menemukan<br />potensimu?
          </h2>
          <p className="text-lg font-medium mb-12 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Tes ini gratis dan akan menjadi langkah awal perubahan besarmu.
          </p>
          <Link
            to="/test"
            className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-12 py-5 text-[16px] font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
          >
            Mulai Sekarang
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
