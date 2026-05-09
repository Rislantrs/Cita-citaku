import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Plus, Trash2, Link as LinkIcon, Send,
  CheckCircle2, Zap,
  Target, Lightbulb,
  BookOpen, Edit3, FileText, ArrowLeft, Search,
  Briefcase, Save, AlertCircle, X, ChevronDown, ChevronUp,
  ImageIcon, Layout, ListChecks, Upload, Globe, Clock, BarChart, Info, Book, FileCode, DollarSign, Check,
  CreditCard, ChevronRight, AlertTriangle, Trophy, Loader2, School, Sparkles
} from 'lucide-react';
import * as motion from 'motion/react-client';
import { ArticleBuilder, ContentBlock } from '../components/ArticleBuilder';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';
import SEO from '../components/SEO';
import { KategoriKarir, CAREER_CATEGORIES } from '../lib/careerCatalog';

type ContributionMode = 'none' | 'new_roadmap' | 'edit_roadmap' | 'add_content';

interface Resource {
  type: 'youtube' | 'course' | 'web' | 'book' | 'documentation';
  title: string;
  description: string;
  link: string;
  priceType: 'Gratis' | 'Berbayar';
}

interface PortfolioProject {
  title: string;
  background: string;
  skillsLearned: string;
  description?: string;
  contentBlocks?: ContentBlock[];
  mode: 'murni' | 'panduan';
  specifications: string[];
  imageSource: 'url' | 'local';
  image: string;
  localFile?: File | null;
  previewUrl?: string;
  interactiveSteps: any[];
}

interface RoadmapTopic {
  title: string;
  isDetailed: boolean;
  description: string;
  timeEstimate: string;
  difficulty: string;
  keyConcepts: string;
  summary: string;
  resources: Resource[];
  costNote: string;
  showProject: boolean;
  project: PortfolioProject;
}

interface RoadmapPhase {
  title: string;
  description: string;
  stats: string;
  topics: RoadmapTopic[];
  isSaved: boolean;
}

