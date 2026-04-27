import { cn } from "@/lib/utils";

type StatusType = "passed" | "failed" | "shortlisted" | "suspicious" | "draft" | "published" | "completed" | "pending" | "active" | "closed" | "submitted";

const statusConfig: Record<string, { bg: string; dot: string }> = {
  passed:      { bg: "bg-success/10 text-success border-success/20",           dot: "bg-success" },
  failed:      { bg: "bg-destructive/10 text-destructive border-destructive/20", dot: "bg-destructive" },
  shortlisted: { bg: "bg-primary/10 text-primary border-primary/20",           dot: "bg-primary" },
  suspicious:  { bg: "bg-warning/10 text-warning border-warning/20",           dot: "bg-warning" },
  draft:       { bg: "bg-muted text-muted-foreground border-border",           dot: "bg-muted-foreground" },
  published:   { bg: "bg-success/10 text-success border-success/20",           dot: "bg-success" },
  completed:   { bg: "bg-info/10 text-info border-info/20",                    dot: "bg-info" },
  pending:     { bg: "bg-warning/10 text-warning border-warning/20",           dot: "bg-warning" },
  // ✅ Added: extra statuses that come from the API in uppercase (lowercased at lookup)
  active:      { bg: "bg-success/10 text-success border-success/20",           dot: "bg-success" },
  closed:      { bg: "bg-muted text-muted-foreground border-border",           dot: "bg-muted-foreground" },
  submitted:   { bg: "bg-info/10 text-info border-info/20",                    dot: "bg-info" },
};

// ✅ Fallback config for any unknown status value
const fallbackConfig = { bg: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" };

export const StatusBadge = ({ status }: { status: string }) => {
  // ✅ Lowercase the incoming status so "PUBLISHED" matches "published" etc.
  const key = status?.toLowerCase() ?? "";
  const config = statusConfig[key] ?? fallbackConfig;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize",
      config.bg
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {key}
    </span>
  );
};