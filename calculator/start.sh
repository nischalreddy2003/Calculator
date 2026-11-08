#!/bin/bash
# Start both backend and frontend servers

echo "Starting Calculator Full-Stack Application..."
echo ""

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "Error: Python is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Start backend
echo "Starting backend server on port 8001..."
cd backend
python main.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "Starting frontend server on port 8000..."
cd frontend
python -m http.server 8000 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Application started successfully!"
echo ""
echo "Backend API: http://localhost:8001"
echo "Frontend:    http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user to press Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo 'Servers stopped.'; exit 0" INT

# Keep script running
wait
