import type { Express } from 'express';
import { CareerModel, ProjectModel, QuizResultModel, SubmissionModel, UserModel, ensureCareerSeeded, isMongoReady, memoryStore } from './mongo';

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
    
      const { callAI } = await import('./ai_service');
      const response = await callAI('quiz', prompt);
      
      console.log(`[AI] Response generated successfully.`);
      
      const cleanJson = response.text.replace(/```json|```/g, '').trim();
      res.json(JSON.parse(cleanJson));
    } catch (e) {
      console.error("[api] Analysis fatal error:", e);
      res.status(500).json({ 
        error: 'Gagal menganalisis',
        message: e instanceof Error ? e.message : 'Unknown error'
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
      { upsert: true, new: true }
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
        { new: true, upsert: true }
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

      res.json({ items });
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

    const items = await (ProjectModel as any).find(query).sort({ featured: -1, createdAt: -1 }).lean();
    res.json({ items });
  });

  app.get('/api/projects/:id', async (req, res) => {
    const { id } = req.params;

    if (!isMongoReady()) {
      const item = (memoryStore.projects as any[]).find((project) => project.id === id);
      if (!item) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      res.json({ item });
      return;
    }

    const item = await (ProjectModel as any).findOne({ id }).lean();

    if (!item) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json({ item });
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

  app.patch('/api/submissions/:id/review', async (req, res) => {
    const { id } = req.params;
    const { status, reviewedBy, reviewerRole, notes } = req.body ?? {};

    if (!['approved', 'rejected'].includes(status)) {
      res.status(400).json({ error: 'status must be approved or rejected' });
      return;
    }

    if (!isAdminLike(reviewerRole)) {
      res.status(403).json({ error: 'Admin access required' });
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
      { new: true },
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
        { upsert: true, new: true },
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
      { upsert: true, new: true }
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
  app.get('/api/careers', async (_req, res) => {
    if (!isMongoReady()) {
      res.json({ items: memoryStore.careers });
      return;
    }

    const items = await CareerModel.find().sort({ featured: -1, title: 1 }).lean();
    res.json({ items });
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
}
