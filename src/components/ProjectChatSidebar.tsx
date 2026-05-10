import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, Mic, RotateCcw } from 'lucide-react';
import * as motion from 'motion/react-client';
import ReactMarkdown from 'react-markdown';

interface ProjectChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
}

export default function ProjectChatSidebar({ isOpen, onClose, projectTitle }: ProjectChatSidebarProps) {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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

  return (
    <motion.aside
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed right-0 top-0 z-[9999] h-full w-full border-l border-slate-100 bg-white shadow-2xl sm:w-[450px] overflow-hidden flex flex-col"
    >
      {/* Header - Fixed Height */}
      <header className="shrink-0 flex items-center justify-between border-b border-slate-50 px-6 py-5 bg-white z-20">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Sparkles size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[11px] font-black tracking-widest text-slate-900 uppercase leading-none mb-1">Mentor Proyek AI</h1>
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">Active Assistant</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChat}
            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
            title="Reset Chat"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Chat Area - Flexible Height */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 scrollbar-hide bg-[#fcfbfa]"
      >
        {messages.length === 0 ? (
          <div className="min-h-full flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 mb-8 shadow-inner">
              <Sparkles size={36} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Mentor AI Cita-Citaku</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-[280px] mx-auto mb-10">
              Butuh petunjuk materi <span className="text-blue-600 font-black">{projectTitle}</span>? Tanyakan apa saja, saya siap membimbing Anda.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2">
              {["Langkah awal", "Konsep utama", "Bantuan kode"].map((hint, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(hint)}
                  className="bg-white border border-slate-200 rounded-xl px-5 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition-all hover:border-blue-300 hover:text-blue-700 active:scale-95"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 space-y-8">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 ${
                    msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  }`}>
                    {msg.role === 'user' ? 'ME' : 'AI'}
                  </div>
                  <div className={`px-5 py-4 rounded-[1.5rem] text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 text-white font-medium' 
                      : 'bg-white border border-slate-100 text-slate-800 font-medium shadow-sm prose prose-slate max-w-none'
                  }`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {streamingText && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-lg shadow-blue-600/20">
                    AI
                  </div>
                  <div className="px-5 py-4 rounded-[1.5rem] text-sm leading-relaxed bg-white border border-slate-100 text-slate-800 font-medium shadow-sm prose prose-slate max-w-none">
                    <ReactMarkdown>{streamingText}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {isLoading && !streamingText && (
              <div className="flex justify-start">
                <div className="ml-11 flex items-center gap-1.5 p-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area - Fixed Height */}
      <footer className="shrink-0 p-6 bg-white border-t border-slate-50">
        <div className="flex items-center gap-2 rounded-full bg-slate-50 border border-slate-100 p-1.5 focus-within:border-blue-200 focus-within:bg-white transition-all shadow-inner">
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
            <Mic size={18} />
          </button>
          
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Tanyakan sesuatu..."
            className="flex-1 bg-transparent border-none px-3 py-2 focus:ring-0 font-bold text-sm text-slate-800 placeholder:text-slate-400"
          />
          
          <button 
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20 disabled:opacity-20 transition-all hover:bg-slate-900 active:scale-95"
          >
            <Send size={16} />
          </button>
        </div>
      </footer>
    </motion.aside>
  );
}
