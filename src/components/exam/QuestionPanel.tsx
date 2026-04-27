import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuestionPanelProps {
  question: any;
  currentIndex: number;
  answer: string | undefined;
  onAnswer: (value: string) => void;
}

/**
 * Displays a single exam question with MCQ options or text area for short answers.
 */
export const QuestionPanel = ({ question, currentIndex, answer, onAnswer }: QuestionPanelProps) => {
  // ✅ FIX 3: options is stored as a JSON string in DB — parse it before rendering
  const parsedOptions: string[] = (() => {
    if (!question.options) return [];
    if (Array.isArray(question.options)) return question.options;
    try {
      return JSON.parse(question.options);
    } catch {
      return [];
    }
  })();

  // ✅ FIX 2: questionType from DB is "MCQ" / "SHORT_ANSWER", not "mcq" / "theoretical"
  const isMCQ = question.questionType === "MCQ";
  const isText = question.questionType === "SHORT_ANSWER" || question.questionType === "CODING";

  return (
    <Card className="shadow-card border-border/50">
      <CardContent className="p-5 md:p-6">
        {/* Question meta */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold capitalize">
            {question.questionType?.toLowerCase().replace("_", " ")}
          </span>
          <span className="text-xs text-muted-foreground">{question.marks} marks</span>
          {question.difficulty && (
            <span className={cn(
              "text-xs px-2.5 py-1 rounded-full font-semibold ml-auto",
              question.difficulty === "EASY" && "bg-green-100 text-green-700",
              question.difficulty === "MEDIUM" && "bg-yellow-100 text-yellow-700",
              question.difficulty === "HARD" && "bg-red-100 text-red-700",
            )}>
              {question.difficulty}
            </span>
          )}
        </div>

        {/* ✅ FIX 1: was question.text — correct field is question.questionText */}
        <h3 className="text-base md:text-lg font-medium mb-6 leading-relaxed">
          <span className="text-primary font-bold mr-2">Q{currentIndex + 1}.</span>
          {question.questionText}
        </h3>

        {/* MCQ options */}
        {isMCQ && parsedOptions.length > 0 && (
          <div className="space-y-2.5">
            {parsedOptions.map((opt, i) => {
              const letters = ["A", "B", "C", "D", "E"];
              const isSelected = answer === opt;
              return (
                <button
                  key={i}
                  onClick={() => onAnswer(opt)}
                  className={cn(
                    "w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center gap-3 group",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/30 hover:bg-muted/30"
                  )}
                >
                  <span className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                    isSelected
                      ? "gradient-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}>
                    {letters[i]}
                  </span>
                  <span className="text-sm">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Short answer / Coding text area */}
        {isText && (
          <textarea
            className={cn(
              "w-full p-4 rounded-xl border border-border bg-background resize-none",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "text-sm leading-relaxed",
              question.questionType === "CODING" ? "font-mono h-48" : "h-40"
            )}
            placeholder={
              question.questionType === "CODING"
                ? "// Write your code here..."
                : "Write your answer here..."
            }
            value={answer || ""}
            onChange={(e) => onAnswer(e.target.value)}
          />
        )}
      </CardContent>
    </Card>
  );
};