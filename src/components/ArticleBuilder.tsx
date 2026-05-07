import React, { useRef } from 'react';
import { Image as ImageIcon, Type, Trash2 } from 'lucide-react';

export interface ContentBlock {
  id: string;
  type: 'text' | 'image';
  content: string;
  file?: File | null;
  previewUrl?: string;
}

interface ArticleBuilderProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export function ArticleBuilder({ blocks = [], onChange }: ArticleBuilderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeBlockId = useRef<string | null>(null);

  const addBlock = (type: 'text' | 'image') => {
    onChange([...blocks, { id: `block-${Date.now()}`, type, content: '' }]);
  };

  const updateBlock = (id: string, field: keyof ContentBlock, value: any) => {
    onChange(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  };

  const handleImageUpload = (id: string, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    onChange(blocks.map(b => b.id === id ? { ...b, file, previewUrl, content: '' } : b));
  };

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <div key={block.id} className="relative group p-4 border border-slate-200 rounded-xl bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/50">
          <button 
            type="button" 
            onClick={() => removeBlock(block.id)} 
            className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-400 hover:text-red-500 hover:border-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
          >
            <Trash2 size={14} />
          </button>
          
          {block.type === 'text' ? (
            <textarea
              placeholder="Tulis paragraf teks di sini..."
              className="w-full min-h-[100px] bg-transparent border-none outline-none resize-y text-sm font-medium text-slate-700 placeholder:text-slate-400"
              value={block.content}
              onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-colors ${!block.file && !block.previewUrl && block.content !== '' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`} 
                  onClick={() => updateBlock(block.id, 'content', block.content)}
                >
                  LINK URL
                </button>
                <button 
                  type="button" 
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-colors ${block.file || block.previewUrl ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`} 
                  onClick={() => {
                    activeBlockId.current = block.id;
                    fileInputRef.current?.click();
                  }}
                >
                  UPLOAD GAMBAR
                </button>
              </div>
              
              {!block.file && !block.previewUrl ? (
                <input 
                  placeholder="https://... (URL Gambar atau Youtube)" 
                  className="w-full p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold" 
                  value={block.content} 
                  onChange={(e) => updateBlock(block.id, 'content', e.target.value)} 
                />
              ) : (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group/img">
                  <img src={block.previewUrl || block.content} className="w-full h-full object-contain" alt="Preview" />
                  <button
                    type="button"
                    onClick={() => {
                      activeBlockId.current = block.id;
                      fileInputRef.current?.click();
                    }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                  >
                    <span className="text-white text-xs font-bold px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm">Ganti Gambar</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center gap-3 pt-2">
        <button type="button" onClick={() => addBlock('text')} className="flex items-center justify-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 px-4 py-3 rounded-xl transition-all flex-1">
          <Type size={16} /> Tambah Teks
        </button>
        <button type="button" onClick={() => addBlock('image')} className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 px-4 py-3 rounded-xl transition-all flex-1">
          <ImageIcon size={16} /> Tambah Gambar/Media
        </button>
      </div>

      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        accept="image/*" 
        onChange={(e) => {
          if (e.target.files?.[0] && activeBlockId.current) {
            handleImageUpload(activeBlockId.current, e.target.files[0]);
          }
          // Reset file input so same file can be selected again
          if (fileInputRef.current) fileInputRef.current.value = '';
        }} 
      />
    </div>
  );
}
