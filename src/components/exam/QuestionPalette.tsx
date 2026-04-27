import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Question } from "@/data/mock";
import { WebcamPreview } from "./WebcamPreview";

interface QuestionPaletteProps {
  questions: Question[];
  currentQ: number;
  answers: Record<string, string>;
  onSelectQuestion: (index: number) => void;
  webcamActive: boolean;
  onFaceAlert: (msg: string) => void;
}

/**
 * Side panel showing question navigation palette and webcam preview.
 */
export const QuestionPalette = ({
  questions, currentQ, answers, onSelectQuestion,
  webcamActive, onFaceAlert,
}: QuestionPaletteProps) => (
  <div className="hidden lg:flex flex-col gap-4 w-52 shrink-0">
    {/* Webcam preview */}
    <WebcamPreview active={webcamActive} onFaceAlert={onFaceAlert} />

    {/* Question palette */}
    <Card className="shadow-card sticky top-6">
      <CardContent className="p-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Questions
        </h4>
        <div className="grid grid-cols-4 gap-1.5">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(i)}
              className={cn(
                "h-9 w-9 rounded-lg text-xs font-semibold transition-all",
                currentQ === i
                  ? "gradient-primary text-primary-foreground shadow-sm scale-105"
                  : answers[q.id]
                  ? "bg-success/15 text-success border border-success/25 hover:bg-success/25"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-border space-y-1.5">
          {[
            { color: "gradient-primary", label: "Current" },
            { color: "bg-success/20 border border-success/30", label: "Answered" },
            { color: "bg-muted", label: "Unanswered" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <div className={cn("h-3 w-3 rounded", item.color)} />
              {item.label}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
