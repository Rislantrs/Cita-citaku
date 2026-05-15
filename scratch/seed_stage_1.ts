import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'cita-citaku';

const careers = [
  {
    slug: "frontend-engineer",
    title: "Frontend Engineer",
    categoryId: "tech",
    description: "Spesialis yang membangun antarmuka interaktif yang langsung digunakan oleh pengguna akhir (user interface).",
    keyIkon: "monitor",
    recommendationMajors: ["Teknik Informatika", "Sistem Informasi", "Ilmu Komputer"],
    sertifikasi: ["Meta Front-End Developer", "React Certification"],
    riasecCategories: ["I", "A", "C"],
    mbtiTags: ["ENFP", "INFP", "ISFP", "ESFP"],
    universityWorld: {
      overview: "Mempelajari bagaimana membuat tampilan web dan aplikasi yang menarik dan responsif.",
      requiredSkills: ["HTML/CSS", "JavaScript/TypeScript", "React/Vue/Angular", "Web Performance"],
      whyChoose: [
        { title: "Visual & Logika", desc: "Menggabungkan keindahan desain dengan logika pemrograman." }
      ]
    },
    roadmap: [
      {
        fase: "Fase 1",
        judul: "Dasar Web",
        topics: [
          {
            title: "Membangun Landing Page",
            description: "Praktik membuat website statis.",
            showProject: true,
            project: {
              id: "landing-page-project",
              title: "Membuat Landing Page Portofolio",
              background: "Kamu mendapat klien yang butuh landing page.",
              mode: "interactive"
            }
          }
        ]
      }
    ]
  },
  {
    slug: "mobile-developer",
    title: "Mobile App Developer",
    categoryId: "tech",
    description: "Pengembang aplikasi untuk perangkat mobile (Android & iOS).",
    keyIkon: "smartphone",
    recommendationMajors: ["Teknik Informatika", "Ilmu Komputer"],
    sertifikasi: ["Google Associate Android Developer", "iOS Developer Certificate"],
    riasecCategories: ["I", "R", "C"],
    mbtiTags: ["ISTP", "INTP", "ESTP"],
    universityWorld: {
      overview: "Fokus pada pembuatan aplikasi yang berjalan di genggaman tangan pengguna.",
      requiredSkills: ["Kotlin/Swift", "Flutter/React Native", "Mobile UI/UX"],
      whyChoose: [
        { title: "Impact Besar", desc: "Aplikasimu bisa diunduh jutaan orang di app store." }
      ]
    },
    roadmap: [
      {
        fase: "Fase 1",
        judul: "Dasar Mobile",
        topics: [
          {
            title: "Aplikasi Todo List",
            description: "Membuat aplikasi sederhana.",
            showProject: true,
            project: {
              id: "todo-app-project",
              title: "Membangun Todo App Pertama",
              background: "Buat aplikasi produktivitas.",
              mode: "interactive"
            }
          }
        ]
      }
    ]
  },
  {
    slug: "product-manager",
    title: "Product Manager",
    categoryId: "business",
    description: "CEO dari sebuah produk. Bertanggung jawab atas visi, strategi, dan pengembangan produk digital.",
    keyIkon: "briefcase",
    recommendationMajors: ["Manajemen Bisnis", "Sistem Informasi", "Teknik Industri"],
    sertifikasi: ["Certified Product Manager (CPM)", "Agile Certified Practitioner"],
    riasecCategories: ["E", "S", "C"],
    mbtiTags: ["ENTJ", "ESTJ", "ENFJ"],
    universityWorld: {
      overview: "Menjembatani antara bisnis, teknologi, dan pengalaman pengguna.",
      requiredSkills: ["Product Strategy", "Agile/Scrum", "Data Analysis", "User Research"],
      whyChoose: [
        { title: "Pengambil Keputusan", desc: "Menentukan arah dan fitur produk masa depan." }
      ]
    },
    roadmap: [
      {
        fase: "Fase 1",
        judul: "Product Discovery",
        topics: [
          {
            title: "Riset Pengguna",
            description: "Melakukan riset untuk fitur baru.",
            showProject: true,
            project: {
              id: "user-research-project",
              title: "Riset Kebutuhan Fitur Chat",
              background: "Aplikasi butuh fitur chat, bagaimana risetnya?",
              mode: "interactive"
            }
          }
        ]
      }
    ]
  },
  {
    slug: "ai-engineer",
    title: "AI Engineer",
    categoryId: "tech",
    description: "Spesialis yang merancang dan membangun sistem kecerdasan buatan dan model machine learning.",
    keyIkon: "cpu",
    recommendationMajors: ["Ilmu Komputer", "Matematika", "Teknik Elektro"],
    sertifikasi: ["TensorFlow Developer Certificate", "AWS Certified Machine Learning"],
    riasecCategories: ["I", "R", "C"],
    mbtiTags: ["INTP", "INTJ", "ISTJ"],
    universityWorld: {
      overview: "Mempelajari algoritma yang memungkinkan mesin belajar dari data.",
      requiredSkills: ["Python", "Machine Learning", "Deep Learning", "NLP"],
      whyChoose: [
        { title: "Teknologi Masa Depan", desc: "Berada di garis depan inovasi dunia." }
      ]
    },
    roadmap: [
      {
        fase: "Fase 1",
        judul: "Machine Learning Basics",
        topics: [
          {
            title: "Model Prediksi",
            description: "Membuat model AI pertama.",
            showProject: true,
            project: {
              id: "ai-prediction-project",
              title: "Prediksi Harga Rumah dengan AI",
              background: "Gunakan dataset untuk memprediksi harga.",
              mode: "interactive"
            }
          }
        ]
      }
    ]
  },
  {
    slug: "game-developer",
    title: "Game Developer",
    categoryId: "tech",
    description: "Menciptakan dunia interaktif dan permainan digital yang imersif.",
    keyIkon: "play",
    recommendationMajors: ["Teknik Informatika", "Desain Komunikasi Visual", "Animasi"],
    sertifikasi: ["Unity Certified User", "Unreal Engine Certification"],
    riasecCategories: ["I", "A", "R"],
    mbtiTags: ["INTP", "ENFP", "ISTP"],
    universityWorld: {
      overview: "Menggabungkan seni, cerita, dan pemrograman ke dalam satu produk interaktif.",
      requiredSkills: ["C# / C++", "Unity / Unreal Engine", "Game Physics", "3D Math"],
      whyChoose: [
        { title: "Bikin Game Sendiri", desc: "Bisa merealisasikan imajinasi dunia buatanmu." }
      ]
    },
    roadmap: [
      {
        fase: "Fase 1",
        judul: "Dasar Game Engine",
        topics: [
          {
            title: "Game 2D Pertama",
            description: "Membuat platformer game.",
            showProject: true,
            project: {
              id: "platformer-game-project",
              title: "Membangun Game Mario Clone",
              background: "Belajar fisika dan input pemain.",
              mode: "interactive"
            }
          }
        ]
      }
    ]
  }
];

