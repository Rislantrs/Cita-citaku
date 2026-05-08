import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Code2,
  Copy,
  Cloud,
  ImageIcon,
  Search,
  Send,
  Share2,
  Sparkles,
  Trophy,
  BrainCircuit,
  X,
} from 'lucide-react';
import * as motion from 'motion/react-client';
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
  interactiveSteps: InteractiveStep[];
  image: string;
  category: string;
}

const DUMMY_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Membangun Chatbot Perbankan AI',
    introduction: 'Pelajari cara membuat asisten virtual yang cerdas menggunakan teknologi Cloud AI terbaru.',
    background:
      'Di era digital saat ini, bank membutuhkan cara yang lebih cepat untuk melayani pelanggan. Banyak pelanggan merasa frustrasi dengan waktu tunggu telepon yang lama. Proyek ini bertujuan untuk memecahkan masalah tersebut dengan chatbot yang responsif.',
    skills: ['Natural Language Processing', 'Cloud Computing', 'Logic Design'],
    brief:
      'Buatlah sebuah alur chatbot yang mampu menangani pertanyaan saldo, transfer antar rekening, dan pemblokiran kartu secara otomatis dengan keamanan tinggi.',
    briefSections: [
      {
        number: 1,
        title: 'Judul Project',
        content: 'Membangun Chatbot Perbankan AI untuk Otomasi Customer Service',
      },
      {
        number: 2,
        title: 'Deskripsi Singkat',
        content: [
          'Bank modern memerlukan solusi customer service yang cepat, 24/7, dan dapat menangani ribuan transaksi bersamaan.',
          'Chatbot AI dapat mengurangi beban tim support hingga 70% untuk pertanyaan rutin.',
          'Proyek ini fokus pada membangun alur chatbot yang intelligent, secure, dan user-friendly.',
        ],
      },
      {
        number: 3,
        title: 'Tujuan & Hasil yang Diharapkan',
        content: {
          'Tujuan Project': [
            'Mengotomasi respons untuk pertanyaan FAQ saldo dan transaksi',
            'Meningkatkan kepuasan customer dengan response time < 2 detik',
            'Mengurangi beban kerja tim customer service',
            'Membangun foundation untuk chatbot generasi berikutnya',
          ],
          'Hasil Akhir yang Diharapkan': [
            'Conversation flow diagram yang lengkap & tervalidasi',
            'Chatbot prototype dengan minimal 5 intent utama',
            'Testing report dengan 20+ test cases',
            'Dokumentasi lengkap untuk deployment',
          ],
        },
      },
      {
        number: 4,
        title: 'Detail Brief Konten',
        content: {
          'Use Cases Utama': [
            'Cek saldo rekening',
            'Verifikasi terakhir transaksi',
            'Request pemblokiran kartu',
            'General FAQ tentang produk bank',
          ],
          'Technical Requirements': [
            'Integrasi dengan API Bank Dummy',
            'NLP Engine minimal: Intent classification accuracy 95%',
            'Response time < 2 detik',
            'Database untuk menyimpan conversation logs',
          ],
          'Security Constraints': [
            'Enkripsi data sensitif (nomor rekening)',
            'Verification layer untuk transaksi penting',
            'Rate limiting untuk mencegah abuse',
          ],
        },
      },
    ],
    steps: [
      'Identifikasi Intent (Tujuan) utama pengguna perbankan.',
      'Buat diagram alur percakapan (Conversation Flow).',
      'Implementasikan slot data untuk menangkap nomor rekening.',
      'Hubungkan ke database simulasi untuk verifikasi saldo.',
      'Uji coba skenario error dan penanganan kata-kata kasar.',
    ],
    interactiveSteps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Setup Environment',
        description: 'Siapkan development environment dengan tools yang diperlukan.',
        question: 'Sudah install Node.js & npm?',
        choices: [
          {
            id: 'opt-1a',
            label: 'Sudah punya Node.js',
            guidance: 'Bagus! Anda bisa langsung lanjut ke langkah berikutnya.',
            nextStepId: 'step-2',
          },
          {
            id: 'opt-1b',
            label: 'Belum punya',
            guidance: 'Silakan download Node.js (LTS version) di https://nodejs.org. Setelah instalasi selesai, verifikasi dengan mengetik node -v di terminal Anda.',
            nextStepId: 'step-2',
          },
        ],
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Buka Editor (Cursor/VS Code)',
        description: 'Buka project folder Anda menggunakan editor pilihan.',
        guidance: 'Kamu bisa gunakan Cursor atau VS Code. Fokusnya: pastikan workspace project sudah terbuka dengan benar.',
        choices: [
          {
            id: 'opt-2a',
            label: 'Sudah siap dengan Editor',
            nextStepId: 'step-3',
          },
          {
            id: 'opt-2b',
            label: 'Belum punya Cursor',
            guidance: 'Anda bisa download Cursor secara gratis di https://cursor.sh. Login dan ikuti setup awalnya.',
            nextStepId: 'step-3',
          },
        ],
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'Install Dependencies',
        description: 'Install semua package yang diperlukan.',
        guidance: 'Jalankan: npm install',
        question: 'Berhasil install dependencies?',
        choices: [
          { id: 'opt-3a', label: 'Berhasil ✓', nextStepId: 'step-4' },
          {
            id: 'opt-3b',
            label: 'Ada error',
            guidance: 'Coba: rm -rf node_modules package-lock.json, lalu npm install lagi. Atau buka chat AI untuk bantuan debugging.',
            nextStepId: 'step-4',
          },
        ],
      },
      {
        id: 'step-4',
        stepNumber: 4,
        title: 'Setup Environment Variables',
        description: 'Konfigurasi API keys dan database connection.',
        guidance: 'Copy .env.example ke .env, lalu isi dengan credentials Anda.',
        requiresExplanation: 'Jelaskan apa saja env variables yang Anda setup',
      },
      {
        id: 'step-5',
        stepNumber: 5,
        title: 'Run Development Server',
        description: 'Jalankan aplikasi di development mode.',
        guidance: 'Jalankan: npm run dev',
        question: 'Berhasil jalan di localhost:3000?',
        choices: [
          { id: 'opt-5a', label: 'Berhasil ✓' },
          {
            id: 'opt-5b',
            label: 'Ada error / port collision',
            guidance: 'Coba gunakan port berbeda: PORT=4000 npm run dev. Atau cek apakah ada process lain pakai port 3000.',
            requiresProof: true,
            requiresExplanation: true,
          },
        ],
      },
      {
        id: 'step-6',
        stepNumber: 6,
        title: 'Buat Conversation Flow Diagram',
        description: 'Design alur percakapan chatbot dengan Lucidchart atau miro.com.',
        requiresExplanation: 'Upload screenshot atau link diagram Anda (berisi minimal 3 intent: cek saldo, transfer, blokir kartu)',
      },
      {
        id: 'step-7',
        stepNumber: 7,
        title: 'Implementasi Intent Recognition',
        description: 'Bangun logic untuk detect intent dari user input.',
        requiresExplanation: 'Jelaskan approach Anda: rule-based atau ML-based? Sebutkan intent apa saja yang bisa dikenali.',
      },
      {
        id: 'step-8',
        stepNumber: 8,
        title: 'Integrasikan API Bank',
        description: 'Connect ke dummy bank API untuk fetch balance & transaction history.',
        guidance: 'Gunakan provided API endpoint: https://api.example.com/bank',
        requiresExplanation: 'Kirimkan test request & response untuk verifikasi integrasi berhasil.',
      },
      {
        id: 'step-9',
        stepNumber: 9,
        title: 'Testing & Quality Assurance',
        description: 'Test semua skenario: success flow, error handling, edge cases.',
        requiresExplanation: 'Upload testing report dengan 20+ test cases dan hasil testing Anda.',
      },
      {
        id: 'step-10',
        stepNumber: 10,
        title: 'Submit Final Project',
        description: 'Kirim deliverable akhir Anda untuk review.',
        guidance: 'Pastikan sudah termasuk: source code, dokumentasi, conversation logs, dan deployment guide.',
      },
    ],
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?w=800',
    category: 'Cloud & AI',
  },
];

