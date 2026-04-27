import express, { Router, Request, Response } from "express";
import { prisma, authenticate, AuthRequest } from "../index.js";

const router: Router = express.Router();

// ─── EXISTING ENDPOINTS (unchanged) ───────────────────────────────────────────

// Log violation
router.post("/violations", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { submissionId, violationType, message, severity } = req.body;
    const violation = await prisma.proctoringViolation.create({
      data: { submissionId, violationType, message, severity: severity || "MEDIUM" },
    });
    res.status(201).json(violation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get violations for submission
router.get("/violations/:submissionId", async (req: Request, res: Response) => {
  try {
    const violations = await prisma.proctoringViolation.findMany({
      where: { submissionId: req.params.submissionId },
      orderBy: { timestamp: "desc" },
    });
    res.json(violations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Log proctoring action
router.post("/logs", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { examId, action, details } = req.body;
    const log = await prisma.proctoringLog.create({
      data: {
        examId,
        studentId: req.userId || "",
        action,
        details: details ? JSON.stringify(details) : null,
      },
    });
    res.status(201).json(log);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get proctoring logs
router.get("/logs/:examId", async (req: Request, res: Response) => {
  try {
    const logs = await prisma.proctoringLog.findMany({
      where: { examId: req.params.examId },
      include: { student: { select: { id: true, name: true, email: true } } },
      orderBy: { timestamp: "desc" },
    });
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create webcam session
router.post("/webcam/session", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { submissionId } = req.body;
    const session = await prisma.webcamSession.create({
      data: { userId: req.userId || "", submissionId },
    });
    res.status(201).json(session);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update webcam session
router.put("/webcam/session/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { faceDetected, faceCount, frameCount, lastFrameUrl } = req.body;
    const session = await prisma.webcamSession.update({
      where: { id: req.params.id },
      data: {
        faceDetected,
        faceCount,
        frameCount: frameCount ? { increment: frameCount } : undefined,
        lastFrameUrl,
        updatedAt: new Date(),
      },
    });
    res.json(session);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// End webcam session
router.put("/webcam/session/:id/end", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const session = await prisma.webcamSession.update({
      where: { id: req.params.id },
      data: { endTime: new Date() },
    });
    res.json(session);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get webcam sessions
router.get("/webcam/sessions/:submissionId", async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.webcamSession.findMany({
      where: { submissionId: req.params.submissionId },
      orderBy: { startTime: "desc" },
    });
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// ─── NEW ENDPOINTS FOR LIVE PROCTORING ────────────────────────────────────────

// 1. Student starts exam → create/reset a proctor session
router.post("/session/start", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { examId, studentName, examName } = req.body;

    // If session already exists for this student+exam, reset it
    const existing = await prisma.proctorSession.findFirst({
      where: { studentId: req.userId || "", examId },
    });

    if (existing) {
      const updated = await prisma.proctorSession.update({
        where: { id: existing.id },
        data: {
          isActive: true,
          tabSwitches: 0,
          fullscreenExit: 0,
          copyPaste: 0,
          rightClicks: 0,
          riskScore: 0,
          snapshotBase64: null,
          startTime: new Date(),
          lastEventAt: new Date(),
        },
      });
      return res.status(200).json(updated);
    }

    const session = await prisma.proctorSession.create({
      data: {
        studentId: req.userId || "",
        examId,
        studentName: studentName || "Unknown",
        examName: examName || "Unknown",
      },
    });

    res.status(201).json(session);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Student sends violation event or webcam snapshot
router.post("/session/event", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { examId, eventType, snapshotBase64 } = req.body;
    // eventType: "TAB_SWITCH" | "FULLSCREEN_EXIT" | "COPY_PASTE" | "RIGHT_CLICK" | "SNAPSHOT"

    const session = await prisma.proctorSession.findFirst({
      where: { studentId: req.userId || "", examId, isActive: true },
    });

    if (!session) {
      return res.status(404).json({ message: "Active session not found" });
    }

    // Build update data based on event type
    const updateData: any = { lastEventAt: new Date() };

    if (eventType === "TAB_SWITCH")      updateData.tabSwitches    = session.tabSwitches + 1;
    if (eventType === "FULLSCREEN_EXIT") updateData.fullscreenExit = session.fullscreenExit + 1;
    if (eventType === "COPY_PASTE")      updateData.copyPaste      = session.copyPaste + 1;
    if (eventType === "RIGHT_CLICK")     updateData.rightClicks    = session.rightClicks + 1;
    if (snapshotBase64)                  updateData.snapshotBase64 = snapshotBase64;

    // Calculate risk score (simple formula, easy to explain in viva)
    const tabSwitches    = updateData.tabSwitches    ?? session.tabSwitches;
    const fullscreenExit = updateData.fullscreenExit ?? session.fullscreenExit;
    const copyPaste      = updateData.copyPaste      ?? session.copyPaste;
    const rightClicks    = updateData.rightClicks    ?? session.rightClicks;

    updateData.riskScore = Math.min(
      100,
      tabSwitches * 15 + fullscreenExit * 10 + copyPaste * 10 + rightClicks * 5
    );

    const updated = await prisma.proctorSession.update({
      where: { id: session.id },
      data: updateData,
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Student ends exam → mark session inactive
router.post("/session/end", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { examId } = req.body;
    const session = await prisma.proctorSession.findFirst({
      where: { studentId: req.userId || "", examId, isActive: true },
    });
    if (!session) return res.status(404).json({ message: "Session not found" });

    const updated = await prisma.proctorSession.update({
      where: { id: session.id },
      data: { isActive: false },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Admin fetches all active proctor sessions (live monitoring)
router.get("/admin/live", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await prisma.proctorSession.findMany({
      where: { isActive: true },
      orderBy: { lastEventAt: "desc" },
    });
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// 5. Admin fetches all sessions (including ended) for history
router.get("/admin/sessions", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await prisma.proctorSession.findMany({
      orderBy: { startTime: "desc" },
      take: 50,
    });
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;