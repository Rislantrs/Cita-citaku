import React from 'react';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, BrainCircuit, Compass, Map, ShieldCheck, Sparkles, Star, UserCircle } from "lucide-react";
import * as motion from "motion/react-client";
import SEO from "../components/SEO";

const CAREER_SPOTLIGHT = [
  { title: "Software Engineer", label: "Teknologi", blurb: "Bangun aplikasi web, mobile, dan AI product yang dipakai banyak orang.", accent: "from-sky-100 to-blue-100", darkAccent: "from-blue-900/20 to-indigo-900/20" },
  { title: "Psikolog Karier", label: "Kesehatan", blurb: "Bantu siswa dan profesional menemukan arah karier yang realistis.", accent: "from-blue-50 to-cyan-100", darkAccent: "from-cyan-900/20 to-blue-900/20" },
  { title: "Product Manager", label: "Bisnis", blurb: "Satukan riset, strategi, dan eksekusi untuk membangun produk.", accent: "from-indigo-100 to-blue-100", darkAccent: "from-indigo-900/20 to-slate-900/20" },
];

const FEATURE_POINTS = [
  { icon: <BrainCircuit size={18} />, title: "Tes jati diri lebih dalam", text: "RIASEC + vibe MBTI untuk menangkap minat, gaya kerja, dan preferensi interaksi." },
  { icon: <Map size={18} />, title: "Roadmap yang konkret", text: "Setiap cita-cita punya langkah belajar, skill, sertifikasi, dan milestone." },
  { icon: <ShieldCheck size={18} />, title: "Aman dan terukur", text: "Fokus pada aksesibilitas, validasi, dan struktur data yang siap berkembang." },
];

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-32 py-10 lg:py-20">
      <SEO 
        title="Beranda"
        description="Temukan jati diri melalui kuis psikometrik, eksplorasi ribuan cita-cita, dan ikuti peta jalan (roadmap) belajar yang konkret sampai ke industri."
        keywords="cita-citaku, eksplorasi karir, tes riasec indonesia, roadmap belajar, masa depan"
        url="https://cita-citaku.id"
      />
      {/* Hero Section */}
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 lg:flex-row lg:items-center">
        <motion.div
          className="flex-1 space-y-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-blue-600 ring-1 ring-blue-100" style={{ backgroundColor: 'rgba(var(--accent-blue), 0.1)' }}>
            <Sparkles size={16} />
            Platform Eksplorasi Karir No. 1
          </div>
          
          <h1 className="text-5xl font-black leading-[1.1] sm:text-7xl lg:text-8xl" style={{ color: 'var(--text-primary)' }}>
            Arah Masa Depan, <br />
            <span
              className="bg-clip-text text-transparent italic"
              style={{ backgroundImage: 'linear-gradient(to right, rgb(37 99 235), rgb(99 102 241))' }}
            >
              Lebih Jelas.
            </span>
          </h1>
          
          <p className="max-w-xl text-xl leading-relaxed opacity-70" style={{ color: 'var(--text-secondary)' }}>
            Temukan jati diri melalui kuis psikometrik, eksplorasi ribuan cita-cita, dan ikuti peta jalan (roadmap) belajar yang konkret sampai ke industri.
          </p>

          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <Link to="/test" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-5 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:bg-blue-700 shadow-xl shadow-blue-600/20">
              <span>Mulai Tes Sekarang</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              to="/roadmap" 
              className="group inline-flex items-center justify-center gap-2 rounded-2xl border px-8 py-5 text-lg font-bold transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-600/5"
              style={{ 
                backgroundColor: 'rgba(37, 99, 235, 0.03)', 
                borderColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--text-primary)' 
              }}
            >
              <Compass size={20} className="text-blue-600 transition-transform group-hover:rotate-45" />
              <span>Cari Profesi</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="flex-1"
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-[3rem] bg-blue-100/20 blur-3xl" />
            <img 
              src="/images/roadmap-hero.png" 
              alt="Career Roadmap Illustration" 
              className="relative h-auto w-full rounded-[2.5rem] object-cover shadow-2xl"
            />
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="mx-auto w-full max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {FEATURE_POINTS.map((item, idx) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="theme-card group rounded-[2.5rem] p-10 transition-all hover:shadow-xl hover:border-blue-600/30"
            >
              <div className="mb-6 inline-flex rounded-2xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-500/30">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
              <p className="mt-4 text-lg leading-relaxed opacity-70" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Section */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-16 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">Mengapa Cita-citaku</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl" style={{ color: 'var(--text-primary)' }}>Bukan sekadar daftar profesi.</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: <Compass size={24} />, title: 'Eksplorasi yang luas', text: 'Lebih banyak pilihan jalur, dan lebih banyak konteks untuk tiap profesi.' },
            { icon: <BookOpen size={24} />, title: 'Roadmap Manusiawi', text: 'Setiap tahap dijelaskan singkat, jelas, dan terasa bisa dikerjakan.' },
            { icon: <Star size={24} />, title: 'Rekomendasi Pintar', text: 'Hasil kuis akan langsung dikaitkan ke profesi dan jalur belajar yang relevan.' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="theme-card p-8"
              style={{ borderRadius: '2rem' }}
            >
              <div className="inline-flex rounded-xl bg-slate-950 p-3 text-white">
                {item.icon}
              </div>
              <h3 className="mt-5 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
              <p className="mt-3 text-sm leading-7 opacity-60" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className="max-w-6xl mx-auto px-4 w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>Cara Kerja Cita-citaku</h2>
          <p className="opacity-60 mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>3 langkah untuk memulai perjalanan karirmu.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <StepCard
            number="1"
            icon={<UserCircle size={32} className="text-blue-500" />}
            title="Kenali Dirimu"
            description="Ikuti tes berbasis RIASEC untuk memahami minat dan potensi terpendam."
            delay={0.1}
          />
          <StepCard
            number="2"
            icon={<Compass size={32} className="text-orange-500" />}
            title="Temukan Karir"
            description="Jelajahi banyak cita-cita yang dirancang lengkap dengan kurikulum industri."
            delay={0.2}
          />
          <StepCard
            number="3"
            icon={<Map size={32} className="text-emerald-500" />}
            title="Ikuti Roadmap"
            description="Dapatkan panduan bertahap dari sekolah hingga dunia kerja."
            delay={0.3}
          />
        </div>
      </section>
    </div>
  );
}

function StepCard({ number, icon, title, description, delay }: { number: string, icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="theme-card group relative rounded-[2.5rem] p-8 transition-all hover:-translate-y-2"
    >
      <div className="absolute -top-5 -left-5 w-12 h-12 bg-slate-950 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
        {number}
      </div>
      <div className="mb-6 inline-flex p-4 bg-slate-50 rounded-2xl transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="opacity-60 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </motion.div>
  );
}
