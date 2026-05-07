import { useState } from 'react';
import { Sparkles, Upload, Plus, FileText, Trash2, Save, BrainCircuit, CheckCircle2 } from 'lucide-react';
import * as motion from 'motion/react-client';

export function AdminRiasec() {
  const [questions, setQuestions] = useState([
    { id: '1', text: 'Saya suka memperbaiki mesin atau barang elektronik', category: 'Realistic', points: 5 },
    { id: '2', text: 'Saya senang menganalisis data atau memecahkan misteri', category: 'Investigative', points: 5 },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'];

  const handleAiGenerate = () => {
    setIsGenerating(true);
    // Simulate AI parsing a document
    setTimeout(() => {
      setQuestions(prev => [
        ...prev,
        { id: Date.now().toString(), text: 'Saya menikmati mengajar atau melatih orang lain', category: 'Social', points: 5 },
        { id: (Date.now() + 1).toString(), text: 'Saya suka memimpin proyek dan mengambil keputusan', category: 'Enterprising', points: 5 }
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now().toString(), text: '', category: 'Realistic', points: 5 }]);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Manajemen Tes RIASEC</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola bank soal untuk tes minat dan bakat.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
          <Save size={16} /> Simpan Perubahan
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* AI Generator Box */}
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
              <button className="flex-1 flex flex-col items-center justify-center gap-2 h-24 rounded-2xl border-2 border-dashed border-indigo-200 bg-white/50 hover:bg-white transition-colors cursor-pointer text-indigo-600">
                <Upload size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Upload PDF/TXT</span>
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

        {/* Stats Box */}
        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Distribusi Soal</h3>
          <div className="space-y-3">
            {categories.slice(0,3).map(cat => (
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

      {/* Manual Questions List */}
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
                    onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
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
