import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Circle,
  ChevronRight
} from 'lucide-react';
import * as motion from 'motion/react-client';
import SEO from '../components/SEO';

export default function Dashboard() {
  const { user } = useAuth();

  // Mock Data
  const lastTestResult = {
    topCode: 'I',
    label: 'Investigative',
    score: 42,
    date: '12 Okt 2026'
  };

  const mainTargetRaw = {
    title: 'Software Engineer',
    slug: 'software-engineer',
    totalPhases: 4,
    phases: [
      { id: 1, title: 'Dasar Pemrograman' },
      { id: 2, title: 'Struktur Data' },
      { id: 3, title: 'Backend Fundamental' },
      { id: 4, title: 'Database & API' },
    ]
  };

  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [currentPhase, setCurrentPhase] = useState(1);

  useEffect(() => {
    if (!user) return;
    const progressRef = doc(db, 'users', user.uid, 'progress', 'software-engineer');
    const unsubscribe = onSnapshot(progressRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCompletedPhases(data.completedPhases || []);
        
        const completed = data.completedPhases || [];
        const maxCompleted = completed.length > 0 ? Math.max(...completed) : 0;
        setCurrentPhase(Math.min(maxCompleted + 1, mainTargetRaw.totalPhases));
      } else {
        setDoc(progressRef, { completedPhases: [] }, { merge: true });
      }
    });
    return () => unsubscribe();
  }, [user]);

  const markPhaseDone = async (phaseId: number) => {
    if (!user) return;
    const newCompleted = [...completedPhases, phaseId];
    const progressRef = doc(db, 'users', user.uid, 'progress', 'software-engineer');
    await updateDoc(progressRef, {
      completedPhases: newCompleted
    });
  };

  const getPhaseStatus = (id: number) => {
    if (completedPhases.includes(id)) return 'done';
    if (id === currentPhase) return 'current';
    return 'locked';
  };

  const savedRoadmaps = [
    { title: 'AI Engineer', slug: 'ai-engineer', category: 'Tech' },
    { title: 'Data Analyst', slug: 'data-analyst', category: 'Data' }
  ];

  return (
    <div className="page-shell max-w-6xl mx-auto px-6 py-16 lg:py-24">
      <SEO
        title="Dasbor Pribadi"
        description="Pantau progres roadmap karir, hasil tes RIASEC, dan target belajarmu di satu dasbor yang fokus dan rapi."
        keywords="dasbor cita-cita, progres karir, target belajar"
      />

      {/* ─── Welcome ─── */}
      <header className="mb-16 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="section-kicker mb-3">Dasbor Pribadi</p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-[-0.04em] text-slate-950">
            Halo, <span className="text-blue-600">{user?.displayName || 'Sahabat Cita'}</span>
          </h1>
          <p className="section-copy mt-3 text-[15px]">
            Fokus, pelajari, dan raih karir impianmu langkah demi langkah.
          </p>
        </motion.div>
      </header>

      <div className="grid gap-8 lg:grid-cols-5">
        
        {/* ─── Left Column ─── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* DNA Result */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="section-kicker mb-4">DNA Karir Terakhir</p>
            <div className="flex items-center gap-5 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-black text-white shadow-lg shadow-blue-600/15">
                {lastTestResult.topCode}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">{lastTestResult.label}</h3>
                <p className="text-[13px] text-slate-500">Skor: {lastTestResult.score}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-[12px] font-semibold text-slate-500">
              <span>{lastTestResult.date}</span>
              <Link to="/test?view=result" className="link-underline text-blue-600 flex items-center gap-1">
                Lihat Hasil <ArrowUpRight size={12} />
              </Link>
              <Link to="/test" className="link-underline opacity-50 hover:opacity-100 transition-opacity">
                Ulangi Tes
              </Link>
            </div>
          </motion.div>

          <div className="fluid-separator" />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="surface-card rounded-3xl p-5">
              <p className="text-3xl font-black text-slate-950">3</p>
              <p className="text-[11px] font-black tracking-widest uppercase text-slate-500 mt-1">Roadmap Disimpan</p>
            </div>
            <div className="surface-card rounded-3xl p-5">
              <p className="text-3xl font-black text-slate-950">1</p>
              <p className="text-[11px] font-black tracking-widest uppercase text-slate-500 mt-1">Proyek Selesai</p>
            </div>
          </div>

          <div className="fluid-separator" />

          {/* Saved Roadmaps */}
          <div>
            <p className="section-kicker mb-5">Disimpan Lainnya</p>
            <div className="space-y-3">
              {savedRoadmaps.map((rm) => (
                <Link 
                  key={rm.slug} 
                  to={`/roadmap/${rm.slug}`} 
                  className="hover-glow click-feedback flex items-center justify-between py-4 px-5 rounded-3xl transition-all group surface-card"
                  style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
                >
                  <div>
                    <h4 className="font-black group-hover:text-blue-700 transition-colors" style={{ color: 'var(--text-primary)' }}>{rm.title}</h4>
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">{rm.category}</span>
                  </div>
                  <ChevronRight size={16} className="opacity-20 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Right Column: Active Target ─── */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {/* Target Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
              <div>
                <p className="section-kicker mb-2">Target Karir Utama</p>
                <h2 className="text-2xl font-black text-slate-950">{mainTargetRaw.title}</h2>
              </div>
              <Link 
                to={`/roadmap/${mainTargetRaw.slug}`} 
                className="text-[13px] font-semibold text-blue-700 flex items-center gap-1"
              >
                Lanjut Eksplorasi <ArrowUpRight size={14} />
              </Link>
            </div>

            {/* Phase indicator */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[13px] font-medium text-slate-600">Checklist Perjalanan</p>
              <span className="text-[11px] font-semibold text-slate-500">Fase {currentPhase} dari {mainTargetRaw.totalPhases}</span>
            </div>

            {/* Phases */}
            <div className="space-y-3">
              {mainTargetRaw.phases.map((phase) => {
                const status = getPhaseStatus(phase.id);
                return (
                  <div 
                    key={phase.id} 
                      className={`click-feedback flex items-center justify-between py-4 px-5 rounded-3xl transition-all surface-card ${
                      status === 'current' 
                        ? 'shadow-sm' 
                        : status === 'done' 
                        ? 'opacity-50' 
                        : 'opacity-30'
                    }`}
                    style={{ 
                      backgroundColor: status === 'current' ? 'rgba(37,99,235,0.04)' : 'transparent',
                      border: status === 'current' ? '1px solid rgba(37,99,235,0.12)' : '1px solid var(--border-color)'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {status === 'done' 
                        ? <CheckCircle2 className="text-emerald-500" size={18}/> 
                        : status === 'current' 
                        ? <Circle className="text-blue-500" size={18}/> 
                        : <Circle className="opacity-30" size={18}/>
                      }
                      <span className={`font-semibold text-[15px] ${status === 'current' ? 'text-blue-700' : 'text-slate-700'}`}>
                        {phase.title}
                      </span>
                    </div>
                    {status === 'current' && (
                      <button 
                        onClick={() => markPhaseDone(phase.id)} 
                        className="click-feedback text-[11px] font-semibold tracking-wider uppercase bg-slate-950 text-white px-4 py-2 rounded-full transition-all hover:shadow-md hover:-translate-y-0.5 hover:bg-blue-700"
                      >
                        Tandai Selesai
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            
            <p className="mt-8 text-center text-[12px] text-slate-500 font-medium">
              Tracker ini berfungsi sebagai catatan pribadi Anda agar tidak lupa batas materi yang sedang dipelajari.
            </p>

            <div className="fluid-separator mt-12 mb-12" />

            {/* AI Counselor CTA */}
            <div className="text-center py-8 surface-card rounded-3xl px-6">
              <h3 className="text-xl font-black mb-2 text-slate-950">Butuh Teman Diskusi?</h3>
              <p className="text-[14px] text-slate-600 mb-6 max-w-sm mx-auto">
                Ceritakan kendala belajarmu, Konselor AI siap memberi saran yang personal.
              </p>
              <Link 
                to="/counselor" 
                className="click-feedback inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 bg-slate-950 hover:bg-blue-700"
              >
                Mulai Sesi Konseling <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}