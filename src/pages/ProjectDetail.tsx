import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ArrowLeft, 
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
  X
} from 'lucide-react';
import * as motion from 'motion/react-client';
import { getProjectById } from '../lib/projectData';
import SEO from '../components/SEO';
import ProjectChatSidebar from '../components/ProjectChatSidebar';

export default function ProjectDetail() {
  const { id } = useParams();
  const project = id ? getProjectById(id) : undefined;
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!project) {
    return <Navigate to="/roadmap" replace />;
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
          {/* Hero Section */}
          <div className="mb-16 space-y-6">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-700">
              • {project.difficulty}
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-950 sm:text-6xl">{project.title}</h1>
            <p className="text-xl leading-relaxed text-slate-600">{project.description}</p>
          </div>

          {/* Key Stats */}
          <div className="mb-20 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { icon: <Clock size={18} />, label: 'Waktu', value: project.estimatedTime },
              { icon: <Gauge size={18} />, label: 'Level', value: project.difficulty },
              { icon: <Lightbulb size={18} />, label: 'Key Concept', value: project.keyConcepts[0] || 'Cloud' },
            ].map((stat, i) => (
              <div key={i} className="surface-card rounded-3xl p-6">
                <div className="mb-3 text-blue-700">{stat.icon}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                <p className="text-base font-black text-slate-950 truncate">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* 5 Minute Summary - Premium Intro Card */}
          <section className="mb-20">
            <div className="rounded-4xl bg-slate-950 p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Zap size={100} fill="currentColor" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 text-orange-400">
                  <Zap fill="currentColor" size={24} />
                  <h2 className="text-xl font-black uppercase tracking-tighter">5 Minute Summary</h2>
                </div>
                <p className="text-2xl font-medium leading-relaxed text-blue-50">
                  {project.summary}
                </p>
              </div>
            </div>
          </section>

          {/* Resources Section - Moved Up */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Materi Referensi</h2>
              <div className="flex-1 bg-slate-200" style={{ height: '1px' }} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.resources.map((resource, idx) => (
                <a 
                  key={idx}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white/80 p-6 transition-all hover:bg-white hover:border-blue-200 hover:shadow-xl group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm group-hover:bg-blue-700 group-hover:text-white transition-colors">
                      <Rocket size={24} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-slate-950">{resource.title}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{resource.type} • {resource.priceInfo}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Optional Cost Note */}
          {project.costNote && (
            <section className="mb-10 rounded-3xl bg-[#FDF8F3] border border-[#F3E8D9] p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="text-xl">💡</div>
                <div className="space-y-2">
                  <h4 className="font-black text-[#4A3728] text-lg">{project.costNote.question}</h4>
                  <p className="text-[#6B5A4B] leading-relaxed font-medium">
                    {project.costNote.answer}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Brief Proyek - Moved to Bottom */}
          <section className="mb-20 space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Proyek Portofolio</h2>
              <div className="flex-1 bg-slate-200" style={{ height: '1px' }} />
            </div>
            <div className="space-y-6">
              {project.projects.map((p, idx) => (
                <div key={idx} className="overflow-hidden rounded-4xl border border-slate-200 bg-white/80 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] hover:border-blue-200 group">
                  <Link 
                    to={`/explore-projects?title=${encodeURIComponent(p.title)}`}
                    className="flex w-full items-center justify-between p-10 text-left"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white font-black text-xl shadow-lg transition-transform group-hover:scale-110">
                        {idx + 1}
                      </div>
                      <span className="text-2xl font-black text-slate-950 leading-tight group-hover:text-blue-700 transition-colors">{p.title}</span>
                    </div>
                    <ChevronRight size={28} className="text-slate-300 group-hover:text-blue-700 transition-colors" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Project Chat Sidebar - Stays fixed on right */}
      <ProjectChatSidebar 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        projectTitle={project.title} 
      />
    </div>
  );
}
