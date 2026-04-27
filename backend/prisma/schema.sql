-- Hackathon Select Pro - Database Schema
-- This file creates all necessary tables for the application

CREATE TABLE `User` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `avatar` VARCHAR(191),
  `role` ENUM('STUDENT', 'PROCTOR', 'ADMIN', 'ORGANIZER') NOT NULL DEFAULT 'STUDENT',
  `phone` VARCHAR(191),
  `college` VARCHAR(191),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `email_idx` (`email`),
  INDEX `role_idx` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Exam` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `title` VARCHAR(191) NOT NULL,
  `description` LONGTEXT,
  `subject` VARCHAR(191) NOT NULL,
  `totalQuestions` INT NOT NULL,
  `duration` INT NOT NULL,
  `totalMarks` INT NOT NULL,
  `passingMarks` INT,
  `status` ENUM('DRAFT', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
  `enableProctoring` BOOLEAN NOT NULL DEFAULT true,
  `enableWebcam` BOOLEAN NOT NULL DEFAULT true,
  `enableScreenShare` BOOLEAN NOT NULL DEFAULT true,
  `createdBy` VARCHAR(191) NOT NULL,
  `startTime` DATETIME(3) NOT NULL,
  `endTime` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `status_idx` (`status`),
  INDEX `createdBy_idx` (`createdBy`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Question` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `examId` VARCHAR(191) NOT NULL,
  `questionText` LONGTEXT NOT NULL,
  `questionType` VARCHAR(191) NOT NULL,
  `marks` INT NOT NULL,
  `negativeMarks` INT NOT NULL DEFAULT 0,
  `difficulty` VARCHAR(191) NOT NULL,
  `options` JSON,
  `correctAnswer` VARCHAR(191),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `examId_idx` (`examId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Submission` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `studentId` VARCHAR(191) NOT NULL,
  `examId` VARCHAR(191) NOT NULL,
  `status` ENUM('IN_PROGRESS', 'SUBMITTED', 'EVALUATED', 'REJECTED') NOT NULL DEFAULT 'IN_PROGRESS',
  `totalMarks` INT,
  `obtainedMarks` INT,
  `percentage` FLOAT,
  `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `submittedAt` DATETIME(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE KEY `studentId_examId_unique` (`studentId`, `examId`),
  FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `examId_idx` (`examId`),
  INDEX `status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Answer` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `questionId` VARCHAR(191) NOT NULL,
  `submissionId` VARCHAR(191) NOT NULL,
  `answer` LONGTEXT,
  `marksObtained` INT,
  `isCorrect` BOOLEAN,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE KEY `questionId_submissionId_unique` (`questionId`, `submissionId`),
  FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`submissionId`) REFERENCES `Submission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `submissionId_idx` (`submissionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ProctoringViolation` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `submissionId` VARCHAR(191) NOT NULL,
  `violationType` ENUM('FULLSCREEN_EXIT', 'TAB_SWITCH', 'FACE_NOT_DETECTED', 'MULTIPLE_FACES', 'COPY_PASTE_ATTEMPT', 'RIGHT_CLICK', 'CONTEXT_MENU') NOT NULL,
  `message` VARCHAR(191) NOT NULL,
  `severity` VARCHAR(191) NOT NULL,
  `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (`submissionId`) REFERENCES `Submission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `submissionId_idx` (`submissionId`),
  INDEX `violationType_idx` (`violationType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ProctoringLog` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `examId` VARCHAR(191) NOT NULL,
  `studentId` VARCHAR(191) NOT NULL,
  `action` VARCHAR(191) NOT NULL,
  `details` JSON,
  `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `examId_idx` (`examId`),
  INDEX `studentId_idx` (`studentId`),
  INDEX `timestamp_idx` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `WebcamSession` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(191) NOT NULL,
  `submissionId` VARCHAR(191),
  `startTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endTime` DATETIME(3),
  `frameCount` INT NOT NULL DEFAULT 0,
  `lastFrameUrl` VARCHAR(191),
  `faceDetected` BOOLEAN NOT NULL DEFAULT false,
  `faceCount` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`submissionId`) REFERENCES `Submission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `userId_idx` (`userId`),
  INDEX `submissionId_idx` (`submissionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `DashboardStats` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `totalStudents` INT NOT NULL DEFAULT 0,
  `totalExams` INT NOT NULL DEFAULT 0,
  `totalSubmissions` INT NOT NULL DEFAULT 0,
  `totalViolations` INT NOT NULL DEFAULT 0,
  `updatedAt` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
