import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useTranslation } from 'react-i18next';
import { Users, Plus, CheckCircle2, Clock, MessageSquare, Heart, Share2, Sparkles, Trophy } from 'lucide-react';
import * as motion from 'motion/react-client';
import { fetchCareerSubmissions } from '../lib/api';

export default function Community() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const data = await fetchCareerSubmissions('all');
        setSubmissions(data.items || []);
      } catch (err) {
        console.error(err);
        // Mock data SUPER LENGKAP sesuai permintaan
        setSubmissions([
          { 
            id: '1', 
            careerData: { 
              title: 'Backend Engineer (Go)', 
              description: 'Jalur belajar fokus pada Microservices dan Concurrency.',
              time: '12 Jam',
              level: 'Moderate',
              concept: 'Microservices',
              background: 'Di era cloud, efisiensi server sangat krusial. Go memberikan performa tinggi dengan konsumsi resource rendah.',
              skills: ['Golang', 'Docker', 'Redis', 'gRPC'],
              specs: [
                'Implementasi RESTful API dengan Gin Gonic',
                'Integrasi Database PostgreSQL & GORM',
                'Containerization menggunakan Docker Compose',
                'Unit Testing dengan tingkat cakupan 80%'
              ],
              image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800',
              ytLink: 'https://youtube.com/...'
            }, 
            status: 'approved', 
            likes: 124, 
            author: 'Andi' 
          },
          { 
            id: '2', 
            careerData: { 
              title: 'Frontend Mastery (Next.js)', 
              description: 'Membangun web modern dengan performa SEO terbaik.',
              time: '8 Jam',
              level: 'Hard',
              concept: 'SSR & Hydration',
              background: 'Banyak web modern lambat saat di-load. Next.js menyelesaikan masalah ini dengan Server Side Rendering.',
              skills: ['React', 'Next.js', 'Tailwind', 'TypeScript'],
              specs: [
                'Optimasi Core Web Vitals (LCP < 2.5s)',
                'Implementasi Dynamic Routing & API Routes',
                'State Management menggunakan Zustand',
                'Deployment ke Vercel dengan CI/CD'
              ],
              image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
              ytLink: 'https://youtube.com/...'
            }, 
            status: 'approved', 
            likes: 85, 
            author: 'Rina' 
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    loadSubmissions();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      {/* ... Hero tetap sama ... */}
      <section className="relative mb-20 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-blue-600 ring-1 ring-blue-100/50" style={{ backgroundColor: 'rgba(var(--accent-blue), 0.1)' }}>
            <Users size={16} />
            <span>1,240+ Kontributor Aktif</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl" style={{ color: 'var(--text-primary)' }}>
            Bangun Masa Depan <br />
            <span className="text-blue-600">Bersama Komunitas.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg opacity-60 sm:text-xl" style={{ color: 'var(--text-secondary)' }}>
            Cita-citaku adalah platform terbuka. Bagikan keahlianmu, buat roadmap karir, dan bantu jutaan anak muda Indonesia menemukan jalan mereka.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link 
              to="/community/submit"
              className="flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-black text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700 hover:-translate-y-1"
            >
              <Plus size={20} />
              Kontribusi Roadmap
            </Link>
            <button className="theme-card flex items-center gap-2 rounded-2xl px-8 py-4 font-black transition-all hover:-translate-y-1">
              <MessageSquare size={20} />
              Gabung Diskusi
            </button>
          </div>
        </motion.div>
      </section>

      <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
        {/* Main Content: Feed */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Kontribusi Terbaru</h2>
          </div>

          <div className="grid gap-6">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              </div>
            ) : (
              submissions.map((sub, idx) => (
                <motion.div 
                   key={sub.id}
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                   className="group relative overflow-hidden rounded-[2.5rem] theme-card p-0 transition-all hover:border-blue-100 hover:shadow-xl"
                >
                  {/* Header Card */}
                  <div className="p-8">
                    <div className="flex flex-col gap-4">
                      {/* Stats Badges */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="rounded-lg bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600">{sub.careerData?.time}</span>
                        <span className="rounded-lg bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{sub.careerData?.level}</span>
                        <span className="rounded-lg bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">{sub.careerData?.concept}</span>
                      </div>

                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{sub.careerData?.title}</h3>
                            {sub.status === 'approved' && (
                              <Trophy size={20} className="text-yellow-500" />
                            )}
                          </div>
                          <p className="opacity-60 leading-relaxed max-w-2xl text-lg" style={{ color: 'var(--text-secondary)' }}>{sub.careerData?.description}</p>
                          
                          <div className="flex items-center gap-4 pt-4">
                            <button 
                              onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:underline"
                            >
                              <Sparkles size={14} />
                              {expandedId === sub.id ? 'Tutup Detail' : 'Buka Detail Brief & Portofolio'}
                            </button>
                            <div className="h-4 w-[1px] bg-slate-200" />
                            <div className="flex items-center gap-1 opacity-40">
                              <Heart size={16} className="transition hover:text-pink-500" />
                              <span className="text-xs font-bold">{sub.likes || 0}</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-20 ml-auto">Oleh {sub.author || 'Anonim'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content - Identical to ProjectDetail Style */}
                  {expandedId === sub.id && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      className="border-t theme-border bg-slate-50/30 p-10 space-y-12"
                    >
                      {/* Integrated Background & Skills */}
                      <div className="grid gap-10 lg:grid-cols-2 bg-white p-8 rounded-[2rem] border theme-border shadow-sm">
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Latar Belakang</p>
                          <p className="text-base font-medium leading-relaxed opacity-70">{sub.careerData?.background}</p>
                        </div>
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Skill Utama</p>
                          <div className="flex flex-wrap gap-2">
                            {sub.careerData?.skills?.map((s: string) => (
                              <span key={s} className="rounded-xl bg-slate-50 px-4 py-2 text-xs font-bold border theme-border">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Spesifikasi Proyek</p>
                        <ul className="space-y-4">
                          {sub.careerData?.specs?.map((spec: string, sIdx: number) => (
                            <li key={sIdx} className="flex items-start gap-3 text-slate-700 font-bold text-base">
                              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {sub.careerData?.image && (
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Visual Ref / Mockup</p>
                          <img 
                            src={sub.careerData.image} 
                            alt={sub.careerData.title} 
                            className="w-full rounded-[2rem] object-cover shadow-xl border-4 border-white" 
                          />
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-6 pt-6 border-t theme-border">
                        <a 
                          href={sub.careerData?.ytLink} 
                          target="_blank" 
                          className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-xs font-black text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
                        >
                          <Share2 size={14} />
                          Tonton Tutorial YouTube
                        </a>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar: Stats & Info */}
        <aside className="space-y-8">
          <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl">
            <Trophy size={40} className="text-yellow-400 mb-6" />
            <h3 className="text-xl font-black">Top Kontributor</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Dapatkan badge eksklusif dan akses awal ke fitur baru dengan menjadi kontributor aktif.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { name: 'Rislan T.', points: 2450, rank: 1 },
                { name: 'Sarah A.', points: 1820, rank: 2 },
                { name: 'Kevin J.', points: 1200, rank: 3 },
              ].map((contributor) => (
                <div key={contributor.name} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[10px] font-black">
                      {contributor.rank}
                    </div>
                    <span className="text-sm font-bold">{contributor.name}</span>
                  </div>
                  <span className="text-xs font-black text-blue-400">{contributor.points} XP</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] theme-card p-8">
            <Sparkles size={32} className="text-blue-600 mb-6" />
            <h3 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>Misi Komunitas</h3>
            <p className="mt-2 text-sm opacity-60 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Menyediakan akses navigasi karir gratis untuk seluruh anak muda di Indonesia demi masa depan yang lebih terarah.
            </p>
            <button className="mt-6 text-sm font-black text-blue-600 hover:underline">Pelajari Selengkapnya</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
