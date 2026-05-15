import fs from 'fs';
import path from 'path';

const careersFile = path.resolve('./backend/data/careers.json');
const projectsFile = path.resolve('./backend/data/projects.json');

const newCareers = [
  {
    "slug": "devops-engineer",
    "title": "DevOps Engineer",
    "categoryId": "tech",
    "description": "Menjembatani pengembangan perangkat lunak (Dev) dan operasi IT (Ops). Membangun infrastruktur yang kuat, mengotomatisasi deployment, dan memastikan sistem tidak pernah mati. Profesi krusial bagi perusahaan teknologi skala besar.",
    "keyIkon": "server",
    "recommendationMajors": ["Teknik Informatika", "Sistem Informasi", "Teknik Komputer"],
    "sertifikasi": ["AWS Certified DevOps Engineer", "Certified Kubernetes Administrator (CKA)", "HashiCorp Certified: Terraform Associate"],
    "riasecCategories": ["I", "R", "C"],
    "mbtiTags": ["INTJ", "ISTJ", "INTP"],
    "universityWorld": {
      "overview": "Kamu akan mempelajari sistem operasi tingkat lanjut, jaringan komputer, dan keamanan sistem. Ini bukan sekadar ngoding, tapi memahami bagaimana kode tersebut dijalankan di atas server fisik maupun cloud.",
      "requiredSkills": ["Linux Administration", "CI/CD (Jenkins/GitLab)", "Containerization (Docker/K8s)", "Infrastructure as Code", "Cloud Platforms (AWS/GCP/Azure)"],
      "whyChoose": [
        { "title": "Gaji Sangat Kompetitif", "desc": "Karena keahlian ini langka dan sangat dibutuhkan untuk menjaga kestabilan aplikasi." },
        { "title": "Bekerja di Belakang Layar", "desc": "Cocok bagi kamu yang suka memecahkan masalah arsitektur tanpa harus sering berinteraksi dengan user langsung." }
      ]
    },
    "roadmap": [
      { "fase": "Fase 1", "judul": "Linux & Networking Dasar", "meta": "2 Bulan", "deskripsi": "Menguasai command line Linux bash scripting, dan fundamental jaringan (TCP/IP, DNS, OSI Model).", "proyek": ["Setup Linux Server VM", "Bash Script Automation"] },
      { "fase": "Fase 2", "judul": "Cloud Computing & IaC", "meta": "3 Bulan", "deskripsi": "Memahami konsep Cloud (AWS/GCP) dan Infrastructure as Code menggunakan Terraform atau Ansible.", "proyek": ["Deploy Web Server di AWS EC2", "Provisioning dengan Terraform"] },
      { "fase": "Fase 3", "judul": "Containerization & Orchestration", "meta": "4 Bulan", "deskripsi": "Membungkus aplikasi menggunakan Docker dan mengelolanya dalam skala besar menggunakan Kubernetes.", "proyek": ["Dockerize Aplikasi Node.js", "Setup MiniKube Local Cluster"] },
      { "fase": "Fase 4", "judul": "CI/CD & Monitoring", "meta": "3 Bulan", "deskripsi": "Mengotomatisasi proses testing dan deployment, serta memantau kesehatan server menggunakan Prometheus & Grafana.", "proyek": ["Pipeline GitHub Actions", "Dashboard Monitoring Grafana"] }
    ],
    "infoGaji": { "rentangIDR": "Rp 15.000.000 - Rp 55.000.000 / bulan", "rentangUSD": "$90,000 - $180,000 / tahun", "penjelasan": "Semakin kompleks arsitektur yang bisa kamu kelola, semakin tinggi valuasimu di mata perusahaan." }
  },
  {
    "slug": "product-manager",
    "title": "Product Manager",
    "categoryId": "business",
    "description": "CEO dari sebuah produk. Bertanggung jawab atas strategi, visi, dan eksekusi produk dari ide hingga peluncuran. PM menghubungkan tim bisnis, desain, dan engineering untuk menciptakan produk yang dicintai pengguna.",
    "keyIkon": "briefcase",
    "recommendationMajors": ["Manajemen Bisnis", "Teknik Informatika", "Psikologi", "Sistem Informasi"],
    "sertifikasi": ["Certified Scrum Product Owner (CSPO)", "Pragmatic Institute Certification"],
    "riasecCategories": ["E", "S", "I"],
    "mbtiTags": ["ENTJ", "ENFJ", "ESTJ"],
    "universityWorld": {
      "overview": "Kamu akan belajar bagaimana menganalisis pasar, memahami psikologi konsumen, dan merencanakan strategi bisnis yang solid. Kemampuan komunikasi dan kepemimpinan akan sangat diuji.",
      "requiredSkills": ["Market Research", "Agile/Scrum", "Data Analysis", "Stakeholder Management", "UX Principles"],
      "whyChoose": [
        { "title": "Pengambil Keputusan", "desc": "Kamu yang menentukan arah dan fitur apa yang akan dibangun selanjutnya." },
        { "title": "Batu Loncatan menjadi Founder", "desc": "Banyak pendiri startup sukses memulai karirnya sebagai Product Manager." }
      ]
    },
    "roadmap": [
      { "fase": "Fase 1", "judul": "Pemahaman Bisnis & Pasar", "meta": "2 Bulan", "deskripsi": "Belajar melakukan riset kompetitor, wawancara pengguna, dan menentukan Product-Market Fit.", "proyek": ["Competitor Analysis Report", "User Persona Development"] },
      { "fase": "Fase 2", "judul": "Strategi Produk & Prioritas", "meta": "3 Bulan", "deskripsi": "Menggunakan framework seperti RICE atau MoSCoW untuk menentukan prioritas fitur.", "proyek": ["Membuat Product Roadmap", "Menulis PRD (Product Requirement Document)"] },
      { "fase": "Fase 3", "judul": "Agile Development & Eksekusi", "meta": "3 Bulan", "deskripsi": "Bekerja sama dengan developer dan desainer menggunakan metodologi Scrum atau Kanban.", "proyek": ["Simulasi Sprint Planning", "Backlog Grooming"] },
      { "fase": "Fase 4", "judul": "Data-Driven Decision", "meta": "2 Bulan", "deskripsi": "Menganalisis metrik produk (AARRR funnel, retention, churn rate) menggunakan tools analitik.", "proyek": ["Analisis Data Mixpanel/Google Analytics", "A/B Testing Strategy"] }
    ],
    "infoGaji": { "rentangIDR": "Rp 12.000.000 - Rp 60.000.000 / bulan", "rentangUSD": "$85,000 - $160,000 / tahun", "penjelasan": "Senior PM di perusahaan teknologi besar (Unicorn) dapat mencapai gaji di atas rata-rata manajemen standar." }
  },
  {
    "slug": "digital-marketing-specialist",
    "title": "Digital Marketing Specialist",
    "categoryId": "business",
    "description": "Arsitek di balik kampanye online yang sukses. Menggunakan data, kreativitas, dan psikologi untuk menargetkan audiens yang tepat dan memaksimalkan ROI (Return on Investment) perusahaan.",
    "keyIkon": "trending-up",
    "recommendationMajors": ["Ilmu Komunikasi", "Pemasaran (Marketing)", "Bisnis Digital"],
    "sertifikasi": ["Google Ads Certification", "HubSpot Content Marketing", "Meta Certified Digital Marketing Associate"],
    "riasecCategories": ["E", "C", "A"],
    "mbtiTags": ["ENFP", "ENTP", "ESFJ"],
    "universityWorld": {
      "overview": "Mempelajari perilaku konsumen di era digital, strategi komunikasi massa, dan analisis data pemasaran. Kamu dituntut kreatif namun tetap berpegang pada data nyata (data-driven).",
      "requiredSkills": ["SEO/SEM", "Content Strategy", "Data Analytics", "Performance Marketing (Ads)", "Copywriting"],
      "whyChoose": [
        { "title": "Karir Dinamis", "desc": "Algoritma dan tren selalu berubah, pekerjaanmu tidak akan pernah membosankan." },
        { "title": "Bisa Freelance / Remote", "desc": "Keahlian ini sangat fleksibel dan memungkinkanmu bekerja dari mana saja untuk klien global." }
      ]
    },
    "roadmap": [
      { "fase": "Fase 1", "judul": "Fundamental Marketing & Copywriting", "meta": "2 Bulan", "deskripsi": "Memahami psikologi pembeli, customer journey, dan teknik menulis iklan yang menjual.", "proyek": ["Membuat Copywriting Social Media", "Customer Journey Mapping"] },
      { "fase": "Fase 2", "judul": "SEO & Content Marketing", "meta": "3 Bulan", "deskripsi": "Strategi optimasi mesin pencari organik dan merencanakan kalender konten.", "proyek": ["Audit SEO Website", "Keyword Research & Content Plan"] },
      { "fase": "Fase 3", "judul": "Performance Marketing (Ads)", "meta": "3 Bulan", "deskripsi": "Mengelola budget untuk iklan berbayar di Google Ads, Meta Ads, dan TikTok Ads.", "proyek": ["Setup Campaign Meta Ads", "A/B Testing Ad Creatives"] },
      { "fase": "Fase 4", "judul": "Analytics & Reporting", "meta": "2 Bulan", "deskripsi": "Membaca data dari Google Analytics dan menghitung RoAS (Return on Ad Spend).", "proyek": ["Membuat Looker Studio Dashboard", "Campaign Performance Report"] }
    ],
    "infoGaji": { "rentangIDR": "Rp 6.000.000 - Rp 25.000.000 / bulan", "rentangUSD": "$50,000 - $100,000 / tahun", "penjelasan": "Kompensasi seringkali ditambah bonus berbasis kinerja jika target penjualan / leads tercapai." }
  }
];

