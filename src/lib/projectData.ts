export interface ProjectDetailData {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy Peasy' | 'Moderate' | 'Hard' | 'Extreme';
  estimatedTime: string;
  refreshedDate: string;
  keyConcepts: string[];
  background: string;
  skillsLearned: string[];
  summary: string;
  costNote?: {
    question: string;
    answer: string;
  }; // Catatan opsional terkait biaya
  projects: {
    title: string;
    description: string;
    specifications: string[];
    image?: string;
  }[];
  resources: {
    type: 'youtube' | 'course' | 'web' | 'book';
    title: string;
    link: string;
    priceInfo: 'Gratis' | string;
  }[];
}

export const projectData: Record<string, ProjectDetailData> = {
  'setup-aws-account': {
    id: 'setup-aws-account',
    title: 'Set Up An AWS Account',
    description: 'Setup akun AWS Anda agar siap untuk membangun proyek cloud kelas industri.',
    difficulty: 'Easy Peasy',
    estimatedTime: '10 Min',
    refreshedDate: '19th Feb \'26',
    keyConcepts: ['Cloud Computing', 'IAM', 'MFA', 'Billing Alarms'],
    background: 'Banyak pemula takut mencoba AWS karena isu "billing shock" atau tagihan yang membengkak tiba-tiba. Selain itu, keamanan akun sering diabaikan, padahal satu kebocoran akses bisa berakibat fatal secara finansial dan data.',
    skillsLearned: [
      'Manajemen Identitas & Akses (IAM)',
      'Konfigurasi Keamanan Root Account',
      'Monitoring Biaya & Budgets',
      'Pemahaman Cloud Governance Dasar'
    ],
    summary: 'Setiap proyek cloud dimulai dengan satu langkah krusial: mengamankan akun. Di sini kamu akan belajar cara setup akun AWS yang "anti-tagihan membengkak" dan memiliki keamanan tingkat tinggi menggunakan standar MFA.',
    costNote: {
      question: 'Do I need to pay to do this project?',
      answer: 'No! AWS offers a Free Tier that includes 30+ Always Free services. You will need a credit or debit card during sign-up, but AWS only places a temporary $1 authorization hold that is not a charge.'
    },
    projects: [
      {
        title: 'Cloud Foundation Mastery',
        description: 'Membangun pondasi utama untuk portofolio Cloud Engineer kamu dengan mengamankan akun AWS menggunakan standar industri.',
        specifications: [
          'Mengaktifkan Multi-Factor Authentication (MFA) pada Root User untuk proteksi maksimal.',
          'Membuat Billing Alarm menggunakan AWS Budgets atau CloudWatch untuk notifikasi jika penggunaan melebihi $0.01.',
          'Melakukan audit awal pada layanan Free Tier untuk memahami batasan EC2, S3, dan RDS.'
        ],
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
      }
    ],
    resources: [
      { type: 'youtube', title: 'AWS Cloud Practitioner Essentials', link: 'https://youtube.com/...', priceInfo: 'Gratis' },
      { type: 'course', title: 'AWS Certified Solutions Architect', link: 'https://udemy.com/...', priceInfo: 'Rp 149.000 (Promo)' },
      { type: 'web', title: 'Panduan Free Tier AWS Resmi', link: 'https://aws.amazon.com/free', priceInfo: 'Gratis' }
    ]
  },
  // ... data lainnya
};

export function getProjectById(id: string): ProjectDetailData | undefined {
  return projectData[id];
}
