import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Gauge,
  Calendar,
  Lightbulb,
  Zap,
  MessageSquare,
  Rocket,
  Target,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  CheckCircle2,
  Camera,
  FileText,
  X
} from 'lucide-react';
import * as motion from 'motion/react-client';
import ReactMarkdown from 'react-markdown';
import { getProjectById } from '../lib/projectData';
import SEO from '../components/SEO';
import ProjectChatSidebar from '../components/ProjectChatSidebar';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    async function loadProject() {
      if (!id) return;
      setLoading(true);
      try {
        // 1. Check if it's a dynamic roadmap project (Format: roadmap-[careerSlug]-[phaseIdx]-[topicIdx])
        if (id.startsWith('roadmap-')) {
          const parts = id.split('-');
          // roadmap-ai-engineer-0-1 -> slug: ai-engineer, pIdx: 0, tIdx: 1
          const topicIdx = parseInt(parts.pop() || '0');
          const phaseIdx = parseInt(parts.pop() || '0');
          const careerSlug = parts.slice(1).join('-'); // handles slugs with hyphens

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
                  // Roadmap projects use contentBlocks and interactiveSteps
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

        // 2. Try local data first for speed
        const local = getProjectById(id);
        if (local) {
          setProject(local);
        } else {
          // 3. Try Firestore
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

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-sm font-bold text-slate-500 animate-pulse">Memuat Lab Proyek...</p>
      </div>
    </div>
  );

  if (!project) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white px-6 text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-4xl bg-blue-50 text-blue-600">
          <Rocket size={48} />
        </div>
        <h1 className="mb-4 text-3xl font-black tracking-tighter text-slate-950 sm:text-4xl">Misi Belum Tersedia</h1>
        <p className="mb-10 max-w-md text-lg font-medium text-slate-500">
          Laboratorium kami sedang menyiapkan instruksi terbaik untuk misi ini. Silakan kembali lagi nanti!
        </p>
        <Link 
          to="/roadmap" 
          className="rounded-full bg-slate-950 px-8 py-4 text-sm font-black text-white transition-all hover:scale-105 hover:bg-blue-700 shadow-xl shadow-slate-900/10"
        >
          Kembali ke Roadmap
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell fixed inset-0 flex overflow-hidden bg-(--bg-primary)" style={{ zIndex: 999 }}>
      <SEO
        title={`${project.title} - Panduan Proyek`}
        description={project.summary}
      />

      {/* Main Content Area - Clean white background for readability */}
      <main
        className="relative flex h-full flex-1 flex-col overflow-y-auto bg-(--bg-primary) transition-all duration-500 ease-in-out"
        style={isChatOpen ? { marginRight: '450px' } : undefined}
      >
        {/* Local Header - Respects the split layout */}
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/80 px-8 py-4 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <Link to="/roadmap" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 border border-slate-200 hover:bg-white transition-colors">
              <ArrowLeft size={20} className="text-slate-900" />
            </Link>
            <div className="h-6 bg-slate-200" style={{ width: '1px' }} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">Project Lab</span>
              <h2 className="truncate text-sm font-black text-slate-950 sm:max-w-md" style={{ maxWidth: '200px' }}>{project.title}</h2>
            </div>
          </div>

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`hidden lg:flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black transition-all ${isChatOpen ? 'bg-slate-900 text-white' : 'bg-blue-700 text-white shadow-lg shadow-blue-700/20'}`}
          >
            <MessageSquare size={16} />
            {isChatOpen ? 'Tutup Chat' : 'Tanya AI'}
          </button>
        </header>

        <div className="mx-auto w-full max-w-4xl px-6 py-16 pb-40">
          {/* Hero Section - More Balanced */}
          <div className="mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> {project.difficulty || 'Easy Peasy'}
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-950 leading-tight">{project.title}</h1>
            <p className="text-lg font-medium text-slate-500 max-w-2xl">{project.description}</p>
          </div>

          {/* Metadata Bar - Tight & Professional */}
          <div className="mb-14 flex items-center gap-10">
            {[
              { icon: <Clock size={18} />, label: 'WAKTU', value: project.timeEstimate || project.estimatedTime || 'dd' },
              { icon: <Gauge size={18} />, label: 'LEVEL', value: project.difficulty || 'Easy Peasy' },
              { icon: <Lightbulb size={18} />, label: 'KONSEP', value: (Array.isArray(project.keyConcepts) ? project.keyConcepts[0] : project.keyConcepts) || 'Teknologi' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-slate-400/80">{stat.icon}</div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{stat.label}</span>
                  <span className="text-base font-black text-slate-800 leading-tight">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Core Content */}
          <section className="mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600">
                <Zap fill="currentColor" size={22} />
                <h2 className="text-lg font-black uppercase tracking-tighter">Ringkasan Materi</h2>
              </div>
              <div className="prose prose-slate max-w-none prose-p:text-lg prose-p:font-medium prose-p:text-slate-600 prose-p:leading-relaxed">
                <div className="whitespace-pre-wrap">
                  <ReactMarkdown>{project.summary || project.description}</ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Resources - Unified Style */}
            {(project.resources?.length > 0) && (
              <div className="space-y-8 pt-10 mt-10 border-t border-slate-50">
                <div className="flex items-center gap-2 text-blue-600">
                  <BookOpen size={22} />
                  <h2 className="text-lg font-black uppercase tracking-tighter">Materi Referensi</h2>
                </div>
                <div className="grid gap-3">
                  {project.resources.map((resource: any, idx: number) => (
                    <a
                      key={idx}
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-blue-600 hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <BookOpen size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900">{resource.title}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {resource.type || 'Web'} • {resource.priceInfo || resource.priceType || 'Gratis'}
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Extended Content Blocks */}
          {(project.contentBlocks?.length > 0) && (
            <section className="mb-20 space-y-12">
              {project.contentBlocks.map((block: any, idx: number) => (
                <div key={idx} className="space-y-6">
                  {block.title && <h3 className="text-2xl font-black text-slate-950 tracking-tight">{block.title}</h3>}
                  <div className="prose prose-slate max-w-none">
                    <div className="text-lg leading-relaxed text-slate-600 whitespace-pre-wrap">
                      <ReactMarkdown>{block.content}</ReactMarkdown>
                    </div>
                  </div>
                  {block.imageUrl && (
                    <div className="rounded-2xl overflow-hidden border border-slate-100">
                      <img src={block.imageUrl} alt={block.title} className="w-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Proyek Portofolio - Simple & Premium */}
          {project.hasProject && (
            <section className="mb-20 pt-10 border-t border-slate-100">
              <div className="space-y-8">
                <div className="flex items-center gap-2 text-blue-600">
                  <Rocket size={20} />
                  <h2 className="text-sm font-black uppercase tracking-widest">Proyek Portofolio</h2>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{project.projectTitle || project.title}</h3>
                      {project.projectBackground && (
                        <p className="text-base text-slate-500 leading-relaxed max-w-2xl">{project.projectBackground}</p>
                      )}
                    </div>

                    {project.mode && (
                      <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600">
                        <Target size={12} />
                        {project.mode === 'guided' ? 'Step-by-Step' : project.mode === 'interactive' ? 'Interactive' : 'Single Task'}
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/project/${id}`}
                    className="group flex items-center justify-between rounded-2xl border border-blue-100 bg-white p-5 transition-all hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                        <Rocket size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-950">MULAI KERJAKAN PROYEK</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Buka Interactive Workspace</span>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-blue-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Cost Note - deduplicated */}
          {project.costNote && (
            <section className="mb-10 rounded-2xl bg-amber-50/50 border border-amber-100 p-6">
              <div className="flex gap-4">
                <Lightbulb size={20} className="text-amber-600 shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-900 text-sm">{typeof project.costNote === 'object' ? project.costNote.question : 'Info Tambahan'}</h4>
                  <p className="text-amber-800/80 text-sm leading-relaxed">
                    {typeof project.costNote === 'object' ? project.costNote.answer : project.costNote}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Project Chat Sidebar */}
      <ProjectChatSidebar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        projectTitle={project.title}
      />
    </div>
  );
}
