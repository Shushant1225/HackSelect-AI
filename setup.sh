#!/bin/bash

echo ""
echo "================================"
echo "  Hackathon Select Pro - Setup"
echo "================================"
echo ""

# Check if Docker is installed
if command -v docker &> /dev/null; then
    echo "Docker found. Starting MySQL..."
    docker-compose up -d
    sleep 5
else
    echo "Docker not found. Install MySQL manually or using Homebrew (macOS):"
    echo "  brew install mysql"
    echo ""
fi

# Setup Backend
echo ""
echo "[1/4] Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with correct DATABASE_URL if needed"
fi

echo "Running database migrations..."
npm run prisma:migrate -- --skip-generate
npm run prisma:generate
npm run prisma:seed

echo "✅ Backend setup complete!"
cd ..

# Setup Frontend
echo ""
echo "[2/4] Setting up Frontend..."
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    echo "VITE_API_URL=http://localhost:5000/api" > .env.local
fi

echo "✅ Frontend setup complete!"

# Display next steps
echo ""
echo "================================"
echo "  Setup Complete! 🎉"
echo "================================"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 - Start Backend:"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Start Frontend:"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "Test Login:"
echo "  Email: admin@hackathon.com"
echo "  Password: password123"
echo ""
echo "Database Admin (if Docker):"
echo "  http://localhost:8080"
echo "  Server: mysql"
echo "  User: root"
echo "  Password: password"
echo ""
echo "For more info, see BACKEND_SETUP.md"
echo ""
