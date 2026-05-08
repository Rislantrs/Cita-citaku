import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import * as motion from 'motion/react-client';
import { careerCatalog, CAREER_CATEGORIES, CareerCategory } from '../lib/careerCatalog';
import { RoadmapCardSkeleton } from '../components/Skeleton';
import SEO from '../components/SEO';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Roadmap() {
  const [activeCategory, setActiveCategory] = useState<CareerCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRoadmaps() {
      setIsLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'roadmaps'));
        const firestoreRoadmaps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Merge with local catalog, unique by slug
        const combined: any[] = [...firestoreRoadmaps];
        careerCatalog.forEach(local => {
          if (!combined.some(c => c.slug === local.slug)) {
            combined.push(local);
          }
        });
        
        setRoadmaps(combined);
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
        setRoadmaps(careerCatalog);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRoadmaps();
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const filteredCareers = roadmaps.filter((career) => {
    const matchesCategory = activeCategory === 'all' || career.categoryId === activeCategory;
    const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          career.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const suggestions = searchQuery.length > 1 
    ? roadmaps.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className="page-shell flex flex-col">
      <SEO 
        title="Katalog Roadmap Karir"
        description="Eksplorasi ratusan jalur karir masa depan lengkap dengan roadmap belajar, skill, dan standar industri global."
        keywords="katalog karir, daftar profesi, roadmap belajar, masa depan anak muda indonesia"
        url="https://cita-citaku.id/roadmap"
      />

      {/* ─── Hero ─── */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        <div className="photo-overlay absolute inset-0">
          <img 
            src="/images/hero-collab.png" 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-kicker mb-6"
          >
            Katalog Karir Masa Depan
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-5xl text-5xl sm:text-7xl font-black tracking-tighter leading-[1.02] text-slate-950"
          >
            Eksplorasi roadmap karir yang
            <span className="block bg-linear-to-r from-blue-700 via-indigo-700 to-slate-900 bg-clip-text text-transparent">lebih konkret.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="section-copy mt-6 text-lg max-w-xl mx-auto"
          >
            Temukan langkah konkret menuju profesi impianmu. 
            Dari nol hingga standar industri global.
          </motion.p>

          {/* Search */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative mt-10 max-w-xl mx-auto"
          >
            <div className="group relative flex items-center">
              <Search className="absolute left-5 text-slate-400 transition-colors group-focus-within:text-blue-700" size={20} />
              <input
                type="text"
                placeholder="Cari profesi (misal: Software Engineer)..."
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 w-full rounded-full pl-14 pr-6 text-[15px] font-medium transition-all focus:ring-4 focus:ring-blue-600/10 focus:outline-none"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-16 z-50 w-full overflow-hidden rounded-3xl shadow-2xl"
                  style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
                >
                  {suggestions.map((s) => (
                    <button
                      key={s.slug}
                      onClick={() => {
                        setSearchQuery(s.title);
                        setShowSuggestions(false);
                      }}
                      className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-blue-50/70"
                    >
                      <Search size={14} className="opacity-30" />
                      <span className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>{s.title}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Category Filter ─── */}
      <div className="px-6 -mt-8 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`click-feedback rounded-full px-5 py-2.5 text-[11px] font-semibold tracking-widest uppercase transition-all ${
              activeCategory === 'all' 
              ? 'bg-slate-950 text-white shadow-lg' 
              : 'text-slate-600 bg-white/80 border border-slate-200/70 hover:text-slate-950'
            }`}
          >
            Semua
          </button>
          {CAREER_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`click-feedback rounded-full px-5 py-2.5 text-[11px] font-semibold tracking-widest uppercase transition-all ${
                activeCategory === cat.id 
                ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/15' 
                : 'text-slate-600 bg-white/80 border border-slate-200/70 hover:text-slate-950'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Career Grid ─── */}
      <section className="py-20 px-6">
        <motion.div 
          layout
          className="max-w-6xl mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {isLoading ? (
            [...Array(6)].map((_, i) => <RoadmapCardSkeleton key={i} />)
          ) : (
            filteredCareers.map((career, idx) => (
              <motion.div
                key={career.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Link 
                  to={`/roadmap/${career.slug}`}
                  className="hover-lift hover-glow click-feedback group block h-full rounded-4xl p-8 transition-all surface-card-strong"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.78)', 
                    border: '1px solid rgba(148,163,184,0.22)' 
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black tracking-widest uppercase text-blue-700">
                      {career.categoryId}
                    </span>
                  </div>

                  <h3 className="text-xl font-black leading-snug mb-3" style={{ color: 'var(--text-primary)' }}>
                    {career.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed line-clamp-2 mb-6" style={{ color: 'var(--text-secondary)' }}>
                    {career.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-5" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <span className="text-[12px] font-semibold text-slate-500">{career.roadmap.length} Tahap Belajar</span>
                    <span className="text-[12px] font-semibold text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Lihat <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
        
        {filteredCareers.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h3 className="text-2xl font-black text-slate-950" style={{ color: 'var(--text-primary)' }}>Pencarian Tidak Ditemukan</h3>
            <p className="mt-3 text-[15px] text-slate-600" style={{ color: 'var(--text-secondary)' }}>Coba gunakan kata kunci yang lebih umum.</p>
          </div>
        )}
      </section>
    </div>
  );
}
