import type { Express } from 'express';
import { CareerModel, QuizResultModel, SubmissionModel, UserModel, ensureCareerSeeded, isMongoReady, memoryStore } from './mongo';

function toPlain(value: unknown) {
  if (value && typeof value === 'object' && 'toObject' in value && typeof (value as { toObject?: () => unknown }).toObject === 'function') {
    return (value as { toObject: () => unknown }).toObject();
  }

  return value;
}

export function registerApiRoutes(app: Express) {
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, mongoReady: isMongoReady() });
  });

  const buildProgress = (user: any, quizResult: any, submissions: any[]) => {
    const tracker = user?.progressTracker ?? {};
    const quizCompleted = Boolean(tracker.quizCompleted ?? quizResult);
    const roadmapVisited = Number(tracker.roadmapVisited ?? 0);
    const derivedBadges = [
      quizCompleted ? 'Tes Jati Diri' : null,
      roadmapVisited > 0 ? 'Eksplor Roadmap' : null,
      submissions.length > 0 ? 'Kontributor Komunitas' : null,
      submissions.length >= 3 ? 'Explorer Pro' : null,
    ].filter(Boolean) as string[];

    const badgeSource = Array.isArray(tracker.badges) ? tracker.badges : [];
    const badges = Array.from(new Set([...badgeSource, ...derivedBadges]));
    const completionPercent = Math.min(100, (quizCompleted ? 40 : 0) + (roadmapVisited > 0 ? 30 : 0) + Math.min(submissions.length, 3) * 10);

    return {
      quizCompleted,
      roadmapVisited,
      submissionsCount: submissions.length,
      badges,
      completionPercent,
    };
  };

  app.get('/api/users/:uid/summary', async (req, res) => {
    const { uid } = req.params;

    if (!isMongoReady()) {
      const quizResult = memoryStore.quizResults.get(uid) ?? null;
      const user = (memoryStore.users.get(uid) ?? null) as any;
      const submissions = memoryStore.submissions.filter((submission: any) => submission?.submittedBy?.uid === uid);

      res.json({
        user: user ?? { uid },
        quizResult,
        submissions,
        progress: buildProgress(user, quizResult, submissions),
      });
      return;
    }

    await ensureCareerSeeded();
    const [user, quizResult, submissions] = await Promise.all([
      (UserModel as any).findOne({ uid }).lean(),
      (QuizResultModel as any).findOne({ userUid: uid }).lean(),
      (SubmissionModel as any).find({ 'submittedBy.uid': uid }).sort({ createdAt: -1 }).lean(),
    ]);

    res.json({
      user: user ?? { uid },
      quizResult: quizResult ?? null,
      submissions,
      progress: buildProgress(user, quizResult, submissions),
    });
  });

  app.post('/api/users/:uid/progress/roadmap', async (req, res) => {
    const { uid } = req.params;
    const { name, email, careerSlug } = req.body ?? {};

    if (!uid) {
      res.status(400).json({ error: 'uid is required' });
      return;
    }

    if (!isMongoReady()) {
      const existingUser = (memoryStore.users.get(uid) ?? { uid }) as any;
      const progressTracker = existingUser.progressTracker ?? { roadmapVisited: 0, quizCompleted: false, badges: [] };
      const roadmapVisited = Number(progressTracker.roadmapVisited ?? 0) + 1;
      const badges = Array.from(new Set([...(Array.isArray(progressTracker.badges) ? progressTracker.badges : []), 'Eksplor Roadmap']));
      const user = {
        ...existingUser,
        uid,
        name: name ?? existingUser.name ?? null,
        email: email ?? existingUser.email ?? null,
        progressTracker: {
          ...progressTracker,
          roadmapVisited,
          badges,
          lastCareerSlug: careerSlug ?? progressTracker.lastCareerSlug ?? '',
        },
      };

      memoryStore.users.set(uid, user);
      res.json({ ok: true, progress: buildProgress(user, memoryStore.quizResults.get(uid) ?? null, memoryStore.submissions.filter((submission: any) => submission?.submittedBy?.uid === uid)) });
      return;
    }

    await ensureCareerSeeded();
    const updated = await (UserModel as any).findOneAndUpdate(
      { uid },
      {
        $set: {
          uid,
          ...(name ? { name } : {}),
          ...(email ? { email } : {}),
          'progressTracker.lastCareerSlug': careerSlug ?? '',
        },
        $inc: { 'progressTracker.roadmapVisited': 1 },
        $addToSet: { 'progressTracker.badges': 'Eksplor Roadmap' },
      },
      { upsert: true, new: true },
    ).lean();

    const [quizResult, submissions] = await Promise.all([
      (QuizResultModel as any).findOne({ userUid: uid }).lean(),
      (SubmissionModel as any).find({ 'submittedBy.uid': uid }).sort({ createdAt: -1 }).lean(),
    ]);

    res.json({ ok: true, progress: buildProgress(updated, quizResult, submissions) });
  });

  app.get('/api/careers', async (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;

    if (!isMongoReady()) {
      const items = category ? memoryStore.careers.filter((career) => career.categoryId === category) : memoryStore.careers;
      res.json({ items });
      return;
    }

    await ensureCareerSeeded();
    const query = category ? { categoryId: category } : {};
    const items = await (CareerModel as any).find(query).sort({ featured: -1, title: 1 }).lean();
    res.json({ items });
  });

  app.get('/api/careers/:slug', async (req, res) => {
    const { slug } = req.params;

    if (!isMongoReady()) {
      const item = memoryStore.careers.find((career) => career.slug === slug);
      if (!item) {
        res.status(404).json({ error: 'Career not found' });
        return;
      }

      res.json({ item });
      return;
    }

    await ensureCareerSeeded();
    const item = await (CareerModel as any).findOne({ slug }).lean();
    if (!item) {
      res.status(404).json({ error: 'Career not found' });
      return;
    }

    res.json({ item });
  });

  app.post('/api/quiz-results', async (req, res) => {
    const { user, riasecScores, mbtiScores, topCodes, mbtiType, completedAt } = req.body ?? {};

    if (!user?.uid) {
      res.status(400).json({ error: 'user.uid is required' });
      return;
    }

    const payload = {
      userUid: user.uid,
      riasecScores,
      mbtiScores,
      topCodes,
      mbtiType,
      completedAt: completedAt ? new Date(completedAt) : new Date(),
    };

    if (!isMongoReady()) {
      memoryStore.quizResults.set(user.uid, payload);
      const existingUser = (memoryStore.users.get(user.uid) ?? { uid: user.uid }) as any;
      const existingProgress = existingUser.progressTracker ?? { roadmapVisited: 0, quizCompleted: false, badges: [] };
      memoryStore.users.set(user.uid, {
        ...existingUser,
        uid: user.uid,
        name: user.name ?? existingUser.name ?? null,
        email: user.email ?? existingUser.email ?? null,
        hasilTes: payload,
        progressTracker: {
          ...existingProgress,
          quizCompleted: true,
          badges: Array.from(new Set([...(Array.isArray(existingProgress.badges) ? existingProgress.badges : []), 'Tes Jati Diri'])),
        },
      });
      res.json({ ok: true, saved: payload });
      return;
    }

    await (QuizResultModel as any).findOneAndUpdate(
      { userUid: user.uid },
      { $set: payload },
      { upsert: true, new: true },
    );

    await (UserModel as any).findOneAndUpdate(
      { uid: user.uid },
      {
        $addToSet: {
          'progressTracker.badges': 'Tes Jati Diri',
        },
        $set: {
          uid: user.uid,
          name: user.name ?? '',
          email: user.email ?? '',
          'hasilTes.riasec': topCodes?.join?.('') ?? '',
          'hasilTes.mbtiVibe': mbtiType ?? '',
          'hasilTes.completedAt': payload.completedAt,
          'progressTracker.quizCompleted': true,
        },
      },
      { upsert: true, new: true },
    );

    res.json({ ok: true, saved: payload });
  });

  app.get('/api/submissions', async (req, res) => {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;

    if (!isMongoReady()) {
      const items = status && status !== 'all'
        ? memoryStore.submissions.filter((submission: any) => submission.status === status)
        : memoryStore.submissions;
      res.json({ items });
      return;
    }

    const query = status && status !== 'all' ? { status } : {};
    const items = await (SubmissionModel as any).find(query).sort({ createdAt: -1 }).lean();
    res.json({ items });
  });

  app.post('/api/submissions', async (req, res) => {
    const { title, description, submittedBy } = req.body ?? {};

    if (!title || !description || !submittedBy?.uid) {
      res.status(400).json({ error: 'title, description, and submittedBy.uid are required' });
      return;
    }

    const payload = {
      title,
      description,
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
}
