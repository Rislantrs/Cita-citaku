import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Map, Code, Brain, Palette, Heart, Briefcase, GraduationCap, Building2, ChevronRight, Sparkles, Target, LibraryBig } from 'lucide-react';
import * as motion from 'motion/react-client';
import { careerCatalog, CAREER_CATEGORIES, CareerCategory } from '../lib/careerCatalog';
import { RoadmapCardSkeleton } from '../components/Skeleton';
import SEO from '../components/SEO';

export default function Roadmap() {
  const [activeCategory, setActiveCategory] = useState<CareerCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredCareers = careerCatalog.filter((career) => {
    const matchesCategory = activeCategory === 'all' || career.categoryId === activeCategory;
    const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          career.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const suggestions = searchQuery.length > 1 
    ? careerCatalog.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SEO 
        title="Katalog Roadmap Karir"
        description="Eksplorasi ratusan jalur karir masa depan lengkap dengan roadmap belajar, skill, dan standar industri global."
        keywords="katalog karir, daftar profesi, roadmap belajar, masa depan anak muda indonesia"
        url="https://cita-citaku.id/roadmap"
      />
      {/* Premium Open Hero Section */}
      <section className="relative mb-24">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:justify-between">
          <div className="max-w-2xl space-y-10 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-black text-blue-600 ring-1 ring-blue-100"
              style={{ backgroundColor: 'rgba(var(--accent-blue), 0.1)' }}
            >
              <Sparkles size={16} />
              <span>Katalog Karir Masa Depan</span>
            </motion.div>
            
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl font-black tracking-tight sm:text-8xl"
                style={{ color: 'var(--text-primary)' }}
              >
                Eksplorasi <br />
                <span className="text-blue-600">Roadmap Karir.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl leading-relaxed sm:text-2xl opacity-70"
                style={{ color: 'var(--text-secondary)' }}
              >
                Temukan langkah konkret menuju profesi impianmu. <br className="hidden lg:block" /> 
                Dari nol hingga standar industri global.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative mx-auto max-w-lg lg:mx-0"
            >
              <div className="group relative flex items-center">
                <Search className="absolute left-6 text-slate-400 transition-colors group-focus-within:text-blue-600" size={24} />
                <input
                  type="text"
                  placeholder="Cari profesi (misal: Software Engineer)..."
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="theme-input h-20 w-full rounded-[2rem] border-none pl-16 pr-8 text-lg font-medium transition-all focus:ring-8 focus:ring-blue-600/5"
                />
                
                {/* Smart Auto-complete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-24 z-50 w-full overflow-hidden rounded-[2rem] border theme-card shadow-2xl"
                  >
                    {suggestions.map((s) => (
                      <button
                        key={s.slug}
                        onClick={() => {
                          setSearchQuery(s.title);
                          setShowSuggestions(false);
                        }}
                        className="flex w-full items-center gap-4 px-8 py-4 text-left transition hover:bg-blue-50/50"
                      >
                        <Search size={16} className="text-blue-600" />
                        <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{s.title}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-16">
                <div className="rounded-[2.5rem] bg-blue-600 p-10 text-white shadow-2xl shadow-blue-600/30">
                  <LibraryBig size={40} />
                  <p className="mt-6 text-4xl font-black">7+</p>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-100 opacity-80">Profesi Terpilih</p>
                </div>
                <div className="theme-card rounded-[2.5rem] p-10 shadow-sm">
                  <Target size={40} className="text-blue-600" />
                  <p className="mt-6 text-4xl font-black">Detail</p>
                  <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Kurikulum Industri</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="theme-card rounded-[2.5rem] p-10 shadow-sm">
                  <Sparkles size={40} className="text-blue-600" />
                  <p className="mt-6 text-4xl font-black">100+</p>
                  <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Modul Belajar</p>
                </div>
                <div className="rounded-[2.5rem] bg-slate-950 p-10 text-white">
                  <Map size={40} className="text-blue-400" />
                  <p className="mt-6 text-4xl font-black">Visual</p>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Alur Roadmap</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modern Category Filter */}
      <div className="mb-16">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-2xl px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${
              activeCategory === 'all' 
              ? 'bg-slate-950 text-white shadow-xl' 
              : 'theme-card text-slate-500 hover:bg-slate-50'
            }`}
          >
            Semua
          </button>
          {CAREER_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-2xl px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                activeCategory === cat.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                : 'theme-card text-slate-500 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Career Grid with Micro-interactions */}
      <motion.div 
        layout
        className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {isLoading ? (
          [...Array(6)].map((_, i) => <RoadmapCardSkeleton key={i} />)
        ) : (
          filteredCareers.map((career, idx) => (
            <motion.div
              key={career.slug}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: idx * 0.02 
              }}
            >
              <Link 
                to={`/roadmap/${career.slug}`}
                className="theme-card group block h-full rounded-[3rem] p-10 transition-all hover:-translate-y-3 hover:border-blue-100 hover:shadow-[0_40px_100px_-30px_rgba(37,99,235,0.15)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/20" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                    {getIcon(career.iconKey)}
                  </div>
                  <div className="rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600" style={{ backgroundColor: 'rgba(var(--accent-blue), 0.1)' }}>
                    {career.categoryId}
                  </div>
                </div>

                <div className="mt-10 space-y-5">
                  <h3 className="text-3xl font-black leading-tight" style={{ color: 'var(--text-primary)' }}>{career.title}</h3>
                  <p className="text-lg leading-relaxed line-clamp-2 opacity-60" style={{ color: 'var(--text-secondary)' }}>
                    {career.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t theme-border">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-widest opacity-40">Kurikulum</span>
                      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{career.roadmap.length} Tahap Belajar</span>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full opacity-40 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-[-45deg] group-hover:opacity-100" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <ChevronRight size={24} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </motion.div>
      
      {filteredCareers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full opacity-20 mb-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <Search size={48} />
          </div>
          <h3 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Pencarian Tidak Ditemukan</h3>
          <p className="mt-3 text-lg opacity-40" style={{ color: 'var(--text-secondary)' }}>Coba gunakan kata kunci yang lebih umum atau kategori lain.</p>
        </div>
      )}
    </div>
  );
}

function getIcon(key: string) {
  const size = 36;
  switch (key) {
    case 'code': return <Code size={size} />;
    case 'brain': return <Brain size={size} />;
    case 'palette': return <Palette size={size} />;
    case 'heart': return <Heart size={size} />;
    case 'briefcase': return <Briefcase size={size} />;
    case 'graduation': return <GraduationCap size={size} />;
    case 'building': return <Building2 size={size} />;
    default: return <Code size={size} />;
  }
}