const EXISTING_ROADMAPS = [
  {
    id: '1',
    title: 'AWS Cloud Engineer',
    category: 'IT & Software',
    description: 'Jalur profesional untuk menguasai infrastruktur cloud AWS.',
    salaryIndo: 'Rp 15jt - 35jt',
    salaryUSA: '$110k - $180k',
    phases: [
      {
        title: 'Cloud Foundation',
        stats: '5 Materi',
        isSaved: true,
        topics: [
          {
            title: 'IAM & Security',
            isDetailed: false,
            description: 'Dasar keamanan AWS.',
            timeEstimate: '20 Min',
            difficulty: 'Easy Peasy',
            keyConcepts: 'IAM, MFA',
            summary: 'Keamanan adalah nomor satu di AWS...',
            resources: [{ type: 'web', title: 'AWS IAM Docs', description: 'Dokumentasi resmi', link: 'https://aws.amazon.com/iam/', priceType: 'Gratis' }],
            costNote: 'Gratis di Free Tier',
            showProject: true,
            project: { title: 'Setup Secure Account', background: 'Mengamankan akun baru', skillsLearned: 'Security Best Practices', specifications: ['Aktifkan MFA', 'Buat Admin User'], imageSource: 'url', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800' }
          },
          {
            title: 'Networking Dasar (VPC)',
            isDetailed: false,
            description: '',
            timeEstimate: '',
            difficulty: 'Easy Peasy',
            keyConcepts: '',
            summary: '',
            resources: [],
            costNote: '',
            showProject: false,
            project: { title: '', background: '', skillsLearned: '', mode: 'murni', specifications: [''], imageSource: 'url', image: '', interactiveSteps: [] }
          }
        ]
      }
    ]
  },
  { id: '2', title: 'Frontend Developer', category: 'IT & Software', description: 'Kuasai React dan modern CSS.', salaryIndo: 'Rp 8jt - 20jt', salaryUSA: '$80k - $140k', phases: [] }
];

interface SubmitRoadmapProps {
  isAdmin?: boolean;
  initialData?: any;
  onAction?: (action: string, data?: any) => void;
}

export default function SubmitRoadmap({ isAdmin = false, initialData = null, onAction }: SubmitRoadmapProps = {}) {
  const { user } = useAuth();
  const [mode, setMode] = useState<ContributionMode>(isAdmin ? (initialData ? 'edit_roadmap' : 'new_roadmap') : 'none');
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    judul: '',
    idKategori: 'tech' as KategoriKarir,
    tipe: 'skill_based' as 'skill_based' | 'education_based',
    deskripsi: '',
    infoGaji: {
      rentangIDR: '',
      rentangUSD: '',
      penjelasan: ''
    },
    infoPendidikan: {
      jurusan: [''],
      durasi: '',
      jalurAkademik: '',
      gelar: ''
    },
    materiBelajar: [{ judul: '', tipe: 'video' as const, link: '' }],
    daftarBuku: [{ judul: '', penulis: '', link: '' }],
    referensiDigital: [{ judul: '', tipe: 'youtube' as const, link: '' }],
  });

  const [faqs, setFaqs] = useState<{ tanya: string, jawab: string }[]>([{ tanya: '', jawab: '' }]);
  const [topUniversities, setTopUniversities] = useState<{ local: string[], global: string[] }>({ local: [''], global: [''] });
  const [universityWorld, setUniversityWorld] = useState({
    ringkasan: '',
    keahlianWajib: [''],
    alasanMemilih: [{ judul: '', deskripsi: '' }]
  });

  const createEmptyTopic = (): RoadmapTopic => ({
    title: '',
    isDetailed: false,
    description: '',
    timeEstimate: '',
    difficulty: 'Easy Peasy',
    keyConcepts: '',
    summary: '',
    resources: [{ type: 'youtube', title: '', description: '', link: '', priceType: 'Gratis' }],
    costNote: '',
    showProject: false,
    project: { title: '', background: '', skillsLearned: '', mode: 'murni', specifications: [''], imageSource: 'url', image: '', interactiveSteps: [] }
  });

  const [phases, setPhases] = useState<RoadmapPhase[]>([
    { title: '', description: '', stats: '', isSaved: false, topics: [createEmptyTopic()] }
  ]);

  const handleSelectRoadmap = (roadmap: any) => {
    if (!roadmap) return;
    
    try {
      setFormData({
        judul: roadmap.judul || roadmap.title || '',
        idKategori: roadmap.idKategori || roadmap.categoryId || 'tech',
        tipe: roadmap.tipe || roadmap.type || 'skill_based',
        deskripsi: roadmap.deskripsi || roadmap.description || '',
        infoGaji: {
          rentangIDR: roadmap.infoGaji?.rentangIDR || roadmap.salaryIndo || '',
          rentangUSD: roadmap.infoGaji?.rentangUSD || roadmap.salaryUSA || '',
          penjelasan: roadmap.infoGaji?.penjelasan || ''
        },
        infoPendidikan: {
          jurusan: roadmap.infoPendidikan?.jurusan || roadmap.recommendationMajors || [''],
          durasi: roadmap.infoPendidikan?.durasi || '',
          jalurAkademik: roadmap.infoPendidikan?.jalurAkademik || '',
          gelar: roadmap.infoPendidikan?.gelar || ''
        },
        materiBelajar: (roadmap.materiBelajar || [{ judul: '', tipe: 'video', link: '' }]).map((m: any) => ({
          judul: m.judul || '',
          tipe: m.tipe || 'video',
          link: m.link || ''
        })),
        daftarBuku: (roadmap.daftarBuku || roadmap.books || [{ judul: '', penulis: '', link: '' }]).map((b: any) => ({
          judul: b.judul || b.title || '',
          penulis: b.penulis || '',
          link: b.link || ''
        })),
        referensiDigital: (roadmap.referensiDigital || [{ judul: '', tipe: 'youtube', link: '' }]).map((r: any) => ({
          judul: r.judul || '',
          tipe: r.tipe || 'youtube',
          link: r.link || ''
        })),
      });

      setFaqs((roadmap.faqs || []).map((f: any) => ({
        tanya: f.tanya || f.q || '',
        jawab: f.jawab || f.a || ''
      })) || [{ tanya: '', jawab: '' }]);

      setTopUniversities(roadmap.universitasTerbaik || roadmap.topUniversities || { local: [''], global: [''] });

      setUniversityWorld({
        ringkasan: roadmap.duniaPerkuliahan?.ringkasan || roadmap.universityWorld?.ringkasan || roadmap.universityWorld?.overview || '',
        keahlianWajib: roadmap.duniaPerkuliahan?.keahlianWajib || roadmap.universityWorld?.keahlianWajib || roadmap.universityWorld?.requiredSkills || [''],
        alasanMemilih: (roadmap.duniaPerkuliahan?.alasanMemilih || roadmap.universityWorld?.alasanMemilih || roadmap.universityWorld?.whyChoose || [{ judul: '', deskripsi: '' }]).map((a: any) => ({
          judul: a.judul || a.title || '',
          deskripsi: a.deskripsi || a.desc || ''
        }))
      });

      const roadmapPhases = roadmap.phases || roadmap.roadmap || [];
      if (roadmapPhases.length > 0) {
        setPhases(roadmapPhases.map((r: any) => ({
          title: r.judul || r.title || r.fase || '',
          description: r.deskripsi || r.desc || '',
          stats: r.meta || r.stats || '',
          isSaved: true,
          topics: (r.topics || r.proyek || []).map((p: any) => {
             if (typeof p === 'string') {
                return { ...createEmptyTopic(), title: p };
             }
             return {
                ...createEmptyTopic(),
                title: p.judul || p.title || '',
                description: p.deskripsi || p.description || '',
                summary: p.summary || '',
                timeEstimate: p.timeEstimate || '',
                difficulty: p.difficulty || 'Easy Peasy',
                showProject: !!p.project,
                project: p.project ? {
                   ...createEmptyTopic().project,
                   ...p.project,
                   contentBlocks: p.project.contentBlocks || []
                } : createEmptyTopic().project,
                resources: (p.resources || []).map((res: any) => ({
                   type: res.type || 'web',
                   title: res.title || '',
                   description: res.description || '',
                   link: res.link || '',
                   priceType: res.priceType || 'Gratis'
                }))
             };
          })
        })));
      } else {
        setPhases([{ title: '', description: '', stats: '', isSaved: false, topics: [createEmptyTopic()] }]);
      }

      setSelectedRoadmapId(roadmap.id || roadmap.slug || 'temp-id');
    } catch (err) {
      console.error("Critical error in handleSelectRoadmap:", err);
      toast.error("Gagal memuat detail data. Struktur data mungkin tidak kompatibel.");
    }
  };

  // Auto-populate when initialData is provided (Admin Review Mode)
  useEffect(() => {
    if (initialData && !selectedRoadmapId) {
      handleSelectRoadmap(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const addPhase = () => setPhases([...phases, { title: '', description: '', stats: '', isSaved: false, topics: [createEmptyTopic()] }]);

  const toggleSavePhase = (idx: number) => {
    const next = [...phases];
    if (!next[idx].isSaved && (!next[idx].title || next[idx].title.trim() === '')) {
      setError('Judul Fase wajib diisi!');
      return;
    }
    next[idx].isSaved = !next[idx].isSaved;
    setPhases(next);
  };

  const updatePhase = (idx: number, field: keyof RoadmapPhase, val: any) => {
    const next = [...phases];
    next[idx] = { ...next[idx], [field]: val };
    setPhases(next);
  };

  const addTopic = (pIdx: number) => {
    const next = [...phases];
    next[pIdx].topics.push(createEmptyTopic());
    setPhases(next);
  };

  const updateTopicData = (pIdx: number, tIdx: number, field: keyof RoadmapTopic, val: any) => {
    const next = [...phases];
    next[pIdx].topics[tIdx] = { ...next[pIdx].topics[tIdx], [field]: val };
    setPhases(next);
  };

  const updateResource = (pIdx: number, tIdx: number, rIdx: number, field: keyof Resource, val: string) => {
    const next = [...phases];
    next[pIdx].topics[tIdx].resources[rIdx] = { ...next[pIdx].topics[tIdx].resources[rIdx], [field]: val };
    setPhases(next);
  };

  const addResource = (pIdx: number, tIdx: number) => {
    const next = [...phases];
    next[pIdx].topics[tIdx].resources.push({ type: 'web', title: '', description: '', link: '', priceType: 'Gratis' });
    setPhases(next);
  };

  const updateProject = (pIdx: number, tIdx: number, field: keyof PortfolioProject, val: any) => {
    const next = [...phases];
    next[pIdx].topics[tIdx].project = { ...next[pIdx].topics[tIdx].project, [field]: val };
    setPhases(next);
  };

  const handleImageUpload = (pIdx: number, tIdx: number, file: File) => {
    const preview = URL.createObjectURL(file);
    const next = [...phases];
    next[pIdx].topics[tIdx].project.localFile = file;
    next[pIdx].topics[tIdx].project.previewUrl = preview;
    setPhases(next);
  };

  const updateSpec = (pIdx: number, tIdx: number, sIdx: number, val: string) => {
    const next = [...phases];
    next[pIdx].topics[tIdx].project.specifications[sIdx] = val;
    setPhases(next);
  };

  const addSpec = (pIdx: number, tIdx: number) => {
    const next = [...phases];
    next[pIdx].topics[tIdx].project.specifications.push('');
    setPhases(next);
  };

  const addInteractiveStep = (pIdx: number, tIdx: number) => {
    const next = [...phases];
    if (!next[pIdx].topics[tIdx].project.interactiveSteps) {
      next[pIdx].topics[tIdx].project.interactiveSteps = [];
    }
    const newStep = {
      id: `step-${Date.now()}`,
      stepNumber: next[pIdx].topics[tIdx].project.interactiveSteps.length + 1,
      title: '',
      description: '',
      contentBlocks: [],
      mediaUrl: '',
      question: '',
      choices: [],
      requiresProof: false,
      requiresExplanation: false
    };
    next[pIdx].topics[tIdx].project.interactiveSteps.push(newStep);
    setPhases(next);
  };

  const updateInteractiveStep = (pIdx: number, tIdx: number, stepIdx: number, field: string, val: any) => {
    const next = [...phases];
    next[pIdx].topics[tIdx].project.interactiveSteps[stepIdx] = { ...next[pIdx].topics[tIdx].project.interactiveSteps[stepIdx], [field]: val };
    setPhases(next);
  };

  const addStepChoice = (pIdx: number, tIdx: number, stepIdx: number) => {
    const next = [...phases];
    const newChoice = {
      id: `opt-${Date.now()}`,
      label: '',
      guidance: '',
      requiresProof: false,
      requiresExplanation: false,
      nextStepId: '',
      contentBlocks: []
    };
    next[pIdx].topics[tIdx].project.interactiveSteps[stepIdx].choices = [...(next[pIdx].topics[tIdx].project.interactiveSteps[stepIdx].choices || []), newChoice];
    setPhases(next);
  };

  const updateStepChoice = (pIdx: number, tIdx: number, stepIdx: number, choiceIdx: number, field: string, val: any) => {
    const next = [...phases];
    next[pIdx].topics[tIdx].project.interactiveSteps[stepIdx].choices[choiceIdx] = { ...next[pIdx].topics[tIdx].project.interactiveSteps[stepIdx].choices[choiceIdx], [field]: val };
    setPhases(next);
  };

  const renderProjectForm = (pi: number, ti: number, topic: RoadmapTopic) => {
    if (!topic.showProject) {
      return (
        <button type="button" onClick={() => updateTopicData(pi, ti, 'showProject', true)} className="w-full py-4 rounded-xl bg-white border border-dashed border-emerald-300 text-emerald-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all"><Plus size={18} /> Tambah Proyek Portofolio (Opsional)</button>
      );
    }

    return (
      <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-md space-y-6 relative">
        <button type="button" onClick={() => updateTopicData(pi, ti, 'showProject', false)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 flex items-center gap-1 text-[10px] font-bold"><X size={14} /> HAPUS PROYEK</button>
        <div className="flex items-center gap-2 border-b border-slate-50 pb-4"><ListChecks size={20} className="text-emerald-600" /><h5 className="font-bold text-slate-900">Formulir Proyek Portofolio</h5></div>

        <input placeholder="Judul Proyek" className="h-10 w-full rounded-lg bg-slate-50 border-none px-3 font-bold text-sm" value={topic.project.title} onChange={(e) => updateProject(pi, ti, 'title', e.target.value)} />

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1"><label className="text-[10px] font-bold text-blue-600">Latar Belakang</label><textarea placeholder="..." rows={2} className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-sm" value={topic.project.background} onChange={(e) => updateProject(pi, ti, 'background', e.target.value)} /></div>
          <div className="space-y-1"><label className="text-[10px] font-bold text-emerald-600">Skill</label><textarea placeholder="..." rows={2} className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-sm" value={topic.project.skillsLearned} onChange={(e) => updateProject(pi, ti, 'skillsLearned', e.target.value)} /></div>
        </div>

        {/* MODE TOGGLE */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-fit mt-4">
          <button type="button" onClick={() => updateProject(pi, ti, 'mode', 'murni')} className={`px-4 py-2 text-xs font-bold rounded-md ${topic.project.mode === 'murni' || !topic.project.mode ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>MURNI (1 Tugas)</button>
          <button type="button" onClick={() => updateProject(pi, ti, 'mode', 'panduan')} className={`px-4 py-2 text-xs font-bold rounded-md ${topic.project.mode === 'panduan' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>PANDUAN (Step-by-Step)</button>
        </div>

        {topic.project.mode === 'murni' || !topic.project.mode ? (
          <div className="space-y-6 pt-4 border-t border-slate-50">
            {/* Visual Ref for Murni */}
            <div className="space-y-4">
              <div className="flex items-center justify-between"><label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2"><ImageIcon size={14} /> Visual / Workflow (Opsional)</label><div className="flex bg-slate-100 p-1 rounded-lg"><button type="button" onClick={() => updateProject(pi, ti, 'imageSource', 'url')} className={`px-3 py-1.5 text-[9px] font-bold rounded-md ${topic.project.imageSource === 'url' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>LINK URL</button><button type="button" onClick={() => updateProject(pi, ti, 'imageSource', 'local')} className={`px-3 py-1.5 text-[9px] font-bold rounded-md ${topic.project.imageSource === 'local' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>UPLOAD</button></div></div>
              {topic.project.imageSource === 'url' ? (<input placeholder="https://..." className="h-10 w-full rounded-xl bg-slate-50 border-none px-4 font-bold text-xs" value={topic.project.image} onChange={(e) => updateProject(pi, ti, 'image', e.target.value)} />) : (<div className="h-28 w-full rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}><input type="file" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleImageUpload(pi, ti, e.target.files[0])} accept="image/*" />{topic.project.previewUrl || topic.project.image ? <img src={topic.project.previewUrl || topic.project.image} className="h-full w-full object-cover rounded-xl" alt="Preview" /> : <Upload className="text-slate-300" size={24} />}</div>)}
            </div>
            {/* Brief Deskripsi for Murni */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-amber-500 uppercase flex items-center gap-2"><Target size={12} /> Instruksi & Brief Tugas Lengkap (Artikel)</label>
              <ArticleBuilder
                blocks={topic.project.contentBlocks || []}
                onChange={(blocks) => updateProject(pi, ti, 'contentBlocks', blocks)}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6 pt-4 border-t border-slate-50">
            <div className="flex items-center justify-between"><label className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-2">INTERACTIVE STEPS</label><button type="button" onClick={() => addInteractiveStep(pi, ti)} className="text-[10px] font-bold text-blue-600 hover:underline">+ Tambah Step</button></div>
            <div className="space-y-6">
              {topic.project.interactiveSteps?.map((step, stepIdx) => (
                <div key={step.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-4 relative">
                  <button type="button" onClick={() => { const n = [...phases]; n[pi].topics[ti].project.interactiveSteps = n[pi].topics[ti].project.interactiveSteps.filter((_, i) => i !== stepIdx); setPhases(n); }} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                  <div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">{stepIdx + 1}</span><h6 className="font-bold text-xs">Konfigurasi Step</h6></div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input placeholder="Judul Step (misal: Setup Environment)" className="h-9 w-full rounded-lg bg-white border border-slate-100 px-3 font-bold text-xs shadow-sm" value={step.title} onChange={(e) => updateInteractiveStep(pi, ti, stepIdx, 'title', e.target.value)} />
                    <input placeholder="Media URL (Image/Video Youtube) - Opsional" className="h-9 w-full rounded-lg bg-white border border-slate-100 px-3 font-bold text-xs shadow-sm" value={step.mediaUrl || ''} onChange={(e) => updateInteractiveStep(pi, ti, stepIdx, 'mediaUrl', e.target.value)} />
                  </div>
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Konten Instruksi Step (Artikel)</label>
                    <ArticleBuilder
                      blocks={step.contentBlocks || []}
                      onChange={(blocks) => updateInteractiveStep(pi, ti, stepIdx, 'contentBlocks', blocks)}
                    />
                  </div>

                  {/* Mode Pertanyaan / Percabangan vs Simple Checklist */}
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-500">Pertanyaan Percabangan (Kosongkan jika hanya 1 ceklis biasa)</label>
                      <input placeholder="Misal: Apakah berhasil dijalankan di localhost?" className="h-9 w-full rounded-lg bg-white border border-slate-100 px-3 font-bold text-xs" value={step.question || ''} onChange={(e) => updateInteractiveStep(pi, ti, stepIdx, 'question', e.target.value)} />
                    </div>

                    {!step.question ? (
                      <div className="flex gap-4 items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer"><input type="checkbox" checked={step.requiresProof || false} onChange={(e) => updateInteractiveStep(pi, ti, stepIdx, 'requiresProof', e.target.checked)} className="rounded border-slate-300 text-blue-600" /> Wajib Screenshot</label>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer"><input type="checkbox" checked={step.requiresExplanation || false} onChange={(e) => updateInteractiveStep(pi, ti, stepIdx, 'requiresExplanation', e.target.checked)} className="rounded border-slate-300 text-blue-600" /> Wajib Penjelasan Singkat</label>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between"><label className="text-[10px] font-bold text-emerald-600">PILIHAN JAWABAN (CHOICES)</label><button type="button" onClick={() => addStepChoice(pi, ti, stepIdx)} className="text-[10px] font-bold text-blue-600 hover:underline">+ Tambah Pilihan</button></div>
                        {step.choices?.map((choice: any, choiceIdx: number) => (
                          <div key={choice.id} className="p-3 bg-white border border-slate-100 shadow-sm rounded-lg space-y-3 relative">
                            <button type="button" onClick={() => { const n = [...phases]; n[pi].topics[ti].project.interactiveSteps[stepIdx].choices = n[pi].topics[ti].project.interactiveSteps[stepIdx].choices.filter((_: any, i: number) => i !== choiceIdx); setPhases(n); }} className="absolute top-3 right-3 text-slate-200 hover:text-red-500"><Trash2 size={14} /></button>
                            <input placeholder="Label Pilihan (misal: Berhasil)" className="h-8 w-full md:w-1/2 rounded-md bg-slate-50 border-none px-3 font-bold text-xs" value={choice.label} onChange={(e) => updateStepChoice(pi, ti, stepIdx, choiceIdx, 'label', e.target.value)} />
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Guidance / Bantuan (Artikel)</label>
                              <ArticleBuilder
                                blocks={choice.contentBlocks || []}
                                onChange={(blocks) => updateStepChoice(pi, ti, stepIdx, choiceIdx, 'contentBlocks', blocks)}
                              />
                            </div>
                            <div className="flex gap-4 items-center flex-wrap pt-2 border-t border-slate-50">
                              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-600 cursor-pointer"><input type="checkbox" checked={choice.requiresProof || false} onChange={(e) => updateStepChoice(pi, ti, stepIdx, choiceIdx, 'requiresProof', e.target.checked)} className="rounded border-slate-300 text-blue-600" /> Wajib Screenshot</label>
                              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-600 cursor-pointer"><input type="checkbox" checked={choice.requiresExplanation || false} onChange={(e) => updateStepChoice(pi, ti, stepIdx, choiceIdx, 'requiresExplanation', e.target.checked)} className="rounded border-slate-300 text-blue-600" /> Wajib Penjelasan</label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const isTopicComplete = (topic: RoadmapTopic) => {
    return topic.summary.trim().length > 50 && topic.resources.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      phases,
      faqs,
      topUniversities,
      universityWorld,
      updatedAt: new Date().toISOString()
    };

    if (isAdmin && onAction) {
      // For Admin, we pass the data back to AdminDashboard to handle Firestore
      await onAction('approve', payload);
      setIsSubmitting(false);
      return;
    }

    try {
      // Regular User Submit to Firestore
      const submissionRef = collection(db, 'submissions');
      await addDoc(submissionRef, {
        ...payload,
        author: user?.displayName || 'Anonim',
        authorUid: user?.uid || 'anonymous',
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setIsSubmitting(false);
      setIsSuccess(true);

      // Reset setelah sukses
      setTimeout(() => {
        setIsSuccess(false);
        setMode('none');
        setSelectedRoadmapId(null);
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting contribution", error);
      const msg = error?.message || "Gagal mengirim kontribusi.";
      setError(`Terjadi kesalahan: ${msg}. Pastikan kamu sudah login dan internet stabil.`);
      toast.error(`Gagal mengirim: ${msg}`);
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (isSuccess) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-24 w-24 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-8">
          <Check size={48} strokeWidth={3} />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Berhasil Terkirim!</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-500 font-bold max-w-sm">Kontribusi Anda sedang dalam tahap peninjauan admin. Terima kasih telah membantu komunitas!</motion.p>
      </div>
    );
  }

  // 1. LOGIN CHECK
  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="mb-8 h-20 w-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto">
          <Sparkles size={40} />
        </div>
        <h1 className="text-3xl font-black mb-4 text-slate-900 tracking-tight uppercase">Akses Terbatas</h1>
        <p className="text-slate-500 font-bold mb-8 max-w-md mx-auto">
          Kamu harus login terlebih dahulu untuk bisa berkontribusi di komunitas Cita-citaku.
        </p>
        <Link to="/login" className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-10 py-4 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  // 1. HOME SCREEN
  if (mode === 'none') {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 lg:px-6 text-center">
        <h1 className="text-3xl font-black mb-12 text-slate-900 tracking-tight uppercase">Contribution Center</h1>
        <div className="grid gap-6 md:grid-cols-3">
          <button onClick={() => setMode('new_roadmap')} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="mb-6 h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform"><Plus size={28} /></div>
            <h3 className="text-xl font-bold mb-2">Roadmap Baru</h3>
            <p className="text-xs font-bold text-slate-400">Buat panduan karir dari nol</p>
          </button>
          <button onClick={() => setMode('edit_roadmap')} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="mb-6 h-16 w-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform"><Edit3 size={28} /></div>
            <h3 className="text-xl font-bold mb-2">Edit Roadmap</h3>
            <p className="text-xs font-bold text-slate-400">Perbarui data roadmap eksis</p>
          </button>
          <button onClick={() => setMode('add_content')} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="mb-6 h-16 w-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform"><FileText size={28} /></div>
            <h3 className="text-xl font-bold mb-2">Lengkapi Konten</h3>
            <p className="text-xs font-bold text-slate-400">Isi detail materi yang kosong</p>
          </button>
        </div>
      </div>
    );
  }

  // 2. SELECTION SCREEN
  if ((mode === 'edit_roadmap' || mode === 'add_content') && !selectedRoadmapId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <button onClick={() => setMode('none')} className="mb-10 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"><ArrowLeft size={16} /> Kembali ke Menu</button>
        <h2 className="text-2xl font-black mb-8 text-slate-900">{mode === 'edit_roadmap' ? 'Pilih Roadmap untuk Diedit' : 'Pilih Roadmap untuk Dilengkapi'}</h2>
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input placeholder="Cari judul roadmap..." className="h-14 w-full rounded-2xl bg-white border border-slate-100 pl-12 pr-4 font-bold text-base shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="space-y-4">
          {EXISTING_ROADMAPS.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).map(roadmap => (
            <button key={roadmap.id} onClick={() => handleSelectRoadmap(roadmap)} className={`w-full p-6 bg-white rounded-2xl border flex items-center justify-between hover:shadow-md transition-all group ${mode === 'add_content' ? 'border-emerald-100 hover:border-emerald-300' : 'border-slate-100 hover:border-blue-200'}`}>
              <div className="text-left">
                <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{roadmap.title}</h4>
                <p className="text-xs font-bold text-slate-400">{roadmap.category}</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-emerald-600 transition-colors" size={20} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 3. SPECIAL VIEW FOR "LENGKAPI KONTEN"
  if (mode === 'add_content' && selectedRoadmapId) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6 pb-40">
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => { setMode('none'); setSelectedRoadmapId(null); }} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors"><ArrowLeft size={16} /> Kembali</button>
          <div className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-2 border border-emerald-100 animate-pulse"><Zap size={14} /> Misi: Lengkapi Detail Materi</div>
        </div>
        <div className="mb-12 bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm flex items-center gap-8">
          <div className="h-20 w-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Trophy size={40} /></div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-slate-900">{formData.judul}</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Bantu komunitas dengan melengkapi detail materi di bawah ini!</p>
          </div>
        </div>
        <div className="space-y-6">
          {phases.map((phase, pi) => (
            <div key={pi} className="space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest pl-4 flex items-center gap-2"><Layout size={14} /> {phase.title}</h3>
              <div className="grid gap-4">
                {phase.topics.map((topic, ti) => {
                  const isComplete = isTopicComplete(topic);
                  return (
                    <div key={ti} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all">
                      <div className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isComplete ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 animate-pulse'}`}>
                            {isComplete ? <Check size={20} /> : <AlertTriangle size={20} />}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{topic.title}</h4>
                            <p className={`text-[10px] font-black uppercase ${isComplete ? 'text-emerald-500' : 'text-amber-500'}`}>{isComplete ? 'Sudah Lengkap' : 'Butuh Detail Summary, Referensi, atau Proyek'}</p>
                          </div>
                        </div>
                        <button onClick={() => updateTopicData(pi, ti, 'isDetailed', !topic.isDetailed)} className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${topic.isDetailed ? 'bg-slate-900 text-white shadow-lg' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'}`}>{topic.isDetailed ? 'Tutup' : 'Lengkapi Sekarang'}</button>
                      </div>
                      {topic.isDetailed && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-8 pb-8 space-y-8 border-t border-slate-50 pt-8 bg-slate-50/30">
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Waktu</label><input placeholder="10 Min" className="h-10 w-full rounded-lg bg-white border border-emerald-100 px-3 font-bold text-sm" value={topic.timeEstimate} onChange={(e) => updateTopicData(pi, ti, 'timeEstimate', e.target.value)} /></div>
                            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Level</label><select className="h-10 w-full rounded-lg bg-white border border-emerald-100 px-3 font-bold text-sm" value={topic.difficulty} onChange={(e) => updateTopicData(pi, ti, 'difficulty', e.target.value)}><option value="Easy Peasy">Easy Peasy</option><option value="Intermediate">Intermediate</option></select></div>
                            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Key Concept</label><input placeholder="Misal: IAM" className="h-10 w-full rounded-lg bg-white border border-emerald-100 px-3 font-bold text-sm" value={topic.keyConcepts} onChange={(e) => updateTopicData(pi, ti, 'keyConcepts', e.target.value)} /></div>
                          </div>
                          <textarea placeholder="5 Minute Summary..." className="w-full rounded-xl p-4 font-bold text-base ring-1 ring-emerald-100 bg-white shadow-inner" rows={3} value={topic.summary} onChange={(e) => updateTopicData(pi, ti, 'summary', e.target.value)} />
                          <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between"><label className="text-xs font-bold text-indigo-600 uppercase flex items-center gap-2"><BookOpen size={14} /> Materi Referensi</label><button type="button" onClick={() => addResource(pi, ti)} className="text-[11px] font-bold text-blue-600 hover:underline">+ Tambah Sumber</button></div>
                            <div className="grid gap-4">{topic.resources.map((res, ri) => (<div key={ri} className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm space-y-4 relative"><button type="button" onClick={() => { const n = [...phases]; n[pi].topics[ti].resources = n[pi].topics[ti].resources.filter((_, i) => i !== ri); setPhases(n); }} className="absolute top-4 right-4 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={16} /></button><div className="grid gap-4 md:grid-cols-3"><div className="space-y-1"><label className="text-[10px] font-bold text-slate-400">Tipe</label><select className="h-9 w-full rounded-lg bg-slate-50 border-none px-2 font-bold text-xs" value={res.type} onChange={(e) => updateResource(pi, ti, ri, 'type', e.target.value as any)}><option value="web">Web</option><option value="book">Buku</option><option value="documentation">Dokumentasi</option><option value="youtube">YouTube</option><option value="course">Course</option></select></div><div className="space-y-1 md:col-span-1"><label className="text-[10px] font-bold text-slate-400">Judul</label><input placeholder="Judul Materi" className="h-9 w-full rounded-lg bg-slate-50 border-none px-3 font-bold text-xs" value={res.title} onChange={(e) => updateResource(pi, ti, ri, 'title', e.target.value)} /></div><div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><CreditCard size={10} /> Status</label><select className="h-9 w-full rounded-lg bg-slate-50 border-none px-2 font-bold text-xs" value={res.priceType} onChange={(e) => updateResource(pi, ti, ri, 'priceType', e.target.value as any)}><option value="Gratis">Gratis</option><option value="Berbayar">Berbayar</option></select></div></div><textarea placeholder="Deskripsi..." rows={2} className="w-full p-3 rounded-lg bg-slate-50 border-none font-bold text-xs" value={res.description} onChange={(e) => updateResource(pi, ti, ri, 'description', e.target.value)} /><input placeholder="https://..." className="h-9 w-full rounded-lg bg-slate-50 border-none px-3 font-bold text-xs text-blue-600 underline" value={res.link} onChange={(e) => updateResource(pi, ti, ri, 'link', e.target.value)} /></div>))}</div>
                          </div>
                          <div className="space-y-3 pt-4 border-t border-slate-100"><label className="text-xs font-bold text-blue-600 flex items-center gap-2"><Info size={14} /> Cost Note / FAQ</label><textarea placeholder="Apakah butuh biaya?..." className="w-full rounded-xl p-4 font-bold text-sm bg-blue-50/50 border border-blue-100" rows={2} value={topic.costNote} onChange={(e) => updateTopicData(pi, ti, 'costNote', e.target.value)} /></div>
                          <div className="space-y-4 pt-6 border-t border-emerald-100">
                            {renderProjectForm(pi, ti, topic)}
                          </div>
                          <div className="flex justify-center pt-6 border-t border-emerald-100"><button type="button" onClick={() => updateTopicData(pi, ti, 'isDetailed', false)} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-10 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-700 transition-all"><Check size={18} /> Simpan Progres Materi</button></div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center pt-12">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-2xl bg-slate-900 px-12 py-5 text-xl font-bold text-white shadow-xl hover:bg-black transition-all active:scale-95 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Mengirim Kontribusi...
              </>
            ) : (
              <>
                Kirim Semua Kontribusi <Send size={24} />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // 4. MAIN FORM SCREEN (New & Edit Only)
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6 pb-40">
      {!isAdmin && (
        <SEO
          title="Kontribusi Roadmap"
          description="Bagikan keahlianmu — buat roadmap karir baru atau perbaiki yang sudah ada untuk membantu komunitas Cita-citaku."
        />
      )}
      {error && (
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="fixed left-1/2 top-10 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-xl bg-slate-900 px-6 py-4 text-white shadow-2xl">
          <AlertCircle className="text-red-500" size={18} /><p className="text-sm font-bold">{error}</p>
        </motion.div>
      )}
      <div className="flex items-center justify-between mb-10">
        <button onClick={() => { setMode('none'); setSelectedRoadmapId(null); }} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"><ArrowLeft size={16} /> Kembali</button>
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-full">
          <div className={`h-2 w-2 rounded-full ${mode === 'edit_roadmap' ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'}`}></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{mode === 'edit_roadmap' ? 'Editing Mode' : 'New Creation'}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-10">
        <section className="rounded-3xl bg-white p-8 border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3 border-b pb-4"><Briefcase className="text-blue-600" size={20} /><h2 className="text-xl font-bold text-slate-900">Informasi Dasar</h2></div>
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Judul Roadmap</label>
                <input required placeholder="Misal: Software Engineer" className="h-12 w-full rounded-xl bg-slate-50 border-none px-4 font-bold text-base" value={formData.judul} onChange={(e) => setFormData({ ...formData, judul: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Kategori</label>
                <select className="h-12 w-full rounded-xl bg-slate-50 border-none px-4 font-bold text-base" value={formData.idKategori} onChange={(e) => setFormData({ ...formData, idKategori: e.target.value as KategoriKarir })}>
                  {CAREER_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Tipe Profesi (Template)</label>
                <select className="h-12 w-full rounded-xl bg-slate-50 border-none px-4 font-bold text-base" value={formData.tipe} onChange={(e) => setFormData({ ...formData, tipe: e.target.value as any })}>
                  <option value="skill_based">Skill & Project Based (Contoh: IT)</option>
                  <option value="education_based">Education Path (Contoh: Dokter)</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500">Deskripsi Utama</label>
              <textarea placeholder="Gambarkan jalur karir ini..." className="w-full rounded-xl bg-slate-50 border-none p-4 font-bold text-base" rows={3} value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} />
            </div>
            
            <div className="space-y-6 pt-4 border-t border-slate-50">
              <p className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-2"><DollarSign size={14} /> Informasi Gaji</p>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2"><label className="text-sm font-bold text-slate-500">Gaji Rata-rata (ID)</label><input placeholder="Rp 8jt - 20jt" className="h-12 w-full rounded-xl bg-slate-50 border-none px-4 font-bold text-base" value={formData.infoGaji.rentangIDR} onChange={(e) => setFormData({ ...formData, infoGaji: { ...formData.infoGaji, rentangIDR: e.target.value } })} /></div>
                <div className="space-y-2"><label className="text-sm font-bold text-slate-500">Gaji Global (USA)</label><input placeholder="$80k - $150k" className="h-12 w-full rounded-xl bg-slate-50 border-none px-4 font-bold text-base" value={formData.infoGaji.rentangUSD} onChange={(e) => setFormData({ ...formData, infoGaji: { ...formData.infoGaji, rentangUSD: e.target.value } })} /></div>
              </div>
              <div className="space-y-2"><label className="text-sm font-bold text-slate-500">Penjelasan Gaji</label><textarea placeholder="Mengapa gajinya sekian? Faktor apa yang mempengaruhi?" className="w-full rounded-xl bg-slate-50 border-none p-4 font-bold text-base" rows={2} value={formData.infoGaji.penjelasan} onChange={(e) => setFormData({ ...formData, infoGaji: { ...formData.infoGaji, penjelasan: e.target.value } })} /></div>
            </div>
          </div>
        </section>

        {/* SECTION: Dunia Perkuliahan & Karir */}
        <section className="rounded-3xl bg-white p-8 border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3 border-b pb-4"><School className="text-blue-600" size={20} /><h2 className="text-xl font-bold text-slate-900">Dunia Perkuliahan & Karir</h2></div>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2"><label className="text-sm font-bold text-slate-500">Durasi Studi</label><input placeholder="Misal: 4 Tahun" className="h-12 w-full rounded-xl bg-slate-50 border-none px-4 font-bold text-base" value={formData.infoPendidikan.durasi} onChange={(e) => setFormData({ ...formData, infoPendidikan: { ...formData.infoPendidikan, durasi: e.target.value } })} /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-slate-500">Jalur Akademik</label><input placeholder="Misal: Sarjana (S1)" className="h-12 w-full rounded-xl bg-slate-50 border-none px-4 font-bold text-base" value={formData.infoPendidikan.jalurAkademik} onChange={(e) => setFormData({ ...formData, infoPendidikan: { ...formData.infoPendidikan, jalurAkademik: e.target.value } })} /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-slate-500">Gelar</label><input placeholder="Misal: S.Kom" className="h-12 w-full rounded-xl bg-slate-50 border-none px-4 font-bold text-base" value={formData.infoPendidikan.gelar} onChange={(e) => setFormData({ ...formData, infoPendidikan: { ...formData.infoPendidikan, gelar: e.target.value } })} /></div>
            </div>
            <div className="space-y-2"><label className="text-sm font-bold text-slate-500">Overview Jurusan</label><textarea placeholder="Gambaran perkuliahan..." className="w-full rounded-xl bg-slate-50 border-none p-4 font-bold text-base" rows={3} value={universityWorld.ringkasan} onChange={(e) => setUniversityWorld({ ...universityWorld, ringkasan: e.target.value })} /></div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between"><label className="text-sm font-bold text-slate-500">Pengetahuan & Keahlian</label><button type="button" onClick={() => setUniversityWorld({ ...universityWorld, keahlianWajib: [...universityWorld.keahlianWajib, ''] })} className="text-xs font-bold text-blue-600">+ Tambah</button></div>
                {universityWorld.keahlianWajib.map((skill, i) => (
                  <div key={i} className="flex gap-2"><input placeholder="Contoh: Observasi" className="h-10 flex-1 rounded-xl bg-slate-50 border-none px-4 font-bold text-sm shadow-sm" value={skill} onChange={(e) => { const newSkills = [...universityWorld.keahlianWajib]; newSkills[i] = e.target.value; setUniversityWorld({ ...universityWorld, keahlianWajib: newSkills }); }} /><button type="button" onClick={() => setUniversityWorld({ ...universityWorld, keahlianWajib: universityWorld.keahlianWajib.filter((_, idx) => idx !== i) })} className="text-slate-300 hover:text-red-500"><Trash2 size={18} /></button></div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between"><label className="text-sm font-bold text-slate-500">Kenapa Memilih Jurusan Ini?</label><button type="button" onClick={() => setUniversityWorld({ ...universityWorld, alasanMemilih: [...universityWorld.alasanMemilih, { judul: '', deskripsi: '' }] })} className="text-xs font-bold text-blue-600">+ Tambah</button></div>
                {universityWorld.alasanMemilih.map((reason, i) => (
                  <div key={i} className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl relative shadow-sm border border-slate-100">
                    <button type="button" onClick={() => setUniversityWorld({ ...universityWorld, alasanMemilih: universityWorld.alasanMemilih.filter((_, idx) => idx !== i) })} className="absolute top-3 right-3 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                    <input placeholder="Judul Alasan" className="h-10 w-11/12 rounded-lg bg-white border border-slate-100 px-3 font-bold text-sm" value={reason.judul} onChange={(e) => { const newReasons = [...universityWorld.alasanMemilih]; newReasons[i].judul = e.target.value; setUniversityWorld({ ...universityWorld, alasanMemilih: newReasons }); }} />
                    <textarea placeholder="Penjelasan singkat" className="w-11/12 rounded-lg bg-white border border-slate-100 p-3 text-sm font-medium" rows={2} value={reason.deskripsi} onChange={(e) => { const newReasons = [...universityWorld.alasanMemilih]; newReasons[i].deskripsi = e.target.value; setUniversityWorld({ ...universityWorld, alasanMemilih: newReasons }); }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Materi & Referensi */}
        <section className="rounded-3xl bg-white p-8 border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3 border-b pb-4"><BookOpen className="text-indigo-600" size={20} /><h2 className="text-xl font-bold text-slate-900">Materi & Referensi Curated</h2></div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between"><label className="text-sm font-bold text-slate-500">Materi Belajar (Video/Artikel/Web)</label><button type="button" onClick={() => setFormData({ ...formData, materiBelajar: [...formData.materiBelajar, { judul: '', tipe: 'video', link: '' }] })} className="text-xs font-bold text-blue-600">+ Tambah Materi</button></div>
              <div className="grid gap-4 md:grid-cols-2">
                {formData.materiBelajar.map((materi, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl relative border border-slate-100">
                    <button type="button" onClick={() => setFormData({ ...formData, materiBelajar: formData.materiBelajar.filter((_, idx) => idx !== i) })} className="absolute top-3 right-3 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                    <div className="grid gap-3">
                      <input placeholder="Judul Materi" className="h-9 rounded-lg bg-white border border-slate-100 px-3 font-bold text-xs" value={materi.judul} onChange={(e) => { const next = [...formData.materiBelajar]; next[i].judul = e.target.value; setFormData({ ...formData, materiBelajar: next }); }} />
                      <div className="flex gap-2">
                        <select className="h-9 flex-1 rounded-lg bg-white border border-slate-100 px-2 font-bold text-xs" value={materi.tipe} onChange={(e) => { const next = [...formData.materiBelajar]; next[i].tipe = e.target.value as any; setFormData({ ...formData, materiBelajar: next }); }}><option value="video">Video</option><option value="artikel">Artikel</option><option value="website">Website</option></select>
                        <input placeholder="https://..." className="h-9 flex-[2] rounded-lg bg-white border border-slate-100 px-3 font-bold text-xs" value={materi.link} onChange={(e) => { const next = [...formData.materiBelajar]; next[i].link = e.target.value; setFormData({ ...formData, materiBelajar: next }); }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between"><label className="text-sm font-bold text-slate-500">Daftar Buku Rekomendasi</label><button type="button" onClick={() => setFormData({ ...formData, daftarBuku: [...formData.daftarBuku, { judul: '', penulis: '', link: '' }] })} className="text-xs font-bold text-blue-600">+ Tambah Buku</button></div>
              <div className="grid gap-4 md:grid-cols-2">
                {formData.daftarBuku.map((buku, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl relative border border-slate-100">
                    <button type="button" onClick={() => setFormData({ ...formData, daftarBuku: formData.daftarBuku.filter((_, idx) => idx !== i) })} className="absolute top-3 right-3 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                    <div className="grid gap-3">
                      <input placeholder="Judul Buku" className="h-9 rounded-lg bg-white border border-slate-100 px-3 font-bold text-xs" value={buku.judul} onChange={(e) => { const next = [...formData.daftarBuku]; next[i].judul = e.target.value; setFormData({ ...formData, daftarBuku: next }); }} />
                      <div className="flex gap-2">
                        <input placeholder="Penulis" className="h-9 flex-1 rounded-lg bg-white border border-slate-100 px-3 font-bold text-xs" value={buku.penulis} onChange={(e) => { const next = [...formData.daftarBuku]; next[i].penulis = e.target.value; setFormData({ ...formData, daftarBuku: next }); }} />
                        <input placeholder="Link (Opsional)" className="h-9 flex-1 rounded-lg bg-white border border-slate-100 px-3 font-bold text-xs" value={buku.link} onChange={(e) => { const next = [...formData.daftarBuku]; next[i].link = e.target.value; setFormData({ ...formData, daftarBuku: next }); }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between"><label className="text-sm font-bold text-slate-500">Referensi Digital (Website/YouTube)</label><button type="button" onClick={() => setFormData({ ...formData, referensiDigital: [...formData.referensiDigital, { judul: '', tipe: 'youtube', link: '' }] })} className="text-xs font-bold text-blue-600">+ Tambah Referensi</button></div>
              <div className="grid gap-4 md:grid-cols-2">
                {(formData.referensiDigital || []).map((ref, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl relative border border-slate-100">
                    <button type="button" onClick={() => setFormData({ ...formData, referensiDigital: (formData.referensiDigital || []).filter((_, idx) => idx !== i) })} className="absolute top-3 right-3 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                    <div className="grid gap-3">
                      <input placeholder="Judul Channel/Website" className="h-9 rounded-lg bg-white border border-slate-100 px-3 font-bold text-xs" value={ref.judul} onChange={(e) => { const next = [...(formData.referensiDigital || [])]; next[i].judul = e.target.value; setFormData({ ...formData, referensiDigital: next }); }} />
                      <div className="flex gap-2">
                        <select className="h-9 flex-1 rounded-lg bg-white border border-slate-100 px-2 font-bold text-xs" value={ref.tipe} onChange={(e) => { const next = [...(formData.referensiDigital || [])]; next[i].tipe = e.target.value as any; setFormData({ ...formData, referensiDigital: next }); }}><option value="youtube">YouTube</option><option value="website">Website</option></select>
                        <input placeholder="https://..." className="h-9 flex-[2] rounded-lg bg-white border border-slate-100 px-3 font-bold text-xs" value={ref.link} onChange={(e) => { const next = [...(formData.referensiDigital || [])]; next[i].link = e.target.value; setFormData({ ...formData, referensiDigital: next }); }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Top Universities */}
        <section className="rounded-3xl bg-white p-8 border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3 border-b pb-4"><Globe className="text-emerald-600" size={20} /><h2 className="text-xl font-bold text-slate-900">Top 5 Universitas</h2></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between"><label className="text-sm font-bold text-slate-500">Dalam Negeri</label><button type="button" onClick={() => setTopUniversities({ ...topUniversities, local: [...(topUniversities.local || []), ''] })} className="text-xs font-bold text-blue-600">+ Tambah</button></div>
              {(topUniversities.local || []).map((univ, i) => (
                <div key={i} className="flex gap-2"><input placeholder="UI (Jakarta)" className="h-10 flex-1 rounded-xl bg-slate-50 border-none px-4 font-bold text-sm shadow-sm" value={univ} onChange={(e) => { const newLocal = [...(topUniversities.local || [])]; newLocal[i] = e.target.value; setTopUniversities({ ...topUniversities, local: newLocal }); }} /><button type="button" onClick={() => setTopUniversities({ ...topUniversities, local: (topUniversities.local || []).filter((_, idx) => idx !== i) })} className="text-slate-300 hover:text-red-500"><Trash2 size={18} /></button></div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between"><label className="text-sm font-bold text-slate-500">Luar Negeri</label><button type="button" onClick={() => setTopUniversities({ ...topUniversities, global: [...(topUniversities.global || []), ''] })} className="text-xs font-bold text-blue-600">+ Tambah</button></div>
              {(topUniversities.global || []).map((univ, i) => (
                <div key={i} className="flex gap-2"><input placeholder="Harvard (USA)" className="h-10 flex-1 rounded-xl bg-slate-50 border-none px-4 font-bold text-sm shadow-sm" value={univ} onChange={(e) => { const newGlobal = [...(topUniversities.global || [])]; newGlobal[i] = e.target.value; setTopUniversities({ ...topUniversities, global: newGlobal }); }} /><button type="button" onClick={() => setTopUniversities({ ...topUniversities, global: (topUniversities.global || []).filter((_, idx) => idx !== i) })} className="text-slate-300 hover:text-red-500"><Trash2 size={18} /></button></div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: FAQs */}
        <section className="rounded-3xl bg-white p-8 border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3"><Info className="text-amber-500" size={20} /><h2 className="text-xl font-bold text-slate-900">Common Questions (FAQ)</h2></div>
            <button type="button" onClick={() => setFaqs([...(faqs || []), { tanya: '', jawab: '' }])} className="text-sm font-bold text-blue-600 hover:underline">+ Tambah Pertanyaan</button>
          </div>
          <div className="grid gap-4">
            {(faqs || []).map((faq, i) => (
              <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-2xl relative shadow-sm border border-slate-100">
                <button type="button" onClick={() => setFaqs((faqs || []).filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
                <div className="flex-1 space-y-3 pr-8">
                  <input placeholder="Pertanyaan..." className="h-11 w-full rounded-xl bg-white border border-slate-100 px-4 font-bold text-sm" value={faq.tanya} onChange={(e) => { const newFaqs = [...(faqs || [])]; newFaqs[i].tanya = e.target.value; setFaqs(newFaqs); }} />
                  <textarea placeholder="Jawaban..." className="w-full rounded-xl bg-white border border-slate-100 p-4 text-sm font-medium" rows={2} value={faq.jawab} onChange={(e) => { const newFaqs = [...(faqs || [])]; newFaqs[i].jawab = e.target.value; setFaqs(newFaqs); }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center justify-between px-2"><h2 className="text-xl font-bold text-slate-900">Alur Belajar (Fase)</h2><button type="button" onClick={addPhase} className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105">+ Tambah Fase</button></div>
          <div className="space-y-8">{(phases || []).map((phase, pi) => (<div key={pi} className="relative"><div className="absolute -left-3 -top-3 z-10 h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-base font-bold shadow-xl">{pi + 1}</div>{!phase.isSaved ? (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white p-8 border border-slate-100 shadow-sm space-y-8"><div className="grid gap-6 md:grid-cols-2"><input placeholder="Judul Fase" className="h-12 rounded-xl bg-slate-50 border-none px-4 font-bold text-base" value={phase.title} onChange={(e) => updatePhase(pi, 'title', e.target.value)} /><input placeholder="Stats" className="h-12 rounded-xl bg-slate-50 border-none px-4 font-bold text-base" value={phase.stats} onChange={(e) => updatePhase(pi, 'stats', e.target.value)} /></div><div className="space-y-6 pt-6 border-t border-slate-50"><div className="flex items-center justify-between"><label className="text-sm font-bold text-indigo-500 uppercase tracking-wider">Materi Pembelajaran</label><button type="button" onClick={() => addTopic(pi)} className="text-xs font-bold text-blue-600 hover:underline">+ TAMBAH MATERI</button></div><div className="space-y-4">{(phase.topics || []).map((topic, ti) => (<div key={ti} className="flex flex-col gap-3"><div className="flex gap-3 items-center"><input placeholder="Judul Materi..." className="h-12 flex-1 rounded-xl bg-slate-100 border-none px-4 font-bold text-base" value={topic.title} onChange={(e) => updateTopicData(pi, ti, 'title', e.target.value)} /><button type="button" onClick={() => updateTopicData(pi, ti, 'isDetailed', !topic.isDetailed)} className={`flex items-center gap-2 px-6 h-12 rounded-xl font-bold text-xs transition-all shadow-sm ${topic.isDetailed ? 'bg-slate-900 text-white' : 'bg-white text-blue-600 border border-slate-100 hover:bg-blue-50'}`}>{topic.isDetailed ? 'Tutup Konten' : 'Lengkapi Konten'}</button><button type="button" onClick={() => { const n = [...phases]; n[pi].topics = n[pi].topics.filter((_, i) => i !== ti); setPhases(n); }} className="text-slate-200 hover:text-red-500"><Trash2 size={18} /></button></div>{topic.isDetailed && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="ml-4 rounded-2xl bg-emerald-50/20 border border-emerald-100 p-8 space-y-8 shadow-inner overflow-hidden"><div className="grid gap-4 md:grid-cols-3"><div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Waktu</label><input placeholder="10 Min" className="h-10 w-full rounded-lg bg-white border border-emerald-100 px-3 font-bold text-sm" value={topic.timeEstimate} onChange={(e) => updateTopicData(pi, ti, 'timeEstimate', e.target.value)} /></div><div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Level</label><select className="h-10 w-full rounded-lg bg-white border border-emerald-100 px-3 font-bold text-sm" value={topic.difficulty} onChange={(e) => updateTopicData(pi, ti, 'difficulty', e.target.value)}><option value="Easy Peasy">Easy Peasy</option><option value="Intermediate">Intermediate</option></select></div><div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Key Concept</label><input placeholder="Misal: IAM" className="h-10 w-full rounded-lg bg-white border border-emerald-100 px-3 font-bold text-sm" value={topic.keyConcepts} onChange={(e) => updateTopicData(pi, ti, 'keyConcepts', e.target.value)} /></div></div><textarea placeholder="Deskripsi materi..." className="w-full rounded-xl bg-white border border-emerald-100 p-4 font-bold text-sm" rows={2} value={topic.description} onChange={(e) => updateTopicData(pi, ti, 'description', e.target.value)} /><textarea placeholder="5 Minute Summary..." className="w-full rounded-xl p-4 font-bold text-base ring-1 ring-emerald-50 bg-white" rows={3} value={topic.summary} onChange={(e) => updateTopicData(pi, ti, 'summary', e.target.value)} /><div className="space-y-4 pt-6 border-t border-emerald-100"><div className="flex items-center justify-between"><label className="text-xs font-bold text-indigo-600 uppercase flex items-center gap-2"><BookOpen size={14} /> Materi Referensi</label><button type="button" onClick={() => addResource(pi, ti)} className="text-[11px] font-bold text-blue-600 hover:underline">+ Tambah Sumber</button></div><div className="grid gap-4">{(topic.resources || []).map((res, ri) => (<div key={ri} className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm space-y-4 relative"><button type="button" onClick={() => { const n = [...phases]; n[pi].topics[ti].resources = n[pi].topics[ti].resources.filter((_, i) => i !== ri); setPhases(n); }} className="absolute top-4 right-4 text-slate-200 hover:text-red-500"><Trash2 size={16} /></button><div className="grid gap-4 md:grid-cols-3"><div className="space-y-1"><label className="text-[10px] font-bold text-slate-400">Tipe</label><select className="h-9 w-full rounded-lg bg-slate-50 border-none px-2 font-bold text-xs" value={res.type} onChange={(e) => updateResource(pi, ti, ri, 'type', e.target.value as any)}><option value="web">Web</option><option value="book">Buku</option><option value="documentation">Dokumentasi</option><option value="youtube">YouTube</option><option value="course">Course</option></select></div><div className="space-y-1 md:col-span-1"><label className="text-[10px] font-bold text-slate-400">Judul</label><input placeholder="Judul" className="h-9 w-full rounded-lg bg-slate-50 border-none px-3 font-bold text-xs" value={res.title} onChange={(e) => updateResource(pi, ti, ri, 'title', e.target.value)} /></div><div className="space-y-1"><label className="text-[10px] font-bold text-slate-400">Status</label><select className="h-9 w-full rounded-lg bg-slate-50 border-none px-2 font-bold text-xs" value={res.priceType} onChange={(e) => updateResource(pi, ti, ri, 'priceType', e.target.value as any)}><option value="Gratis">Gratis</option><option value="Berbayar">Berbayar</option></select></div></div><textarea placeholder="Deskripsi..." rows={2} className="w-full p-3 rounded-lg bg-slate-50 border-none font-bold text-xs" value={res.description} onChange={(e) => updateResource(pi, ti, ri, 'description', e.target.value)} /><input placeholder="https://..." className="h-9 w-full rounded-lg bg-slate-50 border-none px-3 font-bold text-xs text-blue-600 underline" value={res.link} onChange={(e) => updateResource(pi, ti, ri, 'link', e.target.value)} /></div>))}</div></div><div className="space-y-3 pt-6 border-t border-emerald-100"><label className="text-xs font-bold text-blue-600 flex items-center gap-2"><Info size={14} /> Cost Note / FAQ</label><textarea placeholder="Apakah butuh biaya?..." className="w-full rounded-xl p-4 font-bold text-sm bg-blue-50/50 border border-blue-100" rows={2} value={topic.costNote} onChange={(e) => updateTopicData(pi, ti, 'costNote', e.target.value)} /></div><div className="space-y-4 pt-6 border-t border-emerald-100">
            {renderProjectForm(pi, ti, topic)}
          </div><div className="flex justify-center pt-6 border-t border-emerald-100"><button type="button" onClick={() => updateTopicData(pi, ti, 'isDetailed', false)} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-10 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-700 transition-all"><Check size={18} /> Simpan Materi Ini</button></div></motion.div>)}</div>))}</div></div><div className="flex justify-end pt-6 items-center gap-3">{mode === 'edit_roadmap' && <button type="button" onClick={() => setPhases(phases.filter((_, i) => i !== pi))} className="flex items-center gap-2 rounded-xl bg-red-50 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-100 transition-all"><Trash2 size={18} /> Hapus Fase</button>}<button type="button" onClick={() => toggleSavePhase(pi)} className="flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white transition-all"><Save size={18} /> Simpan Struktur Fase</button></div></motion.div>) : (<div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 flex items-center justify-between shadow-sm hover:bg-white transition-all group"><div><h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{phase.title}</h3><p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">{phase.stats}</p></div><button type="button" onClick={() => toggleSavePhase(pi)} className="h-12 w-12 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 shadow-sm transition-all"><Edit3 size={18} /></button></div>)}</div>))}</div></section>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          {isAdmin && initialData ? (
            <>
              <button
                type="button"
                onClick={() => onAction && onAction('reject')}
                className="w-full sm:w-auto rounded-2xl px-12 py-5 text-xl font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                Tolak Kontribusi
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto rounded-2xl px-12 py-5 text-xl font-bold text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
                ACC & Publish
              </button>
            </>
          ) : isAdmin && !initialData ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-2xl px-12 py-5 text-xl font-bold text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
              Publish Roadmap Baru
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-2xl px-12 py-5 text-xl font-bold text-white shadow-xl transition-all active:scale-95 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed ${mode === 'edit_roadmap' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  {mode === 'edit_roadmap' ? 'Memperbarui...' : 'Mengirim...'}
                </>
              ) : (
                <>
                  {mode === 'edit_roadmap' ? 'Perbarui Roadmap' : 'Kirim Kontribusi'}
                  <Send size={24} />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
