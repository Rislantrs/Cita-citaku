import { useAuth } from '../lib/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Layout, 
  Target, 
  Sparkles, 
  ChevronRight, 
  Trophy, 
  BookOpen, 
  Brain,
  ArrowUpRight,
  Settings,
  Bookmark,
  MessageSquareQuote,
  CheckCircle2,
  Circle
} from 'lucide-react';
import * as motion from 'motion/react-client';

export default function Dashboard() {
  const { user } = useAuth();

  // Mock Data
  const lastTestResult = {
    topCode: 'I',
    label: 'Investigative',
    score: 42,
    date: '12 Okt 2026'
  };

  const mainTarget = {
    title: 'Software Engineer',
    slug: 'software-engineer',
    currentPhase: 3,
    totalPhases: 6,
    phases: [
      { id: 1, title: 'Dasar Pemrograman', status: 'done' },
      { id: 2, title: 'Struktur Data', status: 'done' },
      { id: 3, title: 'Backend Fundamental', status: 'current' },
      { id: 4, title: 'Database & API', status: 'locked' },
    ]
  };

  const savedRoadmaps = [
    { title: 'AI Engineer', slug: 'ai-engineer', category: 'Tech' },
    { title: 'Data Analyst', slug: 'data-analyst', category: 'Data' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      {/* Welcome Section */}
      <header className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Halo, <span className="text-blue-600">{user?.displayName || 'Sahabat Cita'}!</span> 👋
          </h1>
          <p className="mt-2 opacity-60 font-medium" style={{ color: 'var(--text-secondary)' }}>Fokus, pelajari, dan raih karir impianmu langkah demi langkah.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl theme-card transition hover:bg-slate-50/10 shadow-sm border border-slate-100">
            <Settings size={20} className="text-slate-400" />
          </button>
          <Link 
            to="/roadmap" 
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-black text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Layout size={18} />
            Eksplor Profesi
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
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl font-black shadow-lg shadow-blue-600/30">
                  {lastTestResult.topCode}
                </div>
                <div>
                  <h3 className="text-2xl font-black">{lastTestResult.label}</h3>
                  <p className="text-sm text-slate-400">Skor: {lastTestResult.score}</p>
                </div>
              </div>
              <div className="mt-8 border-t border-white/10 pt-6 flex items-center justify-between">
                <span className="text-xs text-slate-500">{lastTestResult.date}</span>
                <div className="flex items-center gap-4">
                  <Link to="/test?view=result" className="text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                    Lihat Hasil <ArrowUpRight size={14} />
                  </Link>
                  <Link to="/test" className="text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                    Ulangi Tes
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl theme-card p-6 shadow-sm border border-slate-100 bg-white">
              <Bookmark size={24} className="text-blue-500 mb-4" />
              <p className="text-2xl font-black text-slate-900">3</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Roadmap Disimpan</p>
            </div>
            <div className="rounded-3xl theme-card p-6 shadow-sm border border-slate-100 bg-white">
              <Trophy size={24} className="text-amber-500 mb-4" />
              <p className="text-2xl font-black text-slate-900">1</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Proyek Selesai</p>
            </div>
          </div>
        </div>

        {/* Right Column: Active Target & Saved */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Target Karir Utama (Manual Tracker) */}
          <div className="rounded-[2.5rem] bg-white p-8 shadow-sm relative overflow-hidden group border border-slate-100 transition-all">
             <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10 gap-4">
                <div className="flex items-center gap-4">
                   <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Target size={28}/>
                   </div>
                   <div>
                      <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Target Karir Utama</h2>
                      <h3 className="text-2xl font-black text-slate-900 leading-none">{mainTarget.title}</h3>
                   </div>
                </div>
                <Link to={`/roadmap/${mainTarget.slug}`} className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 bg-blue-50 px-4 py-2 rounded-xl transition-colors">
                   Lanjut Eksplorasi <ArrowUpRight size={16}/>
                </Link>
             </div>

             <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-slate-500">Checklist Perjalanan</p>
                  <span className="text-xs font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full">Fase {mainTarget.currentPhase} dari {mainTarget.totalPhases}</span>
                </div>
                <div className="grid gap-3">
                   {mainTarget.phases.map((phase) => (
                      <div key={phase.id} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${phase.status === 'current' ? 'bg-blue-50 border border-blue-200 shadow-sm' : phase.status === 'done' ? 'bg-slate-50/50 border border-transparent opacity-60' : 'bg-white border border-slate-100 opacity-50'}`}>
                         <div className="flex items-center gap-4">
                            {phase.status === 'done' ? <CheckCircle2 className="text-emerald-500" size={20}/> : phase.status === 'current' ? <Circle className="text-blue-500 fill-blue-500/20" size={20}/> : <Circle className="text-slate-300" size={20}/>}
                            <span className={`font-bold ${phase.status === 'current' ? 'text-blue-900' : 'text-slate-700'}`}>{phase.title}</span>
                         </div>
                         {phase.status === 'current' && (
                            <button className="text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md transition-all active:scale-95">Tandai Selesai</button>
                         )}
                      </div>
                   ))}
                </div>
                <div className="mt-6 text-center border-t border-slate-100 pt-6">
                   <p className="text-xs font-bold text-slate-400">Tracker ini berfungsi sebagai catatan pribadi Anda agar tidak lupa batas materi yang sedang dipelajari secara mandiri.</p>
                </div>
             </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
             {/* Saved Roadmaps */}
             <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h2 className="text-lg font-black flex items-center gap-2 text-slate-900">
                     <Bookmark size={18} className="text-blue-600" />
                     Disimpan Lainnya
                   </h2>
                </div>
                <div className="grid gap-3">
                   {savedRoadmaps.map((rm) => (
                      <Link key={rm.slug} to={`/roadmap/${rm.slug}`} className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group">
                         <div>
                            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{rm.title}</h4>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 block">{rm.category}</span>
                         </div>
                         <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                            <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all"/>
                         </div>
                      </Link>
                   ))}
                </div>
             </div>

             {/* AI Counselor Banner */}
             <div className="rounded-3xl bg-indigo-50 border border-indigo-100 p-8 flex flex-col justify-center text-center group hover:bg-indigo-100 transition-all relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5">
                   <MessageSquareQuote size={120} className="text-indigo-900"/>
                </div>
                <div className="relative z-10 flex flex-col items-center">
                   <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                      <Brain size={24}/>
                   </div>
                   <h3 className="font-black text-indigo-950 text-xl mb-2">Butuh Teman Diskusi?</h3>
                   <p className="text-sm font-medium text-indigo-800/70 mb-6">Ceritakan kendala belajarmu, Konselor AI siap memberi saran yang personal.</p>
                   <Link to="/counselor" className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all text-sm w-full border border-indigo-100">Mulai Sesi Konseling</Link>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}