#!/bin/bash

# SHHEER Case - Deployment Script
# This script automates the deployment process on Hostinger

echo "🚀 Starting SHHEER Case Deployment..."
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Pull latest changes from GitHub
echo -e "\n${YELLOW}Step 1: Pulling latest changes from GitHub...${NC}"
git pull origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully pulled latest changes${NC}"
else
    echo -e "${RED}❌ Failed to pull changes${NC}"
    exit 1
fi

# Step 2: Install dependencies
echo -e "\n${YELLOW}Step 2: Installing dependencies...${NC}"
pnpm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Step 3: Build the project
echo -e "\n${YELLOW}Step 3: Building the project...${NC}"
pnpm build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Project built successfully${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Step 4: Restart the server (if using PM2)
echo -e "\n${YELLOW}Step 4: Restarting the server...${NC}"

if command -v pm2 &> /dev/null; then
    pm2 restart all
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Server restarted successfully${NC}"
    else
        echo -e "${RED}❌ Failed to restart server${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  PM2 not found. Please restart the server manually${NC}"
fi

# Step 5: Show status
echo -e "\n${YELLOW}Step 5: Checking server status...${NC}"

if command -v pm2 &> /dev/null; then
    pm2 status
fi

# Success message
echo -e "\n${GREEN}======================================"
echo -e "✅ Deployment completed successfully!"
echo -e "======================================${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Open your website: https://www.shheercase.com"
echo "2. Press Ctrl+Shift+R to force reload"
echo "3. Test Site Protection feature"
echo ""
echo -e "${YELLOW}To test Site Protection:${NC}"
echo "1. Go to: https://www.shheercase.com/admin/site-protection"
echo "2. Enable protection"
echo "3. Open site in incognito mode"
echo "4. You should see the login page"
echo ""
