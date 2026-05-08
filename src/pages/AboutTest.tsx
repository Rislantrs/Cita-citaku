import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import SEO from "../components/SEO";

export default function AboutTest() {

  // Scroll reveal logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col bg-white">
      <SEO 
        title="Tentang Tes Jati Diri"
        description="Pelajari metodologi ilmiah RIASEC dan MBTI yang kami gunakan untuk membantu kamu menemukan karir impian."
        url="https://cita-citaku.id/about-test"
      />

      {/* ─── Hero (Minimalist & Harmonious) ─── */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-100/50 rounded-full blur-[120px] -mr-40 -mt-40" />
        
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-20 relative z-10">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-slate-400 text-[11px] font-bold tracking-[0.4em] uppercase mb-8"
            >
              Metodologi Psikometrik
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black leading-[1.1] tracking-tight text-slate-900 mb-10"
            >
              Arah Masa Depan, <br />
              <span className="text-blue-700/80">Sesuai Jati Dirimu.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 leading-relaxed max-w-xl mb-14 font-medium"
            >
              Bukan sekadar kuis biasa. Kami menggunakan metodologi ilmiah untuk memetakan minat,
              potensi, dan jalur karir yang paling relevan dengan kepribadian unikmu.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/test"
                className="group inline-flex items-center gap-5 bg-slate-900 px-14 py-6 text-lg font-bold text-white transition-all hover:bg-blue-800 active:scale-95 shadow-2xl shadow-slate-900/10"
              >
                Mulai Tes Sekarang
                <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          <div className="flex-1 hidden lg:block">
            <div className="relative">
               <div className="absolute -inset-4 border border-slate-100 rounded-[3.5rem] -rotate-3" />
               <img
                 src="/images/hero-student.png"
                 alt=""
                 className="relative z-10 w-full h-auto rounded-[3rem] grayscale-[0.5] opacity-90"
               />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats (Subtle) ─── */}
      <section className="py-20 px-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between gap-16">
          {[
            { label: 'Metodologi', value: 'RIASEC + MBTI' },
            { label: 'Jumlah Soal', value: '42 Pertanyaan' },
            { label: 'Estimasi', value: '10 Menit' },
            { label: 'Analisis', value: 'AI Interpretation' },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-2"
            >
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">{item.label}</p>
              <p className="text-2xl font-black text-slate-800">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Details (Clean Typography) ─── */}
      <section className="py-40 px-6 bg-white reveal-on-scroll">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-24 lg:grid-cols-[1fr_1.5fr] items-start">
            <div className="lg:sticky lg:top-40">
              <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-8">
                Mengapa Kami <br /> Berbeda?
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Kami tidak hanya memberi label, tapi memberikan peta jalan yang bisa kamu eksekusi hari ini juga.
              </p>
            </div>

            <div className="space-y-24">
              {[
                {
                  title: 'Akurasi Psikometrik',
                  text: 'Menggabungkan model RIASEC untuk minat karir dengan elemen MBTI untuk menangkap gaya kerja dan preferensi interaksi sosialmu.'
                },
                {
                  title: 'Roadmap yang Konkret',
                  text: 'Hasil tes langsung dihubungkan dengan data industri terbaru, kurikulum belajar, dan sertifikasi yang sedang dicari perusahaan.'
                },
              ].map((item, idx) => (
                <div key={item.title} className="space-y-6">
                  <span className="text-5xl font-black text-slate-50 block opacity-10">0{idx + 1}</span>
                  <h3 className="text-2xl font-black text-slate-900">{item.title}</h3>
                  <p className="text-lg leading-relaxed text-slate-600 font-medium">{item.text}</p>
                  <div className="w-16 h-1 bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── AI Section (Muted Dark) ─── */}
      <section className="py-40 px-6 bg-slate-50 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1">
             <img src="/images/hero-campus.png" alt="" className="w-full h-auto rounded-[3rem] grayscale opacity-60" />
          </div>
          <div className="flex-1 space-y-12">
            <div>
              <p className="text-slate-400 text-[11px] font-bold tracking-[0.4em] uppercase mb-6">AI Interpretation</p>
              <h2 className="text-4xl font-black tracking-tight text-slate-900">Analisis Mendalam.</h2>
            </div>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              Algoritma AI kami menganalisis kecocokan jurusan kuliah, lingkungan kerja produktif, hingga potensi hambatan karirmu secara presisi.
            </p>
            <div className="grid gap-5">
              {[
                'Kecocokan jurusan kuliah spesifik',
                'Lingkungan kerja produktif',
                'Rekomendasi mentor & komunitas'
              ].map((point) => (
                <div key={point} className="flex items-center gap-5 text-slate-700 font-bold">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA (Refined) ─── */}
      <section className="py-40 px-6 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 mb-10">
            Mulai Masa Depanmu.
          </h2>
          <p className="text-xl text-slate-500 font-medium mb-16">
            Hanya butuh 10 menit untuk mendapatkan kejelasan langkahmu.
          </p>
          <Link
            to="/test"
            className="inline-flex items-center gap-5 rounded-full bg-slate-900 px-16 py-7 text-xl font-bold text-white transition-all hover:bg-blue-900 hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/10"
          >
            Mulai Sekarang
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </div>
  );
}
