import type { Express } from 'express';
import { CareerModel, ProjectModel, QuizResultModel, SubmissionModel, UserModel, UserProjectModel, ensureCareerSeeded, isMongoReady, memoryStore } from './mongo';
import multer from 'multer';
import * as pdfLib from 'pdf-parse';
import { callAI } from './ai_service';
import { optionalAuth, requireAuth, requireAdmin, type AuthenticatedRequest } from './auth';
import sharp from 'sharp';

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

function toPlain(value: unknown) {
  if (value && typeof value === 'object' && 'toObject' in value && typeof (value as { toObject?: () => unknown }).toObject === 'function') {
    return (value as { toObject: () => unknown }).toObject();
  }

  return value;
}

function safeString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function safeStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean).slice(0, 50);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function normalizeProjectPayload(input: any) {
  const title = safeString(input?.title);
  const description = safeString(input?.description);
  const careerData = input?.careerData && typeof input.careerData === 'object' ? input.careerData : {};

  const normalizedTitle = safeString(careerData.title, title);
  const normalizedIntroduction = safeString(careerData.introduction, description || 'Project pembelajaran karier berbasis tantangan nyata.');
  const normalizedBrief = safeString(careerData.brief, description || normalizedIntroduction);
  const normalizedCategory = safeString(careerData.category, 'Umum');

  return {
    id: safeString(careerData.id, slugify(normalizedTitle || title || `project-${Date.now()}`)),
    title: normalizedTitle,
    introduction: normalizedIntroduction,
    background: safeString(careerData.background, normalizedBrief),
    skills: safeStringArray(careerData.skills),
    brief: normalizedBrief,
    steps: safeStringArray(careerData.steps),
    briefSections: Array.isArray(careerData.briefSections) ? careerData.briefSections.slice(0, 20) : [],
    interactiveSteps: Array.isArray(careerData.interactiveSteps) ? careerData.interactiveSteps.slice(0, 30) : [],
    image: safeString(careerData.image),
    category: normalizedCategory,
  };
}

function isAdminLike(role: unknown) {
  return role === 'admin' || role === 'moderator' || role === 'super_admin';
}

function cleanProjectForFrontend(project: any) {
  if (!project) return project;
  const category = safeString(project.category, 'Umum');
  let image = safeString(project.image);
  
  if (!image) {
    const catLower = category.toLowerCase();
    let slug = 'cat-tech';
    if (catLower.includes('business') || catLower.includes('management') || catLower.includes('marketing') || catLower.includes('data')) {
      slug = 'cat-business';
    } else if (catLower.includes('art') || catLower.includes('design') || catLower.includes('game') || catLower.includes('animation') || catLower.includes('creative')) {
      slug = 'cat-art';
    } else if (catLower.includes('health') || catLower.includes('med') || catLower.includes('dokter')) {
      slug = 'cat-health';
    } else if (catLower.includes('service') || catLower.includes('human') || catLower.includes('sosial')) {
      slug = 'cat-service';
    } else if (catLower.includes('edu') || catLower.includes('guru') || catLower.includes('ajar')) {
      slug = 'cat-education';
    }
    image = `/images/${slug}.webp`;
  }

  return {
    ...project,
    title: project.title || project.judul || 'Tanpa Judul',
    introduction: project.introduction || project.deskripsi || project.brief || '',
    category,
    image,
  };
}

