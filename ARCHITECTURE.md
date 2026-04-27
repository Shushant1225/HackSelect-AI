# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         HACKATHON SELECT PRO                     │
│                      Full-Stack Application                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│   USER BROWSER INTERFACE     │
│  (React + TypeScript + UI)   │
│                              │
│  ├─ Landing Page            │
│  ├─ Login/Signup            │
│  ├─ Student Dashboard       │
│  ├─ Exam Page               │
│  │  └─ Real Webcam Feed     │
│  ├─ Results Page            │
│  ├─ Admin Dashboard         │
│  └─ Proctor Logs            │
└──────────────────────────────┘
           │
           │ HTTP/REST + JWT Token
           │ (axios/fetch)
           ▼
┌──────────────────────────────────────────┐
│      Express.js REST API Server          │
│      (Node.js + TypeScript)              │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ Authentication Routes              │ │
│  │ • POST /auth/login                 │ │
│  │ • POST /auth/register              │ │
│  │ • GET /auth/me                     │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ Exam Routes                        │ │
│  │ • GET /exams                       │ │
│  │ • GET /exams/:id                   │ │
│  │ • GET /exams/:id/questions         │ │
│  │ • POST /exams (admin)              │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ Submission Routes                  │ │
│  │ • POST /submissions (start)        │ │
│  │ • POST /submissions/:id/answers    │ │
│  │ • POST /submissions/:id/submit     │ │
│  │ • GET /submissions/:id/results     │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ Proctoring Routes                  │ │
│  │ • POST /proctoring/violations      │ │
│  │ • POST /proctoring/webcam/session  │ │
│  │ • PUT /proctoring/webcam/:id       │ │
│  │ • GET /proctoring/logs/:examId     │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ Dashboard Routes                   │ │
│  │ • GET /dashboard/stats             │ │
│  │ • GET /dashboard/exams/:id/analytics│
│  │ • GET /dashboard/leaderboard/:id   │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
           │
           │ SQL Queries (Prisma ORM)
           │ (Type-safe JavaScript)
           ▼
┌──────────────────────────────────────────┐
│        MySQL Database                    │
│   (localhost:3306 or Docker)             │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ user                               │ │
│  │ • id, email, password, name        │ │
│  │ • role, college, phone             │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ exam                               │ │
│  │ • id, title, duration, totalMarks  │ │
│  │ • startTime, endTime               │ │
│  │ • enableProctoring, enableWebcam   │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ question                           │ │
│  │ • id, examId, questionText         │ │
│  │ • marks, difficulty, options       │ │
│  │ • correctAnswer                    │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ submission                         │ │
│  │ • id, studentId, examId            │ │
│  │ • status, obtainedMarks, percentage│ │
│  │ • startedAt, submittedAt           │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ answer                             │ │
│  │ • id, questionId, submissionId     │ │
│  │ • answer, isCorrect, marksObtained │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ proctoringViolation                │ │
│  │ • id, submissionId, violationType  │ │
│  │ • message, severity, timestamp     │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ proctoringLog                      │ │
│  │ • id, examId, studentId, action    │ │
│  │ • details, timestamp               │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ webcamSession                      │ │
│  │ • id, userId, submissionId         │ │
│  │ • startTime, endTime, frameCount   │ │
│  │ • faceDetected, faceCount          │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## Data Flow: Taking an Exam

```
┌─────────────────┐
│  Student Login  │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ Frontend requests        │
│ GET /api/exams           │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Backend queries DB       │
│ SELECT * FROM exam       │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Display Exams            │
│ Student picks exam       │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Request camera access    │
│ navigator.mediaDevices   │
│ .getUserMedia()          │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Create submission        │
│ POST /api/submissions    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Get Questions            │
│ GET /api/exams/:id/q     │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Display Exam with        │
│ • Questions              │
│ • Answer inputs          │
│ • Live webcam feed       │
│ • Proctoring status      │
└────────┬─────────────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌────────┐ ┌─────────────────────┐
│ Answer │ │ Log proctoring data │
│ ▼      │ │ • Face detection    │
│ ▼      │ │ • Tab switches      │
│ ...    │ │ • Violations        │
│        │ │ POST /proctoring... │
└────┬───┘ └─────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ Save each answer             │
│ POST /api/submissions/:id/   │
│     answers                  │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ Backend stores answer in DB  │
│ INSERT INTO answer           │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ Student submits exam         │
│ POST /api/submissions/:id/   │
│     submit                   │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ Backend calculates marks     │
│ Compare answers with keys    │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ Update submission in DB      │
│ UPDATE submission SET status │
│ = 'SUBMITTED'                │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ Return results to frontend   │
│ Score, violations, feedback  │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ Display results page         │
│ • Marks obtained             │
│ • Percentage                 │
│ • Violations logged          │
│ • Time taken                 │
└──────────────────────────────┘
```

