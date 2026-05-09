import { useState, useRef, useEffect } from 'react';
import { Sparkles, Upload, Plus, FileText, Trash2, Save, BrainCircuit, CheckCircle2, Loader2 } from 'lucide-react';
import * as motion from 'motion/react-client';
import { toast } from 'sonner';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';

export function AdminRiasec() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'];
  
  // Mapping for Test Page
  const catMap: Record<string, string> = {
    'Realistic': 'R',
    'Investigative': 'I',
    'Artistic': 'A',
    'Social': 'S',
    'Enterprising': 'E',
    'Conventional': 'C'
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const snapshot = await getDocs(collection(db, 'bank_soal'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (data.length > 0) {
        setQuestions(data);
      } else {
        // Fallback default
        setQuestions([
          { id: '1', text: 'Saya suka memperbaiki mesin atau barang elektronik', category: 'Realistic', points: 5 },
          { id: '2', text: 'Saya senang menganalisis data atau memecahkan misteri', category: 'Investigative', points: 5 },
        ]);
      }
    } catch (error) {
      console.error("Error fetching bank soal:", error);
      toast.error("Gagal mengambil data bank soal.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveQuestions = async () => {
    try {
      setIsSaving(true);
      const batch = writeBatch(db);
      
      // Clear existing (optional, or just update)
      // For simplicity, we just set all current
      for (const q of questions) {
        const docRef = doc(db, 'bank_soal', q.id);
        batch.set(docRef, {
          text: q.text,
          category: q.category,
          categoryCode: catMap[q.category] || q.category[0],
          points: q.points,
          updatedAt: new Date().toISOString()
        });
      }

      await batch.commit();
      toast.success("Bank soal berhasil disimpan!");
    } catch (error) {
      console.error("Error saving bank soal:", error);
      toast.error("Gagal menyimpan bank soal.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!uploadedFile) {
      toast.warning("Silakan unggah dokumen (PDF/TXT) terlebih dahulu untuk dianalisis oleh AI.");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghasilkan soal');
      }

      if (data.questions && Array.isArray(data.questions)) {
        // Map AI response categories to full names if needed
        const newQuestions = data.questions.map((q: any) => ({
          id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          text: q.text,
          category: q.category, // Assuming AI returns full name as requested in prompt
          points: q.points || 5
        }));

        setQuestions(prev => [...prev, ...newQuestions]);
        toast.success(`Berhasil! AI mengekstrak ${newQuestions.length} soal dari dokumen "${uploadedFile.name}".`);
      }
      
      setUploadedFile(null);
    } catch (error) {
      console.error("AI Generation failed:", error);
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat memproses dokumen.");
    } finally {
      setIsGenerating(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now().toString(), text: '', category: 'Realistic', points: 5 }]);
  };

  const removeQuestion = async (id: string) => {
    const next = questions.filter(q => q.id !== id);
    setQuestions(next);
    // If it exists in DB, we could delete it here or just wait for Save
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-sm font-bold text-slate-500">Memuat Bank Soal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Manajemen Tes RIASEC</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola bank soal untuk tes minat dan bakat.</p>
        </div>
        <button 
          onClick={saveQuestions}
          disabled={isSaving}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 text-indigo-500/10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
            <BrainCircuit size={160} />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-500 rounded-xl text-white shadow-md shadow-indigo-500/20"><Sparkles size={18} /></span>
              <h3 className="font-black text-indigo-950">AI Question Generator</h3>
            </div>
            <p className="text-sm text-indigo-900/70 font-medium">Upload dokumen kurikulum atau psikologi. AI akan otomatis mengekstrak dan memformatnya menjadi soal RIASEC.</p>
            
            <div className="flex gap-3 pt-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.txt,.doc,.docx" 
                onChange={e => setUploadedFile(e.target.files?.[0] || null)} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 flex flex-col items-center justify-center gap-2 h-24 rounded-2xl border-2 border-dashed transition-colors cursor-pointer ${uploadedFile ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-indigo-200 bg-white/50 hover:bg-white text-indigo-600'}`}
              >
                {uploadedFile ? <CheckCircle2 size={20} /> : <Upload size={20} />}
                <span className="text-[10px] font-black uppercase tracking-widest text-center px-2">
                  {uploadedFile ? uploadedFile.name.substring(0, 20) + (uploadedFile.name.length > 20 ? '...' : '') : 'Upload PDF/TXT'}
                </span>
              </button>
              <button 
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className="flex-1 flex flex-col items-center justify-center gap-2 h-24 rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition-colors text-white shadow-lg shadow-indigo-500/30 disabled:opacity-50"
              >
                {isGenerating ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" /> : <Sparkles size={20} />}
                <span className="text-[10px] font-black uppercase tracking-widest">Generate Soal</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Distribusi Soal</h3>
          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">{cat}</span>
                <span className="text-xs font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                  {questions.filter(q => q.category === cat).length} Soal
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <FileText size={16} className="text-blue-600" /> Bank Soal ({questions.length})
          </h3>
          <button onClick={addQuestion} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={14} /> Tambah Manual
          </button>
        </div>

        <div className="grid gap-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="group p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="h-8 w-8 shrink-0 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center font-black text-xs">
                  {idx + 1}
                </div>
                <input 
                  type="text" 
                  value={q.text}
                  onChange={(e) => {
                    const newQ = [...questions];
                    newQ[idx].text = e.target.value;
                    setQuestions(newQ);
                  }}
                  placeholder="Ketik pernyataan soal di sini..."
                  className="flex-1 bg-transparent border-none p-0 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-0"
                />
                <div className="flex items-center gap-3 shrink-0">
                  <select 
                    value={q.category}
                    onChange={(e) => {
                      const newQ = [...questions];
                      newQ[idx].category = e.target.value;
                      setQuestions(newQ);
                    }}
                    className="h-9 text-xs font-bold bg-slate-50 border-none rounded-lg text-slate-600 cursor-pointer focus:ring-0"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="flex items-center gap-1 bg-slate-50 h-9 px-3 rounded-lg">
                    <span className="text-[10px] font-black text-slate-400">PTS</span>
                    <input 
                      type="number" 
                      value={q.points}
                      onChange={(e) => {
                        const newQ = [...questions];
                        newQ[idx].points = parseInt(e.target.value) || 0;
                        setQuestions(newQ);
                      }}
                      className="w-12 bg-transparent border-none p-0 text-xs font-bold text-slate-700 text-center focus:ring-0"
                    />
                  </div>
                  <button 
                    onClick={() => removeQuestion(q.id)}
                    className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
