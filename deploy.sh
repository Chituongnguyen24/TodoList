#!/bin/bash
set -e

# --- COLOR CONSTANTS ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0;m' # No Color

echo -e "${YELLOW}====================================================${NC}"
echo -e "${GREEN}      Starting TodoList EC2 Auto-Deployment         ${NC}"
echo -e "${YELLOW}====================================================${NC}"

# 1. Verify Docker Installation
if ! [ -x "$(command -v docker)" ]; then
    echo -e "${YELLOW}[1/4] Docker is not installed. Installing Docker...${NC}"
    sudo apt-get update
    sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    sudo usermod -aG docker $USER
    echo -e "${GREEN}>>> Docker installed successfully!${NC}"
else
    echo -e "${GREEN}[1/4] Docker is already installed.${NC}"
fi

# 2. Verify Docker Compose Installation
if ! docker compose version &>/dev/null; then
    echo -e "${YELLOW}[2/4] Docker Compose is not installed. Installing Docker Compose V2...${NC}"
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
    echo -e "${GREEN}>>> Docker Compose installed successfully!${NC}"
else
    echo -e "${GREEN}[2/4] Docker Compose is already installed.${NC}"
fi

# 3. Pull latest updates from Git
echo -e "${YELLOW}[3/4] Pulling latest changes from GitHub...${NC}"
git pull origin main

# 4. Restart Services in Production Mode
echo -e "${YELLOW}[4/4] Starting Docker containers with Production configuration...${NC}"
# Stop current running containers
docker compose -f docker-compose.yml -f docker-compose.prod.yml down --remove-orphans || true

# Boot containers in production mode (mapping Frontend to Port 80)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

echo -e "${YELLOW}====================================================${NC}"
echo -e "${GREEN}🎉 Deployment successfully completed!${NC}"
echo -e "${YELLOW}====================================================${NC}"
echo -e "${GREEN}You can now access your application at:${NC}"
echo -e "🔗 Web Interface: http://localhost (or your EC2 Public IP address)"
echo -e "🔗 API Endpoints: http://localhost:8080/todos"
echo -e "🔗 Swagger Docs:  http://localhost:8080/swagger-ui/index.html"
echo -e "${YELLOW}====================================================${NC}"

# Print current running containers status
docker compose ps
