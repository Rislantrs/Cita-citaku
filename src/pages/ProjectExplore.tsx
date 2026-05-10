import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  BookOpen,
  ChevronLeft,
  Code2,
  Copy,
  Cloud,
  ImageIcon,
  Search,
  Send,
  Share2,
  RotateCcw,
  Sparkles,
  Trophy,
  BrainCircuit,
  X,
} from 'lucide-react';
import * as motion from 'motion/react-client';
import ReactMarkdown from 'react-markdown';
import { auth } from '../lib/firebase';
import { toast } from 'sonner';
import SEO from '../components/SEO';
import { fetchProjects } from '../lib/api';

interface BriefSection {
  number: number;
  title: string;
  content: string | string[] | Record<string, string | string[]>;
}

interface StepChoice {
  id: string;
  label: string;
  guidance?: string;
  requiresProof?: boolean;
  requiresExplanation?: boolean;
  nextStepId?: string | null;
}

interface InteractiveStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  question?: string;
  choices?: StepChoice[];
  guidance?: string;
  requiresExplanation?: string;
}

interface Project {
  id: string;
  title: string;
  introduction: string;
  background: string;
  skills: string[];
  brief: string;
  steps: string[];
  briefSections: BriefSection[];
  interactiveSteps: any[]; // Changed to any to handle both formats
  image: string;
  category: string;
  contentBlocks?: any[];
  specifications?: string[];
  isRoadmap?: boolean;
}

const DUMMY_PROJECTS: Project[] = [];