const projects = [
  {
    id: "landing-page-project",
    title: "Membuat Landing Page Portofolio",
    introduction: "Simulasi membuat website portofolio untuk freelancer.",
    background: "Sebagai frontend engineer, tugas pertamamu adalah membuat portofolio yang cepat dan responsif.",
    skills: ["HTML", "CSS", "Flexbox", "Responsive Design"],
    brief: "Gunakan HTML dan CSS murni untuk membuat layout 1 halaman.",
    category: "Web Development",
    image: "/images/cat-tech.webp",
    featured: true,
    briefSections: [{ number: 1, title: "Struktur HTML", content: "Mulai dari header, hero section, about, dan contact." }],
    interactiveSteps: [
      {
        id: "step-1",
        stepNumber: 1,
        title: "Pilih Tag Semantic",
        description: "Tag apa yang terbaik untuk membungkus konten utama?",
        question: "Pilih tag HTML5:",
        choices: [
          { id: "c1", label: "<main>", guidance: "Benar! Tag main sangat baik untuk SEO dan accessibility.", nextStepId: "complete" },
          { id: "c2", label: "<div>", guidance: "Bisa, tapi kurang semantik." }
        ]
      }
    ]
  },
  {
    id: "todo-app-project",
    title: "Membangun Todo App Pertama",
    introduction: "Membangun aplikasi Todo sederhana di HP.",
    background: "Aplikasi pengingat tugas harian yang bisa tambah, hapus, coret.",
    skills: ["State Management", "UI Layout", "Event Handling"],
    brief: "Buat list yang bisa di-scroll.",
    category: "Mobile Development",
    image: "/images/cat-tech.webp",
    featured: true,
    briefSections: [{ number: 1, title: "State", content: "Data harus disimpan di state agar UI update." }],
    interactiveSteps: [
      {
        id: "step-1",
        stepNumber: 1,
        title: "Menyimpan List",
        description: "Struktur data apa yang cocok untuk list todo?",
        question: "Pilih tipe data:",
        choices: [
          { id: "c1", label: "Array of Objects", guidance: "Benar! Bisa simpan id, teks, dan status selesai.", nextStepId: "complete" },
          { id: "c2", label: "String", guidance: "Salah, tidak bisa menyimpan banyak item dengan status berbeda." }
        ]
      }
    ]
  },
  {
    id: "user-research-project",
    title: "Riset Kebutuhan Fitur Chat",
    introduction: "Menentukan apakah fitur chat dibutuhkan di aplikasi E-commerce.",
    background: "Sebagai PM, kamu harus memvalidasi asumsi sebelum tim engineer ngoding berbulan-bulan.",
    skills: ["User Interview", "A/B Testing", "Data Analysis"],
    brief: "Tanya user, cek kompetitor, buat MVP.",
    category: "Product Management",
    image: "/images/cat-tech.webp",
    featured: true,
    briefSections: [{ number: 1, title: "Validasi Asumsi", content: "Jangan bikin fitur yang ga dipakai." }],
    interactiveSteps: [
      {
        id: "step-1",
        stepNumber: 1,
        title: "Langkah Pertama",
        description: "Apa yang harus dilakukan pertama kali?",
        question: "Pilih tindakan:",
        choices: [
          { id: "c1", label: "Melakukan interview ke 5 pengguna aktif", guidance: "Tepat! Validasi kualitatif sangat penting di awal.", nextStepId: "complete" },
          { id: "c2", label: "Langsung suruh programmer bikin", guidance: "Bahaya! Bisa buang-buang resource." }
        ]
      }
    ]
  },
  {
    id: "ai-prediction-project",
    title: "Prediksi Harga Rumah dengan AI",
    introduction: "Menggunakan Linear Regression untuk prediksi harga.",
    background: "Kamu punya dataset luas tanah, jumlah kamar, dan harga.",
    skills: ["Python", "Scikit-Learn", "Data Cleaning"],
    brief: "Latih model regresi linier sederhana.",
    category: "Artificial Intelligence",
    image: "/images/cat-tech.webp",
    featured: true,
    briefSections: [{ number: 1, title: "Linear Regression", content: "Mencari garis lurus terbaik yang mewakili tren data." }],
    interactiveSteps: [
      {
        id: "step-1",
        stepNumber: 1,
        title: "Missing Values",
        description: "Ada data rumah yang jumlah kamarnya kosong.",
        question: "Apa yang sebaiknya dilakukan?",
        choices: [
          { id: "c1", label: "Isi dengan nilai rata-rata (mean) kamar", guidance: "Benar! Ini cara umum untuk menangani missing values.", nextStepId: "complete" },
          { id: "c2", label: "Hapus seluruh dataset", guidance: "Terlalu ekstrem, data lain jadi terbuang." }
        ]
      }
    ]
  },
  {
    id: "platformer-game-project",
    title: "Membangun Game Mario Clone",
    introduction: "Menerapkan fisika gravitasi dan lompatan.",
    background: "Karaktermu butuh bisa lompat di atas platform tanpa tembus ke bawah.",
    skills: ["Game Loop", "Collision Detection", "Physics"],
    brief: "Implementasi Collider 2D.",
    category: "Game Development",
    image: "/images/cat-tech.webp",
    featured: true,
    briefSections: [{ number: 1, title: "Collider", content: "Komponen yang mendeteksi tabrakan antar objek." }],
    interactiveSteps: [
      {
        id: "step-1",
        stepNumber: 1,
        title: "Tembus Lantai",
        description: "Karaktermu jatuh menembus lantai.",
        question: "Komponen apa yang lupa dipasang pada lantai?",
        choices: [
          { id: "c1", label: "Box Collider 2D", guidance: "Benar! Lantai butuh collider agar objek lain bisa berpijak.", nextStepId: "complete" },
          { id: "c2", label: "Audio Source", guidance: "Salah, itu untuk suara." }
        ]
      }
    ]
  }
];

async function seed() {
  if (!mongoUri) {
    console.error('MONGODB_URI missing');
    return;
  }
  try {
    await mongoose.connect(mongoUri, { dbName });
    console.log('Connected to DB');
    const CareerModel = mongoose.model('Career', new mongoose.Schema({}, { strict: false }));
    const ProjectModel = mongoose.model('Project', new mongoose.Schema({}, { strict: false }));

    // Inject Projects
    for (const p of projects) {
      await ProjectModel.findOneAndUpdate({ id: p.id }, p, { upsert: true });
      console.log('Project upserted:', p.id);
    }

    // Inject Careers
    for (const c of careers) {
      await CareerModel.findOneAndUpdate({ slug: c.slug }, c, { upsert: true });
      console.log('Career upserted:', c.slug);
    }
    
    console.log('Stage 1 Seeding Complete');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

seed();
