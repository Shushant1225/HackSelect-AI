import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  iconColor?: string;
}

export const StatCard = ({ title, value, icon: Icon, description, trend, iconColor }: StatCardProps) => (
  <Card className="card-hover shadow-sm hover:shadow-lg relative overflow-hidden border border-foreground/10 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm group animate-slide-up">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-accent/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <CardContent className="p-6 relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground mb-2">{value}</p>
        </div>
        <div className={cn(
          "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md",
          iconColor || "gradient-primary"
        )}>
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
      
      {description && (
        <p className="text-sm text-foreground/70 mb-3">{description}</p>
      )}
      
      {trend && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200 w-fit">
          <TrendingUp className="h-4 w-4 text-green-600 font-semibold" />
          <span className="text-sm font-semibold text-green-700">{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);
