-- CreateTable
CREATE TABLE "ProctorSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tabSwitches" INTEGER NOT NULL DEFAULT 0,
    "fullscreenExit" INTEGER NOT NULL DEFAULT 0,
    "copyPaste" INTEGER NOT NULL DEFAULT 0,
    "rightClicks" INTEGER NOT NULL DEFAULT 0,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "snapshotBase64" TEXT,
    "lastEventAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
