# 🚀 Roadmap Pengembangan Cita-citaku

Roadmap ini disusun berdasarkan skala prioritas: **Keamanan > Fungsionalitas Inti > UX/UI > Optimasi**.

---

## 🚨 PENTING: STATUS DEBUGGING TERAKHIR
> [!WARNING]
> **Isu Saat Ini yang Perlu Diselesaikan:**
> 1. **Firestore Permissions:** Error `Missing or insufficient permissions` saat fetch roadmaps. 
>    - **Solusi:** Jalankan `npx firebase deploy --only firestore:rules` untuk mengaktifkan aturan baru.
> 2. **Server 404 /api/chat/stream:** Kadang muncul 404.
>    - **Solusi:** Restart total server (`npm run dev`) dan pastikan log `[api] SSE streaming and history routes registered` muncul di terminal.

---

## ✅ Status Progres Saat Ini (Update Terbaru)

| Fitur | Status | Deskripsi |
| :--- | :--- | :--- |
| **Real-time AI Streaming** | 🟢 Selesai | Respons AI kini muncul kata-demi-kata (SSE) di Counselor & Project Explore. |
| **Chat Persistence** | 🟢 Selesai | Riwayat percakapan disimpan otomatis ke MongoDB (`ChatSessionModel`). |
| **Security Hardening** | 🟢 Selesai | Rate limiting, security headers, dan sanitasi input aktif (JetBrains Patch). |
| **Dynamic Project Schema** | 🟢 Selesai | Mongoose schema untuk mendukung data proyek kompleks & dinamis. |
| **AI Counselor Guardrails** | 🟢 Selesai | System prompt di sisi server untuk menjaga konteks percakapan. |
| **Minimalist Project Explore** | 🟢 Selesai | Desain ulang grid 4 kolom, tipografi ramping, dan UI bersih. |
| **Interactive AI Workspace** | 🟢 Selesai | Panel AI di Project Explore kini terhubung ke backend & dinamis. |
| **AI Smart Orchestrator** | 🟢 Selesai | Sistem gonta-ganti AI (Groq, OpenRouter, Gemini) secara otomatis. |
| **User Quota & Rate Limit** | 🟢 Selesai | Batasan 50 pesan per user aktif. |
| **Multi-Device SSO** | 🟢 Selesai | Login Google via Firebase Auth. |

---

## 🔴 Fase 1: Keamanan & Infrastruktur (Prioritas Utama)
*Kritis untuk mencegah kebocoran data dan serangan luar.*

| No | Tugas | Deskripsi | Kesulitan |
| :--- | :--- | :--- | :--- |
| **12** | **API Security (Zero Leak)** | 🟢 **Done** - Menggunakan .env dan proxy server untuk menyembunyikan API Key. | 🟢 Easy |
| **06** | **Security Hardening (CIA Level)** | 🟢 **Done** - Rate limiting, headers security, dan sanitization aktif. | 🔴 Hard |
| **04** | **Database Schema (MongoDB)** | 🟢 **Done** - Menggunakan Mongoose Schema untuk fleksibilitas data dinamis. | 🟢 Easy |
| **05** | **Database Security Rules** | 🟠 **In Progress** - Firestore rules diperkuat, perlu di-deploy untuk Roadmap. | 🟠 Medium |
| **17** | **Google SSO (Firebase Auth)** | 🟢 **Done** - Implementasi login satu klik menggunakan Google OAuth. | 🟢 Easy |
| **18** | **Secure Admin Hashing** | 🟢 **Done** - Support password hashing di skema User. | 🔴 Hard |
| **19** | **Super Admin Role** | 🟢 **Done** - Role `super_admin` sudah tersedia di schema database. | 🟠 Medium |

---

## 🟡 Fase 2: Logika Bisnis & AI Streaming
*Memastikan aplikasi berjalan pintar dan responsif.*

| No | Tugas | Deskripsi | Kesulitan |
| :--- | :--- | :--- | :--- |
| **11** | **AI Logic Guardrails** | 🟢 **Done** - System prompt di server mencegah penyalahgunaan AI. | 🟠 Medium |
| **27** | **Real-time Streaming (SSE)** | 🟢 **Done** - AI memberikan jawaban kata demi kata (seperti ChatGPT). | 🔴 Hard |
| **28** | **Chat Persistence** | 🟢 **Done** - Riwayat chat disimpan di MongoDB per User ID. | 🔴 Hard |
| **10** | **Session History UI** | 🟢 **Done** - Sidebar riwayat chat untuk load percakapan lama. | 🟠 Medium |
| **14** | **Professional Error Handling** | 🟢 **Done** - Error handling global di API routes & UI indicators. | 🟢 Easy |

---

## 🔵 Fase 3: UI/UX & Desain "Anti-AI Look"
*Membuat tampilan terasa premium, nyata, dan memiliki keterbacaan tinggi.*

| No | Tugas | Deskripsi | Kesulitan |
| :--- | :--- | :--- | :--- |
| **01** | **Modern Editorial Design** | 🟢 **Done** - Dark/Light mode konsisten, CSS variables, Inter font, cross-browser backdrop-filter. | 🟠 Medium |
| **02** | **Advanced Category Grid** | 🟢 **Done** - Carousel horizontal dengan snap-scroll, tombol navigasi, dan lazy loading gambar. | 🟠 Medium |
| **07** | **Adaptive Design** | 🟢 **Done** - Bottom tab bar di mobile, safe-area-inset, dynamic viewport height (dvh). | 🟠 Medium |

---

