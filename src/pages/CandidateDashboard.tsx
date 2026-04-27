import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { examsAPI, submissionsAPI } from "@/api";
import { Trophy, FileText, BarChart3, ArrowRight, Clock, Target, Users, Sparkles, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { downloadStudentPDF } from "@/lib/pdf-generator";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [mySubmissions, setMySubmissions] = useState([]);
  const [available, setAvailable] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examsData = await examsAPI.getAll();
        setAvailable(examsData.filter((exam: any) => exam.status === "PUBLISHED"));
        const subsData = await submissionsAPI.getAll();
        setMySubmissions(subsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const passed = mySubmissions.filter((s: any) => s.status === "SUBMITTED").length;

  const handleDownloadPDF = (submission: any) => {
    try {
      const totalQuestions = submission.answers?.length || 0;
      const correct = submission.answers?.filter((a: any) => a.isCorrect).length || 0;
      const wrong = submission.answers?.filter((a: any) => a.isCorrect === false).length || 0;
      const unanswered = totalQuestions - correct - wrong;
      const pct = Number(submission.percentage || 0);
      let recommendation = "";
      if (pct < 50) {
        recommendation = "Low score detected. Focus on practicing more questions to improve your performance.";
      } else if (unanswered > totalQuestions * 0.5) {
        recommendation = "Many unanswered questions. Work on improving time management during exams.";
      } else if (wrong > totalQuestions * 0.5) {
        recommendation = "Many wrong answers. Consider revising key concepts and fundamentals.";
      } else if (pct >= 80) {
        recommendation = "Excellent work! You performed very well. Try advanced practice questions to further enhance your skills.";
      } else {
        recommendation = "Good performance. Keep practicing to maintain and improve your results.";
      }
      downloadStudentPDF({
        candidateName: submission.student?.name || user?.name || "Student",
        examName: submission.exam?.title || "Exam",
        score: Number(submission.obtainedMarks || 0),
        totalMarks: Number(submission.totalMarks || 0),
        percentage: Number(pct.toFixed(2)),
        correct,
        wrong,
        unanswered,
        status: submission.status,
        submittedAt: submission.submittedAt || new Date().toISOString(),
        recommendation,
      });
      toast.success(`PDF downloaded for ${submission.exam?.title || "Exam"}`);
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome banner */}
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-20 -translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl translate-y-20"></div>

          <div className="relative z-10 p-8 md:p-12 bg-gradient-to-r from-white/40 via-white/20 to-blue-50/40 backdrop-blur-md border border-white/50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  <span className="text-sm font-semibold text-primary">Welcome back</span>
                </div>
                {/* ✅ Fixed: use actual user name from auth context */}
                <h1 className="text-4xl font-bold text-gradient mb-2">{user?.name || "Candidate"} 👋</h1>
                <p className="text-foreground/70">Here's your hackathon screening overview and progress</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 rounded-full bg-white/50 border border-primary/30 backdrop-blur">
                <span className="text-sm font-medium text-foreground">📊 {mySubmissions.length} Tests Completed</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-white/50 border border-green-300/30 backdrop-blur">
                <span className="text-sm font-medium text-foreground">✅ {passed} Tests Passed</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-white/50 border border-accent/30 backdrop-blur">
                <span className="text-sm font-medium text-foreground">🎯 {available.length} Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Tests Taken"
            value={mySubmissions.length}
            icon={FileText}
            description="Total exams completed"
            trend={`${passed} passed`}
            iconColor="gradient-primary"
          />
          <StatCard
            title="Tests Passed"
            value={passed}
            icon={BarChart3}
            description="Successfully completed"
            trend={`${Math.round((passed / mySubmissions.length) * 100) || 0}% success rate`}
            iconColor="bg-gradient-to-br from-green-500 to-emerald-500"
          />
          <StatCard
            title="Available"
            value={available.length}
            icon={Trophy}
            description="Hackathons to take"
            trend="Ready to participate"
            iconColor="bg-gradient-to-br from-amber-500 to-orange-500"
          />
        </div>

        {/* Available Hackathons */}
        <Card className="card-hover shadow-sm hover:shadow-lg border border-foreground/10 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-foreground/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Available Hackathons</CardTitle>
              <span className="text-sm font-medium text-foreground/60">{available.length} hackathons</span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              {available.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
                  <p className="text-foreground/60">No hackathons available right now</p>
                </div>
              ) : (
                available.map((h: any, idx: number) => (
                  <div
                    key={h.id}
                    className="group flex items-start justify-between p-6 rounded-xl border border-foreground/10 hover:border-primary/30 bg-gradient-to-r from-white/50 to-blue-50/50 hover:from-blue-50 hover:to-green-50 transition-all duration-300 animate-slide-up shadow-sm hover:shadow-md"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Trophy className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        {/* ✅ Fixed: raw text nodes wrapped in proper elements */}
                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                          {h.title}
                        </h3>
                        <p className="text-sm text-foreground/70 mb-3">{h.description}</p>
                        <div className="flex flex-wrap gap-4 items-center text-sm">
                          <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/50 border border-foreground/10">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">{h.duration} min</span>
                          </span>
                          <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/50 border border-foreground/10">
                            <Target className="h-4 w-4 text-accent" />
                            <span className="font-medium">{h.totalMarks} marks</span>
                          </span>
                          <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/50 border border-foreground/10">
                            <Users className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Pass: {h.passingMarks}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="lg" className="gradient-primary text-primary-foreground btn-glow shrink-0 ml-4" asChild>
                      <Link to={`/candidate/exam/${h.id}`} className="flex items-center gap-2">
                        Take Test <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* My Results Table */}
        <Card className="card-hover shadow-sm hover:shadow-lg border border-foreground/10 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-foreground/5">
            <CardTitle className="text-xl font-bold">My Results</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {mySubmissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-foreground/10">
                      {["Hackathon", "Score", "Progress", "Status", "Shortlisted", "Download"].map((h) => (
                        <th key={h} className="text-left py-3 px-4 font-semibold text-sm text-foreground/60 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mySubmissions.map((s: any) => {
                      const pct = s.percentage ? parseFloat(s.percentage) : 0;
                      return (
                        <tr
                          key={s.id}
                          className="border-b border-foreground/5 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-green-50/50 transition-all duration-200 group"
                        >
                          <td className="py-4 px-4 text-foreground/70 text-sm">
                            {s.exam?.title || "Unknown"}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 font-semibold text-primary">
                              {Number(s.obtainedMarks || 0).toFixed(2)}/{Number(s.totalMarks || 0).toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3 w-40">
                              <Progress value={pct} className="h-2 bg-foreground/10" />
                              <span className="text-sm font-semibold text-foreground/70 w-12">{pct.toFixed(2)}%</span>
                            </div>
                          </td>
                          {/* ✅ Fixed: StatusBadge was floating outside <td>, now properly wrapped */}
                          <td className="py-4 px-4">
                            <StatusBadge status={s.status === "SUBMITTED" ? "passed" : "failed"} />
                          </td>
                          <td className="py-4 px-4">
                            {s.percentage && parseFloat(s.percentage) >= 60 ? (
                              <StatusBadge status="shortlisted" />
                            ) : (
                              <span className="text-xs font-medium text-foreground/50">—</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadPDF(s)}
                              className="flex items-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              PDF
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
                <p className="text-foreground/60">No test results yet. Take a test to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CandidateDashboard;