---

## Webcam Proctoring Flow

```
┌─────────────────────────────────────────┐
│  Student Starts Exam                    │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Request Camera Permission               │
│  navigator.mediaDevices.getUserMedia()  │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
    Permission          Permission
    Granted             Denied
        │                   │
        ▼                   ▼
    ┌───────┐           ┌────────────┐
    │ Start │           │ Show Error │
    │ Exam  │           │ Cannot see │
    └───┬───┘           │ webcam     │
        │               └────────────┘
        ▼
  ┌──────────────────────────────┐
  │ WebcamPreview Component      │
  │                              │
  │ <video autoPlay playsInline  │
  │   ref={videoRef} />          │
  │                              │
  │ Shows:                       │
  │ • Live camera feed           │
  │ • REC indicator              │
  │ • Face detection status      │
  │ • Proctored badge            │
  └──────────────────────────────┘
        │
        ├─────────┬─────────┬─────────┐
        │         │         │         │
        ▼         ▼         ▼         ▼
   ┌────────┐ ┌──────┐ ┌──────┐ ┌──────────┐
   │ Face   │ │ Tab  │ │Full- │ │ Copy/    │
   │ Check  │ │Switch│ │screen│ │ Paste    │
   │        │ │      │ │Exit  │ │ Attempt  │
   └───┬────┘ └──┬───┘ └──┬───┘ └────┬─────┘
       │         │        │          │
       ├─────────┴────────┴──────────┤
       │                             │
       ▼                             ▼
   ┌──────────────────┐      ┌──────────────────┐
   │ No Violation     │      │ Violation        │
   │ Continue exam    │      │ Detected         │
   └──────────────────┘      │                  │
                             └────────┬─────────┘
                                      │
                                      ▼
                            ┌──────────────────────┐
                            │ POST /api/proctoring/│
                            │ violations           │
                            │                      │
                            │ Save violation:      │
                            │ • Type               │
                            │ • Timestamp          │
                            │ • Severity           │
                            │ • Details            │
                            └────────┬─────────────┘
                                     │
                                     ▼
                            ┌──────────────────────┐
                            │ Store in Database    │
                            │ INSERT INTO          │
                            │ proctoringViolation  │
                            └────────┬─────────────┘
                                     │
                                     ▼
                            ┌──────────────────────┐
                            │ Display Alert        │
                            │ to Student           │
                            │ "Violation logged"   │
                            └──────────────────────┘
```

---

## Role-Based Access Control

