import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  AlertTriangle, Eye, ChevronLeft, ChevronRight, Send, ShieldAlert,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { QuestionPanel } from "@/components/exam/QuestionPanel";
import { QuestionPalette } from "@/components/exam/QuestionPalette";
import { examsAPI, submissionsAPI } from "@/api";
import apiCall from "@/api";
import { useAuth } from "@/context/AuthContext";

const ExamPage = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Exam data
  const [questions, setQuestions]       = useState<any[]>([]);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [examData, setExamData]         = useState<any>(null);
  const [loadingExam, setLoadingExam]   = useState(true);

  // Webcam refs
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Exam state
  const [currentQ, setCurrentQ]                 = useState(0);
  const [answers, setAnswers]                   = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft]                 = useState(3600);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [violations, setViolations]             = useState<string[]>([]);
  const [webcamActive, setWebcamActive]         = useState(false);
  const [examStarted, setExamStarted]           = useState(false);
  const [isFullscreen, setIsFullscreen]         = useState(false);

  // ─── Load exam ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadExam = async () => {
      if (!hackathonId) return;
      try {
        setLoadingExam(true);
        const qs  = await examsAPI.getQuestions(hackathonId);
        setQuestions(Array.isArray(qs) ? qs : []);
        const sub = await submissionsAPI.create(hackathonId);
        if (sub?.id) setSubmissionId(sub.id);
        const ed  = await examsAPI.getById(hackathonId);
        setExamData(ed);
        if (ed?.duration) setTimeLeft(ed.duration * 60);
      } catch (error) {
        console.error("Failed to load exam:", error);
        toast.error("Failed to load exam questions. Please try again.");
      } finally {
        setLoadingExam(false);
      }
    };
    loadExam();
  }, [hackathonId]);

  // ─── Send proctoring event to backend ─────────────────────────────────────
  const sendEvent = useCallback(async (eventType: string, snapshotBase64?: string) => {
    if (!hackathonId) return;
    try {
      await apiCall("/proctoring/session/event", {
        method: "POST",
        body: { examId: hackathonId, eventType, snapshotBase64 },
      });
    } catch (err) {
      console.error("Failed to send proctor event:", err);
    }
  }, [hackathonId]);

  // ─── Capture snapshot from webcam ─────────────────────────────────────────
  const captureSnapshot = useCallback(() => {
    if (!webcamRef.current || !canvasRef.current) return;
    const video  = webcamRef.current;
    const canvas = canvasRef.current;
    canvas.width  = video.videoWidth  || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/jpeg", 0.5);
    sendEvent("SNAPSHOT", base64);
  }, [sendEvent]);

  // ─── Start webcam ──────────────────────────────────────────────────────────
  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        webcamRef.current.play();
      }
      setWebcamActive(true);
    } catch (err) {
      console.warn("Webcam not available:", err);
      setWebcamActive(false);
    }
  }, []);

  const stopWebcam = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setWebcamActive(false);
  }, []);

  // ─── Snapshot every 30 seconds ────────────────────────────────────────────
  useEffect(() => {
    if (!examStarted) return;
    const interval = setInterval(captureSnapshot, 30000);
    return () => clearInterval(interval);
  }, [examStarted, captureSnapshot]);

  // ─── Fullscreen ────────────────────────────────────────────────────────────
  const enterFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    setIsFullscreen(true);
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    setIsFullscreen(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) exitFullscreen();
    else enterFullscreen();
  }, [enterFullscreen, exitFullscreen]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ─── Fullscreen exit violation ─────────────────────────────────────────────
  useEffect(() => {
    if (!examStarted) return;
    const handler = () => {
      if (!document.fullscreenElement) {
        const msg = "Fullscreen exited at " + new Date().toLocaleTimeString();
        setViolations((prev) => [...prev, msg]);
        toast.warning("⚠️ Fullscreen exit detected!");
        sendEvent("FULLSCREEN_EXIT");
      }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [examStarted, sendEvent]);

  // ─── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!examStarted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(interval); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examStarted]);

  // ─── Tab switch ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!examStarted) return;
    const handler = () => {
      if (document.hidden) {
        const msg = "Tab switch detected at " + new Date().toLocaleTimeString();
        setViolations((prev) => [...prev, msg]);
        toast.warning("⚠️ Tab switch detected! This has been logged.");
        sendEvent("TAB_SWITCH");
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [examStarted, sendEvent]);

  // ─── Right-click & copy/paste ──────────────────────────────────────────────
  useEffect(() => {
    if (!examStarted) return;
    const handleContext = (e: MouseEvent) => {
      e.preventDefault();
      setViolations((prev) => [...prev, "Right-click at " + new Date().toLocaleTimeString()]);
      toast.warning("⚠️ Right-click is disabled during the exam.");
      sendEvent("RIGHT_CLICK");
    };
    const handleClipboard = (e: ClipboardEvent) => {
      e.preventDefault();
      setViolations((prev) => [...prev, "Copy/paste at " + new Date().toLocaleTimeString()]);
      toast.warning("⚠️ Copy/paste is disabled during the exam.");
      sendEvent("COPY_PASTE");
    };
    document.addEventListener("contextmenu", handleContext);
    document.addEventListener("copy", handleClipboard);
    document.addEventListener("paste", handleClipboard);
    return () => {
      document.removeEventListener("contextmenu", handleContext);
      document.removeEventListener("copy", handleClipboard);
      document.removeEventListener("paste", handleClipboard);
    };
  }, [examStarted, sendEvent]);

  // ─── Save answer ───────────────────────────────────────────────────────────
  const handleAnswer = useCallback(async (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (submissionId) {
      try {
        await submissionsAPI.updateAnswer(submissionId, questionId, value);
      } catch (err) {
        console.error("Failed to save answer:", err);
      }
    }
  }, [submissionId]);

  // ─── Submit exam ───────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    exitFullscreen();
    stopWebcam();
    try {
      if (submissionId) await submissionsAPI.submit(submissionId);
      if (hackathonId) {
        await apiCall("/proctoring/session/end", {
          method: "POST",
          body: { examId: hackathonId },
        });
      }
      toast.success("Exam submitted successfully! Redirecting to results...");
      setTimeout(() => navigate("/candidate/results"), 1500);
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Failed to submit exam. Please try again.");
    }
  }, [navigate, exitFullscreen, stopWebcam, submissionId, hackathonId]);

  const handleFaceAlert = useCallback((msg: string) => {
    setViolations((prev) => [...prev, msg + " at " + new Date().toLocaleTimeString()]);
    toast.warning("⚠️ " + msg);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // ─── Start exam ────────────────────────────────────────────────────────────
  const startExam = async () => {
    setShowInstructions(false);
    setExamStarted(true);
    enterFullscreen();
    await startWebcam();

    // Create proctor session on backend
    if (hackathonId) {
      try {
        await apiCall("/proctoring/session/start", {
          method: "POST",
          body: {
            examId: hackathonId,
            studentName: user?.name || "Unknown",
            examName: examData?.title || "Unknown",
          },
        });
        setTimeout(captureSnapshot, 5000); // first snapshot after 5s
      } catch (err) {
        console.error("Failed to create proctor session:", err);
      }
    }
  };

  const answered = Object.keys(answers).length;
  const progress  = questions.length > 0 ? (answered / questions.length) * 100 : 0;

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loadingExam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-3">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading exam questions...</p>
        </div>
      </div>
    );
  }

  // ─── No questions ──────────────────────────────────────────────────────────
  if (!loadingExam && questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="max-w-md w-full shadow-elevated">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-5xl">📭</div>
            <h2 className="text-xl font-bold">No Questions Found</h2>
            <p className="text-muted-foreground text-sm">This exam has no questions yet. Please contact the organizer.</p>
            <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Instructions ──────────────────────────────────────────────────────────
  if (showInstructions) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
        <Card className="max-w-2xl w-full shadow-elevated animate-slide-up">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Eye className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Exam Instructions</h1>
              <p className="text-muted-foreground mt-1">Please read carefully before starting</p>
            </div>
            <div className="space-y-2.5 mb-8">
              {[
                { text: "This is a proctored exam. Your webcam will be monitored by AI.", icon: "🎥" },
                { text: "The exam will enter fullscreen mode. Do not exit.", icon: "🖥️" },
                { text: "Do not switch tabs or leave the exam window.", icon: "🚫" },
                { text: "AI face detection is active — only one person allowed.", icon: "🤖" },
                { text: "Right-click and copy/paste are disabled.", icon: "⌨️" },
                { text: "Timer auto-submits when time runs out.", icon: "⏱️" },
                { text: "All suspicious activities are logged and reported.", icon: "📋" },
                { text: `Total: ${questions.length} questions | Duration: ${Math.floor(timeLeft / 60)} minutes`, icon: "📝" },
              ].map((inst, i) => (
                <div key={i} className="flex gap-3 items-center p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
                  <span className="text-lg shrink-0">{inst.icon}</span>
                  <p className="text-sm">{inst.text}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <Button className="w-full gradient-primary text-primary-foreground h-12 text-base" onClick={startExam}>
                <ShieldAlert className="h-5 w-5 mr-2" /> I Understand — Start Exam
              </Button>
              <p className="text-[11px] text-center text-muted-foreground">
                By clicking start, you agree to be monitored during the exam
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQ];

  // ─── Exam screen ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col select-none">
      {/* Hidden canvas for snapshot */}
      <canvas ref={canvasRef} className="hidden" />

      <ExamHeader
        webcamActive={webcamActive}
        violations={violations}
        timeLeft={timeLeft}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        formatTime={formatTime}
      />

      <div className="flex-1 flex max-w-7xl mx-auto w-full p-4 md:p-6 gap-4 md:gap-6">
        <div className="flex-1 space-y-4 md:space-y-5">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{answered} of {questions.length} answered</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {question && (
            <QuestionPanel
              question={question}
              currentIndex={currentQ}
              answer={answers[question.id]}
              onAnswer={(val) => handleAnswer(question.id, val)}
            />
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            {currentQ < questions.length - 1 ? (
              <Button onClick={() => setCurrentQ(currentQ + 1)}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button className="gradient-primary text-primary-foreground" onClick={() => setShowSubmitDialog(true)}>
                <Send className="h-4 w-4 mr-1" /> Submit Exam
              </Button>
            )}
          </div>

          {violations.length > 0 && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                <span className="text-xs font-semibold text-destructive">
                  {violations.length} Violation{violations.length > 1 ? "s" : ""} Logged
                </span>
              </div>
              <div className="max-h-20 overflow-y-auto space-y-1">
                {violations.slice(-3).map((v, i) => (
                  <p key={i} className="text-[11px] text-muted-foreground">• {v}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4">
          
          <video ref={webcamRef} autoPlay muted playsInline style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }} />

          <QuestionPalette
            questions={questions}
            currentQ={currentQ}
            answers={answers}
            onSelectQuestion={setCurrentQ}
            webcamActive={webcamActive}
            onFaceAlert={handleFaceAlert}
          />
        </div>
      </div>

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Exam?</DialogTitle>
            <DialogDescription>
              You have answered {answered} out of {questions.length} questions.
              {answered < questions.length && " Some questions are still unanswered."}
              {" "}This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Go Back</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={handleSubmit}>Confirm Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamPage;