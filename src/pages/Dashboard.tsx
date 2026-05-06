import { useAuth } from '../lib/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Layout, 
  Target, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  Trophy, 
  BookOpen, 
  Brain,
  ArrowUpRight,
  Settings
} from 'lucide-react';
import * as motion from 'motion/react-client';

export default function Dashboard() {
  const { user } = useAuth();

  // Mock Data - Later this will come from Supabase/Firebase
  const lastTestResult = {
    topCode: 'I',
    label: 'Investigative',
    score: 42,
    date: '12 Okt 2026'
  };

  const activeRoadmaps = [
    {
      title: 'Software Engineer',
      progress: 65,
      lastModule: 'Fundamental Go',
      slug: 'software-engineer'
    },
    {
      title: 'AI Engineer',
      progress: 20,
      lastModule: 'Python for Data Science',
      slug: 'ai-engineer'
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      {/* Welcome Section */}
      <header className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Halo, <span className="text-blue-600">{user?.displayName || 'Sahabat Cita'}!</span> 👋
          </h1>
          <p className="mt-2 opacity-60 font-medium" style={{ color: 'var(--text-secondary)' }}>Ini adalah progres perjalananmu menuju karir impian.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl theme-card transition hover:bg-slate-50/10">
            <Settings size={20} className="opacity-50" />
          </button>
          <Link 
            to="/roadmap" 
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-black text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Layout size={18} />
            Eksplor Baru
          </Link>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Stats & DNA */}
        <div className="space-y-8 lg:col-span-1">
          {/* DNA Result Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 text-blue-500">
              <Brain size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-blue-400 mb-6">
                <Sparkles size={18} />
                <span className="text-xs font-black uppercase tracking-widest">DNA Karir Terakhir</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl font-black">
                  {lastTestResult.topCode}
                </div>
                <div>
                  <h3 className="text-2xl font-black">{lastTestResult.label}</h3>
                  <p className="text-sm text-slate-400">Skor: {lastTestResult.score}</p>
                </div>
              </div>
              <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-between">
                <span className="text-xs text-slate-500">{lastTestResult.date}</span>
                <Link to="/test" className="text-xs font-black uppercase tracking-widest text-blue-400 hover:underline flex items-center gap-1">
                  Ulangi Tes <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl theme-card p-6 shadow-sm">
              <Trophy size={24} className="text-yellow-500 mb-4" />
              <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>12</p>
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Skill Baru</p>
            </div>
            <div className="rounded-3xl theme-card p-6 shadow-sm">
              <Clock size={24} className="text-blue-500 mb-4" />
              <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>42j</p>
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Waktu Belajar</p>
            </div>
          </div>
        </div>

        {/* Right Column: Active Roadmaps */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Target size={24} className="text-blue-600" />
              Roadmap Aktif
            </h2>
          </div>

          <div className="grid gap-6">
            {activeRoadmaps.map((roadmap, idx) => (
              <motion.div
                key={roadmap.slug}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-[2.5rem] theme-card p-8 transition-all hover:border-blue-100 hover:shadow-xl"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black group-hover:text-blue-600 transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {roadmap.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm opacity-60">
                      <BookOpen size={16} />
                      Terakhir: <span className="font-bold">{roadmap.lastModule}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{roadmap.progress}%</p>
                      <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Selesai</p>
                    </div>
                    <Link 
                      to={`/roadmap/${roadmap.slug}`}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50/50 text-slate-400 transition-all group-hover:bg-blue-600 group-hover:text-white"
                    >
                      <ChevronRight size={24} />
                    </Link>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-slate-50/20">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${roadmap.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-blue-600"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Activity Suggestion */}
          <div className="rounded-[2.5rem] p-10 border theme-border text-center lg:text-left" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
              <div className="max-w-md space-y-2">
                <h3 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>Lanjutkan Belajar?</h3>
                <p className="opacity-60 leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Modul <span className="text-blue-600 font-bold">Advanced Machine Learning</span> sudah tersedia untuk kamu pelajari hari ini.
                </p>
              </div>
              <button className="flex items-center gap-3 rounded-2xl bg-blue-600 px-10 py-5 text-lg font-black text-white shadow-xl shadow-blue-600/30 transition hover:bg-blue-700">
                Lanjut Sekarang
                <ArrowUpRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}