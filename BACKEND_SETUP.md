# Hackathon Select Pro - Backend & Database Setup Guide

## 🚀 Quick Start

This project now includes a complete backend with MySQL database, real-time proctoring, and webcam integration.

### Prerequisites

- Node.js (v16+)
- MySQL Server (v8.0+)
- npm or yarn

### 1. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start MySQL container
docker run --name hackathon-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=hackathon_select_pro \
  -d -p 3306:3306 mysql:8.0
```

#### Option B: Manual MySQL Installation

1. Install MySQL: https://dev.mysql.com/downloads/mysql/
2. Create database:
   ```sql
   CREATE DATABASE hackathon_select_pro;
   ```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example and update values)
cp .env.example .env

# Setup database schema using Prisma
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed

# Start development server
npm run dev
```

Server will start at `http://localhost:5000`

### 3. Frontend Setup

```bash
# From project root
npm install

# Update API URL in .env.local if needed
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Frontend will run at `http://localhost:5173`

## 📊 Database Schema

### Tables

- **Users** - Student, Proctor, Admin, Organizer profiles
- **Exams** - Hackathon/Exam details with proctoring settings
- **Questions** - MCQ, Short Answer, Essay, Code questions
- **Submissions** - Student exam submissions with results
- **Answers** - Individual question answers
- **ProctoringViolations** - Tab switches, fullscreen exits, face detection alerts
- **ProctoringLogs** - Activity logs for proctoring
- **WebcamSessions** - Webcam stream data and face detection info

## 🔐 Default Test Users

All created with password: `password123`

| Email | Role | Purpose |
|-------|------|---------|
| admin@hackathon.com | ADMIN | Admin dashboard access |
| organizer@hackathon.com | ORGANIZER | Create & manage exams |
| proctor1@hackathon.com | PROCTOR | Monitor exams |
| student1@hackathon.com | STUDENT | Take exams |
| student2@hackathon.com | STUDENT | Take exams |

## 🎥 Webcam Proctoring Features

### Student View During Exam
- ✅ Real-time webcam feed showing in exam interface
- ✅ Face detection status indicator
- ✅ Proctoring status badge
- ✅ REC indicator showing recording is active

### Proctoring Violations Tracked
- Tab switches / Window minimization
- Fullscreen exit attempts
- Face out of frame
- Multiple faces detected
- Copy/Paste attempts
- Right-click context menu attempts

### Backend Logging
- All violations logged to database
- Webcam sessions recorded with timestamps
- Face detection metrics stored
- Detailed proctor logs for review

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Exams
- `GET /api/exams` - List all exams
- `GET /api/exams/:id` - Get exam details
- `POST /api/exams` - Create exam (admin/organizer)
- `GET /api/exams/:id/questions` - Get exam questions

### Submissions
- `POST /api/submissions` - Start exam
- `GET /api/submissions/:id` - Get submission
- `POST /api/submissions/:id/answers` - Submit answer
- `POST /api/submissions/:id/submit` - Complete exam
- `GET /api/submissions/:id/results` - Get results

### Proctoring
- `POST /api/proctoring/violations` - Log violation
- `POST /api/proctoring/logs` - Log action
- `POST /api/proctoring/webcam/session` - Start webcam session
- `PUT /api/proctoring/webcam/session/:id` - Update session
- `PUT /api/proctoring/webcam/session/:id/end` - End session

### Dashboard & Analytics
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/exams/:id/analytics` - Exam analytics
- `GET /api/dashboard/leaderboard/:id` - Exam leaderboard

## 🛠 Useful Prisma Commands

```bash
# Open Prisma Studio (GUI for database)
npm run prisma:studio

# Generate Prisma client
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# Reset database (careful!)
npx prisma migrate reset
```

## 📋 Sample Data Info

The seed script creates:
- ✅ 1 Admin user
- ✅ 1 Organizer user
- ✅ 2 Proctor users
- ✅ 10 Student users
- ✅ 3 Complete exams with questions
- ✅ Sample submissions with violations
- ✅ Proctoring logs and webcam sessions

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL=mysql://root:password@localhost:3306/hackathon_select_pro
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## 🚨 Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check DATABASE_URL in .env
- Verify credentials

### "npm run prisma:seed" fails
- Run `npm run prisma:migrate` first
- Ensure database exists
- Check MySQL permissions

### Webcam not working in browser
- Grant camera permissions when prompted
- Check browser console for errors
- HTTPS required in production (localhost OK)

### CORS Error
- Verify CORS_ORIGIN in backend .env
- Frontend URL must match CORS_ORIGIN
- Ensure Authorization header is properly set

## 📚 Further Customization

### Add Face Detection Library

For production, integrate with face detection:

```bash
npm install face-api.js
```

Update `WebcamPreview.tsx` to use actual face detection.

### Enable Screen Recording

Integrate Mediasoup or WebRTC for actual stream recording.

### Email Notifications

Add Nodemailer for exam notifications to students.

## 📦 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway, Render, or AWS)
```bash
npm run build
npm start
```

## 🎓 Key Features Implemented

- ✅ Complete user authentication system
- ✅ MySQL database with Prisma ORM
- ✅ Real webcam integration during exams
- ✅ Proctoring violation tracking
- ✅ Exam results and analytics
- ✅ Leaderboard system
- ✅ Sample data seeding
- ✅ REST API for all operations
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)

## 🤝 Support

For issues or questions, check:
1. Backend console logs
2. Browser console (F12)
3. Prisma Studio: `npm run prisma:studio`
4. Database tables directly in MySQL

---

**Happy proctoring! 🎉**
