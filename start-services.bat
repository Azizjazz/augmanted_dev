@echo off
REM TaskBoard Pro 3.0 - Microservices Startup Script (Windows)

echo ==========================================
echo   TaskBoard Pro 3.0 - Microservices
echo ==========================================

cd /d "%~dp0"

REM Install dependencies
echo Installing dependencies...
pip install -r services\auth-service\requirements.txt -q
pip install -r services\task-service\requirements.txt -q
pip install -r services\analytics-service\requirements.txt -q
pip install -r gateway\requirements.txt -q

echo.
echo Starting services...

REM Start all services in separate windows
start "Auth Service (8001)" cmd /k "cd services\auth-service && python -m uvicorn main:app --host 0.0.0.0 --port 8001"
start "Task Service (8003)" cmd /k "cd services\task-service && python -m uvicorn main:app --host 0.0.0.0 --port 8003"
start "Analytics Service (8004)" cmd /k "cd services\analytics-service && python -m uvicorn main:app --host 0.0.0.0 --port 8004"
start "API Gateway (8000)" cmd /k "cd gateway && python -m uvicorn main:app --host 0.0.0.0 --port 8000"

echo.
echo ==========================================
echo   All Microservices Started!
echo ==========================================
echo   Gateway:       http://localhost:8000
echo   Auth Service:   http://localhost:8001
echo   Task Service:   http://localhost:8003
echo   Analytics:     http://localhost:8004
echo ==========================================
echo   Close these windows to stop services
echo ==========================================
