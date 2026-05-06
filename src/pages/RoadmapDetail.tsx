import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, ChevronRight, Globe, HelpCircle, Layers3, Sparkles, Wallet, CheckCircle2, Volume2, Square } from 'lucide-react';
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

    const textToRead = `
      Detail Karir: ${career.title}. 
      Deskripsi: ${career.description}. 
      Tanggung jawab utama meliputi: ${career.marketInfo.responsibilities.join(', ')}. 
      Berikut adalah alur belajarnya: 
      ${career.roadmap.map((s, i) => `Langkah ${i + 1}: ${s.phase}, ${s.title}. ${s.desc}`).join('. ')}
    `;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!career) {
    return <Navigate to="/roadmap" replace />;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:px-6">
      <SEO 
        title={`Roadmap Menjadi ${career.title}`}
        description={career.description}
        keywords={`roadmap karir, cara menjadi ${career.title}, belajar ${career.title}, gaji ${career.title} indonesia`}
        url={`https://cita-citaku.id/roadmap/${career.slug}`}
      />
      {/* Hero Section */}
      <section className="theme-card overflow-hidden rounded-[2.5rem] px-8 py-12 shadow-[0_30px_100px_-20px_rgba(37,99,235,0.1)] sm:px-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-6">
            <Link to="/roadmap" className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100" style={{ backgroundColor: 'rgba(var(--accent-blue), 0.1)', borderColor: 'var(--border-color)' }}>
              <ArrowLeft size={16} />
              Kembali ke Katalog
            </Link>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tight sm:text-7xl" style={{ color: 'var(--text-primary)' }}>{career.title}</h1>
                <p className="text-xl leading-relaxed opacity-70" style={{ color: 'var(--text-secondary)' }}>{career.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {career.marketInfo.responsibilities.map((task) => (
                <div key={task} className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
                  <CheckCircle2 size={16} className="text-blue-500" />
                  {task}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[440px]">
            <div className="theme-card rounded-[2rem] p-8 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Wallet size={20} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Rata-rata Gaji (ID)</p>
              </div>
              <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{career.marketInfo.salaryIndo}</p>
              <p className="mt-1 text-[10px] font-bold opacity-40 uppercase tracking-widest">Per Bulan • Est. Lokal</p>
            </div>

            <div className="rounded-[2rem] border border-blue-100 bg-slate-950 p-8 text-white shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                  <Globe size={20} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Benchmark (USA)</p>
              </div>
              <p className="text-2xl font-black">{career.marketInfo.salaryUSA}</p>
              <p className="mt-1 text-[10px] font-bold text-blue-200 uppercase tracking-widest">Per Tahun • Global Standard</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <main className="space-y-12">
          {/* Roadmap Section */}
          <section>
            <div className="mb-8 px-2">
              <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Jalur Belajar Kamu</h2>
              <p className="mt-2 text-lg opacity-60" style={{ color: 'var(--text-secondary)' }}>Panduan langkah demi langkah untuk menguasai {career.title}.</p>
            </div>

            <div className="space-y-6">
              {career.roadmap.map((step, stepIndex) => {
                const stepKey = `${career.slug}-${step.phase}-${step.title}`;
                const isActiveStep = activeStepKey === stepKey;

                return (
                  <motion.div
                    key={stepKey}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`overflow-hidden rounded-[2.5rem] border transition-all ${isActiveStep ? 'border-blue-600 shadow-2xl ring-4 ring-blue-50/10' : 'theme-card shadow-sm'}`}
                    style={{ backgroundColor: 'var(--card-bg)' }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveStepKey(isActiveStep ? '' : stepKey)}
                      className="flex w-full items-start justify-between gap-6 p-8 text-left"
                    >
                      <div className="flex items-start gap-6">
                        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-black shadow-sm transition-colors ${isActiveStep ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                          {stepIndex + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">{step.phase}</p>
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black text-blue-700">{step.meta}</span>
                          </div>
                          <h3 className="mt-2 text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                          <p className="mt-3 max-w-2xl text-lg leading-relaxed opacity-70" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                        </div>
                      </div>
                      <ChevronDown size={28} className={`mt-2 shrink-0 transition-transform ${isActiveStep ? 'rotate-180 text-blue-600' : 'text-slate-300'}`} />
                    </button>

                    {isActiveStep && (
                      <div className="border-t theme-border bg-slate-50/30 p-8">
                        <div className="grid gap-4 sm:grid-cols-2">
                          {step.projects.map((project) => {
                            // Link mapping logic
                            const projectSlugMap: Record<string, string> = {
                              'Amazon Lex Chatbots': 'setup-aws-account', // Example mapping
                              'Lambda for AI Processing': 'setup-aws-account',
                              'Git & Version Control Dasar': 'setup-aws-account',
                              'HTML5 Semantic Structure': 'html-css-basics',
                              'Tooling & Environment Setup': 'setup-aws-account'
                            };
                            
                            const projectSlug = projectSlugMap[project];

                            return (
                              <Link 
                                key={project} 
                                to={projectSlug ? `/project/${projectSlug}` : '#'}
                                className={`group flex items-center justify-between gap-4 rounded-2xl theme-card p-6 shadow-sm transition-all ${
                                  projectSlug 
                                    ? 'hover:border-blue-500 hover:shadow-md cursor-pointer' 
                                    : 'opacity-80'
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all ${projectSlug ? 'group-hover:bg-blue-600 group-hover:text-white' : ''}`}>
                                    <BookOpen size={24} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{project}</span>
                                    {projectSlug && <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">Klik untuk Detail</span>}
                                  </div>
                                </div>
                                <ArrowRight size={20} className={`text-slate-300 transition-transform ${projectSlug ? 'group-hover:translate-x-1 group-hover:text-blue-600' : ''}`} />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="theme-card rounded-[3rem] p-10 shadow-sm">
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <HelpCircle size={24} />
              </div>
              <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Career FAQs</h2>
            </div>

            <div className="space-y-4">
              {career.faqs.map((faq, idx) => (
                <div key={idx} className="overflow-hidden rounded-2xl border theme-border transition-all hover:border-blue-200">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{faq.q}</span>
                    <ChevronDown size={20} className={`transition-transform ${openFaqIndex === idx ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="bg-slate-50/30 px-6 pb-6 pt-2">
                      <p className="text-lg leading-relaxed opacity-70" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-6">
          <div className="theme-card rounded-[2.5rem] p-8 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-widest opacity-40">Ringkasan Jurusan</h4>
            <div className="mt-6 flex flex-wrap gap-2">
              {career.recommendationMajors.map((major) => (
                <span key={major} className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                  {major}
                </span>
              ))}
            </div>
          </div>

          <div className="theme-card rounded-[2.5rem] p-8 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-widest opacity-40">Sertifikasi Rekomendasi</h4>
            <div className="mt-6 space-y-3">
              {career.certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-3 rounded-2xl bg-slate-50/50 p-4 text-sm font-bold ring-1 theme-border">
                  <Sparkles size={16} className="text-blue-500" />
                  <span style={{ color: 'var(--text-primary)' }}>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-slate-950 p-10 text-white shadow-2xl">
            <h4 className="text-xl font-black">Butuh Saran Lain?</h4>
            <p className="mt-4 text-slate-400">Konsultasikan minatmu dengan AI Advisor kami untuk jalur yang lebih personal.</p>
            <Link to="/counselor" className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold transition hover:bg-blue-700">
              Buka Konselor AI
              <ArrowRight size={18} />
            </Link>
          </div>
        </aside>
      </div>

      {/* Floating TTS Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSpeech}
        className={`fixed bottom-8 right-8 z-[100] flex h-14 w-14 items-center justify-center rounded-full font-black text-white shadow-2xl transition-all sm:h-16 sm:w-16 ${isSpeaking ? 'bg-rose-600 shadow-rose-600/40' : 'bg-blue-600 shadow-blue-600/40'
          }`}
      >
        <div className="relative">
          {isSpeaking && (
            <span className="absolute -inset-2 flex h-full w-full animate-ping rounded-full bg-white/20" />
          )}
          {isSpeaking ? <Square size={24} fill="currentColor" /> : <Volume2 size={24} />}
        </div>
      </motion.button>
    </div>
  );
}