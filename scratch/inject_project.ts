import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'cita-citaku';

async function injectDetailedProject() {
  if (!mongoUri) {
    console.error('MONGODB_URI missing');
    return;
  }

  try {
    await mongoose.connect(mongoUri, { dbName });
    console.log('Connected to Atlas');

    const CareerModel = mongoose.model('Career', new mongoose.Schema({}, { strict: false }));
    const ProjectModel = mongoose.model('Project', new mongoose.Schema({}, { strict: false }));

    const projectSlug = 'cyber-security-audit-lab';
    
    // 1. DATA PROYEK DETAIL
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

    // 2. INJECT KE DATABASE PROYEK
    await ProjectModel.findOneAndUpdate(
      { id: projectSlug },
      detailedProject,
      { upsert: true, new: true }
    );
    console.log('Project injected into projects collection');

    // 3. INJECT / UPDATE KE ROADMAP CYBER SECURITY
    const cyberSecuritySlug = 'cyber-security-analyst';
    const career = await CareerModel.findOne({ slug: cyberSecuritySlug });

    if (career) {
      const careerData = (career as any).toObject();
      // Pastikan ada roadmap
      if (!careerData.roadmap || careerData.roadmap.length === 0) {
         careerData.roadmap = [{ fase: "Fase 1", judul: "Dasar Keamanan Jaringan", topics: [] }];
      }

      // Suntik proyek ke topic pertama di fase pertama
      if (!careerData.roadmap[0].topics) careerData.roadmap[0].topics = [];
      
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

      // Tambahkan ke topics jika belum ada
      const exists = (careerData.roadmap[0].topics as any[]).some((t: any) => t.title === newTopic.title);
      if (!exists) {
        careerData.roadmap[0].topics.push(newTopic);
      }

      await CareerModel.findOneAndUpdate({ slug: cyberSecuritySlug }, { $set: { roadmap: careerData.roadmap } });
      console.log('Roadmap updated with the detailed project!');
    } else {
      console.warn('Career Cyber Security Analyst not found. Creating a minimal one...');
      await CareerModel.create({
        slug: cyberSecuritySlug,
        title: "Cyber Security Analyst",
        idKategori: "tech",
        description: "Ahli keamanan cyber yang bertugas melindungi data perusahaan.",
        roadmap: [
          {
            fase: "Fase 1",
            judul: "Dasar-Dasar Keamanan",
            topics: [
               {
                 title: "Praktik Audit Jaringan",
                 description: "Latihan simulasi melakukan audit pada infrastruktur nyata.",
                 showProject: true,
                 project: {
                    id: projectSlug,
                    title: detailedProject.title,
                    background: detailedProject.background,
                    mode: "interactive"
                 }
               }
            ]
          }
        ]
      });
    }

    console.log('Injection Finished Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Injection failed:', err);
    process.exit(1);
  }
}

injectDetailedProject();
