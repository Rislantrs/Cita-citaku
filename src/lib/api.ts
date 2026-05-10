export type ProjectPayload = {
  id?: string;
  title: string;
  introduction: string;
  background: string;
  skills: string[];
  brief: string;
  steps: string[];
  briefSections: unknown[];
  interactiveSteps: unknown[];
  image?: string;
  category: string;
};

export type QuizResultPayload = {
  user: {
    uid: string;
    name?: string | null;
    email?: string | null;
  };
  riasecScores: Record<string, number>;
  mbtiScores: Record<string, number>;
  topCodes: string[];
  mbtiType: string;
  completedAt: string;
};

export type CareerSubmissionPayload = {
  title: string;
  description: string;
  careerData?: ProjectPayload;
  submittedBy: {
    uid: string;
    name?: string | null;
    email?: string | null;
  };
};

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchProjects(params?: { category?: string; search?: string }) {
  const searchParams = new URLSearchParams();

  if (params?.category && params.category !== 'Semua') {
    searchParams.set('category', params.category);
  }

  if (params?.search) {
    searchParams.set('search', params.search);
  }

  const query = searchParams.toString();
  const response = await fetch(query ? `/api/projects?${query}` : '/api/projects');
  return parseJsonResponse<{ items: unknown[] }>(response);
}

export async function fetchProject(id: string) {
  const response = await fetch(`/api/projects/${encodeURIComponent(id)}`);
  return parseJsonResponse<{ item: unknown }>(response);
}

export async function fetchCareers(category?: string) {
  const url = category ? `/api/careers?category=${encodeURIComponent(category)}` : '/api/careers';
  const response = await fetch(url);
  return parseJsonResponse<{ items: unknown[] }>(response);
}

export async function saveQuizResult(payload: QuizResultPayload) {
  const response = await fetch('/api/quiz/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<{ ok: true; saved: unknown }>(response);
}

export async function createCareerSubmission(payload: CareerSubmissionPayload) {
  const response = await fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<{ ok: true; submission: unknown }>(response);
}

export async function fetchCareerSubmissions(status?: 'pending' | 'approved' | 'all') {
  const url = status && status !== 'all' ? `/api/submissions?status=${status}` : '/api/submissions';
  const response = await fetch(url);
  return parseJsonResponse<{ items: unknown[] }>(response);
}

export async function reviewCareerSubmission(payload: {
  id: string;
  status: 'approved' | 'rejected';
  reviewedBy: string;
  reviewerRole: 'admin' | 'moderator' | 'super_admin';
  notes?: string;
}) {
  const response = await fetch(`/api/submissions/${encodeURIComponent(payload.id)}/review`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<{ ok: true; submission: unknown }>(response);
}

export async function fetchUserSummary(uid: string) {
  const response = await fetch(`/api/users/${encodeURIComponent(uid)}/summary`);
  return parseJsonResponse<{ user: unknown; quizResult: unknown; submissions: unknown[]; progress: unknown }>(response);
}

export async function recordRoadmapVisit(payload: { uid: string; name?: string | null; email?: string | null; careerSlug?: string }) {
  const response = await fetch(`/api/users/${encodeURIComponent(payload.uid)}/progress/roadmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<{ ok: true; progress: unknown }>(response);
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  return parseJsonResponse<{ url: string }>(response);
}
