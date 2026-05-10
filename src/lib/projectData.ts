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
  'logika-dasar': {
    id: 'logika-dasar',
    title: 'Logika Dasar & Algoritma',
    description: 'Pelajari pondasi utama pemrograman melalui algoritma dan logika berpikir sistematis.',
    difficulty: 'Easy Peasy',
    estimatedTime: '45 Min',
    refreshedDate: '9th May \'26',
    keyConcepts: ['Algorithm', 'Pseudocode', 'Flowchart', 'Logic Gate'],
    background: 'Logika adalah bahasa universal pemrograman. Sebelum menulis kode di bahasa apapun, Anda harus bisa merancang solusi dalam bentuk langkah-langkah logis. Tanpa logika yang kuat, kode Anda akan sulit dikelola dan penuh bug.',
    skillsLearned: [
      'Pemecahan Masalah (Problem Solving)',
      'Perancangan Algoritma',
      'Pembuatan Flowchart',
      'Boolean Logic & Decision Making'
    ],
    summary: 'Misi ini akan melatih otak Anda untuk berpikir seperti komputer. Anda akan belajar cara memecahkan masalah kompleks menjadi langkah-langkah sederhana yang bisa dipahami oleh mesin.',
    projects: [
      {
        title: 'Membangun Algoritma Robot Pembuat Kopi',
        description: 'Tantangan pertama Anda: Rancang algoritma presisi untuk robot yang harus membuat kopi sempurna berdasarkan preferensi user.',
        specifications: [
          'Gunakan Pseudocode untuk menulis langkah-langkahnya.',
          'Gunakan Flowchart untuk memvisualisasikan percabangan (jika gula habis, apa yang dilakukan?).',
          'Pastikan robot menangani kondisi error (air habis, gelas tidak ada).'
        ],
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'
      }
    ],
    resources: [
      { type: 'youtube', title: 'Belajar Logika Dasar Pemrograman', link: 'https://youtube.com/...', priceInfo: 'Gratis' },
      { type: 'web', title: 'Introduction to Algorithms', link: 'https://khanacademy.org/...', priceInfo: 'Gratis' }
    ]
  },
  'image-classification-dengan-neural-networks': {
    id: 'image-classification-dengan-neural-networks',
    title: 'Image Classification dengan Neural Networks',
    description: 'Bangun model AI yang bisa mengenali objek dalam gambar menggunakan arsitektur Jaringan Saraf Tiruan.',
    difficulty: 'Hard',
    estimatedTime: '60 Min',
    refreshedDate: '10th May \'26',
    keyConcepts: ['Computer Vision', 'CNN', 'TensorFlow', 'Deep Learning'],
    background: 'Klasifikasi gambar adalah fondasi dari teknologi masa depan seperti mobil otonom dan diagnosa medis otomatis. Memahami cara kerja neuron dalam memproses piksel gambar adalah langkah awal menjadi AI Engineer.',
    skillsLearned: [
      'Preprocessing Data Gambar',
      'Membangun Arsitektur CNN',
      'Training & Evaluasi Model',
      'Inference Model AI'
    ],
    summary: 'Dalam misi ini, kamu akan berperan sebagai Machine Learning Engineer untuk membangun sistem pengenalan gambar. Kamu akan belajar bagaimana komputer "melihat" dan mengkategorikan visual.',
    projects: [
      {
        title: 'Klasifikasi Gambar Digit Tangan (MNIST)',
        description: 'Buatlah model neural network sederhana yang mampu mengenali angka tulisan tangan dengan akurasi di atas 95%.',
        specifications: [
          'Gunakan library TensorFlow atau PyTorch.',
          'Lakukan normalisasi data gambar (scaling pixel 0-1).',
          'Tambahkan minimal 2 Hidden Layer.',
          'Visualisasikan hasil prediksi model terhadap data testing.'
        ],
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'
      }
    ],
    resources: [
      { type: 'youtube', title: 'Deep Learning Crash Course', link: 'https://youtube.com/...', priceInfo: 'Gratis' },
      { type: 'web', title: 'TensorFlow Image Classification Tutorial', link: 'https://tensorflow.org/...', priceInfo: 'Gratis' }
    ]
  },
  'smart-chatbot-openai-api': {
    id: 'smart-chatbot-openai-api',
    title: 'Membangun Smart Chatbot dengan OpenAI API',
    description: 'Proyek pengantar untuk membangun chatbot interaktif yang mampu menjaga konteks percakapan menggunakan Chat Completions API, lengkap dengan sistem persona dan manajemen token.',
    difficulty: 'Moderate',
    estimatedTime: '90 Min',
    refreshedDate: '10th May \'26',
    keyConcepts: ['Chat Completions API', 'Prompt Engineering', 'Token Management', 'System Prompts', 'Conversation Memory'],
    background: 'Di era LLM, kemampuan membangun chatbot bukan sekadar "membungkus API". Kamu harus memahami bagaimana cara menulis system prompt yang efektif, mengelola konteks percakapan agar tidak melebihi context window, dan mengoptimasi penggunaan token agar biaya tetap terkendali. Proyek ini merupakan batu loncatan pertama untuk menjadi AI Engineer profesional.',
    skillsLearned: [
      'Menggunakan OpenAI Chat Completions API',
      'Menulis System Prompt & User Prompt yang efektif',
      'Mengelola conversation history & context length',
      'Token counting & pricing optimization',
      'Error handling untuk API calls'
    ],
    summary: 'Kamu akan membangun chatbot pintar yang bisa berperan sebagai asisten apapun (tutor, konsultan, customer service) dengan kepribadian yang konsisten. Chatbot ini mampu mengingat konteks percakapan dan memberikan respons yang relevan.',
    costNote: {
      question: 'Apakah perlu bayar untuk menggunakan OpenAI API?',
      answer: 'OpenAI memberikan kredit gratis $5-$18 untuk akun baru. Untuk proyek ini, biayanya sangat minim (kurang dari $0.50) karena kita menggunakan model gpt-3.5-turbo yang sangat murah. Alternatif gratis: gunakan Ollama untuk menjalankan model lokal.'
    },
    projects: [
      {
        title: 'AI Persona Chatbot',
        description: 'Bangun chatbot dengan 3 persona berbeda (Guru Sejarah, Koki, dan Dokter) yang bisa dipilih user. Setiap persona memiliki gaya bahasa dan pengetahuan unik.',
        specifications: [
          'Setup project Node.js/Python dengan OpenAI SDK dan environment variables untuk API key.',
          'Buat 3 system prompt berbeda yang mendefinisikan kepribadian, batasan pengetahuan, dan gaya bahasa setiap persona.',
          'Implementasikan conversation memory yang menyimpan riwayat pesan (messages array) agar chatbot bisa merujuk ke percakapan sebelumnya.',
          'Tambahkan token counter yang menampilkan jumlah token terpakai per percakapan dan estimasi biayanya.',
          'Implementasikan sliding window: jika percakapan melebihi 3000 token, otomatis hapus pesan terlama untuk menjaga context length.',
          'Buat fitur "reset conversation" yang membersihkan history tapi tetap mempertahankan system prompt persona.'
        ],
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'
      }
    ],
    resources: [
      { type: 'youtube', title: 'Andrej Karpathy - Intro to Large Language Models', link: 'https://www.youtube.com/watch?v=zjkBMFhNj_g', priceInfo: 'Gratis' },
      { type: 'youtube', title: 'Fireship - Build an AI App in 10 Minutes', link: 'https://www.youtube.com/watch?v=mkHDGSjq9og', priceInfo: 'Gratis' },
      { type: 'youtube', title: 'Dave Ebbelaar - OpenAI API Full Course', link: 'https://www.youtube.com/watch?v=CbpsDqhz3r0', priceInfo: 'Gratis' },
      { type: 'web', title: 'OpenAI API Documentation - Chat Completions', link: 'https://platform.openai.com/docs/guides/text-generation', priceInfo: 'Gratis' },
      { type: 'course', title: 'DeepLearning.AI - ChatGPT Prompt Engineering for Developers', link: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/', priceInfo: 'Gratis' },
      { type: 'web', title: 'OpenAI Tokenizer Tool', link: 'https://platform.openai.com/tokenizer', priceInfo: 'Gratis' }
    ]
  },
  'semantic-search-ollama-chromadb': {
    id: 'semantic-search-ollama-chromadb',
    title: 'Sistem Pencarian Semantik Lokal dengan Ollama & ChromaDB',
    description: 'Bangun sistem pencarian dokumen yang memahami makna (bukan sekadar kata kunci) menggunakan model LLM lokal Ollama dan vector database ChromaDB — 100% offline tanpa biaya API.',
    difficulty: 'Moderate',
    estimatedTime: '120 Min',
    refreshedDate: '10th May \'26',
    keyConcepts: ['Ollama', 'Embeddings', 'Vector Database', 'ChromaDB', 'Semantic Search', 'Similarity Search', 'Open Source LLM'],
    background: 'Pencarian tradisional (keyword-based) gagal memahami konteks. Misalnya, jika kamu mencari "cara mengatasi stres kerja", pencarian biasa tidak akan menemukan dokumen berjudul "teknik relaksasi untuk karyawan". Semantic search menggunakan embeddings (representasi vektor dari makna) sehingga bisa menemukan dokumen berdasarkan kesamaan konsep, bukan kata. Ini adalah fondasi utama dari arsitektur RAG.',
    skillsLearned: [
      'Menginstal dan mengonfigurasi Ollama untuk LLM lokal',
      'Menggunakan Hugging Face model secara offline',
      'Membuat text embeddings dari dokumen',
      'Menyimpan & mengindeks vektor ke ChromaDB',
      'Melakukan similarity search & semantic query',
      'Memahami perbedaan embedding model vs generative model'
    ],
    summary: 'Kamu akan membangun mesin pencari pribadi yang bisa "memahami" koleksi dokumenmu. Upload catatan kuliah, artikel, atau PDF — lalu tanya dalam bahasa alami dan sistem akan menemukan jawaban paling relevan, bahkan jika kata-katanya berbeda.',
    projects: [
      {
        title: 'Personal Knowledge Base Search Engine',
        description: 'Bangun search engine semantik untuk koleksi catatan pribadi yang bisa dicari menggunakan bahasa alami, berjalan 100% di laptop tanpa internet.',
        specifications: [
          'Instal Ollama dan unduh minimal 2 model: satu untuk embedding (nomic-embed-text) dan satu untuk generasi teks (llama3 atau mistral).',
          'Siapkan dataset berupa 20+ file teks/markdown (bisa catatan kuliah, artikel blog, atau resume buku).',
          'Buat pipeline preprocessing: baca file → pecah menjadi chunks (300-500 kata per chunk) → bersihkan format.',
          'Generate embeddings untuk setiap chunk menggunakan Ollama embedding model dan simpan ke ChromaDB beserta metadata (nama file, halaman).',
          'Implementasikan fitur query semantik: user mengetik pertanyaan → sistem mengembalikan Top 5 chunk paling relevan beserta skor similarity.',
          'Tambahkan fitur jawaban otomatis: kirim chunks relevan + pertanyaan user ke model generatif Ollama untuk menghasilkan jawaban rangkuman.'
        ],
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800'
      }
    ],
    resources: [
      { type: 'youtube', title: 'Matt Williams - Ollama Course: Complete Beginner Guide', link: 'https://www.youtube.com/watch?v=9KEUFe4KQAI', priceInfo: 'Gratis' },
      { type: 'youtube', title: 'Krish Naik - Vector Databases Explained', link: 'https://www.youtube.com/watch?v=klTvEwg3oJ4', priceInfo: 'Gratis' },
      { type: 'youtube', title: 'Sam Witteveen - ChromaDB Tutorial', link: 'https://www.youtube.com/watch?v=QSW2L8dkaZk', priceInfo: 'Gratis' },
      { type: 'web', title: 'Ollama Official Documentation', link: 'https://ollama.ai/', priceInfo: 'Gratis' },
      { type: 'web', title: 'ChromaDB Getting Started Guide', link: 'https://docs.trychroma.com/getting-started', priceInfo: 'Gratis' },
      { type: 'course', title: 'Hugging Face NLP Course - Embeddings Chapter', link: 'https://huggingface.co/learn/nlp-course', priceInfo: 'Gratis' }
    ]
  },
  'enterprise-rag-system-langchain': {
    id: 'enterprise-rag-system-langchain',
    title: 'Enterprise RAG System menggunakan LangChain',
    description: 'Bangun sistem Retrieval-Augmented Generation (RAG) berskala produksi yang bisa menjawab pertanyaan berdasarkan dokumen perusahaan (PDF, knowledge base) dengan akurasi tinggi menggunakan framework LangChain.',
    difficulty: 'Hard',
    estimatedTime: '180 Min',
    refreshedDate: '10th May \'26',
    keyConcepts: ['RAG Architecture', 'LangChain', 'Document Chunking', 'Retrieval Process', 'Context Injection', 'Prompt Templates', 'Chain of Thought'],
    background: 'LLM standar memiliki keterbatasan: ia hanya tahu informasi dari data pelatihannya. Ketika perusahaan ingin AI yang bisa menjawab pertanyaan tentang dokumen internal (SOP, kontrak, panduan produk), LLM biasa akan berhalusinasi. RAG memecahkan masalah ini dengan cara: (1) memecah dokumen jadi chunks, (2) mencari chunks paling relevan dengan pertanyaan user, (3) menyuntikkan chunks tersebut ke prompt LLM sebagai konteks. Hasilnya: jawaban akurat berbasis fakta.',
    skillsLearned: [
      'Arsitektur RAG end-to-end (Indexing → Retrieval → Generation)',
      'Document loading & preprocessing (PDF, CSV, TXT)',
      'Strategi chunking optimal (recursive, semantic)',
      'LangChain chains, prompts, dan retriever',
      'Evaluasi kualitas jawaban RAG',
      'Penanganan hallucination dan grounding'
    ],
    summary: 'Kamu akan berperan sebagai AI Architect yang membangun sistem "tanya-jawab cerdas" untuk sebuah perusahaan fiktif. Sistem ini membaca ratusan halaman dokumen internal dan mampu menjawab pertanyaan karyawan secara akurat — lengkap dengan referensi sumber dokumennya.',
    projects: [
      {
        title: 'Company Knowledge Assistant',
        description: 'Bangun asisten AI yang bisa menjawab pertanyaan karyawan berdasarkan 50+ halaman dokumen perusahaan (PDF), dengan kemampuan menunjukkan sumber referensi dan confidence score.',
        specifications: [
          'Setup LangChain project dengan Python. Instal dependensi: langchain, langchain-openai, chromadb, pypdf.',
          'Buat document loader yang bisa membaca minimal 3 file PDF (simulasi SOP perusahaan, handbook karyawan, dan FAQ produk).',
          'Implementasikan RecursiveCharacterTextSplitter dengan chunk_size=1000 dan chunk_overlap=200 untuk memecah dokumen.',
          'Buat embedding pipeline: chunks → OpenAI Embeddings (atau Ollama) → simpan ke ChromaDB dengan metadata (nama dokumen, halaman).',
          'Bangun retrieval chain menggunakan LangChain RetrievalQA: user bertanya → retrieve Top 3 chunks → inject ke prompt → generate jawaban.',
          'Tambahkan source attribution: setiap jawaban harus menyertakan nama dokumen dan nomor halaman sumbernya.',
          'Implementasikan prompt template yang menginstruksikan LLM untuk HANYA menjawab berdasarkan konteks yang diberikan (anti-hallucination).',
          'Buat evaluasi sederhana: siapkan 10 pertanyaan test dan ukur akurasi jawaban sistem.'
        ],
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
      }
    ],
    resources: [
      { type: 'youtube', title: 'Rabbit Hole Syndrome - RAG from Scratch (LangChain)', link: 'https://www.youtube.com/watch?v=sVcwVQRHIc8', priceInfo: 'Gratis' },
      { type: 'youtube', title: 'Krish Naik - Complete RAG Pipeline Tutorial', link: 'https://www.youtube.com/watch?v=tcqEUSNCn8I', priceInfo: 'Gratis' },
      { type: 'youtube', title: 'freeCodeCamp - LangChain Full Course', link: 'https://www.youtube.com/watch?v=lG7Uxts9SXs', priceInfo: 'Gratis' },
      { type: 'web', title: 'LangChain RAG Tutorial (Official Docs)', link: 'https://python.langchain.com/docs/tutorials/rag/', priceInfo: 'Gratis' },
      { type: 'course', title: 'DeepLearning.AI - LangChain for LLM Application Development', link: 'https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/', priceInfo: 'Gratis' },
      { type: 'web', title: 'Pinecone Learning Center - RAG Guide', link: 'https://www.pinecone.io/learn/retrieval-augmented-generation/', priceInfo: 'Gratis' }
    ]
  },
  'multi-agent-research-assistant': {
    id: 'multi-agent-research-assistant',
    title: 'Multi-Agent Research Assistant dengan ReAct & Multimodal AI',
    description: 'Rancang agen AI otonom yang mampu meriset topik secara mandiri, menganalisis gambar, mencari informasi di web, dan merangkum temuannya — menggunakan teknik ReAct Prompting dan kapabilitas Multimodal AI.',
    difficulty: 'Extreme',
    estimatedTime: '240 Min',
    refreshedDate: '10th May \'26',
    keyConcepts: ['AI Agents', 'ReAct Prompting', 'Function Calling', 'Tool Use', 'OpenAI Vision API', 'Whisper API', 'DALL-E API', 'Autonomous Systems'],
    background: 'AI Agent adalah tahap evolusi tertinggi dari aplikasi AI saat ini. Berbeda dengan chatbot biasa yang hanya merespons, Agent bisa "berpikir" (Reasoning) dan "bertindak" (Acting) secara otonom. Ia bisa memutuskan kapan harus mencari di Google, kapan harus menganalisis gambar, dan kapan harus menulis laporan — semuanya tanpa instruksi manual. Ini adalah masa depan AI Engineering dan skill yang paling dicari oleh perusahaan teknologi terkemuka.',
    skillsLearned: [
      'Memahami arsitektur AI Agent (Observe → Think → Act)',
      'Mengimplementasikan ReAct Prompting pattern',
      'Menggunakan OpenAI Function Calling / Tool Use',
      'Integrasi Vision API untuk analisis gambar',
      'Integrasi Whisper API untuk speech-to-text',
      'Mendesain tool/function kustom untuk agent',
      'Menangani loop agent dan exit conditions',
      'Keamanan agent: input/output constraints'
    ],
    summary: 'Kamu akan membangun AI Agent canggih yang bisa kamu perintahkan: "Riset tentang tren AI di Indonesia 2026, analisis infografik ini, dan buat laporannya." Agent akan secara otonom memutuskan langkah-langkah yang diperlukan, menggunakan berbagai tools, dan menghasilkan laporan terstruktur.',
    projects: [
      {
        title: 'Autonomous Research Agent',
        description: 'Bangun agent AI yang bisa: (1) menerima topik riset, (2) mencari informasi menggunakan tools, (3) menganalisis gambar/chart yang diberikan, (4) merangkum semua temuan menjadi laporan terstruktur.',
        specifications: [
          'Setup project dengan OpenAI SDK. Definisikan minimal 4 custom tools/functions: web_search, analyze_image, read_document, dan write_report.',
          'Implementasikan ReAct loop: Agent menerima task → Observasi (apa yang diketahui?) → Thinking (tool mana yang perlu digunakan?) → Action (eksekusi tool) → ulangi sampai task selesai.',
          'Buat function web_search yang mensimulasikan pencarian web (bisa menggunakan API gratis seperti SerpAPI atau mock data).',
          'Integrasikan OpenAI Vision API ke function analyze_image: agent bisa menerima URL gambar/chart dan mendeskripsikan isinya secara detail.',
          'Integrasikan Whisper API ke function optional transcribe_audio: agent bisa mengonversi audio menjadi teks untuk dianalisis.',
          'Implementasikan safety guardrails: batasi maksimal 10 iterasi per task, validasi input user, dan filter output yang berpotensi berbahaya.',
          'Buat output terstruktur: setiap hasil riset agent harus berformat markdown dengan heading, bullet points, dan referensi sumber.',
          'Tambahkan logging yang menampilkan "pemikiran" agent di setiap langkah (Thought → Action → Observation) agar proses reasoning-nya transparan.'
        ],
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800'
      }
    ],
    resources: [
      { type: 'youtube', title: 'AI Jason - What are AI Agents? (Explained Simply)', link: 'https://www.youtube.com/watch?v=F8NKVhkZZWI', priceInfo: 'Gratis' },
      { type: 'youtube', title: 'Andrej Karpathy - State of GPT (Agent Architecture)', link: 'https://www.youtube.com/watch?v=bZQun8Y4L2A', priceInfo: 'Gratis' },
      { type: 'youtube', title: 'Tech With Tim - Building AI Agents with OpenAI Functions', link: 'https://www.youtube.com/watch?v=aqdWSYWC_LI', priceInfo: 'Gratis' },
      { type: 'web', title: 'OpenAI Function Calling Documentation', link: 'https://platform.openai.com/docs/guides/function-calling', priceInfo: 'Gratis' },
      { type: 'web', title: 'ReAct Paper (Original Research)', link: 'https://arxiv.org/abs/2210.03629', priceInfo: 'Gratis' },
      { type: 'course', title: 'DeepLearning.AI - Building Agentic RAG with LlamaIndex', link: 'https://www.deeplearning.ai/short-courses/building-agentic-rag-with-llamaindex/', priceInfo: 'Gratis' },
      { type: 'web', title: 'OpenAI Vision API Guide', link: 'https://platform.openai.com/docs/guides/vision', priceInfo: 'Gratis' }
    ]
  }
};

export function getProjectById(id: string): ProjectDetailData | undefined {
  return projectData[id];
}
