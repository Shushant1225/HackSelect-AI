// Mock data for HackSelect AI

export type UserRole = "admin" | "organizer" | "candidate";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  skills?: string[];
  college?: string;
}

export interface Hackathon {
  id: string;
  name: string;
  description: string;
  organizerId: string;
  organizerName: string;
  eligibility: string;
  examDuration: number; // minutes
  totalMarks: number;
  passingScore: number;
  status: "draft" | "published" | "completed";
  questionsCount: number;
  candidatesCount: number;
  createdAt: string;
}

export interface Question {
  id: string;
  hackathonId: string;
  type: "mcq" | "coding" | "theoretical";
  text: string;
  options?: string[];
  correctAnswer?: string;
  marks: number;
}

export interface Submission {
  id: string;
  candidateId: string;
  candidateName: string;
  hackathonId: string;
  hackathonName: string;
  answers: Record<string, string>;
  score: number;
  totalMarks: number;
  status: "passed" | "failed";
  submittedAt: string;
  violations: number;
  isShortlisted: boolean;
}

export interface ProctorLog {
  id: string;
  candidateId: string;
  candidateName: string;
  hackathonId: string;
  type: "tab_switch" | "fullscreen_exit" | "copy_paste" | "multiple_faces" | "right_click";
  message: string;
  timestamp: string;
}

// Demo users
export const mockUsers: User[] = [
  { id: "admin-1", name: "Admin User", email: "admin@hackselect.ai", role: "admin" },
  { id: "org-1", name: "Sarah Chen", email: "sarah@hackselect.ai", role: "organizer" },
  { id: "org-2", name: "Mike Johnson", email: "mike@hackselect.ai", role: "organizer" },
  { id: "cand-1", name: "Alice Kumar", email: "alice@student.com", role: "candidate", skills: ["React", "Python", "ML"], college: "IIT Delhi" },
  { id: "cand-2", name: "Bob Smith", email: "bob@student.com", role: "candidate", skills: ["Java", "Spring", "AWS"], college: "MIT" },
  { id: "cand-3", name: "Charlie Brown", email: "charlie@student.com", role: "candidate", skills: ["Node.js", "MongoDB", "Docker"], college: "Stanford" },
  { id: "cand-4", name: "Diana Ross", email: "diana@student.com", role: "candidate", skills: ["Flutter", "Firebase", "Dart"], college: "IIT Bombay" },
  { id: "cand-5", name: "Eve Wilson", email: "eve@student.com", role: "candidate", skills: ["C++", "Algorithms", "System Design"], college: "CMU" },
];

export const mockHackathons: Hackathon[] = [
  {
    id: "hack-1", name: "CodeStorm 2025", description: "Build innovative AI solutions for real-world problems.",
    organizerId: "org-1", organizerName: "Sarah Chen", eligibility: "Open to all college students",
    examDuration: 60, totalMarks: 100, passingScore: 50, status: "published",
    questionsCount: 15, candidatesCount: 42, createdAt: "2025-03-15",
  },
  {
    id: "hack-2", name: "WebDev Challenge", description: "Full-stack web development hackathon.",
    organizerId: "org-1", organizerName: "Sarah Chen", eligibility: "CS/IT students only",
    examDuration: 90, totalMarks: 150, passingScore: 75, status: "completed",
    questionsCount: 20, candidatesCount: 68, createdAt: "2025-02-10",
  },
  {
    id: "hack-3", name: "DataHack Pro", description: "Data science and analytics competition.",
    organizerId: "org-2", organizerName: "Mike Johnson", eligibility: "Open to everyone",
    examDuration: 120, totalMarks: 200, passingScore: 100, status: "draft",
    questionsCount: 25, candidatesCount: 0, createdAt: "2025-04-01",
  },
];

