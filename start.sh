#!/bin/bash

echo "Starting Live Call Monitoring System..."

# Start Backend
gnome-terminal --tab --title="Backend - Django" -- bash -c "
cd ~/Desktop/Live_Call_Monitoring/backend
source env/bin/activate
python manage.py runserver
exec bash"

# Wait 2 seconds for backend to start
sleep 2

# Start Frontend
gnome-terminal --tab --title="Frontend - React" -- bash -c "
cd ~/Desktop/Live_Call_Monitoring/frontend
npm run dev
exec bash"

sleep 2

# Open browser automatically
xdg-open http://localhost:5173

echo "✓ Backend  → http://127.0.0.1:8000"
echo "✓ Frontend → http://localhost:5173"
echo "✓ Admin    → http://127.0.0.1:8000/admin"
echo ""
echo "Login: Dwisha / Monitor1234"