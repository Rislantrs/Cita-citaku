import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, Mic, RotateCcw } from 'lucide-react';
import * as motion from 'motion/react-client';
import ReactMarkdown from 'react-markdown';

interface ProjectChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  isFixed?: boolean;
}

export default function ProjectChatSidebar({ isOpen, onClose, projectTitle, isFixed = false }: ProjectChatSidebarProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Robust auto-scroll to bottom
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isLoading]);

  const handleResetChat = () => {
    if (window.confirm('Hapus riwayat percakapan?')) {
      setMessages([]);
      setStreamingText('');
    }
  };

  const sendMessage = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user' as const, content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setStreamingText('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              parts: [{ text: `Kamu adalah Mentor AI di platform Cita-citaku. Kamu sedang membimbing user mempelajari materi: "${projectTitle}". Jawablah pertanyaan mereka dengan cara yang edukatif, profesional, dan mudah dipahami. Gunakan format markdown.` }]
            },
            ...newMessages.map(m => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }]
            }))
          ],
          stream: true
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data: ')) continue;
            try {
              const event = JSON.parse(trimmed.slice(6));
              if (event.type === 'chunk') {
                fullText += event.content;
                setStreamingText(fullText);
              }
            } catch (e) { /* ignore */ }
          }
        }
        setMessages(prev => [...prev, { role: 'assistant', content: fullText }]);
        setStreamingText('');
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, saya sedang mengalami kendala teknis. Coba lagi ya!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return isFixed ? (
    // Desktop Panel Layout
    <aside className="h-full w-full flex flex-col bg-[var(--bg-secondary)] overflow-hidden border-l border-[var(--border-color)]">
      {/* Header - Editorial Style with more breathing room */}
      <header className="shrink-0 flex items-center justify-between border-b border-[var(--border-color)] px-6 pt-7 pb-5 bg-[var(--bg-secondary)]/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20 rotate-3 transition-transform hover:rotate-0 duration-500">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[10px] font-black tracking-[0.2em] text-[var(--text-primary)] uppercase leading-none mb-1">Mentor AI</h1>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">Aktif</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
            title="Bersihkan Chat"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-rose-500 hover:bg-rose-50 transition-all duration-300"
            title="Tutup Mentor"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Chat Area - Flexible Height, strictly bounded */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 scrollbar-hide bg-[var(--bg-secondary)] flex flex-col"
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
            <div className="w-14 h-14 rounded-[1.8rem] bg-blue-50 flex items-center justify-center text-blue-600 mb-4 shadow-inner rotate-3">
              <Sparkles size={40} />
            </div>
            <h2 className="text-base font-black text-[var(--text-primary)] mb-1 tracking-tight leading-tight">Halo! Saya Mentor AI</h2>
            <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-relaxed max-w-[200px] mx-auto mb-6">
              Ada yang ingin kamu tanyakan tentang <span className="text-blue-600 font-black">"{projectTitle}"</span>?
            </p>
            
            <div className="grid grid-cols-1 gap-1.5 w-full max-w-[220px]">
              {["Jelaskan langkah awal", "Bantu debug kode", "Ringkas materi ini"].map((hint, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(hint)}
                  className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-[10px] font-bold text-[var(--text-primary)] shadow-sm transition-all hover:border-blue-400 hover:text-blue-600 active:scale-95 text-center"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 space-y-10">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                <div className={`flex max-w-[90%] items-start gap-3.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm transition-transform hover:scale-110 ${msg.role === 'user' ? 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)]' : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white'
                    }`}>
                    {msg.role === 'user' ? 'ME' : 'AI'}
                  </div>
                  <div className={`px-5 py-3.5 rounded-[1.8rem] text-[13px] leading-[1.7] shadow-sm ${msg.role === 'user'
                      ? 'bg-slate-900 text-white font-medium rounded-tr-none'
                      : 'bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium markdown-content rounded-tl-none'
                    }`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {streamingText && (
              <div className="flex justify-start">
                <div className="flex max-w-[90%] items-start gap-3.5">
                  <div className="w-8 h-8 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                    AI
                  </div>
                  <div className="px-5 py-3.5 rounded-[1.5rem] text-[13px] leading-[1.7] bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium markdown-content">
                    <ReactMarkdown>{streamingText}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {isLoading && !streamingText && (
              <div className="flex justify-start">
                <div className="ml-11 flex items-center gap-1.5 p-2 bg-[var(--bg-primary)] rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area - Integrated & Tighter */}
      <footer className="shrink-0 p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
        <div className="flex items-center gap-2 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] p-1.5 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-600/5 transition-all duration-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Tanyakan..."
            className="flex-1 bg-transparent border-none px-2.5 py-1.5 focus:ring-0 font-bold text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50"
          />

          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 disabled:opacity-30 transition-all hover:bg-[var(--text-primary)] active:scale-90"
          >
            <Send size={14} />
          </button>
        </div>
      </footer>
    </aside>
  ) : (
    // Mobile Modal Layout
    <motion.aside
      initial={{ y: '100%' }}
      animate={{ y: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-9999 h-full w-full bg-white overflow-hidden flex flex-col"
    >
      {/* Header - Fixed Height */}
      <header className="shrink-0 flex items-center justify-between border-b border-[var(--border-color)] px-5 py-5 bg-[var(--bg-secondary)] z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[10px] font-black tracking-[0.2em] text-[var(--text-primary)] uppercase leading-none mb-1">Mentor AI</h1>
            <span className="text-[8px] font-bold uppercase tracking-widest text-blue-600">Aktif</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-rose-500 hover:bg-rose-50 transition-all"
        >
          <X size={20} />
        </button>
      </header>

      {/* Chat Area - Flexible Height */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 scrollbar-hide bg-[var(--bg-secondary)]"
      >
        {messages.length === 0 ? (
          <div className="min-h-full flex flex-col items-center justify-center text-center py-10">
            <div className="w-20 h-20 rounded-[2.5rem] bg-blue-50 flex items-center justify-center text-blue-600 mb-8 shadow-inner">
              <Sparkles size={40} />
            </div>
            <h2 className="text-xl font-black text-[var(--text-primary)] mb-3 tracking-tight">Mentor AI</h2>
            <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed max-w-[240px] mx-auto mb-10">
              Ada yang ingin kamu tanyakan tentang <span className="text-blue-600 font-black">"{projectTitle}"</span>?
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {["Langkah awal", "Bantuan kode", "Penjelasan"].map((hint, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(hint)}
                  className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-2.5 text-[11px] font-bold text-[var(--text-primary)] transition-all active:scale-95 shadow-sm"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 space-y-10">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[90%] items-start gap-3.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-[10px] font-black shrink-0 ${msg.role === 'user' ? 'bg-[var(--bg-primary)] text-[var(--text-secondary)]' : 'bg-blue-600 text-white'
                    }`}>
                    {msg.role === 'user' ? 'ME' : 'AI'}
                  </div>
                  <div className={`px-5 py-3.5 rounded-[1.5rem] text-[13px] leading-[1.7] ${msg.role === 'user'
                      ? 'bg-[var(--text-primary)] text-white font-medium shadow-xl'
                      : 'bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium markdown-content'
                    }`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {streamingText && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex max-w-[90%] items-start gap-3.5">
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm">
                    AI
                  </div>
                  <div className="px-5 py-3.5 rounded-[1.8rem] rounded-tl-none text-[13px] leading-[1.7] bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium markdown-content shadow-sm">
                    <ReactMarkdown>{streamingText}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {isLoading && !streamingText && (
              <div className="flex justify-start">
                <div className="ml-11 flex items-center gap-1.5 p-2 bg-[var(--bg-primary)] rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area - Integrated */}
      <footer className="shrink-0 p-5 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
        <div className="flex items-center gap-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] p-2 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-600/5 transition-all duration-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Tanyakan..."
            className="flex-1 bg-transparent border-none px-3 py-2 focus:ring-0 font-bold text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50"
          />

          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition-all active:scale-90"
          >
            <Send size={16} />
          </button>
        </div>
      </footer>
    </motion.aside>
  );
}
