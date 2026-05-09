import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import * as motion from 'motion/react-client';
import { useAuth } from '../lib/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ArrowLeft, Sparkles, Brain, Bot, CheckCircle2, Target, Trophy, ArrowRight, LibraryBig } from 'lucide-react';
import { saveQuizResult } from '../lib/api';
import { careerCatalog } from '../lib/careerCatalog';
import { usePersistedState, clearPersistedKey } from '../lib/usePersistedState';
import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';

type RiasecCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

const QUESTIONS = [
  { id: 1, text: 'Saya suka membongkar, memperbaiki, atau merakit barang.', category: 'R' },
  { id: 2, text: 'Saya nyaman menganalisis data, pola, dan logika yang rumit.', category: 'I' },
  { id: 3, text: 'Saya menikmati membuat ide visual, tulisan, musik, atau konsep baru.', category: 'A' },
  { id: 4, text: 'Saya senang membantu orang lain memahami masalah mereka.', category: 'S' },
  { id: 5, text: 'Saya tertarik memimpin tim, memulai proyek, atau mempengaruhi keputusan.', category: 'E' },
  { id: 6, text: 'Saya rapi saat menyusun jadwal, file, angka, atau administrasi.', category: 'C' },
  { id: 7, text: 'Saya lebih suka aktivitas lapangan dan pekerjaan yang melibatkan alat atau mesin.', category: 'R' },
  { id: 8, text: 'Saya suka bertanya mengapa sesuatu bekerja seperti itu.', category: 'I' },
  { id: 9, text: 'Saya merasa hidup ketika bisa mengekspresikan ide secara bebas.', category: 'A' },
  { id: 10, text: 'Saya sabar mendengarkan teman yang sedang butuh dukungan.', category: 'S' },
  { id: 11, text: 'Saya suka mengejar target, menjual ide, atau membuat sesuatu tumbuh.', category: 'E' },
  { id: 12, text: 'Saya suka mengikuti prosedur yang jelas dan hasil yang rapi.', category: 'C' },
];

const RIASEC_INFO: Record<string, { label: string; desc: string }> = {
  R: { label: 'Realistic', desc: 'Suka bekerja dengan tangan, alat, mesin, dan aktivitas fisik.' },
  I: { label: 'Investigative', desc: 'Suka riset, analisis, eksperimen, dan memecahkan masalah kompleks.' },
  A: { label: 'Artistic', desc: 'Suka ekspresi kreatif, seni, musik, dan bekerja tanpa aturan kaku.' },
  S: { label: 'Social', desc: 'Suka membantu, mengajar, menyembuhkan, dan melayani sesama.' },
  E: { label: 'Enterprising', desc: 'Suka memimpin, mempengaruhi, menjual ide, dan mencapai target.' },
  C: { label: 'Conventional', desc: 'Suka keteraturan, data akurat, detail, dan prosedur sistematis.' },
};

