export type CareerCategory = 'tech' | 'health' | 'business' | 'art' | 'education' | 'service';

export interface CareerRoadmapStep {
  phase: string;    // e.g., "Fase 1"
  meta: string;     // e.g., "5 Proyek" atau "3 Bulan"
  title: string;
  desc: string;
  projects: string[]; // Daftar materi/proyek spesifik
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
    iconKey: 'code', 
    recommendationMajors: ['Teknik Informatika', 'Rekayasa Perangkat Lunak'], 
    certifications: ['AWS Cloud Practitioner', 'Google Associate Cloud Engineer'], 
    riasecCategories: ['I', 'R', 'C'], 
    mbtiTags: ['INTJ', 'ISTJ', 'ENTP'], 
    featured: true, 
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
    ]
  },
  { 
    slug: 'ai-engineer', 
    title: 'AI Engineer', 
    categoryId: 'tech', 
    description: 'Menerapkan model AI ke produk nyata dan alur otomatisasi cerdas.', 
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
    ]
  },
  { 
    slug: 'uiux-designer', 
    title: 'UI/UX Designer', 
    categoryId: 'art', 
    description: 'Merancang antarmuka pengguna yang indah dan fungsional.', 
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
    faqs: []
  },
  { 
    slug: 'psychologist', 
    title: 'Psikolog / Konselor', 
    categoryId: 'health', 
    description: 'Membantu orang memahami emosi, perilaku, dan kesehatan mental.', 
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
    faqs: []
  },
  { 
    slug: 'product-manager', 
    title: 'Product Manager', 
    categoryId: 'business', 
    description: 'Memimpin visi produk dan strategi pengembangan.', 
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
    faqs: []
  },
  { 
    slug: 'teacher', 
    title: 'Guru Inovatif', 
    categoryId: 'education', 
    description: 'Merancang pembelajaran yang relevan dan menarik.', 
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
    faqs: []
  },
  { 
    slug: 'civil-service', 
    title: 'Aparatur Layanan Publik', 
    categoryId: 'service', 
    description: 'Memberikan layanan administratif dan kebijakan untuk masyarakat.', 
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
