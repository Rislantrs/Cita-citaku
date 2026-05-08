import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, Send, Bot, MessageSquare, History, PlusCircle, Trash2 } from 'lucide-react';
import * as motion from 'motion/react-client';
import { toast } from 'sonner';
import { auth } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Link } from 'react-router-dom';

type ChatMessage = { role: 'user' | 'model'; content: string };

interface ChatSessionInfo {
  sessionId: string;
  title: string;
  updatedAt: string;
  messageCount: number;
}

const SUGGESTED_TOPICS = [
  { label: "Analisis RIASEC saya", prompt: "Tolong jelaskan lebih dalam tentang hasil tes RIASEC saya." },
  { label: "Saran Jurusan Kuliah", prompt: "Jurusan kuliah apa yang cocok untuk minat saya di bidang teknologi?" },
  { label: "Tren Karir 2026", prompt: "Apa tren karir yang paling menjanjikan di tahun 2026?" },
];

function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function AICounselor() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [sessionId, setSessionId] = useState(() => generateSessionId());
  const [sessions, setSessions] = useState<ChatSessionInfo[]>([]);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // LOGIN WALL
  if (!user) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center px-4">
        <div className="mb-8 h-20 w-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center">
          <Bot size={40} />
        </div>
        <h1 className="text-3xl font-black mb-4 text-slate-900 tracking-tight uppercase">AI Counselor Eksklusif</h1>
        <p className="text-slate-500 font-bold mb-8 max-w-sm mx-auto">
          Kamu harus masuk akun terlebih dahulu untuk berkonsultasi dengan asisten karir cerdas kami.
        </p>
        <Link to="/login" className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-10 py-4 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95">
          Login Sekarang
        </Link>
      </div>
    );
  }

  // Auto-scroll saat ada pesan baru atau streaming
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, streamingText]);

  // Load session list saat pertama kali
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = useCallback(async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      const res = await fetch(`/api/chat/sessions?userId=${uid}`);
      const data = await res.json();
      if (data.sessions) setSessions(data.sessions);
    } catch { /* ignore */ }
  }, []);

  const loadSession = useCallback(async (sid: string) => {
    try {
      const res = await fetch(`/api/chat/sessions/${sid}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          content: m.content
        })));
        setSessionId(sid);
      }
    } catch {
      toast.error('Gagal memuat riwayat chat.');
    }
  }, []);

  const startNewChat = () => {
    setMessages([]);
    setStreamingText('');
    setSessionId(generateSessionId());
  };

  const startRecording = () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error("Browser kamu tidak mendukung pengenalan suara.");
        return;
      }
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
    } catch (err) { 
      console.error(err); 
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendMessage = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setStreamingText('');

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'counselor',
          userId: auth.currentUser?.uid,
          sessionId,
          messages: newMessages.map(m => ({
            role: m.role === 'model' ? 'assistant' : m.role,
            content: m.content
          }))
        })
      });

      // Cek kalau quota habis (respons JSON, bukan SSE)
      if (response.status === 429) {
        const data = await response.json();
        toast.error(data.error || 'Kuota harian habis');
        setMessages([...newMessages, { role: 'model', content: data.text || 'Kuota harian habis.' }]);
        return;
      }

      if (!response.body) throw new Error('No response body');

      // Baca SSE stream
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
              setStreamingText(fullText);
            }

            if (event.type === 'done') {
              setMessages(prev => [...prev, { role: 'model', content: fullText }]);
              setStreamingText('');
              // Refresh session list
              loadSessions();
            }

            if (event.type === 'error') {
              throw new Error(event.message);
            }
          } catch (parseErr) {
            // skip malformed lines
          }
        }
      }

      // Jika stream selesai tapi fullText belum di-commit
      if (fullText && streamingText) {
        setMessages(prev => [...prev, { role: 'model', content: fullText }]);
        setStreamingText('');
      }

    } catch (err) {
      toast.error('Gagal mengirim pesan. Silakan coba lagi.');
      setMessages([...newMessages, { role: 'model', content: 'Maaf, saya sedang mengalami kendala teknis. Coba lagi nanti ya!' }]);
      setStreamingText('');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    toast.warning("Hapus seluruh percakapan?", {
      action: {
        label: "Hapus",
        onClick: () => {
          startNewChat();
          toast.success("Percakapan dihapus");
        },
      },
      cancel: {
        label: "Batal",
        onClick: () => {},
      }
    });
  };

  return (
    <div className="flex h-[calc(100vh-120px)] max-w-[1600px] mx-auto px-6 pb-6 gap-6">
      {/* Sidebar - Session History */}
      <aside className="hidden lg:flex flex-col w-[280px] shrink-0 gap-6">
        <button 
          onClick={startNewChat}
          className="flex items-center justify-center gap-3 rounded-3xl bg-slate-900 py-5 text-[15px] font-bold text-white transition-all hover:bg-blue-800 hover:-translate-y-1 shadow-xl shadow-slate-900/10"
        >
          <PlusCircle size={20} />
          Percakapan Baru
        </button>

        <div className="flex-1 flex flex-col rounded-[2.5rem] bg-slate-50 border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-200/50">
             <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400">Riwayat Sesi</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {sessions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Belum ada riwayat chat</p>
            ) : (
              sessions.map((session) => (
                <button 
                  key={session.sessionId} 
                  onClick={() => loadSession(session.sessionId)}
                  className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold text-slate-600 transition-all hover:bg-white hover:text-blue-700 hover:shadow-sm ${
                    session.sessionId === sessionId ? 'bg-white text-blue-700 shadow-sm' : ''
                  }`}
                >
                  <MessageSquare size={18} className="opacity-40 shrink-0" />
                  <span className="truncate">{session.title}</span>
                </button>
              ))
            )}
          </div>
          <div className="p-6 bg-white/50 border-t border-slate-200/50">
             <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                <History size={14} />
                Auto-save Aktif
             </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col rounded-[3rem] bg-white border border-slate-100 shadow-sm overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-6 border-b border-slate-50 bg-white/80 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <h1 className="text-base font-black tracking-tight text-slate-900">Konselor AI</h1>
            {streamingText && (
              <span className="text-[10px] font-bold text-blue-500 animate-pulse">● Sedang mengetik...</span>
            )}
          </div>
          <button 
            onClick={clearChat}
            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
          >
            <Trash2 size={20} />
          </button>
        </header>

        {/* Messages List */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-10 space-y-10 scroll-smooth no-scrollbar"
        >
          {messages.length === 0 && !streamingText && (
            <div className="flex h-full flex-col items-center justify-center text-center max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-[2.5rem] bg-blue-50 flex items-center justify-center text-blue-600 mb-8">
                <Bot size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Apa yang bisa saya bantu?</h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Tanyakan apa saja tentang karir, jurusan, atau hasil tes jati dirimu. Saya di sini untuk membantumu menemukan jalan.
              </p>
              
              <div className="mt-12 flex flex-wrap justify-center gap-3">
                {SUGGESTED_TOPICS.map((topic) => (
                  <button
                    key={topic.label}
                    onClick={() => sendMessage(topic.prompt)}
                    className="bg-white border border-slate-200 rounded-full px-6 py-3 text-sm font-bold text-slate-600 transition-all hover:border-blue-300 hover:text-blue-700 hover:shadow-md"
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
              <div className={`flex max-w-[80%] items-start gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 ${
                  msg.role === 'user' ? 'bg-slate-100 text-slate-500' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                }`}>
                  {msg.role === 'user' ? 'ME' : 'AI'}
                </div>
                <div className={`px-6 py-5 rounded-[2rem] text-base leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white font-medium shadow-xl shadow-slate-900/10' 
                    : 'bg-slate-50 text-slate-800 font-medium'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Streaming text — muncul kata demi kata */}
          {streamingText && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex max-w-[80%] items-start gap-5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  AI
                </div>
                <div className="px-6 py-5 rounded-[2rem] text-base leading-relaxed bg-slate-50 text-slate-800 font-medium">
                  <p className="whitespace-pre-wrap">{streamingText}<span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-0.5 rounded-sm" /></p>
                </div>
              </div>
            </motion.div>
          )}
          
          {isLoading && !streamingText && (
            <div className="flex justify-start">
              <div className="ml-14 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <footer className="p-10 bg-white">
          <div className="max-w-4xl mx-auto relative">
            <div className="flex items-center gap-3 rounded-[2rem] bg-slate-50 border border-slate-100 p-2 focus-within:border-blue-200 focus-within:bg-white transition-all">
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
                  isRecording 
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/25' 
                    : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Mic size={22} />
              </button>
              
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Tanyakan sesuatu..."
                className="flex-1 bg-transparent border-none px-4 py-3 focus:ring-0 font-bold text-slate-800 placeholder:text-slate-400"
              />
              
              <button 
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 disabled:opacity-20 transition-all hover:bg-slate-900 active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