## 🎯 Milestone 4: Data Integrity & Mobile Optimization (To-Do List)
- [x] **Mobile Friendly Audit & Polish** (Selesai ✅)
    - [x] Re-design ukuran font Heading & Body agar proporsional di layar HP (Responsive Typography).
    - [x] Optimasi lebar kontainer (Wrapper) dan padding di seluruh halaman utama.
    - [x] Penyesuaian ukuran elemen interaktif (Button, Card, Input) untuk kenyamanan layar sentuh.
    - [x] Perbaikan layout Radar Chart RIASEC agar tidak terpotong di layar kecil.
- [x] **Advanced Career Database Architecture** (Frontend Ready ✅)
    - [x] Perancangan ulang Database Profesi dengan variabel lengkap:
        - [x] Info Gaji (Salary Range & Penjelasan).
        - [x] Info Pendidikan (Jurusan Kuliah, Durasi, Jalur Akademik).
        - [x] Materi Belajar (Curated Materials/Resources).
        - [x] Daftar Buku Rekomendasi (Judul, Penulis, Link).
        - [x] Referensi Digital (Website & YouTube Playlist).
    - [ ] Sinkronisasi ke MongoDB (Backend Pending 🟠)
- [x] **Cross-Page Data Integration** (Selesai ✅)
    - [x] Integrasi Halaman Project dengan Explor Profesi (Berbagi data yang sama).
    - [x] Memastikan setiap profesi memiliki daftar project terkait yang bisa langsung diklik.
- [ ] **Admin & Community Flow Verification**
    - [ ] Uji coba fitur Kontribusi Komunitas (Memastikan data user masuk ke antrean Admin).
    - [ ] Uji coba Dashboard Admin (Fitur Upload Roadmap & Approval Kontribusi).
- [ ] **Content Seeding**
    - [ ] Input 20+ variasi profesi dengan data lengkap (Seni, Bisnis, Sains, Sosial, dll.) ke database.

## ✅ Completed Tasks
- [x] **AI RIASEC Stabilization**: Integrasi Gemini 1.5 Flash dengan Strict JSON Mode.
- [x] **Dynamic Recommendations**: AI merekomendasikan karir berdasarkan data database asli.
- [x] **UI Polish**: Animasi konfeti 5 detik dan premium AI analysis typography.
- [x] **AI Workspace Overhaul**: Independent scrolling, Mobile Tab Switching, dan Markdown rendering.
- [x] **Bug Fixes**: Fixed 500 error handling di API projects & Unique Key warnings di Roadmap.
- [x] **GitHub Sync**: Push berkala untuk keamanan kode.

---

## 🏛️ Standar Web & Desain (Theory)
- **Rich Aesthetics**: Vibrant colors, glassmorphism, dynamic animations.
- **Mobile Friendly**: Grid-responsive, touch-optimized, readable typography.
- **Data Driven**: AI recommendations must be backed by database-accurate slugs.
- **Atomic Design**: Membangun komponen yang reusable dan konsisten.
- **Atomic Design Principles**: Membangun UI dari komponen terkecil (Atoms) hingga Organisms.
- **TDD (Test Driven Development)**: Menulis tes sebelum kode untuk memastikan kualitas jangka panjang.
- **Mobile-First Indexing**: Google memprioritaskan versi mobile.
- **Accessibility (WCAG 2.1)**: Memastikan warna memiliki kontras yang cukup.

---

> [!IMPORTANT]
> **Saran Database:** Saya sangat menyarankan **Firebase/Supabase** untuk data real-time, sementara MongoDB tetap digunakan untuk penyimpanan chat yang berat (heavy text data).

---

---

## 📅 TO-DO LIST MEI 2026 (Urgent Updates)
Daftar tugas yang sudah diimplementasikan pada 10 Mei 2026:

1. ✅ **Audit Keamanan Total**: Secured semua endpoint admin dengan Firebase Admin token verification. Menghapus pola `reviewerRole` dari body (client-spoofable) → sekarang di-verify server-side.
2. ✅ **Admin Authentication**: Auth wall di `AdminDashboard.tsx` — cek role dari Firestore sebelum render. Backend: `requireAuth` + `requireAdmin` middleware di `backend/auth.ts`.
3. ✅ **Mobile Version Audit**: Firestore rules ditambahkan safe-area support. Responsive utilities sudah ada di semua page. *(Full visual testing perlu dilakukan manual di device)*
4. ✅ **Database Integrity Check**: Ditambahkan `UserProjectModel` schema baru untuk user project progress. Semua model ter-export dan ter-index dengan benar.
5. ✅ **Backend-First Philosophy**: Menghapus `GEMINI_API_KEY` dari `vite.config.ts` define (tidak lagi terekspos di frontend). Admin role verification dipindahkan ke server-side. Firestore rules diperketat.
6. ✅ **Image Optimization (WebP)**: `/api/upload` sekarang otomatis compress + convert ke WebP via `sharp` (max 1920px, quality 80). File original dihapus setelah konversi.
7. ✅ **RIASEC Persistence Fix**: Root cause: `saveQuestions()` hanya `batch.set()` tapi tidak `batch.delete()` untuk soal yang dihapus. Fix: fetch existing IDs, diff, delete yang hilang dalam batch yang sama.
8. ✅ **Project Submission System**: `UserProjectModel` + `POST /api/user-projects` + `GET /api/user-projects/:uid`. Tombol "Simpan Progres" dan "Kirim Project" di `ProjectExplore.tsx` sekarang terhubung ke backend.
9. ✅ **Dynamic Dashboard & User Panel**: `Dashboard.tsx` sekarang fetch real data via `GET /api/users/:uid/summary`. Quiz results, project count, dan career target ditarik dari database. Tombol "Simpan Progres" dan "Selesai" aktif.

---

### Langkah Selanjutnya:
Lanjutkan ke **Fase 4 (Gamification)** — semua prerequisite sudah terpenuhi.
