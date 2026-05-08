import mongoose, { Schema } from 'mongoose';
import { careerCatalog, type CareerCatalogItem } from '../src/lib/careerCatalog';

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
    recommendationMajors: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    riasecCategories: { type: [String], default: [] },
    mbtiTags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const userUsageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  count: { type: Number, default: 0 }
});

userUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export const CareerModel = mongoose.models.Career || mongoose.model('Career', careerSchema);
export const ProjectModel = mongoose.models.Project || mongoose.model('Project', projectSchema);
export const SubmissionModel = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
export const QuizResultModel = mongoose.models.QuizResult || mongoose.model('QuizResult', quizResultSchema);
export const UserUsageModel = mongoose.models.UserUsage || mongoose.model('UserUsage', userUsageSchema);

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
    console.error('[mongo] connection failed ERROR:', error);
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
  projects: [] as unknown[],
};

export async function ensureCareerSeeded() {
  if (!isMongoReady()) return;

  const count = await CareerModel.countDocuments();
  if (count > 0) return;

  await (CareerModel as any).insertMany(careerCatalog);
}

export { memoryStore };
