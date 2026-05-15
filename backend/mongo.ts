import mongoose, { Schema } from 'mongoose';
import { careerCatalog, type ItemKatalogKarir } from '../src/lib/careerCatalog';

const userSchema = new Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: '' },
    email: { type: String, default: '', index: true },
    passwordHash: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin', 'moderator', 'super_admin'], default: 'user' },
    hasilTes: {
      riasec: { type: String, default: '' },
      mbtiVibe: { type: String, default: '' },
      completedAt: { type: Date, default: null },
    },
    progressTracker: {
      roadmapVisited: { type: Number, default: 0 },
      quizCompleted: { type: Boolean, default: false },
      badges: { type: [String], default: [] },
      lastCareerSlug: { type: String, default: '' },
    },
  },
  { timestamps: true },
);

const briefSectionSchema = new Schema(
  {
    number: { type: Number, required: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    content: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const stepChoiceSchema = new Schema(
  {
    id: { type: String, required: true, trim: true, maxlength: 80 },
    label: { type: String, required: true, trim: true, maxlength: 180 },
    guidance: { type: String, default: '', maxlength: 2000 },
    requiresProof: { type: Boolean, default: false },
    requiresExplanation: { type: Boolean, default: false },
    nextStepId: { type: String, default: null },
  },
  { _id: false },
);

const interactiveStepSchema = new Schema(
  {
    id: { type: String, required: true, trim: true, maxlength: 80 },
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    question: { type: String, default: '', maxlength: 500 },
    choices: { type: [stepChoiceSchema], default: [] },
    guidance: { type: String, default: '', maxlength: 2000 },
    requiresExplanation: { type: String, default: '' },
  },
  { _id: false },
);

const projectSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    introduction: { type: String, required: true, trim: true, maxlength: 500 },
    background: { type: String, required: true, trim: true, maxlength: 3000 },
    skills: { type: [String], default: [] },
    brief: { type: String, required: true, trim: true, maxlength: 3000 },
    steps: { type: [String], default: [] },
    briefSections: { type: [briefSectionSchema], default: [] },
    interactiveSteps: { type: [interactiveStepSchema], default: [] },
    image: { type: String, default: '' },
    category: { type: String, required: true, index: true, trim: true, maxlength: 80 },
    sourceSubmissionId: { type: String, default: '' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const submissionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    careerData: {
      id: { type: String, default: '' },
      title: { type: String, default: '' },
      introduction: { type: String, default: '' },
      background: { type: String, default: '' },
      skills: { type: [String], default: [] },
      brief: { type: String, default: '' },
      steps: { type: [String], default: [] },
      briefSections: { type: [briefSectionSchema], default: [] },
      interactiveSteps: { type: [interactiveStepSchema], default: [] },
      image: { type: String, default: '' },
      category: { type: String, default: '' },
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    submittedBy: {
      uid: { type: String, required: true, index: true },
      name: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    aiReview: {
      notes: { type: String, default: '' },
      score: { type: Number, default: 0 },
    },
    reviewedBy: { type: String, default: '' },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const quizResultSchema = new Schema(
  {
    userUid: { type: String, required: true, unique: true, index: true },
    riasecScores: { type: Schema.Types.Mixed, required: true },
    mbtiScores: { type: Schema.Types.Mixed, required: true },
    topCodes: { type: [String], default: [] },
    mbtiType: { type: String, default: '' },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const careerSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    categoryId: { type: String, required: true, index: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['skill_based', 'education_based'], default: 'skill_based' },
    keyIkon: { type: String, default: 'code' },
    recommendationMajors: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    riasecCategories: { type: [String], default: [] },
    mbtiTags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    infoGaji: { type: Schema.Types.Mixed, default: {} },
    infoPendidikan: { type: Schema.Types.Mixed, default: {} },
    materiBelajar: { type: Schema.Types.Mixed, default: [] },
    daftarBuku: { type: Schema.Types.Mixed, default: [] },
    referensiDigital: { type: Schema.Types.Mixed, default: [] },
    faqs: { type: Schema.Types.Mixed, default: [] },
    universitasTerbaik: { type: Schema.Types.Mixed, default: {} },
    duniaPerkuliahan: { type: Schema.Types.Mixed, default: {} },
    roadmap: { type: Schema.Types.Mixed, default: [] },
  },
  { timestamps: true, strict: false },
);

const userUsageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  count: { type: Number, default: 0 }
});

userUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const chatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  task: { type: String, default: 'counselor' },
  title: { type: String, default: 'Percakapan Baru' },
  isPinned: { type: Boolean, default: false },
  messages: { type: [chatMessageSchema], default: [] },
}, { timestamps: true });

const userProjectSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  projectId: { type: String, required: true, index: true },
  completedSteps: { type: [String], default: [] },
  stepChoices: { type: mongoose.Schema.Types.Mixed, default: {} },
  stepProofs: { type: mongoose.Schema.Types.Mixed, default: {} },
  driveLink: { type: String, default: '' },
  githubLink: { type: String, default: '' },
  status: { type: String, enum: ['in_progress', 'submitted', 'completed'], default: 'in_progress' },
}, { timestamps: true });

userProjectSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export const CareerModel = mongoose.models.Career || mongoose.model('Career', careerSchema);
export const ProjectModel = mongoose.models.Project || mongoose.model('Project', projectSchema);
export const SubmissionModel = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
export const QuizResultModel = mongoose.models.QuizResult || mongoose.model('QuizResult', quizResultSchema);
export const UserUsageModel = mongoose.models.UserUsage || mongoose.model('UserUsage', userUsageSchema);
export const ChatSessionModel = mongoose.models.ChatSession || mongoose.model('ChatSession', chatSessionSchema);
export const UserProjectModel = mongoose.models.UserProject || mongoose.model('UserProject', userProjectSchema);

let connected = false;

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  console.log('[mongo] Connecting... URI present:', !!mongoUri);

  if (!mongoUri) {
    console.warn('[mongo] MONGODB_URI not found in environment');
    connected = false;
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    connected = true;
    return true;
  }

  try {
    console.log('[mongo] Attempting to connect to Atlas...');
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || 'cita-citaku',
      serverSelectionTimeoutMS: 3000, // 3 seconds timeout
      connectTimeoutMS: 3000,
    });
    connected = true;
    console.log('[mongo] Successfully connected to Atlas');
    return true;
  } catch (error) {
    console.error('[mongo] connection failed ERROR:', error);
    connected = false;
    return false;
  }
}

export function isMongoReady() {
  return mongoose.connection.readyState === 1;
}

const memoryStore = {
  users: new Map<string, { uid: string; name?: string | null; email?: string | null; hasilTes?: unknown }>(),
  submissions: [] as unknown[],
  quizResults: new Map<string, unknown>(),
  careers: [] as ItemKatalogKarir[],
  projects: [] as unknown[],
};

export async function ensureCareerSeeded() {
  const isReady = isMongoReady();
  
  try {
    const fs = await import('fs');
    const path = await import('path');
    const dataPath = path.join(process.cwd(), 'backend', 'data', 'careers.json');
    
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf8');
      const careers = JSON.parse(raw);
      
      // 1. Always seed memoryStore for safety
      memoryStore.careers = careers;
      
      // 2. If Mongo is ready, sync to Atlas
      if (isReady) {
        console.log(`[mongo] Atlas connected. Syncing ${careers.length} careers...`);
        for (const career of careers) {
          await CareerModel.findOneAndUpdate(
            { slug: career.slug } as any,
            career,
            { upsert: true, returnDocument: 'after' }
          );
        }
        console.log('[mongo] Atlas sync complete!');
      } else {
        console.log(`[mongo] Hybrid Mode: Auto-seeded ${careers.length} careers to memory`);
      }
    }
  } catch (err) {
    console.error('[mongo] Seeding failed:', err);
  }
}

export async function ensureProjectSeeded() {
  const isReady = isMongoReady();
  
  try {
    const fs = await import('fs');
    const path = await import('path');
    const dataPath = path.join(process.cwd(), 'backend', 'data', 'projects.json');
    
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf8');
      const projects = JSON.parse(raw);
      
      // 1. Always seed memoryStore
      memoryStore.projects = projects;
      
      // 2. If Mongo is ready, sync to Atlas
      if (isReady) {
        console.log(`[mongo] Atlas connected. Syncing ${projects.length} projects...`);
        for (const project of projects) {
          await ProjectModel.findOneAndUpdate(
            { id: project.id } as any,
            project,
            { upsert: true, returnDocument: 'after' }
          );
        }
        console.log('[mongo] Project Atlas sync complete!');
      } else {
        console.log(`[mongo] Hybrid Mode: Auto-seeded ${projects.length} projects to memory`);
      }
    }
  } catch (err) {
    console.error('[mongo] Project Seeding failed:', err);
  }
}

export { memoryStore };
