import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, Map, Search } from 'lucide-react';
import * as motion from 'motion/react-client';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <SEO
        title="404 — Halaman Tidak Ditemukan"
        description="Halaman yang kamu cari belum tersedia. Kembali ke beranda atau eksplor jalur karir lainnya."
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-12"
      >
        <h1 className="text-[10rem] sm:text-[16rem] font-black leading-none text-slate-200/70">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/25"
          >
            <Search size={64} strokeWidth={3} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="surface-card max-w-md space-y-6 rounded-4xl p-8"
      >
        <h2 className="text-4xl font-black text-slate-950">Jalur Tidak Ditemukan.</h2>
        <p className="text-lg font-medium text-slate-600">
          Sepertinya roadmap yang kamu cari belum terdaftar atau halamannya sudah berpindah lokasi.
        </p>

        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:justify-center">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-8 py-4 font-black text-white transition hover:-translate-y-1 shadow-xl hover:bg-blue-700"
          >
            <Home size={18} />
            Kembali ke Beranda
          </Link>
          <Link 
            to="/roadmap" 
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-8 py-4 font-black text-slate-900 transition hover:-translate-y-1 hover:bg-white"
          >
            <Compass size={18} />
            Eksplor Karir
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
