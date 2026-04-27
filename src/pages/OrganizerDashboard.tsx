import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { examsAPI, dashboardAPI } from "@/api";
import { Trophy, Users, FileText, Plus, BarChart3, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const OrganizerDashboard = () => {
  const { user } = useAuth();

  const [myHackathons, setMyHackathons] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const examsData = await examsAPI.getAll();
        const allMyHackathons = Array.isArray(examsData) ? examsData : [];
        setMyHackathons(allMyHackathons);

        const subsData = await dashboardAPI.getMySubmissions();
        setMySubmissions(Array.isArray(subsData) ? subsData : []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, [user]);

  if (!user) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  const shortlisted = mySubmissions.filter(
    (s: any) => s.percentage && parseFloat(s.percentage) >= 60
  ).length;

  const avgScore =
    mySubmissions.length > 0
      ? (
          mySubmissions.reduce(
            (sum: number, s: any) => sum + parseFloat(s.percentage || "0"),
            0
          ) / mySubmissions.length
        ).toFixed(0)
      : "0";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Organizer Dashboard</h1>
            <p className="text-foreground/70">Manage your hackathon exams, submissions, and shortlist candidates</p>
          </div>
          <Button className="gradient-primary text-primary-foreground btn-glow" asChild>
            <Link to="/organizer/create-exam" className="flex items-center gap-2">
              <Plus className="h-5 w-5" /> Create New Exam
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Hackathons"
            value={myHackathons.length}
            icon={Trophy}
            description="Total created"
            trend="Last 30 days"
            iconColor="gradient-primary"
          />
          <StatCard
            title="Submissions"
            value={mySubmissions.length}
            icon={FileText}
            description="Total received"
            trend="+12% this month"
            iconColor="bg-gradient-to-br from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Shortlisted"
            value={shortlisted}
            icon={Users}
            description={`${Math.round((shortlisted / (mySubmissions.length || 1)) * 100)}% conversion`}
            trend={`${shortlisted}/${mySubmissions.length} selected`}
            iconColor="bg-gradient-to-br from-green-500 to-emerald-500"
          />
          <StatCard
            title="Avg Score"
            value={`${avgScore}%`}
            icon={BarChart3}
            description="Average candidate score"
            trend="+5% this month"
            iconColor="bg-gradient-to-br from-purple-500 to-pink-500"
          />
        </div>

        <Card className="card-hover shadow-sm hover:shadow-lg border border-foreground/10 bg-white/80 backdrop-blur-sm animate-slide-up">
          <CardHeader className="pb-4 border-b border-foreground/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">My Hackathons</CardTitle>
              <span className="text-sm font-medium text-foreground/60">{myHackathons.length} total</span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              {myHackathons.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
                  <p className="text-foreground/60">No hackathons found</p>
                </div>
              ) : (
                myHackathons.map((h: any, idx: number) => (
                  <div
                    key={h.id}
                    className="group flex items-start justify-between p-6 rounded-xl border border-foreground/10 hover:border-primary/30 bg-gradient-to-r from-white/50 to-blue-50/50 hover:from-blue-50 hover:to-green-50 transition-all duration-300 shadow-sm hover:shadow-md animate-slide-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Trophy className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{h.title}</h3>
                        <p className="text-sm text-foreground/70 mb-3">{h.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/50 border border-foreground/10">
                            <FileText className="h-4 w-4 text-accent" />
                            <span className="font-medium">{h._count?.questions || 0} questions</span>
                          </span>
                          <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/50 border border-foreground/10">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">{h.duration} min</span>
                          </span>
                          <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/50 border border-foreground/10">
                            <Users className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{h._count?.submissions || 0} candidates</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={h.status} />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card
          className="card-hover shadow-sm hover:shadow-lg border border-foreground/10 bg-white/80 backdrop-blur-sm animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader className="pb-4 border-b border-foreground/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Recent Submissions</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5" asChild>
                <Link to="/organizer/results" className="flex items-center gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {mySubmissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-foreground/10">
                      {["Candidate", "Hackathon", "Score", "Violations", "Status"].map((h) => (
                        <th
                          key={h}
                          className="text-left py-3 px-4 font-semibold text-sm text-foreground/60 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mySubmissions.slice(0, 10).map((s: any, idx: number) => (
                      <tr
                        key={s.id}
                        className="border-b border-foreground/5 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-green-50/50 transition-all duration-200 group animate-slide-up"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <td className="py-4 px-4 font-semibold text-foreground group-hover:text-primary transition-colors">
                          {s.student?.name || "Unknown"}
                        </td>
                        <td className="py-4 px-4 text-foreground/70 text-sm">{s.exam?.title || "Unknown"}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 font-semibold text-primary">
                            {Number(s.obtainedMarks || 0).toFixed(2)}/{Number(s.totalMarks || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {s.violations && s.violations.length > 0 ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 font-semibold text-red-700">
                              ⚠️ {s.violations.length}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">
                              ✓ Clean
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <StatusBadge status={s.status === "SUBMITTED" ? "passed" : "failed"} />
                            {s.percentage && parseFloat(s.percentage) >= 60 && (
                              <StatusBadge status="shortlisted" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
                <p className="text-foreground/60">No submissions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerDashboard;