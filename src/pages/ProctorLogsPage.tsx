import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockProctorLogs } from "@/data/mock";
import { AlertTriangle, Monitor, Copy, Users, Mouse, Search, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, typeof Monitor> = {
  tab_switch: Monitor,
  fullscreen_exit: Monitor,
  copy_paste: Copy,
  multiple_faces: Users,
  right_click: Mouse,
};

const severityMap: Record<string, string> = {
  tab_switch: "bg-warning/10 text-warning",
  fullscreen_exit: "bg-destructive/10 text-destructive",
  copy_paste: "bg-warning/10 text-warning",
  multiple_faces: "bg-destructive/10 text-destructive",
  right_click: "bg-muted text-muted-foreground",
};

const ProctorLogsPage = () => {
  const [search, setSearch] = useState("");
  const filtered = mockProctorLogs.filter(
    (log) =>
      log.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      log.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-warning/10 flex items-center justify-center">
            <ShieldAlert className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Proctor Logs</h2>
            <p className="text-muted-foreground text-sm">Suspicious activity monitoring</p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Total Alerts", value: mockProctorLogs.length, color: "text-warning" },
            { label: "Tab Switches", value: mockProctorLogs.filter((l) => l.type === "tab_switch").length, color: "text-warning" },
            { label: "Multi-Face", value: mockProctorLogs.filter((l) => l.type === "multiple_faces").length, color: "text-destructive" },
            { label: "Copy/Paste", value: mockProctorLogs.filter((l) => l.type === "copy_paste").length, color: "text-muted-foreground" },
          ].map((stat) => (
            <div key={stat.label} className="px-3 py-2 rounded-xl bg-muted/50 border border-border/50">
              <span className="text-xs text-muted-foreground">{stat.label}: </span>
              <span className={cn("text-sm font-bold", stat.color)}>{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search logs..." className="pl-9 h-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{filtered.length} Alerts Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {filtered.map((log) => {
                const Icon = iconMap[log.type] || AlertTriangle;
                return (
                  <div key={log.id} className="flex items-start gap-3 p-3.5 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                    <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", severityMap[log.type] || "bg-muted")}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-sm">{log.candidateName}</p>
                        <StatusBadge status="suspicious" />
                      </div>
                      <p className="text-xs text-muted-foreground">{log.message}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className={cn(
                      "text-[10px] px-2 py-1 rounded-full font-medium capitalize whitespace-nowrap",
                      severityMap[log.type] || "bg-muted text-muted-foreground"
                    )}>
                      {log.type.replace("_", " ")}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProctorLogsPage;