```
┌─────────────────────────────────────────────────────────────┐
│                    RBAC Matrix                              │
├─────────────────────────────────────────────────────────────┤
│ Action          │ Student │ Proctor │ Organizer │ Admin     │
├─────────────────────────────────────────────────────────────┤
│ Take Exam       │   ✓     │    ✗    │    ✗      │    ✗      │
│ Create Exam     │   ✗     │    ✗    │    ✓      │    ✓      │
│ Edit Exam       │   ✗     │    ✗    │    ✓      │    ✓      │
│ View Results    │   ✓*    │    ✓**  │    ✓      │    ✓      │
│ View Analytics  │   ✗     │    ✓    │    ✓      │    ✓      │
│ View Violations │   ✓*    │    ✓**  │    ✓      │    ✓      │
│ Manage Users    │   ✗     │    ✗    │    ✗      │    ✓      │
│ View Leaderboard│   ✓     │    ✓    │    ✓      │    ✓      │
└─────────────────────────────────────────────────────────────┘

Legend:
✓  = Full Access
✗  = No Access
✓* = Own results only
✓**= All assignments
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND STACK                              │
├─────────────────────────────────────────────────────────────┤
│ • React 18                    (UI Framework)                │
│ • TypeScript                  (Type Safety)                 │
│ • Vite                        (Build Tool)                  │
│ • Tailwind CSS                (Styling)                     │
│ • shadcn/ui                   (Components)                  │
│ • React Router                (Routing)                     │
│ • TanStack Query              (Data Fetching)               │
│ • Sonner                      (Notifications)               │
│ • Lucide Icons                (SVG Icons)                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  BACKEND STACK                               │
├─────────────────────────────────────────────────────────────┤
│ • Node.js                     (Runtime)                     │
│ • Express.js                  (Framework)                   │
│ • TypeScript                  (Type Safety)                 │
│ • Prisma                      (ORM)                         │
│ • MySQL                       (Database)                    │
│ • JWT                         (Authentication)              │
│ • bcryptjs                    (Password Hashing)            │
│ • CORS                        (Cross-Origin)                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE                              │
├─────────────────────────────────────────────────────────────┤
│ • Docker                      (Containerization)            │
│ • Docker Compose              (Multi-container)             │
│ • PhpMyAdmin                  (DB GUI)                      │
│ • Git                         (Version Control)             │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│              PRODUCTION DEPLOYMENT                       │
└──────────────────────────────────────────────────────────┘

┌─────────────────┐
│ CDN / CloudFlare│
└────────┬────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌────────┐  ┌──────────────┐
│ Vercel │  │ S3/CloudFront│
└────────┘  └──────┬───────┘
            Frontend Assets
                   │
    ┌──────────────┴──────────────┐
    │                             │
    ▼                             ▼
Frontend App (React)      API Requests
    │                             │
    └─────────────────┬───────────┘
                      │ HTTPS
                      ▼
         ┌────────────────────────┐
         │   Railway / Render     │
         │   (Node.js Backend)    │
         └────────────┬───────────┘
                      │ SQL
                      ▼
         ┌────────────────────────┐
         │  AWS RDS / CloudSQL    │
         │  (Managed MySQL)       │
         └────────────────────────┘
```

---

## File Organization

```
hackathon-select-pro/
│
├── frontend/                  ← React App (Vite)
│   ├── src/
│   │   ├── api.ts            ← API Client
│   │   ├── context/          ← Auth Logic
│   │   ├── components/       ← React Components
│   │   │   └── exam/
│   │   │       └── WebcamPreview.tsx  ← Webcam
│   │   └── pages/            ← Page Components
│   └── .env.local            ← Config
│
├── backend/                   ← Express App
│   ├── src/
│   │   ├── index.ts          ← Server Entry
│   │   ├── routes/           ← API Endpoints
│   │   │   ├── users.ts
│   │   │   ├── exams.ts
│   │   │   ├── submissions.ts
│   │   │   ├── proctoring.ts
│   │   │   └── dashboard.ts
│   │   └── seed.ts           ← Sample Data
│   ├── prisma/
│   │   └── schema.prisma     ← DB Schema
│   └── .env                  ← Config
│
├── docker-compose.yml        ← Docker Setup
├── setup.bat                 ← Windows Setup
├── setup.sh                  ← Mac/Linux Setup
│
├── BACKEND_SETUP.md          ← Backend Guide
├── FEATURES.md               ← Full Features
├── SETUP_SUMMARY.md          ← Summary
├── QUICK_REFERENCE.md        ← Quick Info
└── COMPLETE_SUMMARY.md       ← This Overview
```

---

## Security Layers

```
┌──────────────────────────────────────────────────────────┐
│                SECURITY ARCHITECTURE                     │
└──────────────────────────────────────────────────────────┘

Layer 1: Transport Security
├─ HTTPS/TLS in production
├─ Secure WebSocket (WSS)
└─ Certificate validation

Layer 2: Application Security
├─ CORS validation
├─ Rate limiting
├─ Input validation
└─ Output encoding

Layer 3: Authentication
├─ JWT tokens (30-day expiration)
├─ Refresh token rotation
├─ Secure token storage (localStorage)
└─ Session management

Layer 4: Authorization
├─ Role-based access control
├─ Route protection
├─ Field-level permissions
└─ Resource ownership verification

Layer 5: Data Security
├─ Password hashing (bcryptjs)
├─ Database encryption at rest
├─ Database backups
└─ PII protection

Layer 6: Infrastructure
├─ Environment variables
├─ Firewall rules
├─ DDoS protection
└─ Intrusion detection
```

---

**This architecture supports:**
- ✅ Scalable multi-user system
- ✅ Real-time proctoring
- ✅ Reliable data storage
- ✅ Secure authentication
- ✅ Analytics and reporting
- ✅ Easy deployment
- ✅ Production-ready operation

