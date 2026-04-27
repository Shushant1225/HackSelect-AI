import express, { Router, Request, Response } from "express";
import { prisma, authenticate, AuthRequest } from "../index.js";

const router: Router = express.Router();

// Get all exams
router.get("/", async (req: Request, res: Response) => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        _count: {
          select: { questions: true, submissions: true },
        },
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { startTime: "desc" },
    });

    res.json(exams);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get exam by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id },
      include: {
        questions: true,
        creator: true,
        _count: {
          select: { submissions: true },
        },
      },
    });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json(exam);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create exam
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      subject,
      totalQuestions,
      duration,
      totalMarks,
      passingMarks,
      enableProctoring,
      enableWebcam,
      enableScreenShare,
      startTime,
      endTime,
    } = req.body;

    const exam = await prisma.exam.create({
      data: {
        title,
        description,
        subject,
        totalQuestions,
        duration,
        totalMarks,
        passingMarks,
        enableProctoring,
        enableWebcam,
        enableScreenShare,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        createdBy: req.userId || "",
      },
    });

    res.status(201).json(exam);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update exam
router.put("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const exam = await prisma.exam.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(exam);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get questions for an exam
router.get("/:id/questions", async (req: Request, res: Response) => {
  try {
    const questions = await prisma.question.findMany({
      where: { examId: req.params.id },
    });

    res.json(questions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Add question to exam
router.post("/:id/questions", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { questionText, questionType, marks, difficulty, options, correctAnswer } = req.body;

    const question = await prisma.question.create({
      data: {
        examId: req.params.id,
        questionText,
        questionType,
        marks,
        difficulty,
        options: options ? JSON.stringify(options) : null,
        correctAnswer,
      },
    });

    res.status(201).json(question);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
