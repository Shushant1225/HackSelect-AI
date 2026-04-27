import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.dashboardStats.deleteMany();
  await prisma.webcamSession.deleteMany();
  await prisma.proctoringViolation.deleteMany();
  await prisma.proctoringLog.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.question.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@hackathon.com",
      password: hashedPassword,
      name: "Admin User",
      role: "ADMIN",
      phone: "+91-9999999999",
      college: "IIT Delhi",
    },
  });

  const organizer = await prisma.user.create({
    data: {
      email: "organizer@hackathon.com",
      password: hashedPassword,
      name: "Event Organizer",
      role: "ORGANIZER",
      phone: "+91-9999999998",
      college: "IIT Mumbai",
    },
  });

  const proctor1 = await prisma.user.create({
    data: {
      email: "proctor1@hackathon.com",
      password: hashedPassword,
      name: "Proctor One",
      role: "PROCTOR",
      phone: "+91-9999999997",
      college: "IIT Bombay",
    },
  });

  const proctor2 = await prisma.user.create({
    data: {
      email: "proctor2@hackathon.com",
      password: hashedPassword,
      name: "Proctor Two",
      role: "PROCTOR",
      phone: "+91-9999999996",
      college: "NIT Trichy",
    },
  });

  // Create students
  const students = [];
  for (let i = 1; i <= 10; i++) {
    const student = await prisma.user.create({
      data: {
        email: `student${i}@hackathon.com`,
        password: hashedPassword,
        name: `Student ${i}`,
        role: "STUDENT",
        phone: `+91-999999999${String(i).padStart(1, "0")}`,
        college: ["IIT Delhi", "IIT Mumbai", "NIT Trichy", "BITS Pilani"][i % 4],
      },
    });
    students.push(student);
  }

  console.log("✅ Users created");

  // Create exams
  const currentTime = new Date();
  const startTime = new Date(currentTime.getTime() - 6 * 60 * 60 * 1000);
  const endTime = new Date(currentTime.getTime() + 1 * 60 * 60 * 1000);

  const exam1 = await prisma.exam.create({
    data: {
      title: "JavaScript Fundamentals",
      description: "Test your JavaScript knowledge",
      subject: "Web Development",
      totalQuestions: 20,
      duration: 60,
      totalMarks: 100,
      passingMarks: 40,
      status: "PUBLISHED",
      enableProctoring: true,
      enableWebcam: true,
      enableScreenShare: false,
      createdBy: organizer.id,
      startTime: startTime,
      endTime: endTime,
    },
  });

  const exam2 = await prisma.exam.create({
    data: {
      title: "React & TypeScript",
      description: "Advanced React concepts with TypeScript",
      subject: "Frontend Development",
      totalQuestions: 25,
      duration: 90,
      totalMarks: 150,
      passingMarks: 60,
      status: "PUBLISHED",
      enableProctoring: true,
      enableWebcam: true,
      enableScreenShare: false,
      createdBy: organizer.id,
      startTime: startTime,
      endTime: endTime,
    },
  });

  const exam3 = await prisma.exam.create({
    data: {
      title: "Data Structures & Algorithms",
      description: "DSA fundamentals and problem solving",
      subject: "Computer Science",
      totalQuestions: 30,
      duration: 120,
      totalMarks: 200,
      passingMarks: 80,
      status: "PUBLISHED",
      enableProctoring: true,
      enableWebcam: true,
      enableScreenShare: true,
      createdBy: organizer.id,
      startTime: startTime,
      endTime: endTime,
    },
  });

  console.log("✅ Exams created");

  // Create questions for exam1
  const questionsExam1 = [
    {
      questionText: "What is JavaScript?",
      questionType: "MCQ",
      marks: 5,
      difficulty: "EASY",
      options: JSON.stringify([
        "A programming language",
        "A styling language",
        "A markup language",
        "A database",
      ]),
      correctAnswer: "A programming language",
    },
    {
      questionText: "Which of the following is NOT a JavaScript data type?",
      questionType: "MCQ",
      marks: 5,
      difficulty: "EASY",
      options: JSON.stringify(["String", "Number", "Boolean", "Document"]),
      correctAnswer: "Document",
    },
    {
      questionText: "What does 'let' keyword do?",
      questionType: "MCQ",
      marks: 5,
      difficulty: "MEDIUM",
      options: JSON.stringify([
        "Declares a block-scoped variable",
        "Declares a global variable",
        "Declares a function",
        "None of the above",
      ]),
      correctAnswer: "Declares a block-scoped variable",
    },
    {
      questionText: "Explain the difference between var, let, and const.",
      questionType: "SHORT_ANSWER",
      marks: 10,
      difficulty: "MEDIUM",
      correctAnswer: "var is function-scoped, let and const are block-scoped",
    },
    {
      questionText:
        "What is the difference between == and === in JavaScript?",
      questionType: "MCQ",
      marks: 5,
      difficulty: "MEDIUM",
      options: JSON.stringify([
        "No difference",
        "== checks type, === doesn't",
        "=== checks type, == doesn't",
        "Both check type but === is faster",
      ]),
      correctAnswer: "=== checks type, == doesn't",
    },
    {
      questionText: "What is a closure in JavaScript?",
      questionType: "SHORT_ANSWER",
      marks: 15,
      difficulty: "HARD",
      correctAnswer:
        "A function that has access to variables from its outer scope",
    },
    {
      questionText: "Promise.all() will reject if any promise rejects.",
      questionType: "MCQ",
      marks: 5,
      difficulty: "MEDIUM",
      options: JSON.stringify(["True", "False"]),
      correctAnswer: "True",
    },
    {
      questionText: "What is the output of console.log(typeof NaN)?",
      questionType: "MCQ",
      marks: 5,
      difficulty: "MEDIUM",
      options: JSON.stringify(["'number'", "'NaN'", "'undefined'", "'object'"]),
      correctAnswer: "'number'",
    },
  ];

  for (const q of questionsExam1) {
    await prisma.question.create({
      data: {
        examId: exam1.id,
        ...q,
      },
    });
  }

  // Create questions for exam2
  const questionsExam2 = [
    {
      questionText: "What is React?",
      questionType: "MCQ",
      marks: 5,
      difficulty: "EASY",
      options: JSON.stringify([
        "A JavaScript library for UI",
        "A database",
        "A backend framework",
        "A design tool",
      ]),
      correctAnswer: "A JavaScript library for UI",
    },
    {
      questionText:
        "What is the primary purpose of React hooks like useState?",
      questionType: "MCQ",
      marks: 5,
      difficulty: "MEDIUM",
      options: JSON.stringify([
        "To manage state in functional components",
        "To style components",
        "To make HTTP requests",
        "To route pages",
      ]),
      correctAnswer: "To manage state in functional components",
    },
    {
      questionText: "Explain the Virtual DOM in React.",
      questionType: "SHORT_ANSWER",
      marks: 15,
      difficulty: "HARD",
      correctAnswer:
        "An in-memory representation of real DOM that React uses for efficient updates",
    },
    {
      questionText: "What is TypeScript?",
      questionType: "MCQ",
      marks: 5,
      difficulty: "EASY",
      options: JSON.stringify([
        "A superset of JavaScript with type safety",
        "A replacement for JavaScript",
        "A styling language",
        "A database language",
      ]),
      correctAnswer: "A superset of JavaScript with type safety",
    },
    {
      questionText: "What are generics in TypeScript?",
      questionType: "SHORT_ANSWER",
      marks: 10,
      difficulty: "MEDIUM",
      correctAnswer: "Generic types allow creating reusable components with type safety",
    },
  ];

  for (const q of questionsExam2) {
    await prisma.question.create({
      data: {
        examId: exam2.id,
        ...q,
      },
    });
  }

  // Create questions for exam3
  const questionsExam3 = [
    {
      questionText: "What is Time Complexity?",
      questionType: "SHORT_ANSWER",
      marks: 10,
      difficulty: "MEDIUM",
      correctAnswer:
        "The amount of time taken by an algorithm to run as a function of input size",
    },
    {
      questionText: "What is the time complexity of binary search?",
      questionType: "MCQ",
      marks: 5,
      difficulty: "EASY",
      options: JSON.stringify(["O(n)", "O(log n)", "O(n²)", "O(1)"]),
      correctAnswer: "O(log n)",
    },
    {
      questionText:
        "Explain the difference between array and linked list.",
      questionType: "SHORT_ANSWER",
      marks: 15,
      difficulty: "MEDIUM",
      correctAnswer:
        "Arrays have contiguous memory and O(1) access, linked lists have scattered memory and O(n) access",
    },
    {
      questionText: "What is a hash table?",
      questionType: "SHORT_ANSWER",
      marks: 10,
      difficulty: "MEDIUM",
      correctAnswer:
        "A data structure that implements an associative array using hash functions",
    },
    {
      questionText: "What sorting algorithm has worst case O(n²) but average O(n log n)?",
      questionType: "MCQ",
      marks: 5,
      difficulty: "MEDIUM",
      options: JSON.stringify(["Bubble Sort", "Quick Sort", "Merge Sort", "Heap Sort"]),
      correctAnswer: "Quick Sort",
    },
  ];

  for (const q of questionsExam3) {
    await prisma.question.create({
      data: {
        examId: exam3.id,
        ...q,
      },
    });
  }

  console.log("✅ Questions created");

  // Create submissions and answers for some students
  for (let i = 0; i < 5; i++) {
    const submission = await prisma.submission.create({
      data: {
        studentId: students[i].id,
        examId: exam1.id,
        status: "SUBMITTED",
        totalMarks: 100,
        obtainedMarks: 60 + Math.random() * 30,
        percentage: 60 + Math.random() * 30,
        submittedAt: new Date(),
      },
    });

    // Create some answers
    const questions = await prisma.question.findMany({
      where: { examId: exam1.id },
      take: 5,
    });

    for (const question of questions) {
      await prisma.answer.create({
        data: {
          questionId: question.id,
          submissionId: submission.id,
          answer:
            question.correctAnswer ||
            `Student answer for question ${question.id}`,
          isCorrect: Math.random() > 0.3,
          marksObtained: Math.random() > 0.3 ? question.marks : 0,
        },
      });
    }

    // Create proctoring violations
    if (i % 2 === 0) {
      await prisma.proctoringViolation.create({
        data: {
          submissionId: submission.id,
          violationType: "TAB_SWITCH",
          message: "Tab switch detected",
          severity: "MEDIUM",
        },
      });
    }

    if (i % 3 === 0) {
      await prisma.proctoringViolation.create({
        data: {
          submissionId: submission.id,
          violationType: "FACE_NOT_DETECTED",
          message: "Face moved out of frame",
          severity: "HIGH",
        },
      });
    }
  }

  console.log("✅ Submissions created");

  // Create proctoring logs
  for (let i = 0; i < 10; i++) {
    await prisma.proctoringLog.create({
      data: {
        examId: exam1.id,
        studentId: students[i % students.length].id,
        action: ["LOGIN", "LOGOUT", "VIOLATION", "FACE_DETECTION_CHANGE"][
          Math.floor(Math.random() * 4)
        ],
        details: JSON.stringify({
          timestamp: new Date(),
          details: "Sample proctoring log entry",
        }),
      },
    });
  }

  console.log("✅ Proctoring logs created");

  // Create webcam sessions
  for (let i = 0; i < 5; i++) {
    await prisma.webcamSession.create({
      data: {
        userId: students[i].id,
        startTime: new Date(currentTime.getTime() - 30 * 60 * 1000),
        endTime: new Date(),
        frameCount: Math.floor(Math.random() * 1000) + 500,
        faceDetected: Math.random() > 0.2,
        faceCount: Math.floor(Math.random() * 3),
      },
    });
  }

  console.log("✅ Webcam sessions created");

  // Create dashboard stats
  await prisma.dashboardStats.create({
    data: {
      totalStudents: students.length,
      totalExams: 3,
      totalSubmissions: 5,
      totalViolations: 8,
    },
  });

  console.log("✅ Dashboard stats created");
  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
