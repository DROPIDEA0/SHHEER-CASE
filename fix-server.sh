#!/bin/bash

# SHHEER Case - Server Fix Script
# This script fixes the Site Protection login issue

echo "======================================"
echo "SHHEER Case - Server Fix Script"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Clean git status
echo -e "${YELLOW}Step 1: Cleaning git status...${NC}"
git reset --hard HEAD
git clean -fd
echo -e "${GREEN}✓ Git status cleaned${NC}"
echo ""

# Step 2: Pull latest changes
echo -e "${YELLOW}Step 2: Pulling latest changes from GitHub...${NC}"
git pull origin main
if [ $? -ne 0 ]; then
  echo -e "${RED}✗ Git pull failed!${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Latest changes pulled${NC}"
echo ""

# Step 3: Install dependencies
echo -e "${YELLOW}Step 3: Installing dependencies...${NC}"
pnpm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 4: Build project
echo -e "${YELLOW}Step 4: Building project...${NC}"
rm -rf dist
pnpm build
if [ $? -ne 0 ]; then
  echo -e "${RED}✗ Build failed!${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Project built successfully${NC}"
echo ""

# Step 5: Check build output
echo -e "${YELLOW}Step 5: Checking build output...${NC}"
if [ -f "dist/public/index.html" ]; then
  echo -e "${GREEN}✓ Client build found${NC}"
  JS_FILE=$(ls dist/public/assets/index-*.js 2>/dev/null | head -1)
  if [ -n "$JS_FILE" ]; then
    echo -e "${GREEN}✓ JavaScript file: $(basename $JS_FILE)${NC}"
  else
    echo -e "${RED}✗ JavaScript file not found!${NC}"
  fi
else
  echo -e "${RED}✗ Client build not found!${NC}"
  exit 1
fi

if [ -f "dist/index.js" ]; then
  echo -e "${GREEN}✓ Server build found${NC}"
else
  echo -e "${RED}✗ Server build not found!${NC}"
  exit 1
fi
echo ""

# Step 6: Restart PM2
echo -e "${YELLOW}Step 6: Restarting PM2...${NC}"
pm2 restart all
echo -e "${GREEN}✓ PM2 restarted${NC}"
echo ""

# Step 7: Show logs
echo -e "${YELLOW}Step 7: Showing recent logs...${NC}"
pm2 logs --lines 20 --nostream
echo ""

echo "======================================"
echo -e "${GREEN}✓ Server fix completed!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Clear browser cache (Ctrl + Shift + R)"
echo "2. Open site in Incognito mode"
echo "3. Try logging in with: Diaa / Diaa123"
echo ""
echo "If still not working, check:"
echo "  pm2 logs shheer-case --lines 50"
echo ""
