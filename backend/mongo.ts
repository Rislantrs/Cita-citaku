import mongoose, { Schema } from 'mongoose';
import { careerCatalog, type CareerCatalogItem } from '../src/lib/careerCatalog';

const userSchema = new Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: '' },
    email: { type: String, default: '', index: true },
    passwordHash: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
    hasilTes: {
      riasec: { type: String, default: '' },
      mbtiVibe: { type: String, default: '' },
      completedAt: { type: Date, default: null },
    },
    progressTracker: {
      roadmapVisited: { type: Number, default: 0 },
      quizCompleted: { type: Boolean, default: false },
      badges: { type: [String], default: [] },
    },
  },
  { timestamps: true },
);

const careerRoadmapSchema = new Schema(
  {
    level: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
  },
  { _id: false },
);

const careerSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    categoryId: { type: String, required: true, index: true },
    description: { type: String, required: true },
    recommendationMajors: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    riasecCategories: { type: [String], default: [] },
    mbtiTags: { type: [String], default: [] },
    roadmap: { type: [careerRoadmapSchema], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const submissionSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
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

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export const CareerModel = mongoose.models.Career || mongoose.model('Career', careerSchema);
export const SubmissionModel = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
export const QuizResultModel = mongoose.models.QuizResult || mongoose.model('QuizResult', quizResultSchema);

let connected = false;

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    connected = false;
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    connected = true;
    return true;
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || 'cita-citaku',
    });
    connected = true;
    return true;
  } catch (error) {
    console.warn('[mongo] connection failed, running in hybrid fallback mode:', error);
    connected = false;
    return false;
  }
}

export function isMongoReady() {
  return connected && mongoose.connection.readyState === 1;
}

const memoryStore = {
  users: new Map<string, { uid: string; name?: string | null; email?: string | null; hasilTes?: unknown }>(),
  submissions: [] as unknown[],
  quizResults: new Map<string, unknown>(),
  careers: careerCatalog as CareerCatalogItem[],
};

export async function ensureCareerSeeded() {
  if (!isMongoReady()) return;

  const count = await CareerModel.countDocuments();
  if (count > 0) return;

  await (CareerModel as any).insertMany(careerCatalog);
}

export { memoryStore };
