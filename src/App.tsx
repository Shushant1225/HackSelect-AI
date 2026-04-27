import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import CreateExamPage from "./pages/CreateExamPage";
import ExamPage from "./pages/ExamPage";
import ResultsPage from "./pages/ResultsPage";
import ShortlistedPage from "./pages/ShortlistedPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ProctorLogsPage from "./pages/ProctorLogsPage";
import NotFound from "./pages/NotFound";
import { ReactNode } from "react";

const queryClient = new QueryClient();

// Simple route guard
const ProtectedRoute = ({ children, allowedRoles }: { children: ReactNode; allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/admin/hackathons" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/proctor-logs" element={<ProtectedRoute allowedRoles={["ADMIN"]}><ProctorLogsPage /></ProtectedRoute>} />

            {/* Organizer routes */}
            <Route path="/organizer" element={<ProtectedRoute allowedRoles={["ORGANIZER"]}><OrganizerDashboard /></ProtectedRoute>} />
            <Route path="/organizer/create-exam" element={<ProtectedRoute allowedRoles={["ORGANIZER"]}><CreateExamPage /></ProtectedRoute>} />
            <Route path="/organizer/results" element={<ProtectedRoute allowedRoles={["ORGANIZER"]}><ResultsPage /></ProtectedRoute>} />
            <Route path="/organizer/shortlisted" element={<ProtectedRoute allowedRoles={["ORGANIZER"]}><ShortlistedPage /></ProtectedRoute>} />
            <Route path="/organizer/proctor-alerts" element={<ProtectedRoute allowedRoles={["ORGANIZER"]}><ProctorLogsPage /></ProtectedRoute>} />

            {/* Candidate routes */}
            <Route path="/candidate" element={<ProtectedRoute allowedRoles={["STUDENT"]}><CandidateDashboard /></ProtectedRoute>} />
            <Route path="/candidate/hackathons" element={<ProtectedRoute allowedRoles={["STUDENT"]}><CandidateDashboard /></ProtectedRoute>} />
            <Route path="/candidate/results" element={<ProtectedRoute allowedRoles={["STUDENT"]}><ResultsPage /></ProtectedRoute>} />
            <Route path="/candidate/exam/:hackathonId" element={<ProtectedRoute allowedRoles={["STUDENT"]}><ExamPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
