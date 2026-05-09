import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User as UserIcon, RefreshCcw, MessageSquare } from 'lucide-react';
import * as motion from 'motion/react-client';
import ReactMarkdown from 'react-markdown';

interface ProjectChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
}

export default function ProjectChatSidebar({ isOpen, onClose, projectTitle }: ProjectChatSidebarProps) {
  const [messages, setMessages] = useState<{role: 'user' | 'model', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;
    
    const newMessages = [...messages, { role: 'user' as const, content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const systemContext = { 
        role: 'user' as const, 
        content: `Kamu adalah Technical Assistant profesional di platform Cita-citaku. Saat ini kamu membantu user mengerjakan proyek: "${projectTitle}". Jawablah pertanyaan teknis mereka dengan ramah, jelas, dan fokus pada materi proyek ini.` 
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [systemContext, ...newMessages].map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
          }))
        })
      });
      const data = await response.json();
      setMessages([...newMessages, { role: 'model', content: data.text }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'model', content: 'Waduh, koneksi ke otak AI terputus. Coba lagi ya!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.aside
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 z-100 h-full w-full border-l border-slate-100 bg-white shadow-2xl sm:w-112.5"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Asisten Proyek</h2>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online & Ready</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-50 transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </header>

        {/* Chat Content */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-white"
        >
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center p-4">
              <div className="mb-6 rounded-3xl bg-blue-50 p-6 text-blue-600">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Ada kesulitan di proyek ini?</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed px-4">
                Tanyakan apa saja tentang <b>{projectTitle}</b>. Saya siap membantu menjelaskan konsep atau memberikan petunjuk teknis.
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[90%] flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white shadow-blue-600/10' 
                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                }`}>
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-li:my-0.5">
                      <ReactMarkdown 
                        components={{
                          p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({children}) => <strong className="font-bold text-blue-700">{children}</strong>,
                          ul: ({children}) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                          li: ({children}) => <li className="text-slate-700">{children}</li>
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest opacity-30 px-1 text-slate-500">
                  {msg.role === 'user' ? 'You' : 'Assistant'}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 border border-slate-200">
                <RefreshCcw size={12} className="animate-spin text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI sedang mengetik...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <footer className="border-t border-slate-100 p-6 bg-slate-50">
          <div className="relative flex items-center gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Tanya asisten teknismu..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-900 shadow-sm transition-all focus:ring-4 focus:ring-blue-600/10 outline-none"
            />
            <button 
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 disabled:opacity-30 transition-all hover:bg-blue-700"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="mt-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            AI dapat melakukan kesalahan. Tetap verifikasi langkah teknismu.
          </p>
        </footer>
      </div>
    </motion.aside>
  );
}
