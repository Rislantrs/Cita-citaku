import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Clock, Target, Bot } from 'lucide-react';

export default function AboutTest() {

  // Scroll reveal
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

      {/* ─── Hero ─── */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="photo-overlay absolute inset-0">
          <img 
            src="/images/hero-student.png" 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[12px] font-semibold tracking-[0.25em] uppercase text-blue-600 mb-6"
            >
              Standar Psikometrik Internasional
            </motion.p>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-7xl font-black leading-[1.05] tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Kenali{' '}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Jati Dirimu
              </span>
              {' '}Lebih Dalam.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-lg leading-relaxed max-w-xl opacity-50"
              style={{ color: 'var(--text-secondary)' }}
            >
              Bukan sekadar kuis biasa. Kami menggunakan metodologi ilmiah untuk memetakan minat, 
              potensi, dan jalur karir yang paling relevan dengan kepribadian unikmu.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10"
            >
              <Link 
                to="/test" 
                className="click-feedback group inline-flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-[15px] font-semibold text-white transition-all hover:-translate-y-1 shadow-lg shadow-blue-600/15"
              >
                Mulai Tes Sekarang
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-24 px-6 reveal-on-scroll">
        <div className="max-w-4xl mx-auto grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Metodologi', value: 'RIASEC + MBTI' },
            { label: 'Jumlah Soal', value: '42 Pertanyaan' },
            { label: 'Estimasi Waktu', value: '8 - 12 Menit' },
            { label: 'Analisis', value: 'AI Interpretation' },
          ].map((item, idx) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="space-y-2"
            >
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase opacity-30">{item.label}</p>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 w-full"><div className="fluid-separator" /></div>

      {/* ─── Why Different ─── */}
      <section className="py-28 px-6 reveal-on-scroll">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-20 lg:grid-cols-2">
            <div>
              <p className="text-[12px] font-semibold tracking-[0.25em] uppercase text-blue-600 mb-4">Keunggulan Tes</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-[1.15]" style={{ color: 'var(--text-primary)' }}>
                Mengapa Tes Ini Berbeda?
              </h2>
            </div>
            
            <div className="space-y-12">
              {[
                { 
                  title: 'Tes Jati Diri Lebih Dalam',
                  text: 'Kami menggabungkan model RIASEC (Holland Codes) untuk minat karir dengan "Vibe MBTI" untuk menangkap gaya kerja dan preferensi interaksi sosialmu secara menyeluruh.'
                },
                { 
                  title: 'Roadmap yang Konkret',
                  text: 'Hasil tes bukan sekadar label. Kami langsung menyambungkannya ke langkah belajar nyata: dari sekolah, sertifikasi, hingga milestone karir pertama.'
                },
                { 
                  title: 'Aman dan Terukur',
                  text: 'Data kamu diolah dengan fokus pada validitas hasil. Struktur data kami dirancang untuk terus berkembang seiring dengan tren industri masa depan.'
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="space-y-3"
                >
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p className="text-[15px] leading-relaxed opacity-45" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── AI Analysis ─── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="photo-overlay absolute inset-0">
          <img 
            src="/images/hero-campus.png" 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[12px] font-semibold tracking-[0.25em] uppercase text-blue-600 mb-4">AI-Powered</p>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>
            Analisis AI Terintegrasi
          </h3>
          <p className="text-[15px] leading-relaxed opacity-45 mb-10" style={{ color: 'var(--text-secondary)' }}>
            Setelah menyelesaikan tes, algoritma AI kami akan melakukan "Interpretasi Mendalam" untuk memberikan saran yang lebih personal:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Kecocokan jurusan kuliah yang spesifik',
              'Lingkungan kerja yang paling produktif',
              'Potensi hambatan dan cara mengatasinya',
              'Rekomendasi mentor atau komunitas terkait'
            ].map((point, idx) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="flex items-start gap-3 py-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <span className="text-[14px] font-medium opacity-70">{point}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 px-6 text-center reveal-on-scroll">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Sudah Siap Menemukan Potensimu?
          </h2>
          <p className="mt-4 opacity-35 text-[15px]" style={{ color: 'var(--text-secondary)' }}>
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
