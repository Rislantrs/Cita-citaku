import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Clock, ShieldCheck, Sparkles, Target, Zap, Bot, Star, Info } from 'lucide-react';

export default function AboutTest() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-12 lg:px-6">
      {/* Hero Section */}
      <section className="relative flex flex-col gap-12 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-blue-700 ring-1 ring-blue-100/50"
            style={{ backgroundColor: 'rgba(var(--accent-blue), 0.1)' }}
          >
            <Sparkles size={16} />
            Standar Psikometrik Internasional
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black leading-tight sm:text-7xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Kenali <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent italic">Jati Dirimu</span> Lebih Dalam.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl text-lg leading-relaxed opacity-60"
            style={{ color: 'var(--text-secondary)' }}
          >
            Bukan sekadar kuis biasa. Kami menggunakan metodologi ilmiah untuk memetakan minat, potensi, dan jalur karir yang paling relevan dengan kepribadian unikmu.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/test" className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-950 px-10 py-5 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:bg-slate-900 shadow-xl">
              Mulai Tes Sekarang
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-blue-400/10 blur-3xl" />
            <img 
              src="/images/self-discovery.png" 
              alt="Self Discovery Illustration" 
              className="relative h-auto w-full rounded-[3rem] object-cover shadow-[0_40px_100px_-20px_rgba(37,99,235,0.2)]"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats/Details Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <Brain className="text-blue-600" />, label: 'Metodologi', value: 'RIASEC + MBTI' },
          { icon: <Target className="text-indigo-600" />, label: 'Jumlah Soal', value: '42 Pertanyaan' },
          { icon: <Clock className="text-blue-600" />, label: 'Estimasi Waktu', value: '8 - 12 Menit' },
          { icon: <Bot className="text-indigo-600" />, label: 'Analisis', value: 'AI Interpretation' },
        ].map((item, idx) => (
          <motion.div 
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-3xl theme-card p-8 shadow-sm transition-all hover:border-blue-200 hover:shadow-lg"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-blue-500/10 p-4">
              {item.icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{item.label}</p>
            <p className="mt-2 text-xl font-black" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
          </motion.div>
        ))}
      </section>

      {/* Methodology Section */}
      <section className="flex flex-col gap-12 rounded-[3rem] p-8 lg:flex-row lg:items-center lg:p-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-black sm:text-4xl" style={{ color: 'var(--text-primary)' }}>Mengapa Tes Ini Berbeda?</h2>
          <div className="space-y-8">
            <div className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl theme-card shadow-sm">
                <Star className="text-blue-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Tes Jati Diri Lebih Dalam</h3>
                <p className="mt-2 leading-relaxed opacity-60" style={{ color: 'var(--text-secondary)' }}>
                  Kami menggabungkan model RIASEC (Holland Codes) untuk minat karir dengan "Vibe MBTI" untuk menangkap gaya kerja dan preferensi interaksi sosialmu secara menyeluruh.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl theme-card shadow-sm">
                <Map className="text-indigo-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Roadmap yang Konkret</h3>
                <p className="mt-2 leading-relaxed opacity-60" style={{ color: 'var(--text-secondary)' }}>
                  Hasil tes bukan sekadar label. Kami langsung menyambungkannya ke langkah belajar nyata: dari sekolah, sertifikasi, hingga milestone karir pertama.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl theme-card shadow-sm">
                <ShieldCheck className="text-blue-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Aman dan Terukur</h3>
                <p className="mt-2 leading-relaxed opacity-60" style={{ color: 'var(--text-secondary)' }}>
                  Data kamu diolah dengan fokus pada validitas hasil. Struktur data kami dirancang untuk terus berkembang seiring dengan tren industri masa depan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="rounded-[2.5rem] theme-card p-8 shadow-inner backdrop-blur-sm border-white/5">
            <h4 className="flex items-center gap-2 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              <Sparkles className="text-blue-500" size={20} />
              Analisis AI Terintegrasi
            </h4>
            <p className="mt-4 leading-relaxed opacity-60" style={{ color: 'var(--text-secondary)' }}>
              Setelah menyelesaikan tes, algoritma AI kami akan melakukan "Interpretasi Mendalam" untuk memberikan saran yang lebih personal, seperti:
            </p>
            <ul className="mt-6 space-y-4">
              {[
                'Kecocokan jurusan kuliah yang spesifik',
                'Lingkungan kerja yang paling membuatmu produktif',
                'Potensi hambatan dan cara mengatasinya',
                'Rekomendasi mentor atau komunitas terkait'
              ].map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm font-semibold opacity-80">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-12 text-center">
        <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Sudah Siap Menemukan Potensimu?</h2>
        <p className="mt-4 opacity-40" style={{ color: 'var(--text-secondary)' }}>Tes ini gratis dan akan menjadi langkah awal perubahan besarmu.</p>
        <Link to="/test" className="mt-8 inline-flex items-center gap-3 rounded-full bg-blue-600 px-12 py-5 text-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1 hover:bg-blue-700">
          Mulai Sekarang
          <ArrowRight size={24} />
        </Link>
      </section>
    </div>
  );
}

function Map({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <path d="M15 5.764v15" />
      <path d="M9 3.236v15" />
    </svg>
  );
}