export function registerApiRoutes(app: Express) {
  // RIASEC AI Analysis
  app.post('/api/ai/analyze-riasec', async (req, res) => {
    const { scores } = req.body;
    console.log(`[AI] Analyzing scores:`, scores);
    
    try {
      // 1. Ambil daftar karir asli dari database
      let careers = [];
      try {
        if (isMongoReady()) {
          careers = await CareerModel.find().select('title slug category description').lean() as any[];
        } else {
          const { memoryStore } = await import('./mongo');
          careers = memoryStore.careers || [];
        }
      } catch (dbErr) {
        console.warn("[api] DB fetch failed, using fallback catalog:", dbErr);
      }

      // Jika kosong, pakai fallback statis agar AI tetap punya data untuk dipilih
      if (!careers || careers.length === 0) {
        const { careerCatalog } = await import('../src/lib/careerCatalog');
        careers = careerCatalog;
      }

      const careerListStr = careers.map(c => `- ${c.title} (slug: ${c.slug}, kategori: ${c.category})`).join('\n');

      const prompt = `Analisis skor RIASEC ini secara profesional: ${JSON.stringify(scores)}.
      
      PILIH MAKSIMAL 4 KARIR dari daftar database ini:
      ${careerListStr}

      Instruksi Tambahan:
      1. Berikan interpretasi psikologis yang mendalam tentang perpaduan tipe RIASEC dominan User.
      2. Berikan output dalam format JSON:
      {
        "summary": "Analisis naratif mendalam (min 3 kalimat)",
        "strengths": ["kekuatan 1", "kekuatan 2"],
        "challenges": ["tantangan 1", "tantangan 2"],
        "recommendations": [
          { "slug": "slug-karir", "matchScore": 95, "reason": "Alasan singkat kenapa cocok" }
        ]
      }
      3. matchScore HARUS bervariasi (misal 92, 88, 85) sesuai tingkat kecocokan asli.
      4. Output HANYA JSON.`;
    
      const aiResult = await callAI('quiz', prompt);
      console.log(`[AI] Response generated successfully.`);
      
      const text = aiResult.text;
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');

      if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
        console.warn('[AI] No JSON in response, using graceful fallback.');
        return res.json({ summary: 'Analisis sedang diproses.', strengths: [], challenges: [], recommendations: [] });
      }

      const cleanJson = text.substring(firstBrace, lastBrace + 1).trim();
      const parsed = JSON.parse(cleanJson);

      // Normalize: support both 'recommendedSlugs' (old) and 'recommendations' (new) 
      if (parsed.recommendedSlugs && !parsed.recommendations) {
        parsed.recommendations = (parsed.recommendedSlugs as string[]).map((slug: string, i: number) => ({
          slug,
          matchScore: 95 - (i * 5),
          reason: 'Cocok berdasarkan profil RIASEC kamu'
        }));
        delete parsed.recommendedSlugs;
      }

      res.json(parsed);
    } catch (e) {
      console.error("[api] Analysis error, returning graceful fallback:", e);
      // Never 500 - always return something usable for the frontend
      res.json({ 
        summary: 'Analisis AI sedang tidak tersedia. Rekomendasi ditampilkan otomatis berdasarkan profil RIASEC kamu.',
        strengths: ['Kemampuan analitis yang kuat', 'Adaptif terhadap tantangan baru'],
        challenges: ['Perlu memperluas jaringan profesional', 'Manajemen waktu perlu ditingkatkan'],
        recommendations: []
      });
    }
  });

  app.post('/api/ai/generate-questions', upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Tidak ada file yang diunggah.' });
      }

      console.log(`[ai-gen] Received file: ${req.file.originalname} (${req.file.size} bytes)`);

      let textContent = '';
      if (req.file.mimetype === 'application/pdf') {
        console.log('[ai-gen] Parsing PDF content (Safer Import)...');
        const PDFParse = (pdfLib as any).PDFParse || (pdfLib as any).default?.PDFParse;
        if (!PDFParse) throw new Error('PDFParse class not found in library');
        
        const parser = new PDFParse({ data: req.file.buffer });
        const result = await parser.getText();
        textContent = result.text;
      } else {
        textContent = req.file.buffer.toString('utf-8');
      }

      console.log(`[ai-gen] Text length: ${textContent.length} characters`);
      if (textContent.trim().length < 50) {
        return res.status(400).json({ error: 'Teks dokumen terlalu pendek atau gagal diekstrak.' });
      }

      console.log('[ai-gen] Calling AI generator...');
      const aiResult = await callAI('generator', `TEKS DOKUMEN:\n${textContent}`);
      console.log('[ai-gen] AI Result received. Type:', typeof aiResult);
      
      console.log('[ai-gen] Parsing AI response...');
      if (!aiResult || !aiResult.text) {
        throw new Error('Respon AI kosong atau tidak valid');
      }

      // Robust JSON extraction: Find the first '[' and the last ']'
      const text = aiResult.text;
      const firstBracket = text.indexOf('[');
      const lastBracket = text.lastIndexOf(']');

      if (firstBracket === -1 || lastBracket === -1 || lastBracket < firstBracket) {
        console.error('[ai-gen] No JSON array found in response:', text);
        throw new Error('AI tidak mengembalikan format soal yang valid (JSON array tidak ditemukan)');
      }

      const cleanJson = text.substring(firstBracket, lastBracket + 1).trim();
      console.log('[ai-gen] Extracted JSON (first 50 chars):', cleanJson.substring(0, 50));
      
      const parsed = JSON.parse(cleanJson);
      console.log(`[ai-gen] Success! Parsed ${Array.isArray(parsed) ? parsed.length : 0} questions.`);
      
      res.json({ questions: parsed });
    } catch (e: any) {
      console.error("[ai-gen] FATAL ERROR:", e);
      res.status(500).json({ 
        error: 'Gagal membuat soal',
        message: e.message
      });
    }
  });

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, mongoReady: isMongoReady() });
  });

  // User Sync
  app.post('/api/users/sync', async (req, res) => {
    const { uid, name, email } = req.body ?? {};
    if (!uid) {
      res.status(400).json({ error: 'uid is required' });
      return;
    }

    const payload = { uid, name: name ?? '', email: email ?? '' };

    if (!isMongoReady()) {
      memoryStore.users.set(uid, payload);
      res.json({ ok: true, user: payload });
      return;
    }

    const user = await UserModel.findOneAndUpdate(
      { uid } as any,
      { $set: payload },
      { upsert: true, returnDocument: 'after' }
    );
    res.json({ ok: true, user: toPlain(user) });
  });

  // User Progress Tracker
  app.post('/api/users/:uid/progress/roadmap', async (req, res) => {
    const { uid } = req.params;
    const { careerSlug } = req.body;

    if (!isMongoReady()) {
      res.json({ ok: true, message: 'Running in memory mode' });
      return;
    }

    try {
      const updateData: any = {
        $inc: { 'progressTracker.roadmapVisited': 1 }
      };

      if (careerSlug) {
        updateData.$set = { 'progressTracker.lastCareerSlug': careerSlug };
      }

      const user = await (UserModel as any).findOneAndUpdate(
        { uid },
        updateData,
        { returnDocument: 'after', upsert: true }
      );

      res.json({ ok: true, progress: user?.progressTracker });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update progress' });
    }
  });

  // Projects
  app.get('/api/projects', async (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

    if (!isMongoReady()) {
      let items = memoryStore.projects as any[];

      if (category && category !== 'Semua') {
        items = items.filter((project) => project.category === category);
      }

      if (search) {
        const lowered = search.toLowerCase();
        items = items.filter((project) =>
          [project.title, project.introduction, project.category, ...(project.skills ?? [])]
            .join(' ')
            .toLowerCase()
            .includes(lowered),
        );
      }

      res.json({ items: items.map(cleanProjectForFrontend) });
      return;
    }

    const query: Record<string, unknown> = {};

    if (category && category !== 'Semua') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { introduction: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
      ];
    }

    try {
      const items = await (ProjectModel as any).find(query).sort({ featured: -1, createdAt: -1 }).lean();
      res.json({ items: items.map(cleanProjectForFrontend) });
    } catch (err) {
      console.error('[api] CRITICAL: Failed to fetch projects:', err);
      res.status(500).json({ 
        error: 'Gagal mengambil data proyek dari database.',
        details: err instanceof Error ? err.message : String(err)
      });
    }
  });

  app.get('/api/projects/:id', async (req, res) => {
    const { id } = req.params;

    try {
      if (!isMongoReady()) {
        const item = (memoryStore.projects as any[]).find((project) => project.id === id);
        if (!item) {
          res.status(404).json({ error: 'Project not found' });
          return;
        }

        res.json({ item: cleanProjectForFrontend(item) });
        return;
      }

      const item = await (ProjectModel as any).findOne({ id }).lean();

      if (!item) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      res.json({ item: cleanProjectForFrontend(item) });
    } catch (err) {
      console.error(`[api] Failed to fetch project ${id}:`, err);
      res.status(500).json({ error: 'Gagal mengambil detail proyek.' });
    }
  });

  // Submissions
  app.get('/api/submissions', async (req, res) => {
    if (!isMongoReady()) {
      res.json({ items: memoryStore.submissions });
      return;
    }

    const items = await (SubmissionModel as any).find().sort({ createdAt: -1 }).lean();
    res.json({ items });
  });

  app.post('/api/submissions', async (req, res) => {
    const { title, description, submittedBy } = req.body ?? {};
    const careerData = normalizeProjectPayload(req.body ?? {});

    if (!title || !description || !submittedBy?.uid) {
      res.status(400).json({ error: 'title, description, and submittedBy.uid are required' });
      return;
    }

    if (!careerData.title || !careerData.brief || !careerData.category) {
      res.status(400).json({ error: 'careerData.title, careerData.brief, and careerData.category are required' });
      return;
    }

    const payload = {
      title: safeString(title),
      description: safeString(description),
      careerData,
      submittedBy: {
        uid: submittedBy.uid,
        name: submittedBy.name ?? '',
        email: submittedBy.email ?? '',
      },
      status: 'pending' as const,
    };

    if (!isMongoReady()) {
      const submission = {
        id: `mem-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryStore.submissions.unshift(submission);
      res.status(201).json({ ok: true, submission });
      return;
    }

    const created = await (SubmissionModel as any).create(payload);
    res.status(201).json({ ok: true, submission: toPlain(created) });
  });

  app.patch('/api/submissions/:id/review', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const { status, notes } = req.body ?? {};
    const reviewedBy = req.user?.email || req.user?.uid || 'admin';

    if (!['approved', 'rejected'].includes(status)) {
      res.status(400).json({ error: 'status must be approved or rejected' });
      return;
    }

    if (!isMongoReady()) {
      const submissions = memoryStore.submissions as any[];
      const index = submissions.findIndex((submission) => submission.id === id);

      if (index === -1) {
        res.status(404).json({ error: 'Submission not found' });
        return;
      }

      const updated = {
        ...submissions[index],
        status,
        reviewedBy: safeString(reviewedBy),
        reviewedAt: new Date().toISOString(),
        aiReview: {
          ...(submissions[index].aiReview ?? {}),
          notes: safeString(notes),
        },
        updatedAt: new Date().toISOString(),
      };

      submissions[index] = updated;

      if (status === 'approved') {
        const project = {
          ...updated.careerData,
          sourceSubmissionId: updated.id,
          featured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const projects = memoryStore.projects as any[];
        const existingProjectIndex = projects.findIndex((item) => item.id === project.id);

        if (existingProjectIndex >= 0) {
          projects[existingProjectIndex] = project;
        } else {
          projects.unshift(project);
        }
      }

      res.json({ ok: true, submission: updated });
      return;
    }

    const updated = await (SubmissionModel as any).findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          reviewedBy: safeString(reviewedBy),
          reviewedAt: new Date(),
          'aiReview.notes': safeString(notes),
        },
      },
      { returnDocument: 'after' },
    ).lean();

    if (!updated) {
      res.status(404).json({ error: 'Submission not found' });
      return;
    }

    if (status === 'approved') {
      await (ProjectModel as any).findOneAndUpdate(
        { id: updated.careerData.id },
        {
          $set: {
            ...updated.careerData,
            sourceSubmissionId: String(updated._id),
            featured: false,
          },
        },
        { upsert: true, returnDocument: 'after' },
      );
    }

    res.json({ ok: true, submission: updated });
  });

  // Quiz Results
  app.post('/api/quiz/results', async (req, res) => {
    const { user, riasecScores, mbtiScores, topCodes, mbtiType, completedAt } = req.body ?? {};
    if (!user?.uid) {
      res.status(400).json({ error: 'user.uid is required' });
      return;
    }

    const payload = {
      userUid: user.uid,
      riasecScores: riasecScores ?? {},
      mbtiScores: mbtiScores ?? {},
      topCodes: topCodes ?? [],
      mbtiType: mbtiType ?? '',
      completedAt: completedAt ? new Date(completedAt) : new Date(),
    };

    if (!isMongoReady()) {
      memoryStore.quizResults.set(user.uid, payload);
      res.json({ ok: true, result: payload });
      return;
    }

    const result = await QuizResultModel.findOneAndUpdate(
      { userUid: user.uid } as any,
      { $set: payload },
      { upsert: true, returnDocument: 'after' }
    );
    res.json({ ok: true, result: toPlain(result) });
  });

  app.get('/api/quiz/results/:uid', async (req, res) => {
    const { uid } = req.params;

    if (!isMongoReady()) {
      const result = memoryStore.quizResults.get(uid);
      if (!result) {
        res.status(404).json({ error: 'Quiz result not found' });
        return;
      }
      res.json({ result });
      return;
    }

    const result = await QuizResultModel.findOne({ userUid: uid } as any).lean();
    if (!result) {
      res.status(404).json({ error: 'Quiz result not found' });
      return;
    }
    res.json({ result });
  });

  // Careers
  app.get('/api/careers', async (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;

    console.log(`[api] GET /api/careers - isMongoReady: ${isMongoReady()}`);
    if (!isMongoReady()) {
      console.log('[api] Mongo not ready, using memoryStore');
      let items = memoryStore.careers;
      if (category && category !== 'Semua' && category !== 'all') {
        items = items.filter(c => c.idKategori === category || (c as any).categoryId === category);
      }
      console.log(`[api] Returning ${items?.length || 0} items from memory`);
      res.json({ items: items || [] });
      return;
    }

    try {
      const query: any = {};
      if (category && category !== 'Semua' && category !== 'all') {
        query.categoryId = category;
      }

      const items = await CareerModel.find(query).sort({ featured: -1, title: 1 }).lean();
      res.json({ items: items || [] });
    } catch (err) {
      console.error('[api] CRITICAL: Failed to fetch careers:', err);
      res.status(500).json({ 
        error: 'Gagal mengambil data karir.',
        details: err instanceof Error ? err.message : String(err)
      });
    }
  });

  app.get('/api/careers/:slug', async (req, res) => {
    const { slug } = req.params;

    if (!isMongoReady()) {
      const item = memoryStore.careers.find((c) => c.slug === slug);
      if (!item) {
        res.status(404).json({ error: 'Career not found' });
        return;
      }
      res.json({ item });
      return;
    }

    const item = await CareerModel.findOne({ slug } as any).lean();
    if (!item) {
      res.status(404).json({ error: 'Career not found' });
      return;
    }
    res.json({ item });
  });

  app.delete('/api/careers/:slug', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    const { slug } = req.params;

    if (!isMongoReady()) {
      const index = memoryStore.careers.findIndex((c) => c.slug === slug);
      if (index === -1) {
        res.status(404).json({ error: 'Career not found in memory' });
        return;
      }
      memoryStore.careers.splice(index, 1);
      res.json({ success: true, message: 'Deleted from memory' });
      return;
    }

    try {
      const result = await CareerModel.findOneAndDelete({ slug } as any);
      if (!result) {
        res.status(404).json({ error: 'Career not found in Atlas' });
        return;
      }
      res.json({ success: true, message: 'Deleted from Atlas' });
    } catch (err) {
      console.error('[api] Delete failed:', err);
      res.status(500).json({ error: 'Gagal menghapus karir' });
    }
  });

  app.post('/api/careers', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const data = req.body;
      const slug = data.slug || data.judul?.toLowerCase()?.replace(/[^a-z0-9\s-]/g, '')?.replace(/\s+/g, '-') || data.title?.toLowerCase()?.replace(/[^a-z0-9\s-]/g, '')?.replace(/\s+/g, '-');

      if (!slug) {
        res.status(400).json({ error: 'Slug atau Judul wajib ada.' });
        return;
      }

      console.log(`[api] Saving career: ${slug}`, JSON.stringify(data).substring(0, 500) + '...');

      // === FULL FIELD NORMALIZATION ===
      const careerUpdate: any = {
        slug,
        title: data.judul || data.title || '',
        categoryId: data.idKategori || data.categoryId || 'tech',
        description: data.deskripsi || data.description || '',
        type: data.tipe || data.type || 'skill_based',
        keyIkon: data.keyIkon || 'code',
        recommendationMajors: data.recommendationMajors || data.rekomendasiJurusan || [],
        certifications: data.certifications || data.sertifikasi || [],
        riasecCategories: data.riasecCategories || data.kategoriRIASEC || [],
        mbtiTags: data.mbtiTags || data.tagMBTI || [],
        featured: data.featured || data.unggulan || false,

        // Gaji
        infoGaji: data.infoGaji || { 
          rentangIDR: data.salaryIndo || '', 
          rentangUSD: data.salaryUSA || '', 
          penjelasan: '' 
        },

        // Pendidikan
        infoPendidikan: {
          jurusan: data.infoPendidikan?.jurusan || data.recommendationMajors || [],
          durasi: data.infoPendidikan?.durasi || '',
          jalurAkademik: data.infoPendidikan?.jalurAkademik || '',
          gelar: data.infoPendidikan?.gelar || '',
        },

        // Materi Belajar
        materiBelajar: (data.materiBelajar || []).map((m: any) => ({
          judul: m.judul || m.title || '',
          tipe: m.tipe || m.type || 'video',
          link: m.link || '',
        })).filter((m: any) => m.judul || m.link),

        // Buku
        daftarBuku: (data.daftarBuku || []).map((b: any) => ({
          judul: b.judul || b.title || '',
          penulis: b.penulis || b.author || '',
          link: b.link || '',
        })).filter((b: any) => b.judul),

        // Referensi Digital
        referensiDigital: (data.referensiDigital || []).map((r: any) => ({
          judul: r.judul || r.title || '',
          tipe: r.tipe || r.type || 'website',
          link: r.link || '',
        })).filter((r: any) => r.judul || r.link),

        // FAQ
        faqs: (data.faqs || []).map((f: any) => ({
          tanya: f.tanya || f.q || '',
          jawab: f.jawab || f.a || '',
        })).filter((f: any) => f.tanya || f.jawab),

        // Universitas Terbaik
        universitasTerbaik: {
          lokal: data.universitasTerbaik?.lokal || data.universitasTerbaik?.local || data.topUniversities?.local || data.topUniversities?.lokal || [],
          local: data.universitasTerbaik?.lokal || data.universitasTerbaik?.local || data.topUniversities?.local || data.topUniversities?.lokal || [],
          global: data.universitasTerbaik?.global || data.topUniversities?.global || [],
        },

        // Dunia Perkuliahan
        duniaPerkuliahan: {
          ringkasan: data.duniaPerkuliahan?.ringkasan || data.universityWorld?.ringkasan || data.universityWorld?.overview || data.duniaPerkuliahan?.overview || '',
          keahlianWajib: data.duniaPerkuliahan?.keahlianWajib || data.universityWorld?.keahlianWajib || data.universityWorld?.requiredSkills || [],
          alasanMemilih: (data.duniaPerkuliahan?.alasanMemilih || data.universityWorld?.alasanMemilih || data.universityWorld?.whyChoose || []).map((a: any) => ({
            judul: a.judul || a.title || '',
            deskripsi: a.deskripsi || a.desc || '',
          })).filter((a: any) => a.judul || a.deskripsi),
        },

        // Roadmap
        roadmap: (data.roadmap || data.phases || []).map((phase: any, idx: number) => ({
          fase: phase.fase || `Fase ${idx + 1}`,
          judul: phase.judul || phase.title || '',
          deskripsi: phase.deskripsi || phase.description || '',
          meta: phase.meta || phase.stats || '',
          proyek: phase.proyek || (phase.topics || []).map((t: any) => t.title || t).filter(Boolean),
          topics: phase.topics || [],
        })),
      };

      // Save to MongoDB if ready
      if (isMongoReady()) {
        const career = await CareerModel.findOneAndUpdate(
          { slug } as any,
          careerUpdate,
          { upsert: true, returnDocument: 'after' }
        );
        res.json({ ok: true, item: career });
      } else {
        // Save to memoryStore
        const existingIdx = memoryStore.careers.findIndex((c: any) => c.slug === slug);
        if (existingIdx >= 0) {
          memoryStore.careers[existingIdx] = careerUpdate as any;
        } else {
          memoryStore.careers.push(careerUpdate as any);
        }
        res.json({ ok: true, item: careerUpdate });
      }
    } catch (err) {
      console.error('[api] Failed to save career:', err);
      res.status(500).json({ error: 'Gagal menyimpan data karir ke database.' });
    }
  });

  // ─── USER PROJECT PROGRESS (Item 8: Project Submission System) ─────────
  app.post('/api/user-projects', requireAuth, async (req: AuthenticatedRequest, res) => {
    const uid = req.user!.uid;
    const { projectId, completedSteps, stepChoices, stepProofs, driveLink, githubLink, status } = req.body;

    if (!projectId) {
      res.status(400).json({ error: 'projectId is required' });
      return;
    }

    const payload = {
      userId: uid,
      projectId,
      completedSteps: completedSteps || [],
      stepChoices: stepChoices || {},
      stepProofs: stepProofs || {},
      driveLink: driveLink || '',
      githubLink: githubLink || '',
      status: status || 'in_progress',
    };

    if (!isMongoReady()) {
      res.json({ ok: true, project: payload, message: 'Saved to memory (DB not available)' });
      return;
    }

    try {
      const result = await UserProjectModel.findOneAndUpdate(
        { userId: uid, projectId } as any,
        { $set: payload },
        { upsert: true, new: true }
      );
      res.json({ ok: true, project: toPlain(result) });
    } catch (err) {
      console.error('[api] Failed to save user project:', err);
      res.status(500).json({ error: 'Gagal menyimpan progres project' });
    }
  });

  app.get('/api/user-projects/:uid', async (req, res) => {
    const { uid } = req.params;
    if (!isMongoReady()) {
      res.json({ projects: [] });
      return;
    }
    try {
      const projects = await UserProjectModel.find({ userId: uid } as any).lean();
      res.json({ projects });
    } catch (err) {
      res.json({ projects: [] });
    }
  });

  // ─── USER SUMMARY (Item 9: Dynamic Dashboard) ─────────────────────────
  app.get('/api/users/:uid/summary', async (req, res) => {
    const { uid } = req.params;

    try {
      let user = null;
      let quizResult = null;
      let userProjects: any[] = [];

      if (isMongoReady()) {
        user = await UserModel.findOne({ uid } as any).lean();
        quizResult = await QuizResultModel.findOne({ userUid: uid } as any).lean();
        userProjects = await UserProjectModel.find({ userId: uid } as any).lean();
      }

      res.json({
        user: user || null,
        quizResult: quizResult || null,
        userProjects: userProjects || [],
      });
    } catch (err) {
      console.error('[api] Failed to fetch user summary:', err);
      res.json({ user: null, quizResult: null, userProjects: [] });
    }
  });

  // Global Error Handler Middleware
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error('[server-error] UNHANDLED EXCEPTION:', err);
    res.status(500).json({ 
      error: 'Terjadi kesalahan pada server',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  });
}

import express from 'express';
import path from 'path';
import fs from 'fs';

export function configureStaticFiles(app: Express) {
  const uploadsPath = path.join(process.cwd(), 'backend', 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsPath));
}

// Add this to registerApiRoutes at the top after multer config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), 'backend', 'uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const uploadDisk = multer({ storage });

export function registerUploadRoute(app: Express) {
  app.post('/api/upload', uploadDisk.single('file'), async (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const originalPath = req.file.path;
    const isImage = /\.(jpe?g|png|gif|bmp|tiff?|webp)$/i.test(req.file.originalname);

    if (isImage) {
      try {
        const webpFilename = req.file.filename.replace(/\.[^.]+$/, '') + '.webp';
        const webpPath = path.join(path.dirname(originalPath), webpFilename);

        await sharp(originalPath)
          .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(webpPath);

        // Remove original file after conversion
        try { fs.unlinkSync(originalPath); } catch {}

        console.log(`[upload] Compressed & converted to WebP: ${webpFilename}`);
        return res.json({ url: `/uploads/${webpFilename}` });
      } catch (compressErr) {
        console.warn('[upload] WebP compression failed, serving original:', compressErr);
      }
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });
}
