const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface RequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiCall("/auth/login", { method: "POST", body: { email, password } }),

  register: (email: string, password: string, name: string, role?: string, college?: string) =>
    apiCall("/auth/register", {
      method: "POST",
      body: { email, password, name, role, college },
    }),

  getCurrentUser: () => apiCall("/auth/me"),
};

// Exams API
export const examsAPI = {
  getAll: () => apiCall("/exams"),
  getById: (id: string) => apiCall(`/exams/${id}`),
  getQuestions: (examId: string) => apiCall(`/exams/${examId}/questions`),
};

// Submissions API
export const submissionsAPI = {
  getAll: () => apiCall("/submissions"),
  getById: (id: string) => apiCall(`/submissions/${id}`),
  create: (examId: string) => apiCall("/submissions", { method: "POST", body: { examId } }),
  updateAnswer: (submissionId: string, questionId: string, answer: string) =>
    apiCall(`/submissions/${submissionId}/answers`, {
      method: "POST",
      body: { questionId, answer },
    }),
  submit: (submissionId: string) =>
    apiCall(`/submissions/${submissionId}/submit`, { method: "POST" }),
  getResults: (submissionId: string) => apiCall(`/submissions/${submissionId}/results`),
};

// Proctoring API
export const proctoringAPI = {
  logViolation: (submissionId: string, violationType: string, message: string) =>
    apiCall("/proctoring/violations", {
      method: "POST",
      body: { submissionId, violationType, message, severity: "MEDIUM" },
    }),

  getViolations: (submissionId: string) =>
    apiCall(`/proctoring/violations/${submissionId}`),

  logAction: (examId: string, action: string, details?: any) =>
    apiCall("/proctoring/logs", {
      method: "POST",
      body: { examId, action, details },
    }),

  startWebcamSession: (submissionId: string) =>
    apiCall("/proctoring/webcam/session", {
      method: "POST",
      body: { submissionId },
    }),

  updateWebcamSession: (
    sessionId: string,
    faceDetected: boolean,
    faceCount: number,
    frameCount?: number
  ) =>
    apiCall(`/proctoring/webcam/session/${sessionId}`, {
      method: "PUT",
      body: { faceDetected, faceCount, frameCount },
    }),

  endWebcamSession: (sessionId: string) =>
    apiCall(`/proctoring/webcam/session/${sessionId}/end`, { method: "PUT" }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiCall("/dashboard/stats"),
  getExamAnalytics: (examId: string) => apiCall(`/dashboard/exams/${examId}/analytics`),
  getLeaderboard: (examId: string) => apiCall(`/dashboard/leaderboard/${examId}`),
  getMySubmissions: () => apiCall("/dashboard/my-submissions"),
};

export default apiCall;
