import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Gauge,
  Lightbulb,
  Rocket,
  ChevronLeft,
  Send,
  RotateCcw,
  Sparkles,
  X,
  MessageSquare
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { auth } from '../lib/firebase';
import { toast } from 'sonner';
import { getProjectById } from '../lib/projectData';
import SEO from '../components/SEO';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiStreamingText, setAiStreamingText] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Robust Body Scroll Lock
  useEffect(() => {
    setIsMounted(true);
    // Setting overflow on body directly; using setProperty prevents strict mode double-mount issues 
    // that cause saving previous 'hidden' state and restoring it incorrectly.
    document.body.style.setProperty('overflow', 'hidden', 'important');

    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [aiMessages, aiStreamingText, isChatOpen]);

  // Load Data
  useEffect(() => {
    async function loadProject() {
      if (!id) return;
      setLoading(true);
      try {
        if (id.startsWith('roadmap-')) {
          const parts = id.split('-');
          const topicIdx = parseInt(parts.pop() || '0');
          const phaseIdx = parseInt(parts.pop() || '0');
          const careerSlug = parts.slice(1).join('-');

          const response = await fetch(`/api/careers/${careerSlug}`);
          if (response.ok) {
            const data = await response.json();
            const career = data.item;
            if (career) {
              const roadmap = career.roadmap || career.phases || [];
              const phase = roadmap[phaseIdx];
              const topic = phase?.topics ? phase.topics[topicIdx] : null;

              if (topic) {
                const proj = topic.project || {};
                setProject({
                  id,
                  title: proj.title || topic.title,
                  summary: proj.background || topic.description || topic.summary,
                  description: topic.summary || topic.description || proj.background,
                  estimatedTime: topic.timeEstimate || '45 Min',
                  difficulty: topic.difficulty || 'Intermediate',
                  keyConcepts: topic.keyConcepts ? [topic.keyConcepts] : ['Teknologi'],
                  resources: topic.resources || [],
                  costNote: topic.costNote,
                  contentBlocks: proj.contentBlocks || [],
                  interactiveSteps: proj.interactiveSteps || [],
                  specifications: proj.specifications || [],
                  skillsLearned: proj.skillsLearned ? (Array.isArray(proj.skillsLearned) ? proj.skillsLearned : [proj.skillsLearned]) : [],
                  mode: proj.mode || 'single',
                  image: proj.image,
                  hasProject: topic.showProject && Object.keys(proj).length > 0,
                  projectTitle: proj.title,
                  projectBackground: proj.background,
                });
                setLoading(false);
                return;
              }
            }
          }
        }

        const local = getProjectById(id);
        if (local) {
          setProject(local);
        } else {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('../lib/firebase');
          const docRef = doc(db, 'projects', id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.id ? { id: docSnap.id, ...docSnap.data() } : docSnap.data();
            setProject({
              ...data,
              summary: data.brief || data.summary,
              description: data.introduction || data.description,
              estimatedTime: data.estimatedTime || '30 Min',
              difficulty: data.difficulty || 'Moderate',
              keyConcepts: data.keyConcepts || data.skills || [],
              resources: data.resources || [],
              projects: data.projects || [{ title: data.title, description: data.brief || data.description, specifications: data.steps || [] }]
            });
          }
        }
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

  const handleAiSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || aiInput;
    if (!textToSend.trim() || isAiLoading || !project) return;

    const newMessages = [...aiMessages, { role: 'user' as const, content: textToSend }];
    setAiMessages(newMessages);
    setAiInput('');
    setIsAiLoading(true);
    setAiStreamingText('');

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'assistant',
          userId: auth.currentUser?.uid,
          messages: newMessages.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
          context: `Anda adalah "Mentor AI Cita-Citaku". Anda membantu user memahami materi: "${project.title}". Berikan penjelasan edukatif, profesional, dan mudah dipahami. Gunakan markdown.`,
        }),
      });

      if (response.status === 429) {
        const data = await response.json();
        toast.error(data.error || 'Kuota harian habis');
        setAiMessages([...newMessages, { role: 'assistant', content: data.text || 'Kuota harian habis.' }]);
        return;
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(trimmed.slice(6));
            if (event.type === 'chunk') { fullText += event.content; setAiStreamingText(fullText); }
            if (event.type === 'done') { setAiMessages(prev => [...prev, { role: 'assistant', content: fullText }]); setAiStreamingText(''); }
            if (event.type === 'error') throw new Error(event.message);
          } catch { /* skip */ }
        }
      }
      if (fullText && aiStreamingText) {
        setAiMessages(prev => [...prev, { role: 'assistant', content: fullText }]);
        setAiStreamingText('');
      }
    } catch {
      toast.error('Gagal terhubung dengan AI. Silakan coba lagi.');
      setAiMessages([...newMessages, { role: 'assistant', content: 'Maaf, saya sedang mengalami kendala koneksi.' }]);
      setAiStreamingText('');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleResetAi = () => {
    toast('Hapus Riwayat Chat?', {
      action: { label: 'Hapus', onClick: () => { setAiMessages([]); setAiStreamingText(''); toast.success('Percakapan direset'); } },
      cancel: { label: 'Batal', onClick: () => { } },
    });
  };

  if (!isMounted) return null;

  // Render into Portal to escape any Z-Index conflicts or Layout overlaps
  const pageContent = (
    <div className="fixed inset-0 z-[9999] flex h-[100dvh] w-screen bg-slate-100 overflow-hidden overscroll-none text-slate-900 font-sans">
      <SEO title={project?.title ? `${project.title} - Lab Proyek` : 'Lab Proyek'} description={project?.summary} />

      {/* Main Content Workspace */}
      <main className={`relative flex h-[100dvh] flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white ${isChatOpen ? 'w-full lg:w-[calc(100vw-400px)] xl:w-[calc(100vw-480px)]' : 'w-full'}`}>

        {/* Minimalist Header */}
        <header className="shrink-0 flex items-center justify-between h-16 px-4 lg:px-8 border-b border-slate-200 bg-white/90 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            {/* Back Button handles Navigation properly without relying on buggy links */}
            <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
              <ChevronLeft size={20} />
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 leading-none mb-1">Lab Proyek</span>
              <h2 className="max-w-[200px] sm:max-w-xs md:max-w-md truncate text-sm font-bold text-slate-900 leading-none">
                {loading ? 'Memuat...' : project?.title || 'Misi'}
              </h2>
            </div>
          </div>

          {!isChatOpen && project && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-all shadow-sm shadow-blue-600/20 hover:bg-blue-700 active:scale-95"
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline">Mentor AI</span>
            </button>
          )}
        </header>

        {/* Scrollable Document Area */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-sm font-bold text-slate-500 animate-pulse">Menyiapkan Workspace...</p>
              </div>
            </div>
          ) : !project ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                <Rocket size={40} />
              </div>
              <h1 className="mb-3 text-2xl font-black text-slate-900">Misi Belum Tersedia</h1>
              <p className="mb-8 max-w-sm text-sm font-medium text-slate-500">Materi ini masih dalam tahap penyusunan. Silakan kembali nanti!</p>
              <button onClick={() => navigate(-1)} className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-blue-600 transition-colors shadow-lg">
                Kembali
              </button>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-4xl px-5 py-10 lg:px-12 lg:py-16 pb-32">
              <div className="space-y-12">

                {/* Hero */}
                <div className="space-y-5 pb-8 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                      {project.category || 'Lab Proyek'}
                    </span>
                    {project.difficulty && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border border-slate-200">{project.difficulty}</span>
                    )}
                  </div>
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-slate-950 tracking-tight leading-[1.1]">{project.title}</h1>
                  {project.description && (
                    <p className="text-base lg:text-lg text-slate-600 leading-relaxed max-w-3xl font-medium">{project.description}</p>
                  )}
                  {project.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.skills.map((skill: string) => (
                        <span key={skill} className="rounded-lg bg-slate-900 px-3 py-1 text-[11px] font-bold text-white tracking-wide">{skill}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-6 pt-1">
                    {[
                      { icon: <Clock size={14} />, label: 'Waktu', value: project.timeEstimate || project.estimatedTime },
                      { icon: <Gauge size={14} />, label: 'Level', value: project.difficulty },
                      { icon: <Lightbulb size={14} />, label: 'Konsep', value: Array.isArray(project.keyConcepts) ? project.keyConcepts[0] : project.keyConcepts },
                    ].filter(s => s.value).map((stat, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="text-blue-500">{stat.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}:</span>
                        <span className="text-sm font-bold text-slate-700">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                {project.summary && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 mb-5">Ringkasan Materi</p>
                    <div className="prose prose-slate prose-base lg:prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-blue-600 prose-strong:text-slate-900 prose-img:rounded-2xl prose-img:border prose-img:border-slate-200">
                      <ReactMarkdown>{project.summary}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Resources */}
                {project.resources?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4 flex items-center gap-1.5"><BookOpen size={12} /> Referensi Bacaan</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {project.resources.map((res: any, i: number) => (
                        <a key={i} href={res.link} target="_blank" rel="noreferrer"
                          className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all active:scale-[0.98]">
                          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                            <BookOpen size={16} className="text-blue-600 group-hover:text-white transition-colors" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm text-slate-900 truncate group-hover:text-blue-700 transition-colors">{res.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{res.type || 'Artikel'} · {res.priceInfo || 'Gratis'}</p>
                          </div>
                          <ArrowRight size={15} className="text-slate-300 shrink-0 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Blocks */}
                {project.contentBlocks?.length > 0 && (
                  <div className="space-y-10">
                    {project.contentBlocks.map((block: any, idx: number) => (
                      <div key={idx} className="space-y-4">
                        {block.title && <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">{block.title}</h2>}
                        <div className="prose prose-slate prose-base lg:prose-lg max-w-none prose-a:text-blue-600 prose-strong:text-slate-900 prose-img:rounded-2xl">
                          <ReactMarkdown>{block.content}</ReactMarkdown>
                        </div>
                        {block.imageUrl && (
                          <img src={block.imageUrl} alt={block.title} className="w-full rounded-2xl border border-slate-200 shadow-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Cost Note */}
                {project.costNote && (
                  <div className="flex gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-200">
                    <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <Lightbulb className="text-amber-600" size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900 text-sm mb-1">{typeof project.costNote === 'object' ? project.costNote.question : 'Info Tambahan'}</h4>
                      <p className="text-amber-800 text-sm leading-relaxed">{typeof project.costNote === 'object' ? project.costNote.answer : project.costNote}</p>
                    </div>
                  </div>
                )}

                {/* Misi Praktek */}
                {project.hasProject && (
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-10 shadow-2xl">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(ellipse at top right, rgba(59,130,246,0.4), transparent 60%)' }} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-7 w-7 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Rocket size={14} className="text-blue-400" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">Misi Praktek</span>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-black text-white mb-3 leading-tight">{project.projectTitle || project.title}</h3>
                      {project.projectBackground && (
                        <p className="text-slate-400 leading-relaxed mb-8 font-medium max-w-2xl text-sm lg:text-base">{project.projectBackground}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4">
                        <Link to={`/project/${project.id}`}
                          className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-7 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg text-sm">
                          Mulai Kerjakan <ArrowRight size={16} />
                        </Link>
                        {project.mode && (
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            {project.mode === 'guided' ? '📖 Terbimbing' : project.mode === 'interactive' ? '⚡ Interaktif' : '🎯 Mandiri'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isChatOpen && (
        <div
          className="fixed inset-0 z-[9990] bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsChatOpen(false)}
        />
      )}

      {/* AI Sidebar Drawer / Column */}
      <aside className={`
        fixed inset-y-0 right-0 z-[10000] flex w-[85vw] max-w-[400px] flex-col bg-slate-50 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        lg:static lg:z-auto lg:w-[400px] xl:w-[480px] lg:border-l lg:border-slate-200 lg:shadow-none
        ${isChatOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 lg:hidden'}
      `}>
        {/* Sidebar Header */}
        <header className="shrink-0 flex items-center justify-between px-5 h-16 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 leading-none mb-1">Mentor AI</h4>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 leading-none">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleResetAi} className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors" title="Reset Chat">
              <RotateCcw size={16} />
            </button>
            <button onClick={() => setIsChatOpen(false)} className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors" title="Tutup Chat">
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Chat Message Thread */}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-6 bg-slate-50">
          {aiMessages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4 rotate-3">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">Mentor Siap Membantu</h3>
              <p className="text-sm font-medium text-slate-500 max-w-[220px] mb-8">Tanyakan apa saja tentang materi ini untuk membantu pemahamanmu.</p>
              <div className="flex flex-col gap-2 w-full max-w-[240px]">
                {['Jelaskan konsep ini', 'Beri contoh nyata', 'Bagaimana memulainya?'].map((hint) => (
                  <button key={hint} onClick={() => handleAiSend(hint)} className="rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm transition-all active:scale-95">
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[90%] rounded-2xl px-5 py-3.5 text-[13px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-sm font-medium' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                    <div className="prose prose-sm prose-slate max-w-none prose-p:last:mb-0 prose-p:leading-relaxed prose-strong:text-blue-600 prose-a:text-blue-600"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                  </div>
                </div>
              ))}
              {aiStreamingText && (
                <div className="flex justify-start">
                  <div className="max-w-[90%] rounded-2xl bg-white border border-slate-200 px-5 py-3.5 text-[13px] leading-relaxed text-slate-800 shadow-sm rounded-tl-sm">
                    <div className="prose prose-sm prose-slate max-w-none prose-p:last:mb-0 prose-p:leading-relaxed prose-strong:text-blue-600 prose-a:text-blue-600"><ReactMarkdown>{aiStreamingText}</ReactMarkdown></div>
                    <span className="inline-block w-1.5 h-3.5 bg-blue-500 animate-pulse ml-1 align-middle rounded-sm" />
                  </div>
                </div>
              )}
              {isAiLoading && !aiStreamingText && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white border border-slate-200 px-5 py-4 shadow-sm rounded-tl-sm">
                    <div className="flex gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Input - with env(safe-area-inset-bottom) to handle mobile keyboards elegantly */}
        <footer className="shrink-0 bg-white border-t border-slate-200 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <form onSubmit={(e) => { e.preventDefault(); handleAiSend(); }} className="relative flex items-center">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ketik pertanyaan..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-4 pr-14 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm"
            />
            <button
              type="submit"
              disabled={!aiInput.trim() || isAiLoading}
              className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white disabled:bg-slate-200 disabled:text-slate-400 transition-all hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-600/20 disabled:shadow-none"
            >
              <Send size={16} />
            </button>
          </form>
        </footer>
      </aside>
    </div>
  );

  return createPortal(pageContent, document.body);
}