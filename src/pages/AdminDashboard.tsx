import { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Search, 
  Filter, 
  ShieldCheck, 
  Users, 
  FileText, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import * as motion from 'motion/react-client';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  // Mock Data for Moderation Queue
  const [submissions, setSubmissions] = useState([
    {
      id: '1',
      title: 'Cloud Security Engineer',
      author: 'Rislan T.',
      date: '2 jam yang lalu',
      category: 'Tech',
      status: 'pending',
      steps: 5,
    },
    {
      id: '2',
      title: 'Digital Marketing Lead',
      author: 'Sarah A.',
      date: '5 jam yang lalu',
      category: 'Business',
      status: 'pending',
      steps: 4,
    },
    {
      id: '3',
      title: 'Data Analyst (Retail)',
      author: 'Kevin J.',
      date: '1 hari yang lalu',
      category: 'Tech',
      status: 'approved',
      steps: 6,
    }
  ]);

  const stats = [
    { label: 'Total User', value: '1,240', icon: <Users className="text-blue-600" />, trend: '+12%' },
    { label: 'Pending Roadmaps', value: '14', icon: <FileText className="text-amber-600" />, trend: 'High Priority' },
    { label: 'Approved Profesi', value: '82', icon: <ShieldCheck className="text-emerald-600" />, trend: '+5 this week' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      {/* Admin Header */}
      <header className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Admin <span className="text-blue-600">Control Panel.</span></h1>
          <p className="mt-2 opacity-60 font-medium" style={{ color: 'var(--text-secondary)' }}>Selamat datang kembali, Admin. Kelola kualitas konten platform Anda di sini.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
            <input 
              type="text" 
              placeholder="Cari kontribusi..."
              className="h-12 rounded-xl pl-12 pr-4 text-sm transition-all theme-input"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            />
          </div>
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 mb-12 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[2rem] theme-card p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50/50">
                {stat.icon}
              </div>
              <span className="text-xs font-black text-emerald-500 flex items-center gap-1">
                <TrendingUp size={14} /> {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">{stat.label}</p>
            <p className="text-4xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Moderation Queue Section */}
      <div className="rounded-[2.5rem] theme-card overflow-hidden shadow-sm">
        <div className="border-b theme-border bg-slate-50/50 px-8 py-6 flex items-center justify-between">
          <div className="flex gap-4">
            {['pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${
                  activeTab === tab 
                  ? 'bg-slate-950 text-white shadow-lg' 
                  : 'opacity-40 hover:opacity-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-[10px] font-black opacity-40 hover:opacity-100 transition">
            <Filter size={16} /> Filter Lanjutan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b theme-border text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                <th className="px-8 py-6">Nama Profesi</th>
                <th className="px-8 py-6">Kontributor</th>
                <th className="px-8 py-6">Kategori</th>
                <th className="px-8 py-6">Detail</th>
                <th className="px-8 py-6">Waktu</th>
                <th className="px-8 py-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {submissions.filter(s => s.status === activeTab).map((sub) => (
                <tr key={sub.id} className="group hover:bg-slate-50/10 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-black" style={{ color: 'var(--text-primary)' }}>{sub.title}</p>
                    <p className="text-[10px] opacity-40">{sub.steps} Tahap Belajar</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600">
                        {sub.author[0]}
                      </div>
                      <span className="text-sm font-bold opacity-70">{sub.author}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="rounded-full bg-slate-100/50 px-3 py-1 text-[10px] font-black uppercase tracking-widest opacity-50">
                      {sub.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button className="flex items-center gap-2 text-xs font-black text-blue-600 hover:underline">
                      <Eye size={14} /> Lihat Konten
                    </button>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold opacity-40">
                    {sub.date}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {activeTab === 'pending' && (
                        <>
                          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                            <CheckCircle2 size={18} />
                          </button>
                          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      <button className="h-10 w-10 flex items-center justify-center rounded-xl opacity-20 hover:opacity-100 transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {submissions.filter(s => s.status === activeTab).length === 0 && (
            <div className="py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50/50 opacity-20 mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <p className="opacity-40 font-bold uppercase tracking-widest text-[10px]">Semua bersih! Tidak ada antrian.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
