import { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, Eye, Search, Filter, ShieldCheck, 
  Users, FileText, TrendingUp, ChevronRight, MoreVertical,
  LayoutDashboard, Map, BrainCircuit, UserPlus, LogOut, FileBadge, Plus, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import * as motion from 'motion/react-client';
import { AdminRiasec } from '../components/admin/AdminRiasec';
import SubmitRoadmap from './SubmitRoadmap';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, updateDoc, setDoc, serverTimestamp, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';

type AdminView = 'dashboard' | 'review' | 'roadmaps' | 'riasec' | 'admins';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [adminVerified, setAdminVerified] = useState<boolean | null>(null);

  // Admin Auth Gate: verify role from Firestore
  useEffect(() => {
    if (authLoading) return;
    if (!user) { setAdminVerified(false); return; }

    const checkAdmin = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const role = snap.data()?.role;
          setAdminVerified(role === 'admin' || role === 'super_admin' || role === 'moderator');
        } else {
          setAdminVerified(false);
        }
      } catch (err) {
        console.error('[admin] Role check failed:', err);
        setAdminVerified(false);
      }
    };
    checkAdmin();
  }, [user, authLoading]);

  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [reviewingSubmission, setReviewingSubmission] = useState<any | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Submissions Data from Firestore
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Format date for display
        date: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toLocaleString() : 'Baru saja'
      }));
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoadmaps = async () => {
    try {
      const response = await fetch('/api/careers');
      const data = await response.json();
      if (data.items) {
        setRoadmaps(data.items);
      }
    } catch (error) {
      console.error('Error fetching roadmaps from API:', error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    fetchRoadmaps();
  }, []);

  const stats = [
    { label: 'Total User', value: '1,240', icon: <Users className="text-blue-600" />, trend: '+12%' },
    { label: 'Pending Roadmaps', value: '14', icon: <FileText className="text-amber-600" />, trend: 'High Priority' },
    { label: 'Approved Profesi', value: '82', icon: <ShieldCheck className="text-emerald-600" />, trend: '+5 this week' },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'review', label: 'Moderasi Kontribusi', icon: <ShieldCheck size={20} /> },
    { id: 'roadmaps', label: 'Database Roadmap', icon: <Map size={20} /> },
    { id: 'riasec', label: 'Bank Soal RIASEC', icon: <BrainCircuit size={20} /> },
    { id: 'admins', label: 'Manajemen Admin', icon: <UserPlus size={20} /> },
  ];

  const handleModerationAction = async (action: 'approve' | 'reject', data?: any) => {
    // If we are reviewing an existing roadmap, we might not have a submissionId
    const isFromSubmission = !!(reviewingSubmission?.status && reviewingSubmission?.id && !roadmaps.some(r => r.id === reviewingSubmission.id));
    const submissionId = isFromSubmission ? reviewingSubmission?.id : null;

    try {
      if (action === 'reject') {
        if (submissionId) {
          const docRef = doc(db, 'submissions', submissionId);
          await updateDoc(docRef, {
            status: 'rejected',
            updatedAt: serverTimestamp(),
            moderatedAt: serverTimestamp()
          });
        }
        toast.info('Kontribusi ditolak');
      } else {
        // APPROVE / PUBLISH
        const slug = data?.slug || data?.judul?.toLowerCase()?.replace(/\s+/g, '-') || data?.title?.toLowerCase()?.replace(/\s+/g, '-');
        
        // 1. SYNC TO MONGODB (The new main brain)
        try {
          const mongoPayload = {
            ...data,
            slug,
            idKategori: data.idKategori || 'tech',
          };
          
          const response = await fetch('/api/careers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mongoPayload)
          });
          
          if (!response.ok) {
            console.warn('[admin] Failed to sync to MongoDB, but will continue with Firestore');
          }
        } catch (e) {
          console.error('[admin] MongoDB sync error:', e);
        }

        // 2. FIRESTORE LEGACY SYNC (Optional, but good for community view)
        const roadmapRef = doc(db, 'roadmaps', slug);
        await setDoc(roadmapRef, {
          ...data,
          status: 'published',
          publishedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });

        // 3. UPDATE SUBMISSION STATUS IF EXISTS
        if (submissionId) {
          const subRef = doc(db, 'submissions', submissionId);
          await updateDoc(subRef, {
            status: 'approved',
            updatedAt: serverTimestamp(),
            moderatedAt: serverTimestamp()
          });
        }
        
        toast.success('Berhasil Di-publish ke Database Utama!');
      }

      setReviewingSubmission(null);
      setIsCreatingNew(false);
      fetchSubmissions();
      fetchRoadmaps();
    } catch (error) {
      console.error('Moderation failed:', error);
      toast.error('Gagal memproses aksi. Pastikan koneksi stabil.');
    }
  };

  const handleDeleteCareer = async (slug: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus karir ini secara permanen?')) return;
    
    try {
      const response = await fetch(`/api/careers/${slug}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Karir berhasil dihapus');
        fetchRoadmaps();
      } else {
        toast.error('Gagal menghapus karir');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan saat menghapus');
    }
  };

  // Auth Gate: show loading or denied
  if (authLoading || adminVerified === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600" />
        <p className="text-sm font-bold text-slate-500">Memverifikasi akses admin...</p>
      </div>
    );
  }

  if (!adminVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
        <div className="h-20 w-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 mb-2">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Akses Ditolak</h1>
        <p className="text-sm text-slate-500 text-center max-w-md">
          Halaman ini hanya bisa diakses oleh admin. Jika kamu merasa ini kesalahan, hubungi administrator.
        </p>
      </div>
    );
  }

  // Overlay for Editor
  if (reviewingSubmission || isCreatingNew) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-50/50 py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 mb-4">
          <button 
            onClick={() => { setReviewingSubmission(null); setIsCreatingNew(false); }}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm inline-flex"
          >
            <ChevronRight className="rotate-180" size={16} /> Kembali ke Admin Panel
          </button>
        </div>
        <SubmitRoadmap 
          isAdmin={true} 
          initialData={reviewingSubmission}
          onAction={(action, data) => {
            handleModerationAction(action as any, data);
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
          <div className="px-2">
            <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Admin<span className="text-blue-600">Panel.</span></h1>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Workspace</p>
          </div>
          
          <nav className="flex flex-col gap-1">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as AdminView)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                  currentView === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="mt-auto pt-8">
            <button className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all w-full">
              <LogOut size={20} /> Logout Admin
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 lg:border-l border-slate-100 lg:pl-8 lg:min-h-[80vh]">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {sidebarItems.find(i => i.id === currentView)?.label}
              </h2>
            </div>
            {currentView === 'roadmaps' && (
              <button 
                onClick={() => setIsCreatingNew(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 transition-all"
              >
                <Plus size={18} /> Buat Roadmap Baru
              </button>
            )}
            {currentView === 'admins' && (
              <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all">
                <UserPlus size={18} /> Tambah Admin
              </button>
            )}
          </header>

          <motion.div 
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {/* VIEW CONTENT */}
            {currentView === 'dashboard' && (
              <div className="grid gap-6 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-3xl bg-white border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600">
                        {stat.icon}
                      </div>
                      <span className="text-xs font-black text-emerald-500 flex items-center gap-1">
                        <TrendingUp size={14} /> {stat.trend}
                      </span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-4xl font-black mt-1 text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            )}

            {currentView === 'review' && (
              <div className="rounded-3xl bg-white border border-slate-100 overflow-hidden shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-2">
                    {['pending', 'approved', 'rejected'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${
                          activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                    <input type="text" placeholder="Cari..." className="h-10 rounded-xl pl-10 pr-4 text-xs font-bold bg-white border border-slate-200" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <th className="px-8 py-6">Nama Profesi</th>
                        <th className="px-8 py-6">Kontributor</th>
                        <th className="px-8 py-6">Status</th>
                        <th className="px-8 py-6 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {submissions.filter(s => s.status === activeTab).map((sub) => (
                        <tr key={sub.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <p className="font-black text-slate-900">{sub.judul || sub.title || 'Tanpa Judul'}</p>
                            <p className="text-[10px] font-bold text-slate-400">{sub.idKategori || sub.category}</p>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600">
                                {(sub.submittedBy?.name || sub.author || 'A')[0]}
                              </div>
                              <span className="text-sm font-bold text-slate-600">{sub.submittedBy?.name || sub.author || 'Anonim'}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="rounded-full bg-amber-50 text-amber-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest">{sub.status}</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => setReviewingSubmission(sub)}
                              className="inline-flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100"
                            >
                              <Eye size={14} /> Tinjau / Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {submissions.filter(s => s.status === activeTab).length === 0 && (
                    <div className="py-20 text-center"><p className="text-slate-400 font-bold">Tidak ada data.</p></div>
                  )}
                </div>
              </div>
            )}

            {currentView === 'roadmaps' && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {roadmaps.map((roadmap) => (
                  <div 
                    key={roadmap.slug || roadmap._id} 
                    className="relative group"
                  >
                    <div 
                      onClick={() => {
                        setReviewingSubmission(roadmap);
                        setIsCreatingNew(true);
                      }}
                      className="h-full rounded-3xl bg-white border border-slate-100 p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-blue-200 transition-colors cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover/card:scale-110 transition-transform">
                        <FileBadge size={28}/>
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900">{roadmap.judul || roadmap.title}</h3>
                        <p className="text-xs font-bold text-slate-400 mt-1">
                          {roadmap.idKategori || roadmap.category} • {(roadmap.roadmap || roadmap.phases || []).length} Fase
                        </p>
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCareer(roadmap.slug);
                      }}
                      className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                      title="Hapus Karir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {roadmaps.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-slate-400 font-bold">Belum ada roadmap di database Firestore.</p>
                  </div>
                )}
              </div>
            )}

            {currentView === 'riasec' && <AdminRiasec />}

            {currentView === 'admins' && (
               <div className="rounded-3xl bg-white border border-slate-100 overflow-hidden shadow-sm">
                  <div className="p-8 flex items-center gap-4">
                     <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black">A</div>
                     <div><p className="font-black text-slate-900">Admin Utama (Anda)</p><p className="text-xs font-bold text-emerald-500">Superadmin</p></div>
                  </div>
               </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
