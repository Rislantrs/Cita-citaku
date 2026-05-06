import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, Send, Bot, User as UserIcon, MessageSquare, History, ArrowRight, PlusCircle, Trash2 } from 'lucide-react';
import * as motion from 'motion/react-client';

const SUGGESTED_TOPICS = [
  { label: "Analisis RIASEC saya", prompt: "Tolong jelaskan lebih dalam tentang hasil tes RIASEC saya." },
  { label: "Saran Jurusan Kuliah", prompt: "Jurusan kuliah apa yang cocok untuk minat saya di bidang teknologi?" },
  { label: "Tren Karir 2026", prompt: "Apa tren karir yang paling menjanjikan di tahun 2026?" },
];

export default function AICounselor() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<{role: 'user' | 'model', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const startRecording = () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'id-ID';
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + " " + transcript);
      };
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) { console.error(err); }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendMessage = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;
    
    const newMessages = [...messages, { role: 'user' as const, content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
          }))
        })
      });
      const data = await response.json();
      setMessages([...newMessages, { role: 'model', content: data.text }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'model', content: 'Maaf, saya sedang mengalami kendala teknis. Coba lagi nanti ya!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] h-[calc(100vh-140px)]">
      {/* Sidebar - Pure Session History */}
      <aside className="hidden flex-col gap-6 lg:flex">
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
          <PlusCircle size={18} />
          Chat Baru
        </button>

        <div className="flex-1 space-y-2 overflow-y-auto">
          <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
            Riwayat Sesi
          </div>
          <div className="space-y-1">
            {['Analisis Karir IT', 'Diskusi Psikologi', 'Persiapan Interview'].map((session) => (
              <button key={session} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold opacity-60 transition hover:bg-white/5 hover:text-blue-600">
                <MessageSquare size={16} className="shrink-0" />
                <span className="truncate">{session}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-4 theme-card" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Status Penyimpanan</p>
          <div className="mt-3 flex items-center gap-2 text-xs font-bold opacity-70">
            <History size={14} />
            Auto-save Aktif
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-col overflow-hidden rounded-[2rem] theme-card shadow-sm">
        {/* Minimal Header */}
        <header className="flex items-center justify-between border-b theme-border px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Konselor AI</h1>
          </div>
          <button className="opacity-30 hover:opacity-100 hover:text-red-500 transition">
            <Trash2 size={18} />
          </button>
        </header>

        {/* Messages List */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-10"
        >
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl text-blue-600 mb-6" style={{ backgroundColor: 'rgba(var(--accent-blue), 0.1)' }}>
                <Bot size={40} />
              </div>
              <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Apa yang bisa saya bantu?</h2>
              <p className="mt-2 opacity-60 max-w-sm" style={{ color: 'var(--text-secondary)' }}>Tanyakan apa saja tentang karir, jurusan, atau hasil tes jati dirimu.</p>
              
              {/* Minimalist Starter Chips */}
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {SUGGESTED_TOPICS.map((topic) => (
                  <button
                    key={topic.label}
                    onClick={() => sendMessage(topic.prompt)}
                    className="theme-card rounded-full px-5 py-2.5 text-sm font-bold opacity-70 shadow-sm transition hover:border-blue-200 hover:text-blue-600 hover:shadow-md"
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black ${msg.role === 'user' ? 'bg-slate-700/20 text-slate-400' : 'bg-blue-600 text-white'}`}>
                  {msg.role === 'user' ? 'ME' : 'AI'}
                </div>
                <div className={`rounded-2xl px-5 py-4 text-base leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10' 
                    : 'theme-card'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3 px-12">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-300" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:0.2s]" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600 [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <footer className="p-8 border-t theme-border">
          <div className="mx-auto max-w-4xl relative">
            <div className="flex items-center gap-3 rounded-2xl p-2 transition-all theme-input focus-within:ring-2 focus-within:ring-blue-600/10" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'opacity-40 hover:opacity-100 hover:text-blue-600'
                }`}
              >
                <Mic size={20} />
              </button>
              
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Tulis pertanyaanmu di sini..."
                className="flex-1 bg-transparent border-none px-2 py-3 focus:ring-0 font-medium"
                style={{ color: 'var(--text-primary)' }}
              />
              
              <button 
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white disabled:opacity-30 transition hover:bg-blue-700"
              >
                <Send size={18} />
              </button>
            </div>
            
            {/* Minimalist Tip */}
            {messages.length > 0 && (
              <div className="mt-4 flex justify-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {SUGGESTED_TOPICS.map(t => (
                  <button key={t.label} onClick={() => sendMessage(t.prompt)} className="whitespace-nowrap text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-blue-600 transition">
                    + {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}