export default function ProjectExplore() {
  const [searchParams] = useSearchParams();
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
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiStreamingText, setAiStreamingText] = useState('');
  const [projects, setProjects] = useState<Project[]>(DUMMY_PROJECTS);
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

        const result = await fetchProjects();
        const items = result.items as Project[];

        if (!cancelled && Array.isArray(items) && items.length > 0) {
          setProjects(items);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
        if (!cancelled) {
          setProjectError('Data project dari server belum tersedia. Menampilkan project contoh.');
          setProjects(DUMMY_PROJECTS);
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
    const projectTitle = searchParams.get('title');
    if (projectTitle) {
      const found = projects.find(p => p.title.toLowerCase() === projectTitle.toLowerCase());
      if (found) {
        setActiveProject(found);
      }
    }
  }, [searchParams, projects]);

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
          context: `User sedang mengerjakan project: ${activeProject.title}. Brief: ${activeProject.introduction}`,
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


  const handleStepChoice = (stepId: string, choiceId: string, nextStepId?: string | null) => {
    setStepChoices((prev) => ({ ...prev, [stepId]: choiceId }));
    if (nextStepId) {
      setCurrentStepId(nextStepId);
    }
  };

  if (activeProject) {
    const steps = activeProject.interactiveSteps;

    return (
      <div className="page-shell fixed inset-0 z-60 flex overflow-hidden bg-(--bg-primary) text-slate-800">
        {/* Main Content Area */}
        <div className={`relative flex h-full flex-1 flex-col overflow-y-auto transition-all duration-500 ease-in-out ${isAiOpen ? 'mr-120' : ''}`}>
          <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
            <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveProject(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-blue-700">Project Workspace</p>
                  <h2 className="max-w-50 truncate text-sm font-black text-gray-900 sm:max-w-sm">{activeProject.title}</h2>
                </div>
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                <button className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:text-gray-900">
                  <Share2 size={15} /> Pamerkan
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black">
                  <Trophy size={15} /> SELESAI
                </button>
                <button
                  onClick={() => setIsAiOpen(!isAiOpen)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${isAiOpen ? 'bg-gray-900 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                >
                  <Sparkles size={18} />
                </button>
              </div>
            </div>
          </header>

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
                  {activeProject.skills.map((skill, idx) => (
                    <span
                      key={skill}
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
                      const selectedChoiceId = stepChoices[step.id];
                      const selectedChoice = step.choices?.find((choice) => choice.id === selectedChoiceId);
                      const proofValue = stepProofs[step.id] || '';
                      const isStepCompleted = completedSteps.includes(step.id);
                      const isFirst = index === 0;
                      const isSecond = step.stepNumber === 2;
                      const isThird = step.stepNumber === 3;

                      return (
                        <article key={step.id} className="relative scroll-mt-24">
                          {!isFirst && <div className="absolute left-5 top-0 hidden h-full w-px bg-gray-200 md:block" />}
                          <div className="grid gap-5 md:grid-cols-[40px_minmax(0,1fr)] md:gap-8">
                            <div className="relative z-10 flex md:justify-center">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-black transition ${isStepCompleted ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-(--bg-primary) text-slate-900'}`}>
                                {isStepCompleted ? <Check size={16} /> : step.stepNumber}
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div className="space-y-3">
                                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                                  Step {step.stepNumber} of {steps.length}
                                </div>
                                <h3 className="max-w-3xl text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">{step.title}</h3>
                                <p className="max-w-3xl text-base leading-8 text-gray-700 sm:text-[17px]">{step.description}</p>
                              </div>

                              {isFirst && (
                                <div className="space-y-6">
                                  <ul className="space-y-4 text-base leading-8 text-gray-700">
                                    <li className="flex gap-3">
                                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-400" />Pastikan Node.js sudah terpasang di perangkat Anda.
                                    </li>
                                    <li className="flex gap-3">
                                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-400" />Buka terminal lalu cek versi dengan <span className="mx-1 rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-xs font-medium text-gray-800">node -v</span>.
                                    </li>
                                    <li className="flex gap-3">
                                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-400" />Jika belum ada, unduh versi LTS dari situs resmi dan lanjutkan setelah instalasi selesai.
                                    </li>
                                  </ul>

                                  <div className="flex flex-wrap items-center gap-8 border-b border-gray-200 pb-1 text-sm font-semibold">
                                    {step.choices?.map((choice) => {
                                      const isSelected = selectedChoiceId === choice.id;
                                      return (
                                        <button
                                          key={choice.id}
                                          type="button"
                                          onClick={() => handleStepChoice(step.id, choice.id, choice.nextStepId)}
                                          className={`pb-3 transition ${isSelected ? 'border-b-2 border-gray-900 text-gray-900' : 'border-b-2 border-transparent text-gray-400 hover:text-gray-700'}`}
                                        >
                                          {choice.label}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {selectedChoice?.guidance && <p className="max-w-2xl text-sm leading-7 text-gray-600">{selectedChoice.guidance}</p>}
                                </div>
                              )}

                              {isSecond && (
                                <div className="space-y-8">
                                  <p className="max-w-2xl text-base leading-8 text-gray-700">Buka project folder Anda menggunakan editor pilihan.</p>

                                  <div className="rounded-2xl bg-stone-100 p-8">
                                    <div className="space-y-6">
                                      <div className="aspect-video rounded-xl bg-stone-200/80 shadow-sm flex items-center justify-center text-stone-400">
                                        <div className="flex flex-col items-center gap-2 text-sm font-semibold">
                                          <ImageIcon size={28} />
                                          Screenshot editor Anda
                                        </div>
                                      </div>
                                      <div className="aspect-video rounded-xl bg-stone-200/80 shadow-sm flex items-center justify-center text-stone-400">
                                        <div className="flex flex-col items-center gap-2 text-sm font-semibold">
                                          <ImageIcon size={28} />
                                          Screenshot workspace / project folder
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <p className="text-xs font-medium text-gray-500">Dua area di atas disediakan untuk screenshot langkah Anda dan bukti setup editor.</p>

                                  <div className="rounded-2xl border-2 border-dashed border-gray-300 px-5 py-7 text-sm text-gray-500">Upload bukti screenshot Editor Anda di sini</div>
                                </div>
                              )}

                              {isThird && (
                                <div className="space-y-8">
                                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                                    <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3">
                                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                                        <Code2 size={15} className="text-blue-700" />
                                        npm install
                                      </div>
                                      <button type="button" className="text-gray-400 transition hover:text-gray-700" aria-label="Copy code">
                                        <Copy size={15} />
                                      </button>
                                    </div>
                                    <pre className="overflow-x-auto pt-4 text-sm leading-7 text-gray-800"><code>{`npm install\nnpm run dev\n`}</code></pre>
                                  </div>

                                  <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">Paste log error Anda di sini</label>
                                    <textarea
                                      value={proofValue}
                                      onChange={(event) => setStepProofs((prev) => ({ ...prev, [step.id]: event.target.value }))}
                                      placeholder="Tempel log terminal, error, atau catatan singkat Anda di sini..."
                                      className="min-h-36 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 text-gray-800 outline-none transition focus:border-gray-400 focus:ring-0"
                                    />
                                  </div>

                                  <div className="flex flex-wrap items-center gap-3">
                                    {step.choices?.map((choice) => {
                                      const isSelected = selectedChoiceId === choice.id;
                                      return (
                                        <button
                                          key={choice.id}
                                          type="button"
                                          onClick={() => handleStepChoice(step.id, choice.id, choice.nextStepId)}
                                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${isSelected ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-800'}`}
                                        >
                                          {choice.label}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {selectedChoice?.guidance && (
                                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm leading-7 text-gray-700">
                                      {selectedChoice.guidance}
                                    </div>
                                  )}
                                </div>
                              )}

                              {!isFirst && !isSecond && !isThird && (
                                <div className="space-y-6">
                                  {step.guidance && <p className="max-w-3xl text-base leading-8 text-gray-700 whitespace-pre-wrap">{step.guidance}</p>}

                                  {step.choices && step.choices.length > 0 && (
                                    <div className="space-y-3">
                                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Pilihan kondisi</p>
                                      <div className="flex flex-wrap gap-3">
                                        {step.choices.map((choice) => {
                                          const isSelected = selectedChoiceId === choice.id;
                                          return (
                                            <button
                                              key={choice.id}
                                              type="button"
                                              onClick={() => handleStepChoice(step.id, choice.id, choice.nextStepId)}
                                              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${isSelected ? 'border-gray-900 text-gray-900' : 'border-gray-300 text-gray-500 hover:border-gray-500 hover:text-gray-800'}`}
                                            >
                                              {choice.label}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {(step.requiresExplanation || selectedChoice?.requiresProof || selectedChoice?.requiresExplanation) && (
                                    <div className="space-y-3 border-l-2 border-blue-100 pl-4">
                                      {step.requiresExplanation && (
                                        <textarea
                                          value={proofValue}
                                          onChange={(event) => setStepProofs((prev) => ({ ...prev, [step.id]: event.target.value }))}
                                          placeholder="Tulis penjelasan singkat di sini..."
                                          className="min-h-28 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 text-gray-800 outline-none transition focus:border-gray-400 focus:ring-0"
                                        />
                                      )}
                                      {selectedChoice?.requiresProof && <p className="text-sm leading-7 text-gray-600">Upload screenshot atau tempel link bukti pada bagian akhir halaman.</p>}
                                      {selectedChoice?.requiresExplanation && !step.requiresExplanation && <p className="text-sm leading-7 text-gray-700">{selectedChoice.requiresExplanation}</p>}
                                    </div>
                                  )}

                                  {selectedChoice?.guidance && (
                                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm leading-7 text-gray-700">
                                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500">If you picked this path</p>
                                      <p className="whitespace-pre-wrap">{selectedChoice.guidance}</p>
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-3 pt-2">
                                <button
                                  onClick={() => toggleStepCompletion(step.id)}
                                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition-all duration-300 ${isStepCompleted ? 'border-emerald-700 bg-emerald-700 text-white shadow-lg shadow-emerald-200' : 'border-gray-300 bg-transparent text-gray-700 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50'}`}
                                >
                                  <Check size={16} />
                                  {isStepCompleted ? 'Selesai' : 'Tandai Selesai'}
                                </button>

                                <button
                                  onClick={() => setIsAiOpen(true)}
                                  className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-5 py-2.5 text-sm font-bold text-blue-700 transition-all hover:bg-blue-100/80"
                                >
                                  <Sparkles size={16} />
                                  Tanya AI
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

        {/* AI Assistant Side Panel */}
        <aside
          className={`fixed right-0 top-0 z-60 h-screen border-l border-slate-200 bg-white transition-all duration-500 ease-in-out ${isAiOpen ? 'w-120 opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'}`}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar Header */}
            <div className="border-b border-gray-100 p-6 pt-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="file:///C:/Users/Rislan/.gemini/antigravity/brain/6b2fba9b-7dae-4660-bdc2-a0c0f9762fa6/ai_assistant_avatar_1778074692948.png"
                      alt="AI Rina"
                      className="h-12 w-12 rounded-full object-cover shadow-sm"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900">AI Rina</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Project Assistant</span>
                      <span className="h-1 w-1 rounded-full bg-gray-300" />
                      <span className="text-[10px] font-bold text-gray-400">Online</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsAiOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {aiMessages.length === 0 ? (
                <div className="flex flex-col items-center pt-8 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-700">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="mb-2 text-xl font-black tracking-tight text-gray-900">
                    Chat about {activeProject.title}
                  </h3>
                  <p className="mb-8 text-sm leading-6 text-gray-600">
                    Mari mulai diskusi tentang <span className="font-bold text-blue-700">{activeProject.title}</span>.
                    Saya siap membantu Anda dengan pertanyaan atau wawasan terkait brief ini.
                  </p>

                  <div className="flex flex-col gap-2 w-full">
                    {['Jelaskan tentang brief ini', 'Apa yang harus difokuskan?', 'Berikan beberapa ide'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleAiSend(suggestion)}
                        className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-left text-xs font-bold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {aiMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium whitespace-pre-wrap ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800'}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {/* Streaming text — muncul kata demi kata */}
                  {aiStreamingText && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium bg-slate-100 text-slate-800 whitespace-pre-wrap">
                        {aiStreamingText}<span className="inline-block w-1.5 h-4 bg-blue-500 animate-pulse ml-0.5 rounded-sm" />
                      </div>
                    </div>
                  )}
                  {isAiLoading && !aiStreamingText && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 rounded-2xl">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Input */}
            <div className="border-t border-gray-100 p-6 pb-10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
                  placeholder="Ketik pesan Anda..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-4 pl-5 pr-14 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white"
                />
                <button
                  onClick={() => handleAiSend()}
                  disabled={!aiInput.trim() || isAiLoading}
                  className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white transition hover:bg-black disabled:opacity-30"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Re-add floating toggle button if needed, but here it's integrated in header */}
        {!isAiOpen && (
          <div className="fixed bottom-8 right-8 z-60">
            <button
              onClick={() => setIsAiOpen(true)}
              className="group relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 text-white shadow-2xl transition-all hover:scale-110 hover:bg-black active:scale-95"
            >
              <div className="absolute -top-12 right-0 hidden rounded-xl bg-gray-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl group-hover:block">
                Tanya AI
                <div className="absolute -bottom-1 right-6 h-2 w-2 rotate-45 bg-gray-900" />
              </div>
              <Sparkles size={24} className="transition-transform group-hover:rotate-12" />
              <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-[#fcfbfa] bg-blue-500" />
            </button>
          </div>
        )}
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
                <img 
                  src={project.image || "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=1200"} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt={project.title} 
                />
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
