@echo off
echo.
echo ================================
echo  Hackathon Select Pro - Setup
echo ================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not installed. Installing MySQL locally...
    REM Continue without Docker
) else (
    echo Docker found. Starting MySQL...
    docker-compose up -d
    timeout /t 5
)

REM Setup Backend
echo.
echo [1/4] Setting up Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)

if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo ⚠️  Please update .env with correct DATABASE_URL if needed
)

echo Running database migrations...
call npm run prisma:migrate -- --skip-generate
call npm run prisma:generate
call npm run prisma:seed

echo ✅ Backend setup complete!
cd ..

REM Setup Frontend
echo.
echo [2/4] Setting up Frontend...
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)

if not exist .env.local (
    echo Creating .env.local file...
    (
        echo VITE_API_URL=http://localhost:5000/api
    ) > .env.local
)

echo ✅ Frontend setup complete!

REM Display next steps
echo.
echo ================================
echo  Setup Complete! 🎉
echo ================================
echo.
echo To start the application:
echo.
echo Terminal 1 - Start Backend:
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 - Start Frontend:
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
echo Test Login:
echo   Email: admin@hackathon.com
echo   Password: password123
echo.
echo Database Admin (if Docker):
echo   http://localhost:8080
echo   Server: mysql
echo   User: root
echo   Password: password
echo.
echo For more info, see BACKEND_SETUP.md
echo.
pause
