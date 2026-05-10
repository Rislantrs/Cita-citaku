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
  ChevronRight,
  Loader2,
} from 'lucide-react';
import * as motion from 'motion/react-client';
import SEO from '../components/SEO';
import { fetchDashboardSummary, fetchCareers } from '../lib/api';

const RIASEC_INFO: Record<string, { label: string; emoji: string }> = {
  R: { label: 'Realistic', emoji: '🔧' },
  I: { label: 'Investigative', emoji: '🔬' },
  A: { label: 'Artistic', emoji: '🎨' },
  S: { label: 'Social', emoji: '🤝' },
  E: { label: 'Enterprising', emoji: '💼' },
  C: { label: 'Conventional', emoji: '📊' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [savedRoadmaps, setSavedRoadmaps] = useState<any[]>([]);

  // Progress tracking state
  const [mainTarget, setMainTarget] = useState<any>(null);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [currentPhase, setCurrentPhase] = useState(1);

  // Fetch real data from backend
  useEffect(() => {
    if (!user) { setIsLoading(false); return; }

    async function loadDashboard() {
      try {
        const [summary, careersRes] = await Promise.all([
          fetchDashboardSummary(user!.uid),
          fetchCareers(),
        ]);

        // Quiz result
        if (summary.quizResult) {
          setQuizResult(summary.quizResult);
        }

        // User projects
        setUserProjects(summary.userProjects || []);

        // Determine main target from last career slug or quiz recommendations
        const careers = careersRes.items || [];
        const lastSlug = (summary.user as any)?.progressTracker?.lastCareerSlug;

        if (lastSlug && careers.length > 0) {
          const target = (careers as any[]).find(c => c.slug === lastSlug);
          if (target) {
            const phases = target.roadmap || target.phases || [];
            setMainTarget({
              title: target.title || target.judul,
              slug: target.slug,
              totalPhases: phases.length,
              phases: phases.map((p: any, i: number) => ({
                id: i + 1,
                title: p.judul || p.title || `Fase ${i + 1}`,
              })),
            });
          }
        }

        // Pick some careers as "saved roadmaps" — first 3 from catalog
        if (careers.length > 0) {
          setSavedRoadmaps(
            (careers as any[]).slice(0, 3).map(c => ({
              title: c.title || c.judul,
              slug: c.slug,
              category: c.categoryId || c.idKategori || 'Tech',
            }))
          );
        }
      } catch (err) {
        console.error('[dashboard] Failed to load summary:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [user]);

  // Firestore progress listener for main target
  useEffect(() => {
    if (!user || !mainTarget) return;
    const progressRef = doc(db, 'users', user.uid, 'progress', mainTarget.slug);
    const unsubscribe = onSnapshot(progressRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCompletedPhases(data.completedPhases || []);
        const completed = data.completedPhases || [];
        const maxCompleted = completed.length > 0 ? Math.max(...completed) : 0;
        setCurrentPhase(Math.min(maxCompleted + 1, mainTarget.totalPhases));
      } else {
        setDoc(progressRef, { completedPhases: [] }, { merge: true });
      }
    });
    return () => unsubscribe();
  }, [user, mainTarget]);

  const markPhaseDone = async (phaseId: number) => {
    if (!user || !mainTarget) return;
    const newCompleted = [...completedPhases, phaseId];
    const progressRef = doc(db, 'users', user.uid, 'progress', mainTarget.slug);
    await updateDoc(progressRef, { completedPhases: newCompleted });
  };

  const getPhaseStatus = (id: number) => {
    if (completedPhases.includes(id)) return 'done';
    if (id === currentPhase) return 'current';
    return 'locked';
  };

  // Derive top RIASEC code from quiz
  const topCode = quizResult?.topCodes?.[0] || null;
  const topLabel = topCode ? RIASEC_INFO[topCode]?.label || topCode : null;
  const topScore = topCode && quizResult?.riasecScores ? quizResult.riasecScores[topCode] : 0;
  const completedDate = quizResult?.completedAt
    ? new Date(quizResult.completedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const projectsDone = userProjects.filter(p => p.status === 'completed').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="page-shell max-w-6xl mx-auto px-6 py-16 lg:py-24">
      <SEO
        title="Dasbor Pribadi"
        description="Pantau progres roadmap karir, hasil tes RIASEC, dan target belajarmu di satu dasbor yang fokus dan rapi."
        keywords="dasbor cita-cita, progres karir, target belajar"
      />

      {/* ─── Welcome ─── */}
      <header className="mb-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="section-kicker mb-4">DNA Karir Terakhir</p>
            {topCode ? (
              <>
                <div className="flex items-center gap-5 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-black text-white shadow-lg shadow-blue-600/15">
                    {topCode}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-950">{topLabel}</h3>
                    <p className="text-[13px] text-slate-500">Skor: {topScore}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-[12px] font-semibold text-slate-500">
                  {completedDate && <span>{completedDate}</span>}
                  <Link to="/test?view=result" className="link-underline text-blue-600 flex items-center gap-1">
                    Lihat Hasil <ArrowUpRight size={12} />
                  </Link>
                  <Link to="/test" className="link-underline opacity-50 hover:opacity-100 transition-opacity">
                    Ulangi Tes
                  </Link>
                </div>
              </>
            ) : (
              <div className="surface-card rounded-3xl p-6 text-center">
                <p className="text-sm text-slate-500 mb-4">Kamu belum mengambil Tes RIASEC.</p>
                <Link to="/test" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                  Mulai Tes <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </motion.div>

          <div className="fluid-separator" />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="surface-card rounded-3xl p-5">
              <p className="text-3xl font-black text-slate-950">{savedRoadmaps.length}</p>
              <p className="text-[11px] font-black tracking-widest uppercase text-slate-500 mt-1">Roadmap Tersedia</p>
            </div>
            <div className="surface-card rounded-3xl p-5">
              <p className="text-3xl font-black text-slate-950">{projectsDone}</p>
              <p className="text-[11px] font-black tracking-widest uppercase text-slate-500 mt-1">Proyek Selesai</p>
            </div>
          </div>

          <div className="fluid-separator" />

          {/* Saved Roadmaps */}
          <div>
            <p className="section-kicker mb-5">Roadmap Karir</p>
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
              {savedRoadmaps.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">Belum ada roadmap. <Link to="/roadmap" className="text-blue-600 font-bold">Jelajahi →</Link></p>
              )}
            </div>
          </div>
        </div>

        {/* ─── Right Column: Active Target ─── */}
        <div className="lg:col-span-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            {mainTarget ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                  <div>
                    <p className="section-kicker mb-2">Target Karir Utama</p>
                    <h2 className="text-2xl font-black text-slate-950">{mainTarget.title}</h2>
                  </div>
                  <Link to={`/roadmap/${mainTarget.slug}`} className="text-[13px] font-semibold text-blue-700 flex items-center gap-1">
                    Lanjut Eksplorasi <ArrowUpRight size={14} />
                  </Link>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <p className="text-[13px] font-medium text-slate-600">Checklist Perjalanan</p>
                  <span className="text-[11px] font-semibold text-slate-500">Fase {currentPhase} dari {mainTarget.totalPhases}</span>
                </div>

                <div className="space-y-3">
                  {mainTarget.phases.map((phase: any) => {
                    const status = getPhaseStatus(phase.id);
                    return (
                      <div 
                        key={phase.id} 
                        className={`click-feedback flex items-center justify-between py-4 px-5 rounded-3xl transition-all surface-card ${
                          status === 'current' ? 'shadow-sm' : status === 'done' ? 'opacity-50' : 'opacity-30'
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
              </>
            ) : (
              <div className="text-center py-16 surface-card rounded-3xl px-6">
                <h3 className="text-xl font-black mb-2 text-slate-950">Belum Ada Target Utama</h3>
                <p className="text-[14px] text-slate-600 mb-6 max-w-sm mx-auto">
                  Jelajahi roadmap karir dan pilih target pertamamu untuk mulai melacak progresmu.
                </p>
                <Link 
                  to="/roadmap" 
                  className="click-feedback inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 bg-blue-600 hover:bg-blue-700"
                >
                  Jelajahi Roadmap <ArrowRight size={14} />
                </Link>
              </div>
            )}

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