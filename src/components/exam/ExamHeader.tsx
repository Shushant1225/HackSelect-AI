import { Camera, AlertTriangle, Clock, Maximize, Minimize, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamHeaderProps {
  webcamActive: boolean;
  violations: string[];
  timeLeft: number;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  formatTime: (s: number) => string;
}

/**
 * Top bar for the exam page showing webcam status, timer, violations, and fullscreen toggle.
 */
export const ExamHeader = ({
  webcamActive, violations, timeLeft, isFullscreen,
  onToggleFullscreen, formatTime,
}: ExamHeaderProps) => (
  <header className="bg-card border-b border-border px-4 md:px-6 py-2.5">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      {/* Left: Branding */}
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
          <Shield className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="hidden sm:block">
          <span className="font-semibold text-sm">HackSelect AI</span>
          <span className="text-xs text-muted-foreground ml-2">Proctored Exam</span>
        </div>
      </div>

      {/* Right: Status indicators */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Webcam indicator */}
        <div className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs",
          webcamActive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}>
          <Camera className="h-3.5 w-3.5" />
          <span className="hidden sm:inline font-medium">{webcamActive ? "Live" : "Off"}</span>
          {webcamActive && <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />}
        </div>

        {/* Violations */}
        {violations.length > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-warning/10">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            <span className="text-xs font-semibold text-warning">{violations.length}</span>
          </div>
        )}

        {/* Timer */}
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm transition-colors",
          timeLeft < 300
            ? "bg-destructive/10 text-destructive animate-pulse"
            : timeLeft < 600
            ? "bg-warning/10 text-warning"
            : "bg-muted text-foreground"
        )}>
          <Clock className="h-4 w-4" />
          {formatTime(timeLeft)}
        </div>

        {/* Fullscreen toggle */}
        <button
          onClick={onToggleFullscreen}
          className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </button>
      </div>
    </div>
  </header>
);
