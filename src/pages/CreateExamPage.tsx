import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Save, Send, FileText, Clock, Target, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionForm {
  id: string;
  type: "mcq" | "coding" | "theoretical";
  text: string;
  options: string[];
  correctAnswer: string;
  marks: number;
}

const CreateExamPage = () => {
  const [hackathonName, setHackathonName] = useState("");
  const [description, setDescription] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [duration, setDuration] = useState(60);
  const [passingScore, setPassingScore] = useState(50);
  const [questions, setQuestions] = useState<QuestionForm[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: `q-${Date.now()}`, type: "mcq", text: "", options: ["", "", "", ""], correctAnswer: "", marks: 5 },
    ]);
  };

  const updateQuestion = (index: number, updates: Partial<QuestionForm>) => {
    setQuestions(questions.map((q, i) => (i === index ? { ...q, ...updates } : q)));
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  const handlePublish = () => {
    if (!hackathonName || questions.length === 0) {
      toast.error("Please fill in hackathon name and add at least one question.");
      return;
    }
    toast.success("Hackathon exam published successfully!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold">Create New Exam</h2>
          <p className="text-muted-foreground text-sm">Set up a hackathon screening test</p>
        </div>

        {/* Summary strip */}
        <div className="flex flex-wrap gap-3">
          {[
            { icon: FileText, label: "Questions", value: questions.length },
            { icon: Target, label: "Total Marks", value: totalMarks },
            { icon: Clock, label: "Duration", value: `${duration} min` },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border/50">
              <item.icon className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">{item.label}:</span>
              <span className="text-sm font-semibold">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Hackathon details */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Hackathon Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Hackathon Name</Label>
                <Input placeholder="e.g., CodeStorm 2025" value={hackathonName} onChange={(e) => setHackathonName(e.target.value)} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Eligibility</Label>
                <Input placeholder="e.g., Open to all students" value={eligibility} onChange={(e) => setEligibility(e.target.value)} className="h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Description</Label>
              <Textarea placeholder="Describe your hackathon..." value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[80px]" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Duration (minutes)</Label>
                <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Passing Score</Label>
                <Input type="number" value={passingScore} onChange={(e) => setPassingScore(Number(e.target.value))} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Total Marks (auto)</Label>
                <Input value={totalMarks} disabled className="h-10 bg-muted/50" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Questions ({questions.length})</CardTitle>
            <Button size="sm" onClick={addQuestion} className="gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" /> Add Question
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.length === 0 && (
              <div className="text-center py-16 rounded-xl border-2 border-dashed border-border">
                <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No questions yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Click "Add Question" to get started</p>
              </div>
            )}
            {questions.map((q, qi) => (
              <div key={q.id} className="p-4 rounded-xl border border-border/50 space-y-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground/40" />
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Q{qi + 1}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeQuestion(qi)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-xs">Question Text</Label>
                    <Textarea placeholder="Enter your question..." value={q.text} onChange={(e) => updateQuestion(qi, { text: e.target.value })} className="min-h-[80px]" />
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Type</Label>
                      <Select value={q.type} onValueChange={(v) => updateQuestion(qi, { type: v as QuestionForm["type"] })}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">MCQ</SelectItem>
                          <SelectItem value="coding">Coding</SelectItem>
                          <SelectItem value="theoretical">Theoretical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Marks</Label>
                      <Input type="number" value={q.marks} onChange={(e) => updateQuestion(qi, { marks: Number(e.target.value) })} className="h-9" />
                    </div>
                  </div>
                </div>
                {q.type === "mcq" && (
                  <div className="space-y-3 pt-2 border-t border-border/50">
                    <Label className="text-xs">Options</Label>
                    <div className="grid md:grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground w-5">{["A", "B", "C", "D"][oi]}</span>
                          <Input placeholder={`Option ${oi + 1}`} value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)} className="h-9" />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Correct Answer</Label>
                      <Select value={q.correctAnswer} onValueChange={(v) => updateQuestion(qi, { correctAnswer: v })}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="Select correct option" /></SelectTrigger>
                        <SelectContent>
                          {q.options.filter(Boolean).map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pb-6">
          <Button variant="outline" onClick={() => toast.success("Exam saved as draft.")}>
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
          <Button className="gradient-primary text-primary-foreground" onClick={handlePublish}>
            <Send className="h-4 w-4 mr-2" /> Publish Exam
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateExamPage;
