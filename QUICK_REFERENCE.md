# ⚡ Quick Reference Card

## 🚀 Start Project

```bash
# Windows
setup.bat

# macOS/Linux
bash setup.sh

# Manual - Terminal 1
cd backend && npm run dev

# Manual - Terminal 2
npm run dev
```

## 📍 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| API | http://localhost:5000/api |
| Prisma Studio | Run: npm run prisma:studio |
| PhpMyAdmin | http://localhost:8080 |

## 🔑 Test Credentials

```
Admin:
  Email: admin@hackathon.com
  Pass: password123

Students:
  Email: student1@hackathon.com (through 10)
  Pass: password123
```

## 📁 Key Files

```
Frontend:
  src/api.ts                          ← API client
  src/context/AuthContext.tsx         ← Auth logic
  src/components/exam/WebcamPreview.tsx ← Webcam
  .env.local                          ← Frontend config

Backend:
  backend/src/index.ts                ← Server
  backend/src/routes/*.ts             ← API routes
  backend/src/seed.ts                 ← Sample data
  backend/prisma/schema.prisma        ← DB schema
  backend/.env                        ← Backend config
```

## 🛠 Commands

### Backend
```bash
cd backend

npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build TypeScript
npm run prisma:migrate  # Run migrations
npm run prisma:seed     # Add sample data
npm run prisma:studio   # Open GUI
```

### Frontend
```bash
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run lint            # Check code style
npm run test:watch      # Run tests
```

## 📡 Key API Endpoints

### Auth
```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me
```

### Exams
```
GET    /api/exams
GET    /api/exams/:id
GET    /api/exams/:id/questions
```

### Submissions
```
POST   /api/submissions                 ← Start exam
POST   /api/submissions/:id/answers    ← Save answer
POST   /api/submissions/:id/submit     ← Submit exam
GET    /api/submissions/:id/results    ← Get results
```

### Proctoring
```
POST   /api/proctoring/violations      ← Log violation
POST   /api/proctoring/webcam/session  ← Start webcam
PUT    /api/proctoring/webcam/session/:id ← Update
```

### Dashboard
```
GET    /api/dashboard/stats
GET    /api/dashboard/exams/:id/analytics
GET    /api/dashboard/leaderboard/:id
```

## 💾 Database Tables

- `User` - Students, admins, proctors
- `Exam` - Tests/hackathons
- `Question` - Quiz questions
- `Submission` - Student responses
- `Answer` - Individual answers
- `ProctoringViolation` - Rule breaks
- `ProctoringLog` - Activity log
- `WebcamSession` - Camera data

## 🔐 Environment Variables

### Backend (.env)
```
DATABASE_URL=mysql://root:password@localhost:3306/hackathon_select_pro
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## 🎥 Webcam Features

Student sees during exam:
- ✅ Real camera feed
- ✅ Face detection status
- ✅ REC indicator
- ✅ Proctored badge

Backend tracks:
- ✅ Tab switches
- ✅ Face detection events
- ✅ Fullscreen exits
- ✅ Copy/paste attempts

## 🧪 Test Workflow

1. **Login** as `student1@hackathon.com / password123`
2. **Navigate** to exam
3. **Enable Webcam** when prompted
4. **See** your live camera feed
5. **Answer** questions
6. **Submit** exam
7. **View** results with violations logged

## 🐛 Troubleshoot

```bash
# MySQL not connecting?
docker-compose up -d

# Database empty?
cd backend && npm run prisma:seed

# API not responding?
# Check: backend running? PORT=5000? CORS_ORIGIN set?

# Webcam not working?
# Check: permission granted? HTTPS required for prod?

# Can't find npm?
node --version        # Ensure Node installed
npm --version        # Check npm version
```

## 📊 Sample Data

**Exams:**
1. JavaScript (60 min, 100 marks)
2. React (90 min, 150 marks)
3. DSA (120 min, 200 marks)

**Users:**
- 1 Admin
- 1 Organizer
- 2 Proctors
- 10 Students

**Data:**
- 18 Questions across exams
- 5 Sample submissions
- 10 Proctoring logs
- 5 Webcam sessions

## 📈 Performance

| Metric | Target |
|--------|--------|
| API Response | < 200ms |
| Page Load | < 2s |
| Database Query | < 100ms |
| Webcam Feed | 30fps |

## 🔗 Documentation Links

- `BACKEND_SETUP.md` - Full setup guide
- `FEATURES.md` - Feature overview
- `SETUP_SUMMARY.md` - Complete summary
- `README.md` - Original project readme

## 💡 Pro Tips

1. **Use Prisma Studio** for visual database admin
2. **Check browser DevTools** for API calls (Network tab)
3. **Keep tokens fresh** - they expire in 30 days
4. **Test with all roles** - different features per role
5. **Monitor violations** - they're logged for proctoring

## 🚀 Deploy

**Backend:** Railway, Render, AWS, Heroku  
**Frontend:** Vercel, Netlify, AWS CloudFront  
**Database:** AWS RDS, Google Cloud SQL, Managed MySQL service

---

**Last Updated:** April 2026  
**Version:** 2.0.0  
**Status:** ✅ Production Ready
