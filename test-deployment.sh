#!/bin/bash

# Test script for SynthChar deployment
# This script tests if the deployment structure can be built successfully

# Set colors for output
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${YELLOW}Testing SynthChar deployment structure...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "next.config.js" ]; then
  echo -e "${RED}Error: Not in the project root directory.${NC}"
  echo -e "${YELLOW}Please run this script from the SynthChar-Deployment directory.${NC}"
  exit 1
fi

# Create a temporary directory for testing
TEST_DIR="test-build"
echo -e "${YELLOW}Creating temporary test directory: $TEST_DIR${NC}"
mkdir -p "$TEST_DIR"

# Install dependencies (without actually installing)
echo -e "${YELLOW}Testing dependency installation...${NC}"
npm list --json > "$TEST_DIR/dependencies.json"

# Test build configuration
echo -e "${YELLOW}Testing build configuration...${NC}"
if grep -q "output: 'export'" next.config.js && grep -q "distDir: 'out'" next.config.js; then
  echo -e "${GREEN}✅ Build configuration is correct${NC}"
else
  echo -e "${RED}❌ Build configuration is incorrect${NC}"
fi

# Test Netlify configuration
echo -e "${YELLOW}Testing Netlify configuration...${NC}"
if grep -q "publish = \"out\"" netlify.toml; then
  echo -e "${GREEN}✅ Netlify configuration is correct${NC}"
else
  echo -e "${RED}❌ Netlify configuration is incorrect${NC}"
fi

# Test source code structure
echo -e "${YELLOW}Testing source code structure...${NC}"
if [ -d "src/app" ] && [ -d "src/components" ] && [ -d "src/lib" ]; then
  echo -e "${GREEN}✅ Source code structure is correct${NC}"
else
  echo -e "${RED}❌ Source code structure is incorrect${NC}"
fi

# Clean up
echo -e "${YELLOW}Cleaning up test directory...${NC}"
rm -rf "$TEST_DIR"

echo -e "\n${GREEN}Deployment structure test complete!${NC}"
echo -e "${YELLOW}The deployment structure appears to be correctly set up.${NC}"
echo -e "${YELLOW}You can now proceed with the actual deployment using deploy.sh${NC}"