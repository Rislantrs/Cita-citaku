export type CareerCategory = 'tech' | 'health' | 'business' | 'art' | 'education' | 'service';

export interface CareerRoadmapStep {
  phase: string;    // e.g., "Fase 1"
  meta: string;     // e.g., "5 Proyek" atau "3 Bulan"
  title: string;
  desc: string;
  projects: string[]; // Daftar materi/proyek spesifik
  longDesc?: string;   // Penjelasan mendalam ala artikel
  books?: { title: string; link: string }[]; // Referensi buku
}

export interface CareerMarketInfo {
  salaryIndo: string;
  salaryUSA: string;
  responsibilities: string[];
}

export interface CareerFAQ {
  q: string;
  a: string;
}

export interface CareerUniversityWorld {
  overview: string;
  requiredSkills: string[];
  whyChoose: { title: string; desc: string }[];
}

export interface CareerCatalogItem {
  slug: string;
  title: string;
  categoryId: CareerCategory;
  description: string;
  iconKey: string;
  recommendationMajors: string[];
  certifications: string[];
  riasecCategories: string[];
  mbtiTags: string[];
  roadmap: CareerRoadmapStep[];
  featured?: boolean;
  marketInfo: CareerMarketInfo;
  faqs: CareerFAQ[];
  type: 'skill_based' | 'education_based';
  topUniversities: {
    local: string[];
    global: string[];
  };
  universityWorld?: CareerUniversityWorld;
}

const DEFAULT_ROADMAP: CareerRoadmapStep[] = [
  { 
    phase: 'Fase 1', 
    meta: 'Fundamental', 
    title: 'Pondasi Logika', 
    desc: 'Membangun cara berpikir sistematis melalui matematika dan logika dasar.',
    projects: ['Matematika Diskrit Dasar', 'Logika Algoritma', 'Pengenalan Perangkat Keras']
  },
  { 
    phase: 'Fase 2', 
    meta: 'Eksplorasi', 
    title: 'Pengenalan Profesi', 
    desc: 'Mulai mencoba alat-alat dasar yang digunakan di industri ini.',
    projects: ['Tooling & Environment Setup', 'Basic Workflow', 'Etika Profesi']
  },
];

