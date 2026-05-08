# 🚀 Roadmap Pengembangan Cita-citaku

Roadmap ini disusun berdasarkan skala prioritas: **Keamanan > Fungsionalitas Inti > UX/UI > Optimasi**.

---

## ✅ Status Progres Saat Ini (Update Terbaru)

| Fitur | Status | Deskripsi |
| :--- | :--- | :--- |
| **Security Hardening** | 🟢 Selesai | Rate limiting, security headers, dan sanitasi input aktif (JetBrains Patch). |
| **Dynamic Project Schema** | 🟢 Selesai | Mongoose schema untuk mendukung data proyek kompleks & dinamis. |
| **AI Counselor Guardrails** | 🟢 Selesai | System prompt di sisi server untuk menjaga konteks percakapan. |
| **Minimalist Project Explore** | 🟢 Selesai | Desain ulang grid 4 kolom, tipografi ramping, dan UI bersih. |
| **Project-Specific Thumbnails** | 🟢 Selesai | Field thumbnail didukung penuh di schema dan UI. |
| **Interactive AI Workspace** | 🟢 Selesai | Panel AI di Project Explore kini terhubung ke backend & dinamis. |
| **Project Detail View** | 🟢 Selesai | Implementasi halaman `ProjectDetail.tsx` dengan desain premium. |
| **AI Smart Orchestrator** | 🟢 Selesai | Sistem gonta-ganti AI (Groq, OpenRouter, Gemini) secara otomatis. |
| **User Quota & Rate Limit** | 🟢 Selesai | Batasan pesan per user agar API Key gratis tidak cepat habis. |
| **Multi-Device SSO** | 🟢 Selesai | Login Google yang bisa diakses dari berbagai perangkat (Firebase Auth). |
| **Push to GitHub** | 🟡 Pending | Rencana sinkronisasi seluruh perubahan ke repository. |

---

## 🔴 Fase 1: Keamanan & Infrastruktur (Prioritas Utama)
*Kritis untuk mencegah kebocoran data dan serangan luar.*

| No | Tugas | Deskripsi | Kesulitan |
| :--- | :--- | :--- | :--- |
| **12** | **API Security (Zero Leak)** | 🟢 **Done** - Menggunakan .env dan proxy server untuk menyembunyikan API Key. | 🟢 Easy |
| **06** | **Security Hardening (CIA Level)** | 🟢 **Done** - Rate limiting, headers security, dan sanitization aktif. | 🔴 Hard |
| **04** | **Database Schema (MongoDB)** | 🟢 **Done** - Menggunakan Mongoose Schema untuk fleksibilitas data dinamis. | 🟢 Easy |
| **05** | **Database Security Rules** | 🟢 **Done** - Firestore rules diperkuat untuk role-based access. | 🟠 Medium |
| **17** | **Google SSO (Firebase Auth)** | 🟡 **Planned** - Implementasi login satu klik menggunakan Google OAuth. | 🟢 Easy |
| **18** | **Secure Admin Hashing** | 🟢 **Done** - Support password hashing di skema User. | 🔴 Hard |
| **19** | **Super Admin Role** | 🟢 **Done** - Role `super_admin` sudah tersedia di schema database. | 🟠 Medium |
| **13** | **API Integration** | 🟢 **Done** - Endpoint dasar untuk User, Project, dan Submission tersedia. | 🟠 Medium |

---

## 🟡 Fase 2: Logika Bisnis & AI Guardrails
*Memastikan aplikasi berjalan pintar dan tidak bisa "diakali".*

| No | Tugas | Deskripsi | Kesulitan |
| :--- | :--- | :--- | :--- |
| **11** | **AI Logic Guardrails** | 🟢 **Done** - System prompt di server mencegah penyalahgunaan AI. | 🟠 Medium |
| **27** | **Smart AI Selection** | 🟢 **Done** - Memilih AI berdasarkan tingkat kesulitan tugas (Logic vs Chat). | 🟠 Medium |
| **28** | **Token/Usage Quota** | 🟢 **Done** - Pembatasan jumlah request per user ID untuk menghemat API Free. | 🔴 Hard |
| **10** | **State Persistence (Anti-Reset)** | 🟡 **Planned** - Menggunakan localStorage/Zustand untuk persistensi data. | 🟢 Easy |
| **14** | **Professional Error Handling** | 🟢 **Done** - Error handling global di API routes & UI indicators. | 🟢 Easy |
| **03** | **Logic & Link Audit** | 🟡 **Planned** - Pengecekan manual seluruh alur navigasi. | 🟢 Easy |
| **15** | **Dynamic Schema Integration** | 🟢 **Done** - Mendukung skema Project kompleks (Steps & Brief). | 🔴 Hard |
| **16** | **Form Data Mapping** | 🟢 **Done** - Mapping otomatis data kontribusi ke mesin render. | 🟠 Medium |

---

## 🔵 Fase 3: UI/UX & Desain "Anti-AI Look"
*Membuat tampilan terasa premium, nyata, dan memiliki keterbacaan tinggi.*

| No | Tugas | Deskripsi | Kesulitan |
| :--- | :--- | :--- | :--- |
| **01** | **Modern Editorial Design** | Mengubah gaya "soft AI" menjadi gaya **Editorial/Premium**. Kontras tinggi, tipografi tajam, dan penggunaan *negative space* yang berani. | 🟠 Medium |
| **02** | **Advanced Category Grid** | Mengubah grid kategori statis menjadi **Dynamic Carousel** atau **Horizontal Scroll** yang responsif untuk menampung banyak profesi. | 🟠 Medium |
| **07** | **Adaptive Design** | Bukan sekadar mengecilkan ukuran, tapi mengubah layout (misal: menu samping jadi tab bawah) saat di mobile. | 🟠 Medium |

---

## ⚪ Fase 4: Optimasi & Skalabilitas
*Memastikan web siap untuk ribuan pengguna.*

| No | Tugas | Deskripsi | Kesulitan |
| :--- | :--- | :--- | :--- |
| **09** | **Scalability Architecture** | Optimasi performa (Code Splitting, Image Optimization) agar web tetap kencang saat data profesi membengkak. | 🟠 Medium |
| **08** | **Cross-Browser Testing** | Memastikan tampilan konsisten di Chrome, Safari, Firefox, dan browser mobile. | 🟢 Easy |
| **20** | **Core Web Vitals (CWV)** | Optimasi LCP & CLS untuk memastikan skor Lighthouse 90+ (SEO & Performance). | 🔴 Hard |
| **21** | **Micro-interactions** | Penambahan animasi halus pada tombol dan hover state agar UX terasa "premium" dan hidup. | 🟢 Easy |
| **22** | **Open Graph & SEO Audit** | Implementasi Meta Tags dinamis agar link web tampil cantik saat di-share ke media sosial. | 🟠 Medium |
| **23** | **Observability (Sentry)** | Integrasi error tracking untuk mendeteksi bug yang dialami user secara real-time. | 🟠 Medium |
| **24** | **Gamification Engine** | Implementasi sistem XP, Level, dan Badge untuk meningkatkan retensi user (Engagement). | 🔴 Hard |
| **25** | **Automated E2E Testing** | Setup Playwright untuk memastikan alur krusial (Login -> Test -> Submit) tidak pernah break. | 🔴 Hard |
| **26** | **Design Token System** | Standardisasi variabel warna, spacing, dan shadow agar UI konsisten 100%. | 🟢 Easy |

---

## 🏛️ Standar Web & Desain (Theory)

- **Octalysis Framework (Gamification)**: Menggunakan 8 penggerak inti psikologi manusia agar user merasa tertantang dan dihargai saat belajar karir.
- **Atomic Design Principles**: Membangun UI dari komponen terkecil (Atoms) hingga Organisms agar kode konsisten dan mudah diatur.
- **TDD (Test Driven Development)**: Menulis tes sebelum kode untuk memastikan kualitas aplikasi jangka panjang (Scalability).
- **Mobile-First Indexing**: Google memprioritaskan versi mobile. Pastikan tampilan mobile bukan sekadar "versi kecil" dari desktop, tapi memang didesain untuk jempol manusia.
- **Accessibility (WCAG 2.1)**: Memastikan warna memiliki kontras yang cukup dan elemen bisa dibaca oleh *Screen Reader*.

---

> [!IMPORTANT]
> **Saran Database:** Saya sangat menyarankan **Firebase/Supabase**. Mengapa? Karena project ini sangat bergantung pada kecepatan data dan keamanan user. Firebase memberikan kita sistem **Auth + Database + Security Rules** dalam satu paket yang sangat sulit ditembus jika dikonfigurasi dengan benar.

---

### Langkah Selanjutnya:
Saya akan mulai mengerjakan **Poin 15 & 16** (Integrasi Skema Data Dinamis) agar tampilan "Project Explore" yang sudah keren itu bisa langsung menarik data dari database. Setuju?
