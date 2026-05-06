import React from 'react';
import { Brain } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function Loading({ message = 'Memproses Data', submessage = 'Menganalisis potensimu...' }: { message?: string, submessage?: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="relative mb-8">
        {/* Pulsing Glow Effect */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-8 rounded-full bg-blue-500/20 blur-3xl"
        />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 shadow-xl"
        >
          <Brain size={48} className="animate-pulse" />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">{message}</h2>
        <p className="mt-2 text-sm font-medium text-slate-400">{submessage}</p>
      </motion.div>

      {/* Progress Bar Animation */}
      <div className="mt-10 h-1.5 w-64 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-1/2 bg-blue-600 rounded-full"
        />
      </div>
    </div>
  );
}
