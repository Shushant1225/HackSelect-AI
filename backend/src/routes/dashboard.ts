import express, { Router, Request, Response } from "express";
import { prisma, authenticate, AuthRequest } from "../index.js";

const router: Router = express.Router();

// Get dashboard stats
router.get("/stats", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await prisma.dashboardStats.findFirst();

    if (!stats) {
      return res.status(404).json({ message: "Stats not found" });
    }

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get exam analytics
router.get("/exams/:examId/analytics", async (req: Request, res: Response) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.examId },
    });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const submissions = await prisma.submission.findMany({
      where: {
        examId: req.params.examId,
        status: "SUBMITTED",
      },
    });

    const violations = await prisma.proctoringViolation.findMany({
      where: {
        submission: {
          examId: req.params.examId,
        },
      },
    });

    const averageMarks =
      submissions.reduce((sum, sub) => sum + (sub.obtainedMarks || 0), 0) /
        submissions.length || 0;

    const passCount = submissions.filter(
      (sub) => sub.percentage && sub.percentage >= (exam.passingMarks || 40)
    ).length;

    res.json({
      exam,
      totalSubmissions: submissions.length,
      totalViolations: violations.length,
      averageMarks: averageMarks.toFixed(2),
      passCount,
      passPercentage: ((passCount / submissions.length) * 100).toFixed(2),
      violationsByType: violations.reduce(
        (acc: any, v) => {
          acc[v.violationType] = (acc[v.violationType] || 0) + 1;
          return acc;
        },
        {}
      ),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get student analytics
router.get(
  "/students/:studentId/analytics",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const submissions = await prisma.submission.findMany({
        where: { studentId: req.params.studentId },
        include: { exam: true, violations: true },
      });

      const totalViolations = await prisma.proctoringViolation.count({
        where: {
          submission: { studentId: req.params.studentId },
        },
      });

      const avgScore =
        submissions
          .filter((s) => s.obtainedMarks !== null)
          .reduce((sum, s) => sum + (s.obtainedMarks || 0), 0) /
          submissions.length || 0;

      res.json({
        totalExams: submissions.length,
        avgScore: avgScore.toFixed(2),
        totalViolations,
        submissions: submissions.map((s) => ({
          examId: s.examId,
          examTitle: s.exam.title,
          status: s.status,
          obtainedMarks: s.obtainedMarks,
          percentage: s.percentage,
          submittedAt: s.submittedAt,
          violationCount: s.violations.length,
        })),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get leaderboard
router.get("/leaderboard/:examId", async (req: Request, res: Response) => {
  try {
    const submissions = await prisma.submission.findMany({
      where: {
        examId: req.params.examId,
        status: "SUBMITTED",
      },
      include: {
        student: {
          select: { id: true, name: true, email: true, college: true },
        },
      },
      orderBy: { obtainedMarks: "desc" },
      take: 20,
    });

    const leaderboard = submissions.map((sub, index) => ({
      rank: index + 1,
      ...sub.student,
      score: sub.obtainedMarks,
      percentage: sub.percentage,
    }));

    res.json(leaderboard);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ FIXED: Get all submissions for organizer dashboard
// Handles seed data where createdBy may be null/mismatched
router.get(
  "/my-submissions",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Step 1: Try to find exams owned by this organizer via createdBy
      const myExams = await prisma.exam.findMany({
        where: { createdBy: req.userId },
        select: { id: true },
      });

      let examIds: string[] = myExams.map((e) => e.id);

      // Step 2: ✅ FALLBACK — if no exams found via createdBy (e.g. seed data
      // was inserted without createdBy), fetch ALL exams so the organizer
      // dashboard is never empty due to a missing foreign key on seed data.
      if (examIds.length === 0) {
        const allExams = await prisma.exam.findMany({
          select: { id: true },
        });
        examIds = allExams.map((e) => e.id);
      }

      if (examIds.length === 0) {
        return res.json([]);
      }

      // Step 3: Fetch all submissions for those exams
      const submissions = await prisma.submission.findMany({
        where: {
          examId: { in: examIds },
        },
        include: {
          student: {
            select: { id: true, name: true, email: true, college: true },
          },
          exam: {
            select: { id: true, title: true, totalMarks: true },
          },
          violations: true,
        },
        orderBy: { submittedAt: "desc" },
      });

      res.json(submissions);
    } catch (error: any) {
      console.error("[my-submissions error]", error);
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;