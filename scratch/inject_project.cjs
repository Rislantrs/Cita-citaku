const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables dari root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'cita-citaku';

async function injectDetailedProject() {
  if (!mongoUri) {
    console.error('ERROR: MONGODB_URI tidak ditemukan di file .env');
    process.exit(1);
  }

  try {
    console.log('--- MEMULAI INJEKSI PROYEK ---');
    console.log('Menghubungkan ke MongoDB Atlas...');
    await mongoose.connect(mongoUri, { dbName });
    console.log('✅ Terhubung ke database:', dbName);

    // Definisikan model secara fleksibel (Tanpa strict schema agar gampang suntik data)
    const CareerModel = mongoose.models.Career || mongoose.model('Career', new mongoose.Schema({}, { strict: false }));
    const ProjectModel = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({}, { strict: false }));

    const projectSlug = 'cyber-security-audit-lab';
    
    // 1. DATA PROYEK SUPER DETAIL
    const detailedProject = {
      id: projectSlug,
      title: "Network Security Audit: Menambal Celah Startup",
      introduction: "Simulasi nyata melakukan audit keamanan pada jaringan startup yang sedang berkembang.",
      background: "Startup 'Go-Fast' baru saja mengalami serangan DDoS ringan. Sebagai junior security analyst, tugasmu adalah mengaudit konfigurasi firewall, memindai port yang terbuka, dan memberikan rekomendasi keamanan.",
      skills: ["Nmap", "Wireshark", "Firewall Policy", "Network Mapping", "Vulnerability Assessment"],
      brief: "Audit ini bertujuan untuk mengidentifikasi celah keamanan sebelum hacker sesungguhnya menemukannya. Kamu akan menggunakan alat standar industri untuk melakukan pemindaian.",
      category: "Cyber Security",
      image: "/images/cat-tech.webp",
      featured: true,
      
      // ARTIKEL PANDUAN (Manual)
      briefSections: [
        {
          number: 1,
          title: "Apa itu Network Auditing?",
          content: "Network auditing adalah proses meninjau infrastruktur jaringan untuk memverifikasi kepatuhan terhadap kebijakan keamanan. Ini mencakup pemeriksaan hardware, software, dan konfigurasi."
        },
        {
          number: 2,
          title: "Tool Utama: Nmap",
          content: "Nmap (Network Mapper) adalah tool open-source untuk eksplorasi jaringan dan audit keamanan. Tool ini sangat powerful untuk memetakan host yang aktif dan layanan yang berjalan."
        }
      ],

      // LANGKAH INTERAKTIF (Step-by-Step)
      interactiveSteps: [
        {
          id: "step-1",
          stepNumber: 1,
          title: "Pemindaian Awal (Reconnaissance)",
          description: "Gunakan perintah nmap untuk mendeteksi host yang hidup di subnet 192.168.1.0/24.",
          question: "Perintah mana yang paling tepat untuk 'Ping Scan' tanpa melakukan port scan?",
          choices: [
            { id: "c1", label: "nmap -sP 192.168.1.0/24", guidance: "Benar! -sP atau -sn digunakan untuk ping scan.", nextStepId: "step-2" },
            { id: "c2", label: "nmap -p 80 192.168.1.0/24", guidance: "Salah, itu untuk scan port 80 saja." }
          ]
        },
        {
          id: "step-2",
          stepNumber: 2,
          title: "Analisis Port Terbuka",
          description: "Kamu menemukan port 21 (FTP) terbuka dan menggunakan versi lama.",
          question: "Apa risiko utama membiarkan port FTP (port 21) terbuka dengan versi lama?",
          choices: [
            { id: "c3", label: "Pencurian data melalui eksploitasi buffer overflow", guidance: "Tepat sekali! FTP lama sangat rentan terhadap exploit.", nextStepId: "complete" },
            { id: "c4", label: "Hanya membuat internet lambat", guidance: "Kurang tepat, risikonya jauh lebih besar yaitu keamanan data." }
          ]
        }
      ]
    };

    // 2. SIMPAN KE KOLEKSI PROJECTS
    console.log('Injeksi ke koleksi "projects"...');
    await ProjectModel.findOneAndUpdate(
      { id: projectSlug },
      detailedProject,
      { upsert: true, new: true }
    );

    // 3. UPDATE ROADMAP CYBER SECURITY
    const cyberSecuritySlug = 'cyber-security-analyst';
    console.log(`Mengupdate roadmap: ${cyberSecuritySlug}...`);
    const careerDoc = await CareerModel.findOne({ slug: cyberSecuritySlug });

    if (careerDoc) {
      const career = careerDoc.toObject();
      if (!career.roadmap) career.roadmap = [];
      if (career.roadmap.length === 0) {
        career.roadmap.push({ fase: "Fase 1", judul: "Keamanan Jaringan", topics: [] });
      }

      if (!career.roadmap[0].topics) career.roadmap[0].topics = [];
      
      const newTopic = {
        title: "Praktik Audit Jaringan",
        description: "Latihan simulasi melakukan audit pada infrastruktur nyata.",
        showProject: true,
        project: {
           id: projectSlug,
           title: detailedProject.title,
           background: detailedProject.background,
           mode: "interactive"
        }
      };

      // Tambahkan jika belum ada topic dengan judul yang sama
      const exists = career.roadmap[0].topics.some(t => t.title === newTopic.title);
      if (!exists) {
        career.roadmap[0].topics.push(newTopic);
      }

      await CareerModel.findOneAndUpdate({ slug: cyberSecuritySlug }, { $set: { roadmap: career.roadmap } });
      console.log('✅ Roadmap Cyber Security berhasil diperbarui!');
    } else {
      console.log('⚠️ Karir Cyber Security belum ada, membuat data baru...');
      await CareerModel.create({
        slug: cyberSecuritySlug,
        title: "Cyber Security Analyst",
        idKategori: "tech",
        roadmap: [{
          fase: "Fase 1",
          judul: "Spesialis Keamanan",
          topics: [{
            title: "Praktik Audit Jaringan",
            description: "Simulasi audit nyata.",
            showProject: true,
            project: { id: projectSlug, title: detailedProject.title, mode: "interactive" }
          }]
        }]
      });
    }

    console.log('--- 🎉 INJEKSI SELESAI SEMPURNA ---');
    process.exit(0);
  } catch (err) {
    console.error('❌ Injeksi GAGAL:', err);
    process.exit(1);
  }
}

injectDetailedProject();
