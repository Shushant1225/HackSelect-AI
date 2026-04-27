import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { Search, Download, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadPDF } from "@/lib/pdf-generator";
// ✅ Fixed: use dashboardAPI for organizer, submissionsAPI for students
import { dashboardAPI, submissionsAPI } from "@/api";
import { useAuth } from "@/context/AuthContext";

const ResultsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        let data: any[] = [];
        if (user?.role === "ORGANIZER" || user?.role === "ADMIN") {
          // ✅ Organizer/Admin: fetch all submissions for their exams
          data = await dashboardAPI.getMySubmissions();
        } else {
          // Candidate: fetch only their own submissions
          data = await submissionsAPI.getAll();
        }
        setSubmissions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        toast.error("Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [user]);

  const filtered = submissions.filter((s: any) => {
    const candidateName = s.student?.name?.toLowerCase() || "";
    const hackathonName = s.exam?.title?.toLowerCase() || "";
    const q = search.toLowerCase();
    return candidateName.includes(q) || hackathonName.includes(q);
  });

  const sorted = [...filtered].sort((a: any, b: any) => {
    const pctA = parseFloat(a.percentage || "0");
    const pctB = parseFloat(b.percentage || "0");
    return pctB - pctA;
  });

  const handleDownloadPDF = (submission: any, rank: number) => {
    try {
      const cheatingScore = submission.violations?.length
        ? Math.min(100, submission.violations.length * 10)
        : 0;
      const riskLevel: "Low" | "Medium" | "High" =
        cheatingScore < 30 ? "Low" : cheatingScore < 70 ? "Medium" : "High";
      const pct = parseFloat(submission.percentage || "0");
      const aiRecommendation =
        pct >= 80
          ? "Excellent performance. Highly recommended for shortlisting."
          : pct >= 60
          ? "Good performance. Candidate meets the qualifying criteria."
          : "Below average performance. Further review recommended before shortlisting.";

      downloadPDF({
        candidateName: submission.student?.name || "Unknown",
        examName: submission.exam?.title || "Unknown",
        score: Number(submission.obtainedMarks || 0),
        totalMarks: Number(submission.totalMarks || 0),
        percentage: pct,
        cheatingScore,
        riskLevel,
        rank,
        violations: submission.violations?.length || 0,
        status: submission.status,
        submittedAt: submission.submittedAt || new Date().toISOString(),
        aiRecommendation,
      });
      toast.success(`PDF downloaded for ${submission.student?.name || "candidate"}`);
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold">Results & Rankings</h2>
            <p className="text-muted-foreground text-sm">View candidate performance and rankings</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success("Report downloaded!")}>
            <Download className="h-4 w-4 mr-2" /> Export Report
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by candidate or hackathon..."
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">All Submissions ({sorted.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground text-sm">Loading results...</div>
            ) : sorted.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">No submissions found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Rank", "Candidate", "Hackathon", "Score", "Progress", "Violations", "Status", "Action"].map((h) => (
                        <th key={h} className="text-left py-2.5 px-3 font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((s: any, i: number) => {
                      const pct = parseFloat(s.percentage || "0");
                      const score = Number(s.obtainedMarks || 0);
                      const totalMarks = Number(s.totalMarks || 0);
                      const violations = s.violations?.length || 0;
                      const isShortlisted = pct >= 60;

                      return (
                        <tr key={s.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3">
                            {i < 3 ? (
                              <span className="text-lg">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
                            ) : (
                              <span className="font-bold text-primary text-sm">#{i + 1}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-medium">{s.student?.name || "Unknown"}</td>
                          <td className="py-2.5 px-3 text-muted-foreground text-xs">{s.exam?.title || "Unknown"}</td>
                          <td className="py-2.5 px-3 font-semibold">{score.toFixed(2)}/{totalMarks.toFixed(2)}</td>
                          <td className="py-2.5 px-3 w-28">
                            <div className="flex items-center gap-2">
                              <Progress value={pct} className="h-1.5 flex-1" />
                              <span className="text-[11px] text-muted-foreground">{pct.toFixed(2)}%</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            {violations > 0 ? (
                              <span className="text-warning font-semibold">⚠️ {violations}</span>
                            ) : (
                              <span className="text-success text-xs">✓ Clean</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex gap-1">
                              <StatusBadge status={s.status === "SUBMITTED" ? "passed" : "failed"} />
                              {isShortlisted && <StatusBadge status="shortlisted" />}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-primary/10 text-primary"
                              onClick={() => handleDownloadPDF(s, i + 1)}
                              title="Download PDF Report"
                            >
                              <FileDown className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResultsPage;