import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockHackathons, mockSubmissions, mockProctorLogs, mockUsers } from "@/data/mock";
import { Trophy, Users, FileText, AlertTriangle, BarChart3, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const AnalyticsPage = () => {
  const totalCandidates = mockUsers.filter((u) => u.role === "candidate").length;

  const scoreDistribution = [
    { range: "0-20", count: 0 },
    { range: "21-40", count: 0 },
    { range: "41-60", count: 2 },
    { range: "61-80", count: 1 },
    { range: "81-100", count: 3 },
  ];

  const statusData = [
    { name: "Passed", value: mockSubmissions.filter((s) => s.status === "passed").length, color: "hsl(160, 84%, 39%)" },
    { name: "Failed", value: mockSubmissions.filter((s) => s.status === "failed").length, color: "hsl(0, 72%, 51%)" },
  ];

  const hackathonPerformance = mockHackathons.map((h) => {
    const subs = mockSubmissions.filter((s) => s.hackathonId === h.id);
    const avgScore = subs.length > 0 ? Math.round(subs.reduce((a, s) => a + (s.score / s.totalMarks) * 100, 0) / subs.length) : 0;
    return { name: h.name.substring(0, 12), candidates: h.candidatesCount, avgScore };
  });

  // Trend data
  const trendData = [
    { month: "Jan", candidates: 12, exams: 2 },
    { month: "Feb", candidates: 28, exams: 3 },
    { month: "Mar", candidates: 42, exams: 5 },
    { month: "Apr", candidates: 55, exams: 6 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground text-sm">Platform-wide performance insights</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Hackathons" value={mockHackathons.length} icon={Trophy} />
          <StatCard title="Candidates" value={totalCandidates} icon={Users} />
          <StatCard title="Submissions" value={mockSubmissions.length} icon={FileText} />
          <StatCard title="Avg Score" value="72%" icon={BarChart3} trend="+5% this month" />
          <StatCard title="Shortlisted" value={mockSubmissions.filter((s) => s.isShortlisted).length} icon={TrendingUp} iconColor="gradient-accent" />
          <StatCard title="Proctor Alerts" value={mockProctorLogs.length} icon={AlertTriangle} iconColor="bg-warning" description="Total violations" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Growth trend */}
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: "0.75rem", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="candidates" fill="hsl(234, 85%, 55%)" fillOpacity={0.1} stroke="hsl(234, 85%, 55%)" strokeWidth={2} />
                  <Area type="monotone" dataKey="exams" fill="hsl(160, 84%, 39%)" fillOpacity={0.1} stroke="hsl(160, 84%, 39%)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Score distribution */}
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                  <XAxis dataKey="range" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: "0.75rem", fontSize: "12px" }} />
                  <Bar dataKey="count" fill="hsl(234, 85%, 55%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pass/Fail */}
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Pass vs Fail</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "0.75rem", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Hackathon performance */}
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Hackathon Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={hackathonPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: "0.75rem", fontSize: "12px" }} />
                  <Bar dataKey="candidates" fill="hsl(234, 85%, 55%)" name="Candidates" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="avgScore" fill="hsl(160, 84%, 39%)" name="Avg Score %" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
