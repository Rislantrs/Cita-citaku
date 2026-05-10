export type KategoriKarir = 'tech' | 'health' | 'business' | 'art' | 'education' | 'service';

export interface LangkahRoadmap {
  fase: string;      // e.g., "Fase 1"
  meta: string;      // e.g., "5 Proyek" atau "3 Bulan"
  judul: string;
  deskripsi: string;
  proyek: string[];  // Daftar materi/proyek spesifik
  deskripsiPanjang?: string;
  buku?: { judul: string; penulis: string; link: string }[];
}

export interface InfoGaji {
  rentangIDR: string;
  rentangUSD: string;
  penjelasan: string;
}

export interface InfoPendidikan {
  jurusan: string[];
  durasi: string;
  jalurAkademik: string;
  gelar: string;
}

export interface MateriBelajar {
  judul: string;
  tipe: 'video' | 'artikel' | 'website';
  link: string;
}

export interface ReferensiDigital {
  judul: string;
  tipe: 'youtube' | 'website';
  link: string;
}

export interface FAQKarir {
  tanya: string;
  jawab: string;
}

export interface DuniaPerkuliahan {
  ringkasan: string;
  keahlianWajib: string[];
  alasanMemilih: { judul: string; deskripsi: string }[];
}

export interface ItemKatalogKarir {
  slug: string;
  judul: string;
  idKategori: KategoriKarir;
  deskripsi: string;
  keyIkon: string;
  rekomendasiJurusan: string[];
  sertifikasi: string[];
  kategoriRIASEC: string[];
  tagMBTI: string[];
  roadmap: LangkahRoadmap[];
  unggulan?: boolean;
  infoGaji: InfoGaji;
  infoPendidikan: InfoPendidikan;
  materiBelajar: MateriBelajar[];
  daftarBuku: { judul: string; penulis: string; link: string }[];
  referensiDigital: ReferensiDigital[];
  proyekTerkait: string[]; // ID/Slug proyek dari koleksi 'projects'
  faqs: FAQKarir[];
  tipe: 'skill_based' | 'education_based';
  universitasTerbaik: {
    lokal: string[];
    global: string[];
  };
  duniaPerkuliahan?: DuniaPerkuliahan;
}

export const careerCatalog: ItemKatalogKarir[] = [
  {
    slug: 'software-engineer',
    judul: 'Software Engineer',
    idKategori: 'tech',
    deskripsi: 'Membangun aplikasi web, mobile, dan sistem pintar yang skalabel.',
    tipe: 'skill_based',
    keyIkon: 'code',
    rekomendasiJurusan: ['Teknik Informatika', 'Rekayasa Perangkat Lunak'],
    sertifikasi: ['AWS Cloud Practitioner', 'Google Associate Cloud Engineer'],
    kategoriRIASEC: ['I', 'R', 'C'],
    tagMBTI: ['INTJ', 'ISTJ', 'ENTP'],
    unggulan: true,
    infoGaji: {
      rentangIDR: 'Rp 8.000.000 - Rp 35.000.000',
      rentangUSD: '$85,000 - $160,000',
      penjelasan: 'Gaji Software Engineer sangat bergantung pada keahlian teknologi (stack) dan pengalaman kerja.'
    },
    infoPendidikan: {
      jurusan: ['Teknik Informatika', 'Ilmu Komputer'],
      durasi: '4 Tahun',
      jalurAkademik: 'Sarjana (S1)',
      gelar: 'S.Kom'
    },
    materiBelajar: [
      { judul: 'FreeCodeCamp Responsive Web Design', tipe: 'website', link: 'https://www.freecodecamp.org/' }
    ],
    daftarBuku: [
      { judul: 'Clean Code', penulis: 'Robert C. Martin', link: '#' }
    ],
    referensiDigital: [
      { judul: 'Web Programming UNPAS', tipe: 'youtube', link: '#' }
    ],
    proyekTerkait: ['1'],
    duniaPerkuliahan: {
      ringkasan: 'Jurusan Teknik Informatika atau Ilmu Komputer adalah gerbang utama menuju dunia rekayasa perangkat lunak.',
      keahlianWajib: ['Logika', 'Problem Solving'],
      alasanMemilih: [{ judul: 'Gaji Tinggi', deskripsi: 'Prospek kerja sangat luas.' }]
    },
    roadmap: [
      {
        fase: 'Fase 1',
        meta: 'Fundamental',
        judul: 'Pondasi Logika',
        deskripsi: 'Membangun cara berpikir sistematis.',
        proyek: ['Logika Dasar']
      },
    ],
    faqs: [{ tanya: 'Apa itu SE?', jawab: 'Software Engineer adalah...' }],
    universitasTerbaik: {
      lokal: ['ITB', 'UI'],
      global: ['MIT', 'Stanford']
    }
  },
];

export const CAREER_CATEGORIES: { id: KategoriKarir; label: string; keyIkon: string }[] = [
  { id: 'tech', label: 'Teknologi', keyIkon: 'monitor' },
  { id: 'health', label: 'Kesehatan', keyIkon: 'heart' },
  { id: 'business', label: 'Bisnis', keyIkon: 'briefcase' },
  { id: 'art', label: 'Seni & Desain', keyIkon: 'palette' },
  { id: 'education', label: 'Pendidikan', keyIkon: 'graduation' },
  { id: 'service', label: 'Layanan Publik', keyIkon: 'building' },
];

export function getCareerBySlug(slug: string) {
  return careerCatalog.find((career) => career.slug === slug);
}
