import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockHackathons, mockSubmissions, mockProctorLogs, mockUsers } from "@/data/mock";
import { Trophy, Users, FileText, AlertTriangle, BarChart3, Shield, ArrowRight, Activity, Eye, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import apiCall from "@/api";

// ─── Live Monitoring Tab ───────────────────────────────────────────────────────

const getRiskLevel = (score: number): { label: string; color: string } => {
  if (score >= 70) return { label: "High",   color: "bg-red-100 text-red-700 border-red-300" };
  if (score >= 30) return { label: "Medium", color: "bg-yellow-100 text-yellow-700 border-yellow-300" };
  return             { label: "Low",    color: "bg-green-100 text-green-700 border-green-300" };
};

const LiveMonitoring = () => {
  const [sessions, setSessions]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState<any | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchSessions = async () => {
    try {
      const data = await apiCall("/proctoring/admin/live");
      setSessions(Array.isArray(data) ? data : []);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Failed to fetch live sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 15 seconds
  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading live sessions...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-semibold text-green-700">
            {sessions.length} student{sessions.length !== 1 ? "s" : ""} currently active
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Last refreshed: {lastRefresh.toLocaleTimeString()}
          </span>
          <Button size="sm" variant="outline" onClick={fetchSessions} className="flex items-center gap-1">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Eye className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No students are currently attempting any exam.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Sessions list */}
          <div className="lg:col-span-2 space-y-3">
            {sessions.map((s) => {
              const risk = getRiskLevel(s.riskScore);
              const duration = Math.floor(
                (new Date().getTime() - new Date(s.startTime).getTime()) / 60000
              );
              return (
                <Card
                  key={s.id}
                  className={`cursor-pointer transition-all border-2 ${
                    selected?.id === s.id ? "border-primary" : "border-border hover:border-primary/40"
                  }`}
                  onClick={() => setSelected(s)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm truncate">{s.studentName}</p>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${risk.color}`}>
                            {risk.label} Risk
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 truncate">{s.examName}</p>

                        {/* Event counters */}
                        <div className="flex flex-wrap gap-2 text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-semibold">
                            📑 Tab Switch: {s.tabSwitches}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">
                            🖥️ Fullscreen Exit: {s.fullscreenExit}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-semibold">
                            📋 Copy/Paste: {s.copyPaste}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold">
                            🖱️ Right Click: {s.rightClicks}
                          </span>
                        </div>
                      </div>

                      {/* Risk score circle */}
                      <div className="shrink-0 text-center">
                        <div className={`h-14 w-14 rounded-full flex flex-col items-center justify-center border-2 ${risk.color}`}>
                          <span className="text-lg font-bold leading-none">{s.riskScore}</span>
                          <span className="text-[9px] font-medium">RISK</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">{duration}m ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="space-y-3">
            {selected ? (
              <>
                {/* Webcam snapshot */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Latest Snapshot</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selected.snapshotBase64 ? (
                      <img
                        src={selected.snapshotBase64}
                        alt="Student webcam snapshot"
                        className="w-full rounded-lg border border-border object-cover"
                      />
                    ) : (
                      <div className="w-full h-36 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">
                        No snapshot yet
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-2 text-center">
                      Snapshots captured every 30 seconds
                    </p>
                  </CardContent>
                </Card>

                {/* Activity summary */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Activity Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Student</span>
                      <span className="font-semibold">{selected.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exam</span>
                      <span className="font-semibold truncate max-w-[120px]">{selected.examName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start Time</span>
                      <span className="font-semibold">
                        {new Date(selected.startTime).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk Score</span>
                      <span className={`font-bold ${
                        selected.riskScore >= 70 ? "text-red-600" :
                        selected.riskScore >= 30 ? "text-yellow-600" : "text-green-600"
                      }`}>{selected.riskScore}/100</span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tab Switches</span>
                      <span className="font-semibold text-orange-600">{selected.tabSwitches}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fullscreen Exits</span>
                      <span className="font-semibold text-blue-600">{selected.fullscreenExit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Copy/Paste</span>
                      <span className="font-semibold text-purple-600">{selected.copyPaste}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Right Clicks</span>
                      <span className="font-semibold text-gray-600">{selected.rightClicks}</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground text-sm">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  Click a student card to see details & snapshot
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Admin Dashboard ──────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "live">("overview");

  const totalCandidates  = mockUsers.filter((u) => u.role === "candidate").length;
  const totalHackathons  = mockHackathons.length;
  const totalSubmissions = mockSubmissions.length;
  const avgScore         = Math.round(mockSubmissions.reduce((a, s) => a + (s.score / s.totalMarks) * 100, 0) / mockSubmissions.length);
  const shortlisted      = mockSubmissions.filter((s) => s.isShortlisted).length;
  const suspiciousCount  = mockProctorLogs.length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Admin Dashboard</h1>
            <p className="text-foreground/70">Platform overview, monitoring, and performance metrics</p>
          </div>
          <Button className="gradient-primary text-primary-foreground btn-glow" asChild>
            <Link to="/admin/analytics" className="flex items-center gap-2">
              <Activity className="h-5 w-5" /> View Analytics
            </Link>
          </Button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 border-b border-border pb-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("live")}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "live"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Live Monitoring
          </button>
        </div>

        {/* Overview tab */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard title="Hackathons"    value={totalHackathons}  icon={Trophy}        description="Total registered hackathons"   trend="+12% this month"       iconColor="gradient-primary" />
              <StatCard title="Candidates"    value={totalCandidates}  icon={Users}         description="Total registered candidates"   trend="+28% this quarter"     iconColor="bg-gradient-to-br from-cyan-500 to-blue-500" />
              <StatCard title="Submissions"   value={totalSubmissions} icon={FileText}      description="Exam submissions received"     trend="+5% from last week"    iconColor="bg-gradient-to-br from-purple-500 to-pink-500" />
              <StatCard title="Average Score" value={`${avgScore}%`}   icon={BarChart3}     description="Average candidate performance" trend="+5% from last month"   iconColor="bg-gradient-to-br from-green-500 to-emerald-500" />
              <StatCard title="Shortlisted"   value={shortlisted}      icon={Shield}        description={`Out of ${totalSubmissions} submissions`} trend={`${Math.round((shortlisted / totalSubmissions) * 100)}% success rate`} iconColor="bg-gradient-to-br from-amber-500 to-orange-500" />
              <StatCard title="Proctor Alerts" value={suspiciousCount} icon={AlertTriangle} description="Suspicious activities detected" trend="Requires review"       iconColor="bg-gradient-to-br from-red-500 to-pink-500" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Hackathons */}
              <Card className="card-hover shadow-sm hover:shadow-lg border border-foreground/10 bg-white/80 backdrop-blur-sm animate-slide-up">
                <CardHeader className="pb-4 border-b border-foreground/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">Recent Hackathons</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5" asChild>
                      <Link to="/admin/hackathons" className="flex items-center gap-1">
                        View All <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {mockHackathons.map((h, idx) => (
                      <div
                        key={h.id}
                        className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white/50 to-blue-50/50 hover:from-blue-50 hover:to-green-50 border border-foreground/5 hover:border-primary/20 transition-all duration-300 animate-slide-up"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{h.name}</p>
                          <p className="text-xs text-foreground/60 mt-1">{h.organizerName} · <span className="font-medium">{h.candidatesCount}</span> candidates</p>
                        </div>
                        <StatusBadge status={h.status} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Suspicious Activities */}
              <Card className="card-hover shadow-sm hover:shadow-lg border border-foreground/10 bg-white/80 backdrop-blur-sm animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <CardHeader className="pb-4 border-b border-foreground/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">Suspicious Activities</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5" asChild>
                      <Link to="/admin/proctor-logs" className="flex items-center gap-1">
                        View All <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {mockProctorLogs.slice(0, 5).map((log, idx) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-red-50/50 to-orange-50/50 hover:from-red-50 hover:to-red-50 border border-red-200/50 hover:border-red-300 transition-all duration-300 animate-slide-up group"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-foreground">{log.candidateName}</p>
                            <StatusBadge status="suspicious" />
                          </div>
                          <p className="text-xs text-foreground/60">{log.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Live Monitoring tab */}
        {activeTab === "live" && <LiveMonitoring />}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;