export const mockQuestions: Question[] = [
  { id: "q-1", hackathonId: "hack-1", type: "mcq", text: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswer: "O(log n)", marks: 5 },
  { id: "q-2", hackathonId: "hack-1", type: "mcq", text: "Which hook is used for side effects in React?", options: ["useState", "useEffect", "useRef", "useMemo"], correctAnswer: "useEffect", marks: 5 },
  { id: "q-3", hackathonId: "hack-1", type: "mcq", text: "What does REST stand for?", options: ["Representational State Transfer", "Remote Execution Standard Technology", "Real-time Event Streaming", "Responsive Server Template"], correctAnswer: "Representational State Transfer", marks: 5 },
  { id: "q-4", hackathonId: "hack-1", type: "mcq", text: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Array", "Linked List"], correctAnswer: "Stack", marks: 5 },
  { id: "q-5", hackathonId: "hack-1", type: "mcq", text: "What is the default port for MongoDB?", options: ["3306", "5432", "27017", "6379"], correctAnswer: "27017", marks: 5 },
  { id: "q-6", hackathonId: "hack-1", type: "theoretical", text: "Explain the concept of Virtual DOM and how React uses it for efficient rendering.", marks: 10 },
  { id: "q-7", hackathonId: "hack-1", type: "mcq", text: "Which CSS property is used for flexbox?", options: ["display: flex", "position: flex", "layout: flex", "align: flex"], correctAnswer: "display: flex", marks: 5 },
  { id: "q-8", hackathonId: "hack-1", type: "mcq", text: "What is the purpose of useCallback in React?", options: ["Memoize values", "Memoize functions", "Handle errors", "Manage state"], correctAnswer: "Memoize functions", marks: 5 },
];

export const mockSubmissions: Submission[] = [
  { id: "sub-1", candidateId: "cand-1", candidateName: "Alice Kumar", hackathonId: "hack-1", hackathonName: "CodeStorm 2025", answers: {}, score: 85, totalMarks: 100, status: "passed", submittedAt: "2025-03-20T14:30:00Z", violations: 0, isShortlisted: true },
  { id: "sub-2", candidateId: "cand-2", candidateName: "Bob Smith", hackathonId: "hack-1", hackathonName: "CodeStorm 2025", answers: {}, score: 72, totalMarks: 100, status: "passed", submittedAt: "2025-03-20T14:45:00Z", violations: 1, isShortlisted: true },
  { id: "sub-3", candidateId: "cand-3", candidateName: "Charlie Brown", hackathonId: "hack-1", hackathonName: "CodeStorm 2025", answers: {}, score: 45, totalMarks: 100, status: "failed", submittedAt: "2025-03-20T15:00:00Z", violations: 3, isShortlisted: false },
  { id: "sub-4", candidateId: "cand-4", candidateName: "Diana Ross", hackathonId: "hack-1", hackathonName: "CodeStorm 2025", answers: {}, score: 92, totalMarks: 100, status: "passed", submittedAt: "2025-03-20T14:20:00Z", violations: 0, isShortlisted: true },
  { id: "sub-5", candidateId: "cand-5", candidateName: "Eve Wilson", hackathonId: "hack-2", hackathonName: "WebDev Challenge", answers: {}, score: 130, totalMarks: 150, status: "passed", submittedAt: "2025-02-15T16:00:00Z", violations: 0, isShortlisted: true },
  { id: "sub-6", candidateId: "cand-1", candidateName: "Alice Kumar", hackathonId: "hack-2", hackathonName: "WebDev Challenge", answers: {}, score: 60, totalMarks: 150, status: "failed", submittedAt: "2025-02-15T15:30:00Z", violations: 2, isShortlisted: false },
];

export const mockProctorLogs: ProctorLog[] = [
  { id: "pl-1", candidateId: "cand-2", candidateName: "Bob Smith", hackathonId: "hack-1", type: "tab_switch", message: "Switched to another tab during exam", timestamp: "2025-03-20T14:35:00Z" },
  { id: "pl-2", candidateId: "cand-3", candidateName: "Charlie Brown", hackathonId: "hack-1", type: "fullscreen_exit", message: "Exited fullscreen mode", timestamp: "2025-03-20T14:50:00Z" },
  { id: "pl-3", candidateId: "cand-3", candidateName: "Charlie Brown", hackathonId: "hack-1", type: "copy_paste", message: "Attempted to paste content", timestamp: "2025-03-20T14:52:00Z" },
  { id: "pl-4", candidateId: "cand-3", candidateName: "Charlie Brown", hackathonId: "hack-1", type: "multiple_faces", message: "Multiple faces detected on webcam", timestamp: "2025-03-20T14:55:00Z" },
  { id: "pl-5", candidateId: "cand-1", candidateName: "Alice Kumar", hackathonId: "hack-2", type: "tab_switch", message: "Switched to another tab during exam", timestamp: "2025-02-15T15:10:00Z" },
  { id: "pl-6", candidateId: "cand-1", candidateName: "Alice Kumar", hackathonId: "hack-2", type: "right_click", message: "Attempted right-click during exam", timestamp: "2025-02-15T15:15:00Z" },
];
