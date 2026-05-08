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
  HelpCircle
} from 'lucide-react';
import * as motion from 'motion/react-client';
import { useAuth } from '../lib/AuthContext';
import { recordRoadmapVisit } from '../lib/api';
import { getCareerBySlug } from '../lib/careerCatalog';
import SEO from '../components/SEO';

export default function RoadmapDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const career = slug ? getCareerBySlug(slug) : undefined;
  const [activeStepKey, setActiveStepKey] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const sentRef = useRef(false);

  // MAPPING PROJECT SLUGS
  const projectSlugMap: Record<string, string> = {
    'Amazon Lex Chatbots': 'setup-aws-account',
    'Lambda for AI Processing': 'setup-aws-account',
    'Git & Version Control Dasar': 'setup-aws-account',
    'HTML5 Semantic Structure': 'html-css-basics',
    'Tooling & Environment Setup': 'setup-aws-account',
    'React Component Architecture': 'setup-aws-account' // Example mapping extension
  };

  useEffect(() => {
    if (!career) return;
    const firstStep = career.roadmap[0];
    if (firstStep) {
      const firstStepKey = `${career.slug}-${firstStep.phase}-${firstStep.title}`;
      setActiveStepKey(firstStepKey);
    }
    if (!user || sentRef.current) return;
    sentRef.current = true;
    void recordRoadmapVisit({ uid: user.uid, name: user.displayName, email: user.email, careerSlug: career.slug }).catch((error) => {
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
    const textToRead = `Detail Karir: ${career.title}. ${career.description}.`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'id-ID';
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!career) return <Navigate to="/roadmap" replace />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <SEO
        title={`Roadmap Menjadi ${career.title}`}
        description={career.description}
        keywords={`roadmap karir, cara menjadi ${career.title}, belajar ${career.title}, gaji ${career.title} indonesia`}
        url={`https://cita-citaku.id/roadmap/${career.slug}`}
      />

      {/* Modern Editorial Header */}
      <header className="mb-20 space-y-8">
        <Link to="/roadmap" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 transition hover:text-blue-600">
          <ArrowLeft size={16} />
          Kembali ke Katalog
        </Link>

        <div className="max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-50 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600 ring-1 ring-blue-100">
              {career.categoryId}
            </span>
            <span className="h-1 w-1 rounded-full bg-gray-300"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {career.type === 'skill_based' ? 'Skill Path' : 'Education Path'}
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            {career.title}
          </h1>
          <p className="text-xl leading-relaxed text-gray-500 max-w-2xl">
            {career.description}
          </p>
        </div>
      </header>

      <div className="grid gap-16 lg:grid-cols-[1fr_360px]">
        {/* Main Content: Vertical Timeline */}
        <main className="space-y-24">
          {career.universityWorld && (
            <section className="rounded-3xl border border-gray-100 bg-white p-8 sm:p-10 shadow-sm">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <School size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Dunia Perkuliahan & Karir</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Overview Jurusan</p>
                </div>
              </div>

              <div className="space-y-10">
                <p className="text-base leading-relaxed text-gray-600">
                  {career.universityWorld.overview}
                </p>

                <div className="grid gap-10 lg:grid-cols-2">
                  <div className="space-y-5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-3">Pengetahuan & Keahlian</h3>
                    <ul className="space-y-3">
                      {career.universityWorld.requiredSkills.map((skill, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                          <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-3">Kenapa Memilih Jurusan Ini?</h3>
                    <div className="space-y-4">
                      {career.universityWorld.whyChoose.map((reason, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-50 text-xs font-black text-gray-400">
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">{reason.title}</h4>
                            <p className="text-sm leading-relaxed text-gray-500">{reason.desc}</p>
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
              <h2 className="text-2xl font-black text-gray-900">
                {career.type === 'skill_based' ? 'Langkah Strategis' : 'Fase Pendidikan & Milestone'}
              </h2>
              <div className="mt-2 h-1 w-20 rounded-full bg-blue-600"></div>
            </div>

            {/* Vertical Timeline Line */}
            <div className="absolute left-[31px] top-[100px] bottom-0 w-px bg-gray-100 hidden sm:block"></div>

            <div className="space-y-16">
              {career.roadmap.map((step, stepIndex) => {
                const stepKey = `${career.slug}-${step.phase}-${step.title}`;
                const isActive = activeStepKey === stepKey;

                return (
                  <div key={stepKey} className="relative flex flex-col sm:flex-row gap-8">
                    {/* Step Indicator */}
                    <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white border border-gray-100 text-xl font-black text-gray-300 shadow-sm transition-all group-hover:border-blue-600">
                      {stepIndex + 1}
                      {isActive && <div className="absolute -inset-1 rounded-2xl border-2 border-blue-600 animate-pulse"></div>}
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">{step.phase}</span>
                          <span className="text-[10px] font-bold text-gray-400 tracking-widest">• {step.meta}</span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">{step.title}</h3>
                        <p className="text-lg leading-relaxed text-gray-500">{step.desc}</p>
                      </div>

                      {/* Content Section */}
                      <div className="grid gap-6">
                        {/* Projects Grid - BACK TO CLICKABLE */}
                        <div className="space-y-4">
                          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                            <Bookmark size={14} /> {career.type === 'skill_based' ? 'Modul Pelajaran & Proyek' : 'Topik Studi Utama'}
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {step.projects.map((proj) => {
                              const projectSlug = projectSlugMap[proj];
                              return (
                                <Link
                                  key={proj}
                                  to={projectSlug ? `/project/${projectSlug}` : '#'}
                                  className={`group flex items-center justify-between gap-4 rounded-2xl p-5 border transition-all ${projectSlug
                                    ? 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-md'
                                    : 'bg-gray-50/50 border-transparent cursor-default'
                                    }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${projectSlug ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-gray-100 text-gray-400'}`}>
                                      <BookOpen size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-bold text-gray-700">{proj}</span>
                                      {projectSlug && <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 opacity-0 group-hover:opacity-100">Buka Misi</span>}
                                    </div>
                                  </div>
                                  {projectSlug && <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />}
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

          {/* FAQs Editorial - Simplified Accordion */}
          <section className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-100"></div>
              <h2 className="text-xl font-black text-gray-400 uppercase tracking-[0.2em]">Common Questions</h2>
              <div className="h-px flex-1 bg-gray-100"></div>
            </div>
            <div className="mx-auto max-w-3xl space-y-3">
              {career.faqs.map((faq, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-blue-100 shadow-sm">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <h4 className={`text-base font-bold transition-colors ${openFaqIndex === i ? 'text-blue-600' : 'text-gray-900'}`}>
                      {faq.q}
                    </h4>
                    <ChevronDown
                      size={18}
                      className={`text-gray-400 transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180 text-blue-600' : ''}`}
                    />
                  </button>
                  {openFaqIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-sm leading-relaxed text-gray-500 border-t border-gray-50 pt-4">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Sidebar: Universities & Market Data */}
        <aside className="space-y-10">
          {/* Top Universities Section */}
          <section className="space-y-8 rounded-[2.5rem] bg-gray-900 p-10 text-white shadow-2xl">
            <header className="space-y-2">
              <School className="text-blue-400 mb-4" size={32} />
              <h3 className="text-xl font-black">Top 5 Universitas</h3>
              <p className="text-xs text-gray-400 font-medium">Rekomendasi institusi pendidikan terbaik.</p>
            </header>

            <div className="space-y-8">
              {/* Local */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Dalam Negeri (Indonesia)</p>
                <div className="space-y-3">
                  {career.topUniversities.local.map((uni, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-black text-gray-600">{i + 1}</span>
                      <span className="text-sm font-bold text-gray-100">{uni}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/10"></div>

              {/* Global */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Luar Negeri (Global)</p>
                <div className="space-y-3">
                  {career.topUniversities.global.map((uni, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-black text-gray-600">{i + 1}</span>
                      <span className="text-sm font-bold text-gray-100">{uni}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Salary Data Section */}
          <section className="space-y-6 rounded-[2.5rem] bg-white p-10 border border-gray-100 shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estimasi Gaji</p>
              <h3 className="text-xl font-black text-gray-900">Pasar Kerja</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">Indonesia</span>
                <span className="text-sm font-black text-blue-600">{career.marketInfo.salaryIndo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">Global (USA)</span>
                <span className="text-sm font-black text-gray-900">{career.marketInfo.salaryUSA}</span>
              </div>
            </div>
          </section>

          {/* AI Advisor Call to Action */}
          <div className="p-10 rounded-[2.5rem] bg-blue-600 text-white relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform group-hover:scale-150"></div>
            <Sparkles className="mb-6" size={24} />
            <h4 className="text-xl font-black">Mau Jalur Personal?</h4>
            <p className="mt-4 text-sm font-medium leading-relaxed text-blue-100 opacity-80">Konsultasikan minatmu dengan AI Advisor kami untuk jalur yang lebih personal.</p>
            <Link to="/counselor" className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-black text-blue-600 transition hover:bg-blue-50">
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
        className={`fixed bottom-8 right-8 z-[100] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition-all ${isSpeaking ? 'bg-rose-600 shadow-rose-600/40' : 'bg-blue-600 shadow-blue-600/40'}`}
      >
        {isSpeaking ? <Square size={20} fill="currentColor" /> : <Volume2 size={24} />}
      </motion.button>
    </div>
  );
}