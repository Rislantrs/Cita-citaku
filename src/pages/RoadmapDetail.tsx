import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Globe2,
  Sparkles,
  Wallet,
  CheckCircle2,
  Volume2,
  Square,
  School,
  Library,
  GraduationCap,
  Bookmark,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Target
} from 'lucide-react';
import * as motion from 'motion/react-client';
import { useAuth } from '../lib/AuthContext';
import { recordRoadmapVisit } from '../lib/api';
import { getCareerBySlug } from '../lib/careerCatalog';
import SEO from '../components/SEO';

export default function RoadmapDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [career, setCareer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeStepKey, setActiveStepKey] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const sentRef = useRef(false);

  // Helper to slugify title for project links
  const getProjectSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-');
  };

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/careers/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch from API');
        const data = await response.json();

        if (data.item) {
          setCareer(data.item);
        } else {
          const local = getCareerBySlug(slug);
          if (local) setCareer(local);
        }
      } catch (error) {
        console.error("Error loading career detail from API:", error);
        const local = getCareerBySlug(slug);
        if (local) setCareer(local);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  useEffect(() => {
    if (!career) return;
    const roadmap = career.roadmap || career.phases || [];
    const firstStep = roadmap[0];
    if (firstStep) {
      const firstStepKey = `${career.slug || career.id}-${firstStep.fase || firstStep.phase}-${firstStep.judul || firstStep.title}`;
      setActiveStepKey(firstStepKey);
    }
    if (!user || sentRef.current) return;
    sentRef.current = true;
    void recordRoadmapVisit({ uid: user.uid, name: user.displayName, email: user.email, careerSlug: career.slug || career.id }).catch((error) => {
      console.error('Failed to record roadmap visit', error);
    });
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [career, user]);

  const handleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if (!career) return;
    const textToRead = `Detail Karir: ${career.judul || career.title}. ${career.deskripsi || career.description}.`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'id-ID';
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-sm font-bold text-slate-500 animate-pulse">Menyiapkan Roadmap...</p>
      </div>
    </div>
  );

  if (!career) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white px-6 text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-4xl bg-orange-50 text-orange-600">
          <Target size={48} />
        </div>
        <h1 className="mb-4 text-3xl font-black tracking-tighter text-slate-950 sm:text-4xl">Roadmap Belum Tersedia</h1>
        <p className="mb-10 max-w-md text-lg font-medium text-slate-500">
          Tim kami sedang merancang peta jalan terbaik untuk karir ini. Silakan eksplorasi karir lainnya!
        </p>
        <Link
          to="/roadmap"
          className="rounded-full bg-slate-950 px-8 py-4 text-sm font-black text-white transition-all hover:scale-105 hover:bg-orange-600 shadow-xl shadow-slate-900/10"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:py-12 lg:px-8">
      <SEO
        title={`Roadmap Menjadi ${career.judul || career.title}`}
        description={career.deskripsi || career.description}
        keywords={`roadmap karir, cara menjadi ${career.judul || career.title}, belajar ${career.judul || career.title}, gaji ${career.judul || career.title} indonesia`}
        url={`https://cita-citaku.id/roadmap/${career.slug || career.id}`}
      />

      {/* Modern Editorial Header */}
      <header className="mb-12 sm:mb-20 space-y-6 sm:space-y-8">
        <Link to="/roadmap" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 transition hover:text-blue-600">
          <ArrowLeft size={16} />
          Kembali ke Katalog
        </Link>

        <div className="max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-50 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-blue-700 ring-1 ring-blue-100">
              {career.idKategori || career.categoryId}
            </span>
            <span className="h-1 w-1 rounded-full bg-gray-300"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              {career.tipe || (career.type === 'skill_based' ? 'Skill Path' : 'Education Path')}
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-950 sm:text-6xl lg:text-7xl leading-[1.1]">
            {career.judul || career.title}
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed text-slate-600 max-w-2xl">
            {career.deskripsi || career.description}
          </p>
        </div>
      </header>

      <div className="grid gap-12 sm:gap-16 lg:grid-cols-[1fr_360px]">
        {/* Main Content: Vertical Timeline */}
        <main className="space-y-24">
          {(career.duniaPerkuliahan || career.universityWorld) && (
            <section className="surface-card-strong rounded-3xl sm:rounded-4xl border border-slate-200 p-6 sm:p-10 shadow-sm">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <School size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-950">Dunia Perkuliahan & Karir</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Overview Jurusan</p>
                </div>
              </div>

              <div className="space-y-10">
                <div className="grid gap-6 sm:grid-cols-3">
                  {career.infoPendidikan?.durasi && (
                    <div className="rounded-2xl bg-blue-50/50 p-4 border border-blue-100/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Durasi Studi</p>
                      <p className="text-sm font-bold text-slate-900">{career.infoPendidikan.durasi}</p>
                    </div>
                  )}
                  {career.infoPendidikan?.jalurAkademik && (
                    <div className="rounded-2xl bg-indigo-50/50 p-4 border border-indigo-100/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">Jalur Akademik</p>
                      <p className="text-sm font-bold text-slate-900">{career.infoPendidikan.jalurAkademik}</p>
                    </div>
                  )}
                  {career.infoPendidikan?.gelar && (
                    <div className="rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Gelar Lulusan</p>
                      <p className="text-sm font-bold text-slate-900">{career.infoPendidikan.gelar}</p>
                    </div>
                  )}
                </div>

                <p className="text-base leading-relaxed text-slate-600">
                  {career.duniaPerkuliahan?.ringkasan || career.universityWorld?.overview}
                </p>

                <div className="grid gap-10 lg:grid-cols-2">
                  <div className="space-y-5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-3">Pengetahuan & Keahlian</h3>
                    <ul className="space-y-3">
                      {(career.duniaPerkuliahan?.keahlianWajib || career.universityWorld?.requiredSkills || []).map((skill: any, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                          <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-3">Kenapa Memilih Jurusan Ini?</h3>
                    <div className="space-y-4">
                      {(career.duniaPerkuliahan?.alasanMemilih || career.universityWorld?.whyChoose || []).map((reason: any, i: number) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-500">
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-950 mb-1">{reason.judul || reason.title}</h4>
                            <p className="text-sm leading-relaxed text-slate-600">{reason.deskripsi || reason.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="relative">
            <div className="mb-12">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                {career.type === 'skill_based' ? 'Langkah Strategis' : 'Fase Pendidikan & Milestone'}
              </h2>
              <div className="mt-2 h-1 w-16 sm:w-20 rounded-full bg-blue-600"></div>
            </div>

            {/* Vertical Timeline Line */}
            <div className="absolute left-7.75 top-25 bottom-0 w-px bg-slate-200 hidden sm:block"></div>

            <div className="space-y-16">
              {(career.roadmap || career.phases || []).map((step: any, stepIndex: number) => {
                const stepKey = `${career.slug || career.id}-${step.fase || step.phase}-${step.judul || step.title}`;
                const isActive = activeStepKey === stepKey;

                return (
                  <div key={stepKey} className="relative flex flex-col sm:flex-row gap-8">
                    {/* Step Indicator */}
                    <div className="relative z-10 flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-white/80 border border-slate-200 text-base sm:text-xl font-black text-slate-300 shadow-sm transition-all group-hover:border-blue-700">
                      {stepIndex + 1}
                      {isActive && <div className="absolute -inset-1 rounded-xl sm:rounded-2xl border-2 border-blue-600 animate-pulse"></div>}
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">{step.fase || step.phase}</span>
                          <span className="text-[10px] font-bold text-slate-500 tracking-widest">• {step.meta}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-950">{step.judul || step.title}</h3>
                        <p className="text-base sm:text-lg leading-relaxed text-slate-600">{step.deskripsi || step.desc}</p>
                      </div>

                      {/* Content Section */}
                      <div className="grid gap-6">
                        {/* Projects Grid - BACK TO CLICKABLE */}
                        <div className="space-y-4">
                          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
                            <Bookmark size={14} /> {career.type === 'skill_based' ? 'Modul Pelajaran & Proyek' : 'Topik Studi Utama'}
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {(step.topics || step.proyek || step.projects || []).map((topicOrProj: any, topicIndex: number) => {
                              const isObject = typeof topicOrProj === 'object';
                              const title = isObject ? topicOrProj.title : topicOrProj;
                              const projectUrlId = isObject 
                                ? `roadmap-${career.slug || career.id}-${stepIndex}-${topicIndex}`
                                : getProjectSlug(title);

                              return (
                                <Link
                                  key={title}
                                  to={`/module/${projectUrlId}`}
                                  className="group flex items-center justify-between gap-4 rounded-2xl p-5 border transition-all bg-white/80 border-slate-200 hover:border-blue-700 hover:shadow-md"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white">
                                      <BookOpen size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-bold text-slate-700">{title}</span>
                                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 opacity-0 group-hover:opacity-100">Buka Misi</span>
                                    </div>
                                  </div>
                                  <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Curated Resources Section */}
          {(career.materiBelajar?.length > 0 || career.daftarBuku?.length > 0 || career.referensiDigital?.length > 0) && (
            <section className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200"></div>
                <h2 className="text-xl font-black text-slate-500 uppercase tracking-[0.2em]">Curated Resources</h2>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* Learning Materials */}
                {career.materiBelajar?.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500"><Library size={16} /> Materi Belajar</h3>
                    <div className="space-y-3">
                      {career.materiBelajar.map((materi: any, i: number) => (
                        <a key={i} href={materi.link} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-600 transition-all shadow-sm hover:shadow-md group">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-[9px] font-black uppercase text-slate-500 mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">{materi.tipe}</span>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{materi.judul}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Books */}
                {career.daftarBuku?.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500"><BookOpen size={16} /> Rekomendasi Buku</h3>
                    <div className="space-y-3">
                      {career.daftarBuku.map((buku: any, i: number) => (
                        <a key={i} href={buku.link || '#'} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-600 transition-all shadow-sm hover:shadow-md group">
                          <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{buku.judul}</p>
                          <p className="text-[11px] font-medium text-slate-500 mt-1">oleh {buku.penulis || 'Pakar Industri'}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Digital References */}
                {career.referensiDigital?.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500"><Globe2 size={16} /> Referensi Digital</h3>
                    <div className="space-y-3">
                      {career.referensiDigital.map((ref: any, i: number) => (
                        <a key={i} href={ref.link} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-600 transition-all shadow-sm hover:shadow-md group">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase transition-colors ${ref.tipe === 'youtube' ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'}`}>{ref.tipe}</span>
                          </div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{ref.judul}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* FAQs Editorial */}
          <section className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200"></div>
              <h2 className="text-xl font-black text-slate-500 uppercase tracking-[0.2em]">Common Questions</h2>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>
            <div className="mx-auto max-w-3xl space-y-3">
              {(career.faqs || []).map((faq: any, i: number) => (
                <div key={i} className="overflow-hidden rounded-3xl border border-slate-200 bg-white/80 transition-all hover:border-blue-100 shadow-sm">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <h4 className={`text-base font-bold transition-colors ${openFaqIndex === i ? 'text-blue-600' : 'text-gray-900'}`}>
                      {faq.tanya || faq.q}
                    </h4>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180 text-blue-700' : ''}`}
                    />
                  </button>
                  {openFaqIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-sm leading-relaxed text-slate-600 border-t border-slate-100 pt-4">
                        {faq.jawab || faq.a}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Sidebar: Universities & Market Data */}
        <aside className="space-y-8 sm:space-y-10">
          {/* Top Universities Section */}
          <section className="space-y-8 rounded-3xl sm:rounded-4xl bg-slate-950 p-6 sm:p-10 text-white shadow-2xl">
            <header className="space-y-2">
              <School className="text-blue-400 mb-4" size={32} />
              <h3 className="text-xl font-black">Top 5 Universitas</h3>
              <p className="text-xs text-slate-400 font-medium">Rekomendasi institusi pendidikan terbaik.</p>
            </header>

            <div className="space-y-8">
              {/* Local */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-300">Dalam Negeri (Indonesia)</p>
                <div className="space-y-3">
                  {(career.universitasTerbaik?.lokal || career.topUniversities?.local || []).map((uni: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-500">{i + 1}</span>
                      <span className="text-sm font-bold text-white/90">{uni}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/10"></div>

              {/* Global */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-300">Luar Negeri (Global)</p>
                <div className="space-y-3">
                  {(career.universitasTerbaik?.global || career.topUniversities?.global || []).map((uni: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-500">{i + 1}</span>
                      <span className="text-sm font-bold text-white/90">{uni}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Salary Data Section */}
          <section className="space-y-6 rounded-3xl sm:rounded-4xl bg-white/80 p-6 sm:p-10 border border-slate-200 shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Estimasi Gaji</p>
              <h3 className="text-xl font-black text-slate-950">Pasar Kerja</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Indonesia</span>
                <span className="text-sm font-black text-blue-700">{career.infoGaji?.rentangIDR || career.marketInfo?.salaryIndo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Global (USA)</span>
                <span className="text-sm font-black text-slate-950">{career.infoGaji?.rentangUSD || career.marketInfo?.salaryUSA}</span>
              </div>
              {(career.infoGaji?.penjelasan) && (
                <p className="text-[10px] leading-relaxed text-slate-500 border-t border-slate-100 pt-3 italic">
                  {career.infoGaji.penjelasan}
                </p>
              )}
            </div>
          </section>

          {/* AI Advisor Call to Action */}
          <div className="p-6 sm:p-10 rounded-3xl sm:rounded-4xl bg-slate-950 text-white relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform group-hover:scale-150"></div>
            <Sparkles className="mb-6" size={24} />
            <h4 className="text-xl font-black">Mau Jalur Personal?</h4>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-300">Konsultasikan minatmu dengan AI Advisor kami untuk jalur yang lebih personal.</p>
            <Link to="/counselor" className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-black text-slate-950 transition hover:bg-blue-50">
              Buka Konselor AI
              <ArrowRight size={18} />
            </Link>
          </div>
        </aside>
      </div>

      {/* Persistent Floating Audio Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSpeech}
        className={`fixed bottom-24 sm:bottom-8 right-5 sm:right-8 z-[100] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition-all ${isSpeaking ? 'bg-rose-600 shadow-rose-600/40' : 'bg-blue-600 shadow-blue-600/40'}`}
      >
        {isSpeaking ? <Square size={20} fill="currentColor" /> : <Volume2 size={24} />}
      </motion.button>
    </div>
  );
}