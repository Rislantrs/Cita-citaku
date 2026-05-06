import React from 'react';
import { RefreshCcw, AlertTriangle, BotOff } from 'lucide-react';
import * as motion from 'motion/react-client';

type ErrorType = 'ai' | 'generic' | '300';

export default function ErrorState({ type = 'generic', onRetry }: { type?: ErrorType, onRetry?: () => void }) {
  const config = {
    ai: {
      icon: <BotOff size={48} />,
      title: 'AI Sedang Istirahat',
      desc: 'Limit kuota AI untuk sesi ini telah habis atau server sedang sibuk. Silakan coba lagi nanti ya!',
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-900/20'
    },
    '300': {
      icon: <AlertTriangle size={48} />,
      title: 'Ada Banyak Pilihan',
      desc: 'Terjadi ambiguitas data (Error 300). Server bingung menentukan roadmap mana yang harus ditampilkan.',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20'
    },
    generic: {
      icon: <AlertTriangle size={48} />,
      title: 'Ups! Ada Masalah',
      desc: 'Terjadi kesalahan sistem yang tidak terduga. Kami sedang berusaha memperbaikinya.',
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    }
  }[type];

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] shadow-xl ${config.bg} ${config.color}`}
      >
        {config.icon}
      </motion.div>

      <h3 className="text-2xl font-black text-slate-900 dark:text-white">{config.title}</h3>
      <p className="mt-3 max-w-sm text-lg font-medium opacity-60" style={{ color: 'var(--text-secondary)' }}>
        {config.desc}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-8 flex items-center gap-2 rounded-2xl bg-slate-950 dark:bg-white dark:text-slate-950 px-8 py-4 font-black text-white transition hover:scale-105"
        >
          <RefreshCcw size={18} />
          Coba Lagi
        </button>
      )}
    </div>
  );
}
