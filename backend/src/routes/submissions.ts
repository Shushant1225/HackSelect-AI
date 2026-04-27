import express, { Router, Request, Response } from "express";
import { prisma, authenticate, AuthRequest } from "../index.js";

const router: Router = express.Router();

// Get submissions for current user
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const submissions = await prisma.submission.findMany({
      where: { studentId: req.userId },
      include: {
        exam: true,
        answers: true,
        violations: true,
      },
      orderBy: { startedAt: "desc" },
    });

    res.json(submissions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get submission by ID
router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
      include: {
        exam: {
          include: { questions: true },
        },
        answers: true,
        violations: true,
      },
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Check authorization
    if (submission.studentId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(submission);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create submission
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { examId } = req.body;

    // Check if already submitted
    const existing = await prisma.submission.findUnique({
      where: {
        studentId_examId: {
          studentId: req.userId || "",
          examId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Already submitted for this exam" });
    }

    const submission = await prisma.submission.create({
      data: {
        studentId: req.userId || "",
        examId,
      },
    });

    res.status(201).json(submission);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update answer
router.post("/:id/answers", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { questionId, answer } = req.body;

    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.studentId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const existingAnswer = await prisma.answer.findUnique({
      where: {
        questionId_submissionId: {
          questionId,
          submissionId: req.params.id,
        },
      },
    });

    let result;
    if (existingAnswer) {
      result = await prisma.answer.update({
        where: { id: existingAnswer.id },
        data: { answer },
      });
    } else {
      result = await prisma.answer.create({
        data: {
          questionId,
          submissionId: req.params.id,
          answer,
        },
      });
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Submit exam
router.post("/:id/submit", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.studentId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Calculate marks
    const answers = await prisma.answer.findMany({
      where: { submissionId: req.params.id },
      include: { question: true },
    });

    let totalMarks = 0;
    const exam = await prisma.exam.findUnique({
      where: { id: submission.examId },
    });

    for (const answer of answers) {
      if (answer.isCorrect === null) {
        answer.isCorrect =
          answer.answer?.trim() === answer.question.correctAnswer?.trim();
      }

      if (answer.isCorrect) {
        totalMarks += answer.question.marks;
      }
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id: req.params.id },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
        totalMarks: exam?.totalMarks || 100,
        obtainedMarks: totalMarks,
        percentage: ((totalMarks / (exam?.totalMarks || 100)) * 100).toFixed(2) as any,
      },
    });

    res.json(updatedSubmission);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get results
router.get("/:id/results", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
      include: {
        exam: true,
        answers: {
          include: { question: true },
        },
        violations: true,
      },
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.studentId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(submission);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