export const careerCatalog: CareerCatalogItem[] = [
  { 
    slug: 'software-engineer', 
    title: 'Software Engineer', 
    categoryId: 'tech', 
    description: 'Membangun aplikasi web, mobile, dan sistem pintar yang skalabel.', 
    type: 'skill_based',
    iconKey: 'code', 
    recommendationMajors: ['Teknik Informatika', 'Rekayasa Perangkat Lunak'], 
    certifications: ['AWS Cloud Practitioner', 'Google Associate Cloud Engineer'], 
    riasecCategories: ['I', 'R', 'C'], 
    mbtiTags: ['INTJ', 'ISTJ', 'ENTP'], 
    featured: true, 
    universityWorld: {
      overview: 'Jurusan Teknik Informatika atau Ilmu Komputer adalah gerbang utama menuju dunia rekayasa perangkat lunak. Di bangku kuliah, kamu tidak hanya belajar bahasa pemrograman, tetapi juga cara merancang algoritma yang efisien, memahami struktur data, arsitektur sistem, hingga keamanan siber. Fokus utamanya adalah melatih logika berpikir untuk menyelesaikan masalah kompleks.',
      requiredSkills: [
        'Kemampuan berpikir logis dan algoritmik',
        'Analisis pemecahan masalah (Problem Solving)',
        'Pemahaman matematika diskrit dan kalkulus',
        'Kemampuan belajar mandiri yang tinggi',
        'Ketelitian dalam mencari bug (Debugging)'
      ],
      whyChoose: [
        { title: 'Prospek Karir Luas', desc: 'Hampir semua industri saat ini membutuhkan digitalisasi, membuat talenta IT sangat dicari dengan gaji kompetitif.' },
        { title: 'Inovasi Tanpa Batas', desc: 'Kamu punya kebebasan penuh untuk menciptakan solusi baru, dari aplikasi mobile hingga teknologi AI canggih.' },
        { title: 'Kerja Fleksibel', desc: 'Banyak perusahaan teknologi menawarkan fleksibilitas kerja, seperti remote working dari mana saja.' }
      ]
    },
    roadmap: [
      { 
        phase: 'Fase 1', 
        meta: '3 Proyek', 
        title: 'Logika & Computational Thinking', 
        desc: 'Membiasakan diri dengan pola pikir algoritma dan logika komputer sejak dini.',
        projects: ['Algoritma Flowchart Dasar', 'Scratch Logic Games', 'Matematika Biner']
      },
      { 
        phase: 'Fase 2', 
        meta: '10 Materi', 
        title: 'Dasar Pemrograman Web', 
        desc: 'Deep dive ke dalam teknologi inti internet: struktur, gaya, dan logika.',
        projects: [
          'HTML5 Semantic Structure', 
          'CSS Flexbox & Grid Mastery', 
          'JavaScript DOM Manipulation', 
          'Responsive Design Principles',
          'Git & Version Control Dasar'
        ]
      },
      { 
        phase: 'Fase 3', 
        meta: '5 Proyek', 
        title: 'Frontend & Frameworks', 
        desc: 'Membangun aplikasi web interaktif menggunakan standar industri modern.',
        projects: [
          'React Component Architecture',
          'State Management with Redux/Zustand',
          'Connecting to REST APIs',
          'Form Validation & User Flow'
        ]
      },
      { 
        phase: 'Fase 4', 
        meta: '7 Materi', 
        title: 'Backend & Databases', 
        desc: 'Mengelola data, server, dan logika di balik layar aplikasi.',
        projects: [
          'Node.js & Express Basics',
          'Relational Database (SQL)',
          'NoSQL (MongoDB/Firebase)',
          'Auth & Security (JWT)'
        ]
      },
      { 
        phase: 'Fase 5', 
        meta: '4 Proyek', 
        title: 'DevOps & Deployment', 
        desc: 'Mastering cloud services dan otomatisasi pengiriman kode.',
        projects: [
          'Docker Containerization',
          'CI/CD Pipelines (GitHub Actions)',
          'AWS/Vercel Deployment',
          'Monitoring & Error Logging'
        ]
      },
    ],
    marketInfo: {
      salaryIndo: 'Rp 8.000.000 - Rp 35.000.000',
      salaryUSA: '$85,000 - $160,000',
      responsibilities: [
        'Merancang dan memelihara sistem perangkat lunak yang skalabel.',
        'Menulis kode yang bersih, efisien, dan mudah dipelihara.',
        'Berkolaborasi dengan tim produk untuk menentukan fitur baru.',
        'Melakukan debugging dan optimasi performa aplikasi.'
      ]
    },
    faqs: [
      { q: 'Apakah harus jago matematika?', a: 'Tidak harus jenius, tapi logika dasar dan pemahaman algoritma sangat penting.' },
      { q: 'Bahasa pemrograman apa yang harus dipelajari pertama?', a: 'JavaScript atau Python adalah pilihan terbaik untuk pemula saat ini.' },
      { q: 'Berapa lama untuk jadi Junior SE?', a: 'Dengan belajar intensif, biasanya butuh waktu 6-12 bulan untuk siap kerja.' }
    ],
    topUniversities: {
      local: ['ITB (Bandung)', 'UI (Depok)', 'ITS (Surabaya)', 'UGM (Yogyakarta)', 'Binus University'],
      global: ['MIT (USA)', 'Stanford University (USA)', 'Carnegie Mellon (USA)', 'Oxford (UK)', 'ETH Zurich (CH)']
    }
  },
  { 
    slug: 'ai-engineer', 
    title: 'AI Engineer', 
    categoryId: 'tech', 
    description: 'Menerapkan model AI ke produk nyata dan alur otomatisasi cerdas.', 
    type: 'skill_based',
    iconKey: 'brain', 
    recommendationMajors: ['Data Science', 'Ilmu Komputer', 'Matematika'], 
    certifications: ['TensorFlow Developer', 'Google ML Crash Course'], 
    riasecCategories: ['I', 'C', 'R'], 
    mbtiTags: ['INTP', 'INFJ', 'ENTJ'], 
    roadmap: [
      { 
        phase: 'Fase 1', 
        meta: '4 Materi', 
        title: 'Matematika untuk AI', 
        desc: 'Mengasah kemampuan analisa angka yang menjadi jantung kecerdasan buatan.',
        projects: ['Aljabar Linear Dasar', 'Kalkulus Lanjutan', 'Statistik & Probabilitas']
      },
      { 
        phase: 'Fase 2', 
        meta: '8 Proyek', 
        title: 'Data Science Foundation', 
        desc: 'Mulai mengolah data mentah menjadi informasi yang berharga.',
        projects: ['Python for Data Science', 'Data Cleaning with Pandas', 'Visualization with Seaborn']
      },
      { 
        phase: 'Fase 3', 
        meta: '6 Proyek', 
        title: 'Machine Learning Mastery', 
        desc: 'Memahami algoritma yang memungkinkan mesin untuk belajar.',
        projects: ['Supervised Learning Models', 'Unsupervised Clustering', 'Model Evaluation Metrics']
      },
      { 
        phase: 'Fase 4', 
        meta: '5 Proyek', 
        title: 'AI on Cloud', 
        desc: 'Mengintegrasikan layanan AI ke dalam aplikasi cloud berskala besar.',
        projects: ['Amazon Lex Chatbots', 'Lambda for AI Processing', 'AI Audio Transcription']
      },
    ],
    marketInfo: {
      salaryIndo: 'Rp 12.000.000 - Rp 50.000.000',
      salaryUSA: '$110,000 - $220,000',
      responsibilities: [
        'Mengembangkan dan melatih model Machine Learning.',
        'Melakukan pemrosesan data skala besar (Data Engineering).',
        'Mengoptimalkan algoritma AI untuk efisiensi komputasi.',
        'Menerapkan solusi AI ke dalam sistem produksi.'
      ]
    },
    faqs: [
      { q: 'Apa bedanya dengan Data Scientist?', a: 'AI Engineer lebih fokus pada implementasi dan deployment model ke sistem produksi, sedangkan Data Scientist lebih fokus pada analisis data.' },
      { q: 'Apakah butuh hardware mahal?', a: 'Untuk belajar dasar tidak, tapi untuk training model besar biasanya butuh GPU atau layanan cloud.' }
    ],
    topUniversities: {
      local: ['ITB (Bandung)', 'UI (Depok)', 'ITS (Surabaya)', 'Binus University', 'Telkom University'],
      global: ['Stanford (USA)', 'UC Berkeley (USA)', 'Tsinghua (China)', 'Toronto (Canada)', 'Oxford (UK)']
    }
  },
  { 
    slug: 'uiux-designer', 
    title: 'UI/UX Designer', 
    categoryId: 'art', 
    description: 'Merancang antarmuka pengguna yang indah dan fungsional.', 
    type: 'skill_based',
    iconKey: 'pen', 
    recommendationMajors: ['Desain Komunikasi Visual', 'Sistem Informasi'], 
    certifications: ['Figma Advanced', 'UX Research Basics'], 
    riasecCategories: ['A', 'S', 'I'], 
    mbtiTags: ['INFJ', 'INFP', 'ISFP'], 
    roadmap: DEFAULT_ROADMAP,
    marketInfo: {
      salaryIndo: 'Rp 7.000.000 - Rp 25.000.000',
      salaryUSA: '$75,000 - $145,000',
      responsibilities: ['User Research', 'Wireframing', 'Visual Design', 'Prototyping']
    },
    topUniversities: {
      local: ['ITB (SR)', 'IKJ (Jakarta)', 'ISI (Yogyakarta)', 'Telkom University', 'Binus (DKV)'],
      global: ['RISD (USA)', 'Royal College of Art (UK)', 'Parsons (USA)', 'Pratt Institute (USA)', 'Politecnico di Milano (Italy)']
    },
    faqs: []
  },
  { 
    slug: 'psychologist', 
    title: 'Psikolog / Konselor', 
    categoryId: 'health', 
    description: 'Membantu orang memahami emosi, perilaku, dan kesehatan mental.', 
    type: 'education_based',
    iconKey: 'users', 
    recommendationMajors: ['Psikologi', 'Bimbingan Konseling'], 
    certifications: ['Konseling Dasar', 'Asesmen Psikologis'], 
    riasecCategories: ['S', 'A', 'I'], 
    mbtiTags: ['INFJ', 'ENFJ', 'ISFJ'], 
    roadmap: DEFAULT_ROADMAP,
    marketInfo: {
      salaryIndo: 'Rp 6.000.000 - Rp 20.000.000',
      salaryUSA: '$70,000 - $130,000',
      responsibilities: ['Clinical Assessment', 'Counseling', 'Therapy Planning']
    },
    topUniversities: {
      local: ['UI (Jakarta)', 'UGM (Yogyakarta)', 'Airlangga (Surabaya)', 'Padjadjaran (Bandung)', 'Universitas Sanata Dharma'],
      global: ['Stanford (USA)', 'Harvard (USA)', 'Oxford (UK)', 'UCL (UK)', 'Yale (USA)']
    },
    faqs: []
  },
  { 
    slug: 'product-manager', 
    title: 'Product Manager', 
    categoryId: 'business', 
    description: 'Memimpin visi produk dan strategi pengembangan.', 
    type: 'skill_based',
    iconKey: 'briefcase', 
    recommendationMajors: ['Manajemen', 'Bisnis Digital'], 
    certifications: ['Product Management Basics', 'Agile Scrum'], 
    riasecCategories: ['E', 'I', 'C'], 
    mbtiTags: ['ENTJ', 'ENFJ', 'ESTJ'], 
    featured: true, 
    roadmap: DEFAULT_ROADMAP,
    marketInfo: {
      salaryIndo: 'Rp 10.000.000 - Rp 45.000.000',
      salaryUSA: '$100,000 - $190,000',
      responsibilities: ['Roadmap Planning', 'User Feedback Analysis', 'Team Coordination']
    },
    topUniversities: {
      local: ['Prasetya Mulya', 'UI (FE)', 'ITB (SBM)', 'UGM (FEB)', 'Binus Business School'],
      global: ['Harvard (USA)', 'INSEAD (France)', 'Wharton (USA)', 'London Business School (UK)', 'Stanford (USA)']
    },
    faqs: []
  },
  { 
    slug: 'teacher', 
    title: 'Guru Inovatif', 
    categoryId: 'education', 
    description: 'Merancang pembelajaran yang relevan dan menarik.', 
    type: 'education_based',
    iconKey: 'graduation', 
    recommendationMajors: ['Pendidikan', 'Teknologi Pendidikan'], 
    certifications: ['Microteaching', 'Digital Learning'], 
    riasecCategories: ['S', 'C', 'A'], 
    mbtiTags: ['ENFJ', 'ISFJ', 'INFJ'], 
    roadmap: DEFAULT_ROADMAP,
    marketInfo: {
      salaryIndo: 'Rp 4.000.000 - Rp 15.000.000',
      salaryUSA: '$50,000 - $90,000',
      responsibilities: ['Curriculum Design', 'Instructional Leadership', 'Educational Technology Integration']
    },
    topUniversities: {
      local: ['UPI (Bandung)', 'UNY (Yogyakarta)', 'UM (Malang)', 'UNNES (Semarang)', 'UNJ (Jakarta)'],
      global: ['Stanford (USA)', 'Harvard (USA)', 'Oxford (UK)', 'HKU (Hong Kong)', 'UCL (UK)']
    },
    faqs: []
  },
  { 
    slug: 'civil-service', 
    title: 'Aparatur Layanan Publik', 
    categoryId: 'service', 
    description: 'Memberikan layanan administratif dan kebijakan untuk masyarakat.', 
    type: 'education_based',
    iconKey: 'building', 
    recommendationMajors: ['Administrasi Publik', 'Hukum'], 
    certifications: ['Administrasi Digital', 'Pelayanan Publik'], 
    riasecCategories: ['C', 'S', 'E'], 
    mbtiTags: ['ISTJ', 'ESTJ', 'ISFJ'], 
    featured: true, 
    roadmap: DEFAULT_ROADMAP,
    marketInfo: {
      salaryIndo: 'Rp 5.000.000 - Rp 25.000.000',
      salaryUSA: '$55,000 - $110,000',
      responsibilities: ['Public Service Delivery', 'Policy Implementation', 'Administrative Support']
    },
    topUniversities: {
      local: ['IPDN (Sumedang)', 'UI (Jakarta)', 'UGM (Yogyakarta)', 'STIA LAN', 'Universitas Brawijaya'],
      global: ['Harvard Kennedy School (USA)', 'Oxford Blavatnik School (UK)', 'LSE (UK)', 'Lee Kuan Yew School (Singapore)', 'Sciences Po (France)']
    },
    faqs: []
  },
  {
    slug: 'general-practitioner',
    title: 'Dokter Umum',
    categoryId: 'health',
    description: 'Mendiagnosis dan mengobati penyakit serta menjaga kesehatan umum pasien.',
    type: 'education_based',
    iconKey: 'heart',
    recommendationMajors: ['Kedokteran Umum'],
    certifications: ['STR (Surat Tanda Registrasi)', 'ACL S (Advanced Cardiac Life Support)'],
    riasecCategories: ['I', 'S', 'A'],
    mbtiTags: ['ISFJ', 'ESTJ', 'INFJ'],
    featured: true,
    universityWorld: {
      overview: 'Pendidikan Dokter merupakan salah satu jurusan paling prestisius. Saat berkuliah, kamu akan mempelajari anatomi tubuh manusia secara mendetail, biologi seluler, farmakologi, hingga cara mendiagnosis dan menangani penyakit. Kamu akan melalui masa pra-klinik (teori) dan klinik (praktik/koas) yang membutuhkan ketahanan mental dan dedikasi yang sangat tinggi.',
      requiredSkills: [
        'Kemampuan observasi dan ketelitian tingkat tinggi',
        'Empati dan keterampilan komunikasi dengan pasien',
        'Berpikir kritis dan terstruktur dalam diagnosis',
        'Daya hafal yang sangat kuat dan penalaran logis',
        'Manajemen stres dan ketahanan fisik'
      ],
      whyChoose: [
        { title: 'Prospek Karir Terjamin', desc: 'Lulusan Pendidikan Dokter hampir selalu dapat pekerjaan karena kebutuhan tenaga medis di Indonesia masih sangat tinggi, baik di kota maupun daerah terpencil.' },
        { title: 'Jalur Pengabdian Mulia', desc: 'Profesi ini memberikan kesempatan untuk menyelamatkan nyawa dan menyembuhkan penyakit, memberikan kepuasan batin yang mendalam.' },
        { title: 'Peluang Akademis/Penelitian', desc: 'Bagi kamu yang suka meneliti, bisa menjadi dosen atau peneliti biomedis untuk mencari obat-obatan atau terapi baru.' }
      ]
    },
    roadmap: [
      {
        phase: 'Tahun 1-4',
        meta: 'S.Ked',
        title: 'Masa Pra-Klinik',
        desc: 'Kuliah teori dengan sistem blok. Mempelajari anatomi, fisiologi, biokimia, dan dasar medis lainnya.',
        projects: ['Anatomi Dasar', 'Histologi', 'Ujian OSCA']
      },
      {
        phase: 'Tahun 5-6',
        meta: 'Koas',
        title: 'Masa Klinik (Internship RS)',
        desc: 'Praktik langsung di rumah sakit. Rotasi di berbagai stase seperti Penyakit Dalam, Bedah, dan Anak.',
        projects: ['Rotasi Stase Bedah', 'Rotasi Stase Anak', 'Ujian UKMPPD']
      },
      {
        phase: 'Tahun 7',
        meta: 'Internship',
        title: 'Program Internsip',
        desc: 'Pengabdian dan pemandirian dokter di fasilitas kesehatan (Puskesmas/RS) selama 1 tahun.',
        projects: ['Pelayanan Puskesmas', 'IGD Experience']
      }
    ],
    marketInfo: {
      salaryIndo: 'Rp 10.000.000 - Rp 40.000.000',
      salaryUSA: '$180,000 - $250,000',
      responsibilities: ['Konsultasi Medis', 'Diagnosis Penyakit', 'Tindakan Medis Dasar', 'Edukasi Kesehatan']
    },
    topUniversities: {
      local: ['UI (Jakarta)', 'UGM (Yogyakarta)', 'Airlangga (Surabaya)', 'Padjadjaran (Bandung)', 'Hasanuddin (Makassar)'],
      global: ['Harvard Medical School (USA)', 'Oxford Medical (UK)', 'Johns Hopkins (USA)', 'Stanford Medicine (USA)', 'University of Toronto (Canada)']
    },
    faqs: [
      { q: 'Berapa lama total sekolah dokter?', a: 'Rata-rata butuh 6-7 tahun sampai benar-benar bisa praktik mandiri sebagai dokter umum.' },
      { q: 'Apakah biayanya mahal?', a: 'Bisa bervariasi, namun saat ini banyak skema beasiswa dan bantuan biaya pendidikan untuk kedokteran.' }
    ]
  },
  {
    slug: 'digital-artist',
    title: 'Digital Artist / Pelukis',
    categoryId: 'art',
    description: 'Menciptakan karya visual digital untuk berbagai industri kreatif.',
    type: 'skill_based',
    iconKey: 'palette',
    recommendationMajors: ['Seni Rupa', 'Desain Komunikasi Visual'],
    certifications: ['Adobe Certified Professional', 'Portfolio Review'],
    riasecCategories: ['A', 'R', 'I'],
    mbtiTags: ['INFP', 'ISFP', 'ENFP'],
    roadmap: [
      {
        phase: 'Langkah 1',
        meta: 'Skill Dasar',
        title: 'Fundamental Seni',
        desc: 'Menguasai anatomi, perspektif, dan komposisi warna.',
        projects: ['Sketching Harian', 'Color Theory Practice', 'Anatomy Study']
      },
      {
        phase: 'Langkah 2',
        meta: 'Portofolio',
        title: 'Eksplorasi Gaya Visual',
        desc: 'Menemukan karakter visual yang unik dan membangun portofolio awal.',
        projects: ['Digital Painting Basics', 'Style Development', 'Portfolio Website']
      }
    ],
    marketInfo: {
      salaryIndo: 'Rp 5.000.000 - Rp 20.000.000',
      salaryUSA: '$45,000 - $90,000',
      responsibilities: ['Konsep Visual', 'Ilustrasi', 'Digital Painting', 'Client Collaboration']
    },
    topUniversities: {
      local: ['ISI Yogyakarta', 'ISI Denpasar', 'IKJ Jakarta', 'ITB (Seni Rupa)', 'ISI Padangpanjang'],
      global: ['RISD (USA)', 'Arts University Bournemouth (UK)', 'CalArts (USA)', 'Emily Carr (Canada)', 'RCA (UK)']
    },
    faqs: []
  },
];

export const CAREER_CATEGORIES: { id: CareerCategory; label: string; iconKey: string }[] = [
  { id: 'tech', label: 'Teknologi', iconKey: 'monitor' },
  { id: 'health', label: 'Kesehatan', iconKey: 'heart' },
  { id: 'business', label: 'Bisnis', iconKey: 'briefcase' },
  { id: 'art', label: 'Seni & Desain', iconKey: 'palette' },
  { id: 'education', label: 'Pendidikan', iconKey: 'graduation' },
  { id: 'service', label: 'Layanan Publik', iconKey: 'building' },
];

export function getCareerBySlug(slug: string) {
  return careerCatalog.find((career) => career.slug === slug);
}
