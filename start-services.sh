#!/bin/bash

# TaskBoard Pro 3.0 - Microservices Startup Script

echo "=========================================="
echo "  TaskBoard Pro 3.0 - Microservices"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}Python3 not found. Please install Python 3.10+${NC}"
    exit 1
fi

# Function to install dependencies for a service
install_deps() {
    local dir=$1
    if [ -f "$dir/requirements.txt" ]; then
        echo -e "${GREEN}Installing dependencies for $dir...${NC}"
        pip install -r "$dir/requirements.txt" -q
    fi
}

# Install all dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
install_deps "services/auth-service"
install_deps "services/task-service"
install_deps "services/analytics-service"
install_deps "gateway"

# Start services
echo -e "${GREEN}Starting services...${NC}"

# Start Auth Service
echo -e "${YELLOW}Starting Auth Service on port 8001...${NC}"
cd services/auth-service && python -m uvicorn main:app --host 0.0.0.0 --port 8001 &
AUTH_PID=$!

# Start Task Service
echo -e "${YELLOW}Starting Task Service on port 8003...${NC}"
cd services/task-service && python -m uvicorn main:app --host 0.0.0.0 --port 8003 &
TASK_PID=$!

# Start Analytics Service
echo -e "${YELLOW}Starting Analytics Service on port 8004...${NC}"
cd services/analytics-service && python -m uvicorn main:app --host 0.0.0.0 --port 8004 &
ANALYTICS_PID=$!

# Start API Gateway
echo -e "${YELLOW}Starting API Gateway on port 8000...${NC}"
cd gateway && python -m uvicorn main:app --host 0.0.0.0 --port 8000 &
GATEWAY_PID=$!

echo ""
echo -e "${GREEN}=========================================="
echo "  All Microservices Started!"
echo "=========================================="
echo "  Gateway:       http://localhost:8000"
echo "  Auth Service:   http://localhost:8001"
echo "  Task Service:   http://localhost:8003"
echo "  Analytics:      http://localhost:8004"
echo ""
echo "  Press Ctrl+C to stop all services"
echo -e "==========================================${NC}"

# Wait for all processes
wait