export default function TestRIASEC() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const isResultView = searchParams.get('view') === 'result';

  const initialScores = isResultView
    ? { R: 2, I: 8, A: 6, S: 4, E: 5, C: 3 }
    : { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  const [currentIndex, setCurrentIndex] = usePersistedState<number>(
    isResultView ? 'test:idx-result' : 'test:idx',
    0
  );
  const [scores, setScores] = usePersistedState<Record<string, number>>(
    isResultView ? 'test:scores-result' : 'test:scores',
    initialScores
  );
  const [finished, setFinished] = useState(isResultView);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dynamicCareers, setDynamicCareers] = useState<any[]>(careerCatalog);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (finished) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [finished]);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await fetch('/api/careers');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setDynamicCareers(data);
      } catch (err) {
        console.warn("Failed to fetch dynamic careers, using static fallback", err);
      }
    };
    fetchCareers();
  }, []);

  const progress = Math.round((currentIndex / QUESTIONS.length) * 100);

  const answer = (weight: number) => {
    const q = QUESTIONS[currentIndex];
    setScores(prev => ({ ...prev, [q.category]: (prev[q.category] || 0) + weight }));

    if (currentIndex + 1 === QUESTIONS.length) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const sortedScores = useMemo(() => 
    Object.entries(scores).sort((a, b) => b[1] - a[1]), [scores]
  );
  
  const top3 = sortedScores.slice(0, 3);

  const fetchAnalysis = async () => {
    if (aiAnalysis || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-riasec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores })
      });
      const data = await res.json();
      if (data) setAiAnalysis(data);
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (finished) fetchAnalysis();
  }, [finished]);

  // Radar Chart Config
  const size = 300;
  const center = size / 2;
  const radius = size * 0.4;
  const riasecOrder = ['R', 'I', 'A', 'S', 'E', 'C'];
  const maxPossibleScore = 8;

  const radarPoints = riasecOrder.map((type, i) => {
    const score = scores[type];
    const angle = (i * 60 - 90) * (Math.PI / 180);
    const r = Math.min((score / maxPossibleScore) * radius, radius);
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 25) * Math.cos(angle),
      labelY: center + (radius + 25) * Math.sin(angle),
    };
  });

  const polygonPath = radarPoints.map(p => `${p.x},${p.y}`).join(' ');

  if (finished) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <SEO
          title="Hasil Tes RIASEC"
          description="Visualisasi profil RIASEC kamu beserta rekomendasi karir yang paling cocok berdasarkan tiga kode dominan."
          keywords="hasil riasec, profil karir, rekomendasi cita-cita"
        />
        {showConfetti && (
          <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  y: -10, 
                  x: Math.random() * window.innerWidth,
                  scale: Math.random() * 0.5 + 0.5,
                  rotate: 0 
                }}
                animate={{ 
                  y: window.innerHeight + 10,
                  rotate: 360,
                  opacity: 0
                }}
                transition={{ 
                  duration: Math.random() * 2 + 1,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
                className="absolute h-3 w-3 rounded-full"
                style={{ 
                  backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)] 
                }}
              />
            ))}
          </div>
        )}

        <header className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-blue-600 mb-6"
            style={{ backgroundColor: 'rgba(var(--accent-blue), 0.1)' }}
          >
            <Sparkles size={16} />
            <span>DNA Karir Terdeteksi</span>
          </motion.div>
          <h1 className="text-4xl font-black sm:text-6xl tracking-tight" style={{ color: 'var(--text-primary)' }}>Hasil Jati Dirimu.</h1>
        </header>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[3rem] theme-card p-10 shadow-sm flex flex-col items-center"
            >
              <div className="relative h-[300px] w-[300px]">
                <svg width={size} height={size} className="overflow-visible">
                  {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
                    <polygon
                      key={scale}
                      points={riasecOrder.map((_, i) => {
                        const angle = (i * 60 - 90) * (Math.PI / 180);
                        const r = radius * scale;
                        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                      }).join(' ')}
                      className="fill-none stroke-current opacity-10"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  ))}
                  <motion.polygon
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.5, scale: 1 }}
                    points={polygonPath}
                    className="fill-blue-600/60 stroke-blue-500"
                    strokeWidth="2"
                  />
                  {radarPoints.map((p, i) => (
                    <text key={i} x={p.labelX} y={p.labelY} textAnchor="middle" className="text-[10px] font-black" style={{ fill: 'var(--text-secondary)' }}>
                      {riasecOrder[i]}
                    </text>
                  ))}
                </svg>
              </div>
              <div className="mt-12 grid w-full grid-cols-3 gap-4">
                {top3.map(([type, score]) => (
                  <div key={type} className="rounded-2xl p-4 text-center border theme-border" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40" style={{ color: 'var(--text-secondary)' }}>{type}</p>
                    <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{score}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-3">
              {top3.map(([type], idx) => (
                <motion.div 
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-3xl theme-card p-6 shadow-sm border"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-black text-white">{type}</div>
                  <h3 className="font-black" style={{ color: 'var(--text-primary)' }}>{RIASEC_INFO[type].label}</h3>
                  <p className="mt-2 text-[10px] leading-relaxed opacity-60" style={{ color: 'var(--text-secondary)' }}>{RIASEC_INFO[type].desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[3rem] border p-10 backdrop-blur-xl shadow-sm"
              style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderColor: 'var(--border-color)',
                boxShadow: '0 0 40px rgba(37, 99, 235, 0.03)'
              }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                  <Bot size={24} />
                </div>
                <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Analisis AI</h2>
              </div>

              <div className="space-y-8">
                {isAnalyzing ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-200/50 rounded-full w-full"></div>
                    <div className="h-4 bg-slate-200/50 rounded-full w-5/6"></div>
                    <div className="h-32 bg-slate-200/50 rounded-[2rem] w-full"></div>
                  </div>
                ) : aiAnalysis ? (
                  <div className="space-y-8">
                    <div className="prose prose-slate dark:prose-invert max-w-none text-lg font-medium leading-relaxed opacity-80">
                      <ReactMarkdown>
                        {aiAnalysis.summary}
                      </ReactMarkdown>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl theme-card p-6 shadow-sm border border-emerald-500/10" style={{ backgroundColor: 'rgba(16, 185, 129, 0.02)' }}>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-3 flex items-center gap-2">
                          <CheckCircle2 size={14} /> Kekuatan
                        </h4>
                        <ul className="space-y-2 text-sm font-bold opacity-70">
                          {aiAnalysis.strengths?.map((s: string) => (
                            <li key={s} className="flex items-start gap-2">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" /> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl theme-card p-6 shadow-sm border border-rose-500/10" style={{ backgroundColor: 'rgba(239, 68, 68, 0.02)' }}>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-3 flex items-center gap-2">
                          <Target size={14} /> Tantangan
                        </h4>
                        <ul className="space-y-2 text-sm font-bold opacity-70">
                          {aiAnalysis.challenges?.map((c: string) => (
                            <li key={c} className="flex items-start gap-2">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-500" /> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-lg font-medium leading-relaxed opacity-80">
                    Kamu memiliki profil dominan <span className="text-blue-600 font-black">{RIASEC_INFO[top3[0][0]].label}</span>. 
                    Klik "Ulangi Tes" jika ingin menyegarkan analisis.
                  </p>
                )}
              </div>
            </motion.div>

            <div className="space-y-6">
              <h3 className="text-xl font-black flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Trophy size={20} className="text-yellow-500" /> Karir Rekomendasi
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {(aiAnalysis?.recommendations && Array.isArray(aiAnalysis.recommendations)
                  ? aiAnalysis.recommendations.map((rec: any) => {
                      const career = dynamicCareers.find(c => c.slug === rec.slug);
                      if (!career) return null;
                      return { ...career, matchScore: rec.matchScore };
                    }).filter(Boolean)
                  : dynamicCareers.slice(0, 4).map(c => ({ ...c, matchScore: 98 }))
                ).map((career: any) => (
                  <Link 
                    key={career.slug}
                    to={`/roadmap/${career.slug}`}
                    className="theme-card group flex items-center gap-4 rounded-3xl p-5 transition-all hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-600/10"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                      <ArrowRight size={20} />
                    </div>
                    <div>
                      <h4 className="font-black group-hover:text-blue-600 transition-colors" style={{ color: 'var(--text-primary)' }}>{career.title}</h4>
                      <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Cocok {career.matchScore}%</p>
                    </div>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => {
                  clearPersistedKey('test:idx');
                  clearPersistedKey('test:scores');
                  window.location.href = '/test';
                }}
                className="w-full rounded-2xl bg-blue-600 py-5 font-black text-white transition hover:bg-blue-700 shadow-xl shadow-blue-600/20"
              >
                Ulangi Tes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <SEO
        title="Tes Jati Diri RIASEC"
        description="Kuis psikometrik singkat untuk memetakan minat dan gaya kerjamu lewat enam dimensi RIASEC. Hasil instan, tanpa registrasi panjang."
        keywords="tes riasec, kuis kepribadian karir, jati diri, holland code"
      />
      <div className="mb-12 flex items-center justify-between">
        <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Tes Jati Diri</h2>
        <div className="rounded-full bg-slate-950 px-4 py-1 text-xs font-black text-white">
          {currentIndex + 1} / {QUESTIONS.length}
        </div>
      </div>

      <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-slate-100/20">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-blue-600"
        />
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[3rem] theme-card p-12 shadow-sm text-center"
      >
        <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">Kategori: {QUESTIONS[currentIndex].category}</span>
        <h3 className="mt-8 text-3xl font-black leading-tight sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
          "{QUESTIONS[currentIndex].text}"
        </h3>
        
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-5">
          {[
            { l: 'Sangat Tidak Setuju', v: 0, c: 'hover:bg-rose-500/20 text-rose-500 border-rose-500/20' },
            { l: 'Tidak Setuju', v: 1, c: 'hover:bg-orange-500/20 text-orange-500 border-orange-500/20' },
            { l: 'Netral', v: 2, c: 'hover:bg-slate-500/20 text-slate-400 border-slate-500/20' },
            { l: 'Setuju', v: 3, c: 'hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/20' },
            { l: 'Sangat Setuju', v: 4, c: 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' },
          ].map((btn) => (
            <button
              key={btn.v}
              onClick={() => answer(btn.v)}
              className={`rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest transition-all hover:-translate-y-1 border ${btn.c}`}
              style={btn.v !== 4 ? { backgroundColor: 'var(--bg-secondary)' } : {}}
            >
              {btn.l}
            </button>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between pt-8 border-t theme-border">
          <button 
            onClick={goBack} 
            disabled={currentIndex === 0}
            className="flex items-center gap-2 text-sm font-bold opacity-30 hover:opacity-100 disabled:opacity-0"
          >
            <ArrowLeft size={16} /> Sebelumnya
          </button>
          <p className="text-xs font-bold opacity-20 italic">Jawabanmu membantu AI memahami DNA Karirmu.</p>
        </div>
      </motion.div>
    </div>
  );
}