export default function ProjectExplore() {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'guided' | 'pure'>('guided');
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [driveLink, setDriveLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [currentStepId, setCurrentStepId] = useState<string>('step-1');
  const [stepChoices, setStepChoices] = useState<Record<string, string>>({});
  const [stepProofs, setStepProofs] = useState<Record<string, string>>({});
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'ai'>('guide');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiStreamingText, setAiStreamingText] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        setIsLoadingProjects(true);
        setProjectError(null);

        // Fetch standard projects
        const result = await fetchProjects();
        let items = (result.items as Project[]) || [];

        // Also fetch careers to extract roadmap projects
        try {
          const careerRes = await fetch('/api/careers');
          if (careerRes.ok) {
            const careerData = await careerRes.json();
            const careers = careerData.items || [];
            
            careers.forEach((career: any) => {
              const roadmap = career.roadmap || career.phases || [];
              roadmap.forEach((phase: any, pIdx: number) => {
                if (phase.topics) {
                  phase.topics.forEach((topic: any, tIdx: number) => {
                    if (topic.showProject && topic.project) {
                      const rawSkills = topic.project.skillsLearned || [];
                      items.push({
                        id: `roadmap-${career.slug}-${pIdx}-${tIdx}`,
                        title: topic.project.title || topic.title,
                        introduction: topic.project.background || topic.summary || topic.description,
                        background: topic.project.background || topic.description,
                        skills: Array.isArray(rawSkills) ? rawSkills : (typeof rawSkills === 'string' ? rawSkills.split(',').map(s => s.trim()).filter(Boolean) : []),
                        brief: topic.project.background || '',
                        steps: topic.project.specifications || [],
                        briefSections: [],
                        interactiveSteps: topic.project.interactiveSteps || [],
                        image: topic.project.image || '',
                        category: career.category || 'Career Roadmap',
                        isRoadmap: true,
                        contentBlocks: topic.project.contentBlocks || []
                      });
                    }
                  });
                }
              });
            });
          }
        } catch (e) {
          console.error("Failed to load roadmap projects:", e);
        }

        if (!cancelled && items.length > 0) {
          setProjects(items);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
        if (!cancelled) {
          setProjectError('Data project dari server belum tersedia.');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProjects(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (id) {
      const found = projects.find(p => p.id === id);
      if (found) {
        setActiveProject(found);
        return;
      }

      // If not found in loaded projects and it's a roadmap ID, fetch specifically
      if (id.startsWith('roadmap-')) {
        const parts = id.split('-');
        const tIdx = parseInt(parts.pop() || '0');
        const pIdx = parseInt(parts.pop() || '0');
        const slug = parts.slice(1).join('-');

        fetch(`/api/careers/${slug}`)
          .then(res => res.json())
          .then(data => {
            const career = data.item;
            if (career) {
              const roadmap = career.roadmap || career.phases || [];
              const topic = roadmap[pIdx]?.topics?.[tIdx];
              if (topic && topic.project) {
                const rawSkills = topic.project.skillsLearned || [];
                setActiveProject({
                  id,
                  title: topic.project.title || topic.title,
                  introduction: topic.project.background || topic.summary || topic.description,
                  background: topic.project.background || topic.description,
                  skills: Array.isArray(rawSkills) ? rawSkills : (typeof rawSkills === 'string' ? rawSkills.split(',').map(s => s.trim()).filter(Boolean) : []),
                  brief: topic.project.background || '',
                  steps: topic.project.specifications || [],
                  briefSections: [],
                  interactiveSteps: topic.project.interactiveSteps || [],
                  image: topic.project.image || '',
                  category: career.category || 'Career Roadmap',
                  isRoadmap: true,
                  contentBlocks: topic.project.contentBlocks || []
                });
              }
            }
          });
      }
    } else {
      const projectTitle = searchParams.get('title');
      if (projectTitle) {
        const found = projects.find(p => p.title.toLowerCase() === projectTitle.toLowerCase());
        if (found) {
          setActiveProject(found);
        }
      }
    }
  }, [id, searchParams, projects]);

  const categories = ['Semua', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         project.introduction.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'Semua' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleTask = (index: number) => {
    setCompletedTasks((prev) => (prev.includes(index) ? prev.filter((value) => value !== index) : [...prev, index]));
  };

  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps((prev) => (prev.includes(stepId) ? prev.filter((value) => value !== stepId) : [...prev, stepId]));
  };

  const handleAiSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || aiInput;
    if (!textToSend.trim() || isAiLoading || !activeProject) return;

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
          messages: newMessages.map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
          context: `Anda adalah "Asisten Ahli Cita-Citaku". Anda sedang membantu user mengerjakan proyek: "${activeProject.title}". 
          
          Konteks Proyek:
          - Kategori: ${activeProject.category}
          - Deskripsi: ${activeProject.introduction}
          - Skills: ${activeProject.skills.join(', ')}
          
          Tugas Anda:
          1. Berikan saran teknis yang praktis dan mendalam.
          2. Gunakan gaya bahasa yang menyemangati namun tetap profesional.
          3. Jika user bertanya tentang error, bantu debug langkah demi langkah.
          4. Fokus pada membantu user menyelesaikan langkah yang sedang aktif.`,
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
            if (event.type === 'chunk') {
              fullText += event.content;
              setAiStreamingText(fullText);
            }
            if (event.type === 'done') {
              setAiMessages(prev => [...prev, { role: 'assistant', content: fullText }]);
              setAiStreamingText('');
            }
            if (event.type === 'error') throw new Error(event.message);
          } catch { /* skip */ }
        }
      }

      if (fullText && aiStreamingText) {
        setAiMessages(prev => [...prev, { role: 'assistant', content: fullText }]);
        setAiStreamingText('');
      }
    } catch (err) {
      toast.error('Gagal terhubung dengan AI. Silakan coba lagi.');
      setAiMessages([...newMessages, { role: 'assistant', content: 'Maaf, saya sedang mengalami kendala koneksi.' }]);
      setAiStreamingText('');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleResetAi = () => {
    toast('Hapus Riwayat Chat?', {
      description: 'Seluruh percakapan dengan Mentor AI akan dihapus permanen.',
      action: {
        label: 'Hapus',
        onClick: () => {
          setAiMessages([]);
          setAiStreamingText('');
          toast.success('Percakapan telah direset');
        },
      },
      cancel: {
        label: 'Batal',
        onClick: () => {},
      },
    });
  };


  const handleStepChoice = (stepId: string, choiceId: string, nextStepId?: string | null) => {
    setStepChoices((prev) => ({ ...prev, [stepId]: choiceId }));
    if (nextStepId) {
      setCurrentStepId(nextStepId);
    }
  };

  if (activeProject) {
    const steps = activeProject.interactiveSteps;

    return (
      <div className="fixed inset-0 z-[1000] flex h-[100dvh] w-screen overflow-hidden bg-[#fcfbfa] text-slate-800">
        {/* Main Workspace Column - Guide View */}
        <div className={`relative flex h-full flex-1 flex-col overflow-hidden transition-all duration-500 ease-in-out ${activeTab === 'ai' ? 'hidden sm:flex' : 'flex'}`}>
          <header className="shrink-0 border-b border-slate-200 bg-white/85 backdrop-blur">
            <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveProject(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="hidden sm:block">
                  <p className="text-[11px] font-black uppercase tracking-widest text-blue-700">Project Workspace</p>
                  <h2 className="max-w-40 truncate text-sm font-black text-gray-900 sm:max-w-sm">{activeProject.title}</h2>
                </div>
              </div>

              {/* Mobile Segmented Control - Integrated in Header */}
              <div className="flex rounded-xl bg-slate-100 p-1 sm:hidden">
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeTab === 'guide' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  PANDUAN
                </button>
                <button
                  onClick={() => {
                    setActiveTab('ai');
                    setIsAiOpen(true);
                  }}
                  className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeTab === 'ai' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  MENTOR AI
                </button>
              </div>

              <div className="hidden items-center gap-3 sm:flex">
                <button className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:text-gray-900">
                  <Share2 size={15} /> Pamerkan
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black">
                  <Trophy size={15} /> SELESAI
                </button>
                <button
                  onClick={() => {
                    setIsAiOpen(!isAiOpen);
                    if (!isAiOpen) setActiveTab('ai');
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${isAiOpen ? 'bg-gray-900 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                >
                  <Sparkles size={18} />
                </button>
              </div>
              {/* Mobile Menu Placeholder / Info */}
              <div className="flex sm:hidden items-center text-blue-600 font-black text-[10px] tracking-widest">
                STEP {completedSteps.length + 1}/{steps.length}
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto scroll-smooth pb-24 sm:pb-0">
            <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 md:px-6 md:pt-14">
            <section className="border-b border-gray-200 pb-8">
              <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
                {activeProject.category}
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                {activeProject.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">{activeProject.introduction}</p>
            </section>

            <section className="grid gap-6 border-b border-gray-200 py-10 lg:grid-cols-5">
              <article className="rounded-3xl border border-gray-200 bg-white/70 p-6 lg:col-span-3">
                <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Latar Belakang Masalah</p>
                <p className="text-base italic leading-8 text-gray-700 sm:text-lg">{activeProject.background}</p>
              </article>

              <article className="rounded-3xl border border-gray-200 bg-white/70 p-6 lg:col-span-2">
                <p className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Skill yang akan dipelajari</p>
                <div className="flex flex-wrap gap-2.5">
                  {(Array.isArray(activeProject.skills) ? activeProject.skills : []).map((skill: string, idx: number) => (
                    <span
                      key={skill + idx}
                      className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-3 py-1.5 text-xs font-semibold text-blue-900"
                    >
                      {idx % 3 === 0 ? <BrainCircuit size={14} /> : idx % 3 === 1 ? <Cloud size={14} /> : <Code2 size={14} />}
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            </section>

            <section className="space-y-6 border-b border-gray-200 py-10">
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Interactive Brief & Task</p>
                <div className="inline-flex rounded-full border border-gray-200 bg-white/70 p-1 text-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode('pure')}
                    className={`rounded-full px-4 py-2 font-semibold transition ${viewMode === 'pure' ? 'border-b-2 border-gray-900 text-gray-900' : 'border-b-2 border-transparent text-gray-500'}`}
                  >
                    Murni
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('guided');
                      setCurrentStepId('step-1');
                    }}
                    className={`rounded-full px-4 py-2 font-semibold transition ${viewMode === 'guided' ? 'border-b-2 border-gray-900 text-gray-900' : 'border-b-2 border-transparent text-gray-500'}`}
                  >
                    Panduan
                  </button>
                </div>
              </div>

              {viewMode === 'pure' ? (
                <div className="space-y-8">
                  {activeProject.briefSections.map((section) => (
                    <div key={section.number} className="space-y-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {section.number}️⃣ {section.title}
                      </h3>
                      {typeof section.content === 'string' ? (
                        <p className="text-sm leading-relaxed text-gray-700 sm:text-base">{section.content}</p>
                      ) : Array.isArray(section.content) ? (
                        <ul className="space-y-2 text-sm leading-7 text-gray-700 sm:text-base">
                          {section.content.map((item, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="shrink-0 text-blue-600">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="space-y-4 text-sm text-gray-700 sm:text-base">
                          {Object.entries(section.content).map(([subTitle, subContent]) => (
                            <div key={subTitle}>
                              <p className="mb-2 font-semibold text-gray-900">{subTitle}:</p>
                              {Array.isArray(subContent) ? (
                                <ul className="ml-4 space-y-1">
                                  {subContent.map((item, idx) => (
                                    <li key={idx} className="flex gap-2">
                                      <span className="shrink-0 text-blue-600">→</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="ml-4">{subContent}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative mt-4 pl-1 md:pl-6">
                  <div className="absolute left-5 top-0 hidden h-full w-px bg-gray-200 md:block" />
                  <div className="space-y-16 md:space-y-20">
                    {steps.map((step, index) => {
                      const selectedChoiceId = stepChoices[step.id || `step-${index}`];
                      const selectedChoice = step.choices?.find((choice: any) => choice.id === selectedChoiceId);
                      const proofValue = stepProofs[step.id || `step-${index}`] || '';
                      const isStepCompleted = completedSteps.includes(step.id || `step-${index}`);
                      const isFirst = index === 0;
                      
                      // Roadmap project specific flags
                      const stepId = step.id || `step-${index}`;

                      return (
                        <article key={stepId} className="relative scroll-mt-24">
                          {!isFirst && <div className="absolute left-5 top-0 hidden h-full w-px bg-gray-200 md:block" />}
                          <div className="grid gap-5 md:grid-cols-[40px_minmax(0,1fr)] md:gap-8">
                            <div className="relative z-10 flex md:justify-center">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-black transition ${isStepCompleted ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-white text-slate-900 shadow-sm'}`}>
                                {isStepCompleted ? <Check size={16} /> : (index + 1)}
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div className="space-y-3">
                                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                                  Step {index + 1} of {steps.length}
                                </div>
                                <h3 className="max-w-3xl text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">{step.title || `Langkah ${index + 1}`}</h3>
                                {step.description && <p className="max-w-3xl text-base leading-8 text-gray-700 sm:text-[17px]">{step.description}</p>}
                                {step.config && <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{step.config}</p>}
                              </div>

                              {/* Media (New Roadmap Format) */}
                              {step.mediaUrl && (
                                <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm max-w-2xl bg-white p-2">
                                  {step.mediaUrl.includes('youtube') || step.mediaUrl.includes('youtu.be') ? (
                                    <iframe
                                      src={step.mediaUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                      className="w-full aspect-video rounded-2xl"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  ) : (
                                    <img src={step.mediaUrl} alt={step.title} className="w-full object-cover rounded-2xl" />
                                  )}
                                </div>
                              )}

                              {/* Content Blocks (New Roadmap Format) */}
                              {step.contentBlocks?.map((block: any, bi: number) => (
                                <div key={bi} className="space-y-4 max-w-2xl">
                                  {block.type === 'text' && block.content && (
                                    <div className="prose prose-slate max-w-none prose-p:leading-8 prose-p:text-gray-700">
                                      <div>
                                        <ReactMarkdown>{block.content}</ReactMarkdown>
                                      </div>
                                    </div>
                                  )}
                                  {block.type === 'image' && block.url && (
                                    <div className="rounded-2xl overflow-hidden border border-slate-200">
                                      <img src={block.url} alt="Step content" className="w-full object-cover" />
                                    </div>
                                  )}
                                </div>
                              ))}

                              {/* Legacy Rendering for Hardcoded Demo Steps */}
                              {!activeProject.isRoadmap && isFirst && (
                                <div className="space-y-6">
                                  <ul className="space-y-4 text-base leading-8 text-gray-700">
                                    <li className="flex gap-3">
                                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-400" />Pastikan Node.js sudah terpasang di perangkat Anda.
                                    </li>
                                  </ul>
                                </div>
                              )}

                              {/* Branching / Choices */}
                              {step.choices && step.choices.length > 0 && (
                                <div className="space-y-4">
                                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Pilih Kondisi Anda:</p>
                                  <div className="flex flex-wrap items-center gap-3">
                                    {step.choices.map((choice: any) => {
                                      const isSelected = selectedChoiceId === choice.id;
                                      return (
                                        <button
                                          key={choice.id}
                                          type="button"
                                          onClick={() => handleStepChoice(stepId, choice.id, choice.nextStepId)}
                                          className={`rounded-full border px-5 py-2.5 text-sm font-bold transition-all ${isSelected ? 'border-gray-900 bg-gray-900 text-white shadow-lg' : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900'}`}
                                        >
                                          {choice.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {selectedChoice?.guidance && (
                                    <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6 text-sm leading-relaxed text-blue-800">
                                      <p className="font-bold mb-1">💡 Petunjuk Path ini:</p>
                                      {selectedChoice.guidance}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Branching Question (Roadmap Format) */}
                              {step.branchQuestion && (
                                <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6 max-w-2xl">
                                  <p className="text-sm font-bold text-amber-900 italic">
                                    ❓ {step.branchQuestion}
                                  </p>
                                </div>
                              )}

                              {/* Proof / Requirements */}
                              <div className="space-y-4">
                                {(step.requireExplanation || step.requiresExplanation || selectedChoice?.requiresExplanation) && (
                                  <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Penjelasan Singkat:</label>
                                    <textarea
                                      value={proofValue}
                                      onChange={(event) => setStepProofs((prev) => ({ ...prev, [stepId]: event.target.value }))}
                                      placeholder="Tulis hasil atau kendala Anda di sini..."
                                      className="min-h-28 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 text-gray-800 outline-none transition focus:border-gray-400 focus:shadow-sm"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-3 pt-2">
                                <button
                                  onClick={() => toggleStepCompletion(stepId)}
                                  className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-black transition-all duration-300 ${isStepCompleted ? 'border-emerald-700 bg-emerald-700 text-white shadow-lg shadow-emerald-200' : 'border-gray-300 bg-transparent text-gray-700 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50'}`}
                                >
                                  <Check size={16} />
                                  {isStepCompleted ? 'Selesai' : 'Tandai Selesai'}
                                </button>

                                <button
                                  onClick={() => {
                                    setIsAiOpen(true);
                                    setActiveTab('ai');
                                  }}
                                  className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-6 py-3 text-sm font-black text-blue-700 transition-all hover:bg-blue-100/80"
                                >
                                  <Sparkles size={16} />
                                  Tanya Mentor AI
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            <section className="py-10 border-b border-gray-200">
              <div className="max-w-xl">
                <p className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Bukti Hasil Karya</p>
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-gray-700">Tempel link Google Drive di sini...</span>
                    <input
                      type="url"
                      value={driveLink}
                      onChange={(e) => setDriveLink(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full rounded-2xl border border-gray-200 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-gray-400 focus:ring-0"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-gray-700">Link GitHub / Portofolio...</span>
                    <input
                      type="url"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full rounded-2xl border border-gray-200 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-gray-400 focus:ring-0"
                    />
                  </label>
                </div>

                <div className="mt-4 rounded-2xl border-2 border-dashed border-gray-300 px-5 py-8 text-sm text-gray-500">
                  Upload Screenshot / Bukti (Coming Soon)
                </div>
              </div>
            </section>

            <section className="py-12">
              <div className="mx-auto max-w-xl text-center">
                {completedSteps.length < steps.length ? (
                  <div className="rounded-2xl border-2 border-gray-200 py-4 text-sm font-bold text-gray-400">
                    Masih ada tugas yang perlu diselesaikan!
                  </div>
                ) : (
                  <button
                    className="w-full rounded-2xl bg-gray-900 py-4 text-sm font-black text-white shadow-xl transition-all hover:bg-black active:scale-[0.98]"
                  >
                    Kirim Project Sekarang
                  </button>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

        {/* AI Assistant Column - Mobile Adaptive */}
        <aside
          className={`relative z-70 flex h-full flex-col border-l border-slate-200 bg-white transition-all duration-500 ease-in-out shrink-0 
            ${isAiOpen ? 'w-full sm:w-110 lg:w-128 translate-x-0' : 'w-0 translate-x-full overflow-hidden border-none'}
            ${activeTab === 'guide' ? 'hidden sm:flex' : 'flex'}
          `}
        >
          <div className="flex h-full w-full flex-col overflow-hidden">
            {/* Sidebar Header - Pinned */}
            <header className="shrink-0 border-b border-slate-100 p-6 pt-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Mentor Proyek AI</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Active Assistant</span>
                      <span className="h-1 w-1 rounded-full bg-gray-300 sm:hidden" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest sm:hidden">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleResetAi}
                    title="Reset Percakapan"
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition hover:bg-slate-100 hover:text-blue-600"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setIsAiOpen(false);
                      setActiveTab('guide');
                    }}
                    title="Kembali ke Panduan"
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </header>

            {/* Sidebar Chat Content - Independently Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth pb-32 sm:pb-6">
              {aiMessages.length === 0 ? (
                <div className="flex flex-col items-center pt-8 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-700">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-gray-900">
                    Mentor AI Cita-Citaku
                  </h3>
                  <p className="mb-8 px-4 text-sm leading-6 text-gray-600">
                    Butuh petunjuk mengerjakan proyek ini? Tanyakan apa saja, saya siap membimbing Anda.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {aiMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] rounded-3xl px-5 py-4 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white shadow-slate-200' : 'bg-white border border-slate-100 text-slate-700'}`}>
                        <div className="prose prose-sm prose-slate max-w-none">
                          <ReactMarkdown 
                            components={{
                              p: ({children}) => <p className="mb-3 last:mb-0">{children}</p>,
                              strong: ({children}) => <strong className="font-black text-blue-600">{children}</strong>,
                              ul: ({children}) => <ul className="list-disc pl-4 mb-3 space-y-1">{children}</ul>,
                              li: ({children}) => <li className="text-slate-600">{children}</li>
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {aiStreamingText && (
                    <div className="flex justify-start">
                      <div className="max-w-[90%] rounded-3xl bg-white border border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-700 shadow-sm">
                        <div className="prose prose-sm prose-slate max-w-none">
                          <div>
                            <ReactMarkdown 
                              components={{
                                p: ({children}) => <p className="mb-3 last:mb-0">{children}</p>,
                                strong: ({children}) => <strong className="font-black text-blue-600">{children}</strong>,
                                ul: ({children}) => <ul className="list-disc pl-4 mb-3 space-y-1">{children}</ul>,
                              }}
                            >
                              {aiStreamingText}
                            </ReactMarkdown>
                          </div>
                        </div>
                        <span className="inline-block w-1.5 h-4 bg-blue-500 animate-pulse ml-0.5 rounded-sm" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Input Footer - Adaptive Padding */}
            <footer className="shrink-0 border-t border-slate-100 p-6 pb-28 sm:pb-10 bg-white">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAiSend();
                }}
                className="relative"
              >
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAiSend();
                    }
                  }}
                  placeholder="Ketik pertanyaan teknis..."
                  className="w-full min-h-[60px] max-h-32 rounded-3xl border border-slate-200 bg-white pl-5 pr-14 py-4 text-sm text-gray-800 outline-none transition focus:border-blue-500 shadow-sm resize-none"
                />
                <button
                  type="submit"
                  disabled={!aiInput.trim() || isAiLoading}
                  className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white transition-all hover:scale-105 disabled:bg-slate-200"
                >
                  <Send size={18} />
                </button>
              </form>
            </footer>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen bg-[#FCFCFD] pb-32 pt-28">
      <SEO
        title="Eksplorasi Proyek"
        description="Bangun portofolio nyata dari proyek interaktif lintas profesi — Cloud, AI, Web Engineering, dan banyak lagi."
        keywords="proyek karir, portofolio, latihan industri, project based learning"
      />
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-12">
          <span className="text-blue-600 text-[9px] font-black tracking-[0.4em] uppercase mb-3 block">Misi Masa Depan</span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Pilih Misi <span className="text-slate-400">Terbaik Anda.</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-3 leading-relaxed max-w-md">
            Bangun portofolio nyata dengan tantangan industri yang dirancang untuk menguji batas kemampuan Anda.
          </p>
        </header>

        {/* Search & Filter Section - Refined */}
        <section className="mb-12 space-y-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text"
              placeholder="Cari tantangan, teknologi, atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-100 bg-white py-3.5 pl-12 pr-6 text-xs font-bold shadow-sm outline-none transition focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50"
            />
          </div>

          {isLoadingProjects && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-xs font-bold text-blue-700">
              Memuat project terbaru dari server...
            </div>
          )}

          {projectError && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-xs font-bold text-amber-700">
              {projectError}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === category 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                  : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600 shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setActiveProject(project)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white p-2.5 shadow-sm transition-all hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-slate-50">
                {project.image && (
                  <img 
                    src={project.image} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={project.title} 
                  />
                )}
                <div className="absolute left-3 top-3">
                  <span className="rounded-md bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-slate-100/50">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="px-2.5 pb-4">
                <div className="mb-2 flex flex-wrap gap-2">
                  {project.skills.slice(0, 2).map((skill) => (
                    <span key={skill} className="text-[8px] font-bold text-blue-500/80 uppercase tracking-wider">
                      #{skill}
                    </span>
                  ))}
                </div>
                <h3 className="mb-2 text-sm font-black leading-tight text-slate-800 transition-colors group-hover:text-blue-600">
                  {project.title}
                </h3>
                <p className="mb-6 line-clamp-2 text-[11px] font-medium leading-relaxed text-slate-400">
                  {project.introduction}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-600 transition-colors">
                    Mulai Misi <ArrowRight size={10} />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-300 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Sparkles size={12} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