const newProjects = [
  {
    "id": "devops-cicd-pipeline",
    "title": "Automated CI/CD Pipeline Deployment",
    "introduction": "Bangun sistem otomatisasi untuk menguji dan merilis kode ke server produksi tanpa campur tangan manusia secara manual.",
    "background": "Tim developer sering mengalami konflik kode dan downtime saat merilis fitur baru karena masih dilakukan secara manual via FTP.",
    "skills": ["Git Actions", "Docker", "Linux Server", "Bash Scripting"],
    "brief": "Tugasmu adalah membuat script CI/CD menggunakan GitHub Actions yang otomatis melakukan build Docker image dan deploy ke server VPS saat ada push ke branch 'main'.",
    "category": "Tech / DevOps",
    "image": "/images/cat-tech.webp",
    "featured": true,
    "briefSections": [
      { "number": 1, "title": "Containerization dengan Docker", "content": "Docker memungkinkan aplikasimu berjalan dengan lingkungan yang sama persis antara laptop developer dan server produksi. Buat `Dockerfile` yang ringan berbasis Alpine Linux.", "imageUrl": "/images/cat-tech.webp" },
      { "number": 2, "title": "GitHub Actions YAML", "content": "File `.github/workflows/deploy.yml` adalah jantung dari otomasi ini. Kamu harus mendefinisikan *trigger* dan *jobs* yang akan dieksekusi secara berurutan.", "imageUrl": "/images/cat-tech.webp" },
      { "number": 3, "title": "Secure SSH Deployment", "content": "Jangan pernah menyimpan password server di dalam kode. Gunakan GitHub Secrets untuk menyimpan SSH Key yang akan digunakan runner untuk login ke server dan memanipulasi container.", "imageUrl": "/images/cat-tech.webp" }
    ],
    "interactiveSteps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Optimasi Dockerfile",
        "description": "Kamu diberikan Dockerfile untuk aplikasi Node.js. Namun, ukurannya mencapai 1GB. Bagaimana cara menguranginya?",
        "question": "Metode apa yang paling efektif untuk mengurangi ukuran final image Docker?",
        "choices": [
          { "id": "c1", "label": "Multi-stage Builds", "guidance": "Sangat Tepat! Dengan memisahkan proses build dan environment production, kamu membuang dependensi yang tidak diperlukan di server.", "nextStepId": "step-2" },
          { "id": "c2", "label": "Menghapus komentar di dalam kode Node.js", "guidance": "Komentar teks hanya berukuran beberapa Kilobyte, tidak akan signifikan mengurangi ukuran 1GB." }
        ]
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Mengatasi Downtime Saat Deploy",
        "description": "Pipeline kamu berhasil jalan, tapi setiap kali deploy, server mati selama 10 detik saat mengganti container lama dengan yang baru.",
        "question": "Strategi deployment apa yang bisa mencegah downtime ini (Zero-Downtime)?",
        "choices": [
          { "id": "c1", "label": "Blue-Green Deployment", "guidance": "Sempurna! Kamu menjalankan versi baru (Green) secara paralel dengan versi lama (Blue), lalu mengarahkan traffic melalui Load Balancer seketika.", "nextStepId": "complete" },
          { "id": "c2", "label": "Menjalankan script deploy di jam 3 pagi", "guidance": "Ini bukan best practice DevOps, ini hanya menghindari masalah, bukan menyelesaikannya secara teknis." }
        ]
      }
    ]
  },
  {
    "id": "pm-prd-creation",
    "title": "Market Research & PRD (Product Requirement Document)",
    "introduction": "Berperan sebagai Product Manager untuk merancang fitur 'Group Booking' pada aplikasi travel.",
    "background": "Data analitik menunjukkan banyak pengguna aplikasi travel kita yang mencoba memesan untuk rombongan lebih dari 10 orang, namun sistem saat ini membatasi maksimal 5 orang per transaksi.",
    "skills": ["Product Strategy", "User Research", "Wireframing", "Documentation"],
    "brief": "Lakukan riset kompetitor, tentukan user story, dan tulis Product Requirement Document (PRD) yang akan diserahkan ke tim engineering.",
    "category": "Business / Product",
    "image": "/images/cat-business.webp",
    "featured": true,
    "briefSections": [
      { "number": 1, "title": "Riset Kompetitor", "content": "Analisis bagaimana Traveloka atau Tiket.com menangani pemesanan rombongan besar. Apa pain points yang belum mereka selesaikan?", "imageUrl": "/images/cat-business.webp" },
      { "number": 2, "title": "User Persona & Stories", "content": "Bentuk profil 'Budi, Sang Koordinator Tour'. Buat format User Story: 'Sebagai [Persona], saya ingin [Tujuan], sehingga [Alasan/Benefit]'.", "imageUrl": "/images/cat-business.webp" },
      { "number": 3, "title": "Menyusun PRD", "content": "PRD harus mencakup: Visi Fitur, Target Metrik (Success Metrics), Scope Pekerjaan (MVP), Out of Scope, dan Mockup Kasar (Wireframe).", "imageUrl": "/images/cat-business.webp" }
    ],
    "interactiveSteps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Menentukan Success Metrics",
        "description": "Sebagai PM, kamu harus mendefinisikan apa yang disebut 'sukses' untuk fitur Group Booking ini.",
        "question": "Metrik utama apa yang paling merepresentasikan kesuksesan fitur baru ini?",
        "choices": [
          { "id": "c1", "label": "Peningkatan jumlah transaksi dengan >5 penumpang sebesar 20% di bulan pertama", "guidance": "Tepat! Metrik ini SMART (Specific, Measurable, Actionable, Relevant, Time-bound).", "nextStepId": "step-2" },
          { "id": "c2", "label": "Jumlah likes di postingan Instagram peluncuran fitur", "guidance": "Ini adalah vanity metrics (metrik pamer) yang tidak berdampak langsung pada pendapatan bisnis." }
        ]
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Prioritas MVP (Minimum Viable Product)",
        "description": "Tim developer mengatakan fitur 'Pembayaran Patungan' akan memakan waktu 3 bulan. Jika dimasukkan, peluncuran fitur akan tertunda.",
        "question": "Apa keputusanmu sebagai Product Manager?",
        "choices": [
          { "id": "c1", "label": "Tunda fitur 'Patungan' untuk Fase 2, luncurkan booking rombongan dengan pembayaran tunggal dulu (MVP).", "guidance": "Keputusan yang solid! Prinsip Agile adalah merilis cepat untuk mendapatkan feedback pasar.", "nextStepId": "complete" },
          { "id": "c2", "label": "Tunda peluncuran 3 bulan, fitur harus sempurna sejak hari pertama.", "guidance": "Berisiko tinggi. Bagaimana jika setelah 3 bulan ternyata user tidak menyukainya? Kamu membuang waktu dan biaya besar." }
        ]
      }
    ]
  }
];

function seed() {
  try {
    let careers = [];
    if (fs.existsSync(careersFile)) {
      careers = JSON.parse(fs.readFileSync(careersFile, 'utf-8'));
    }
    
    // Merge careers, preventing duplicates by slug
    const existingCareerSlugs = new Set(careers.map(c => c.slug));
    const toAddCareers = newCareers.filter(c => !existingCareerSlugs.has(c.slug));
    careers = [...careers, ...toAddCareers];
    
    fs.writeFileSync(careersFile, JSON.stringify(careers, null, 2));
    console.log(`Successfully injected ${toAddCareers.length} new detailed careers.`);

    let projects = [];
    if (fs.existsSync(projectsFile)) {
      projects = JSON.parse(fs.readFileSync(projectsFile, 'utf-8'));
    }
    
    // Merge projects, preventing duplicates by id
    const existingProjectIds = new Set(projects.map(p => p.id));
    const toAddProjects = newProjects.filter(p => !existingProjectIds.has(p.id));
    projects = [...projects, ...toAddProjects];
    
    fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
    console.log(`Successfully injected ${toAddProjects.length} new detailed projects.`);

  } catch (error) {
    console.error("Error during data injection:", error);
  }
}

seed();
