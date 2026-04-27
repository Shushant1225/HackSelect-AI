import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockSubmissions } from "@/data/mock";
import { Trophy, Download, Award, Star } from "lucide-react";
import { toast } from "sonner";

const ShortlistedPage = () => {
  const shortlisted = mockSubmissions
    .filter((s) => s.isShortlisted)
    .sort((a, b) => (b.score / b.totalMarks) - (a.score / a.totalMarks));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl gradient-accent flex items-center justify-center">
              <Trophy className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Shortlisted Candidates</h2>
              <p className="text-muted-foreground text-sm">Top performers who made the cut</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success("Shortlist exported!")}>
            <Download className="h-4 w-4 mr-2" /> Export List
          </Button>
        </div>

        {/* Top 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {shortlisted.slice(0, 3).map((s, i) => {
            const pct = Math.round((s.score / s.totalMarks) * 100);
            const medals = ["🥇", "🥈", "🥉"];
            const gradients = ["gradient-primary", "gradient-accent", "bg-muted"];
            return (
              <Card key={s.id} className="shadow-card border-border/50 text-center overflow-hidden">
                <div className={`${i < 2 ? gradients[i] : gradients[2]} p-4`}>
                  <span className="text-3xl">{medals[i]}</span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-sm">{s.candidateName}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.hackathonName}</p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                    <span className="text-lg font-bold">{pct}%</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{s.score}/{s.totalMarks} marks</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Full table */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{shortlisted.length} Candidates Shortlisted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Rank", "Candidate", "Hackathon", "Score", "Progress", "Violations", "Status"].map((h) => (
                      <th key={h} className="text-left py-2.5 px-3 font-medium text-[11px] text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shortlisted.map((s, i) => {
                    const pct = Math.round((s.score / s.totalMarks) * 100);
                    return (
                      <tr key={s.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3">
                          {i < 3 ? <span className="text-lg">{["🥇", "🥈", "🥉"][i]}</span> : <span className="font-bold text-primary">#{i + 1}</span>}
                        </td>
                        <td className="py-2.5 px-3 font-medium">{s.candidateName}</td>
                        <td className="py-2.5 px-3 text-muted-foreground text-xs">{s.hackathonName}</td>
                        <td className="py-2.5 px-3 font-semibold">{s.score}/{s.totalMarks}</td>
                        <td className="py-2.5 px-3 w-28">
                          <div className="flex items-center gap-2">
                            <Progress value={pct} className="h-1.5 flex-1" />
                            <span className="text-[11px] text-muted-foreground">{pct}%</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          {s.violations === 0
                            ? <span className="text-success text-xs">Clean</span>
                            : <span className="text-warning font-semibold">{s.violations}</span>}
                        </td>
                        <td className="py-2.5 px-3"><StatusBadge status="shortlisted" /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ShortlistedPage;
