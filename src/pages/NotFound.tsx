import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, Map, Search } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-12"
      >
        <h1 className="text-[12rem] font-black leading-none text-slate-100 dark:text-slate-900 sm:text-[20rem]">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-blue-600 text-white shadow-2xl shadow-blue-600/40"
          >
            <Search size={64} strokeWidth={3} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-md space-y-6"
      >
        <h2 className="text-4xl font-black text-slate-900 dark:text-white">Jalur Tidak Ditemukan.</h2>
        <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
          Sepertinya roadmap yang kamu cari belum terdaftar atau halamannya sudah berpindah lokasi.
        </p>

        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:justify-center">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 dark:bg-white dark:text-slate-950 px-8 py-4 font-black text-white transition hover:-translate-y-1 shadow-xl"
          >
            <Home size={18} />
            Kembali ke Beranda
          </Link>
          <Link 
            to="/roadmap" 
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 px-8 py-4 font-black text-slate-900 dark:text-white transition hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <Compass size={18} />
            Eksplor Karir
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
