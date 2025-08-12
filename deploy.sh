#!/bin/bash

# Deployment script for SynthChar
# This script prepares the project for deployment to Netlify

# Set colors for output
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${YELLOW}Starting SynthChar deployment process...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "next.config.js" ]; then
  echo -e "${RED}Error: Not in the project root directory.${NC}"
  echo -e "${YELLOW}Please run this script from the SynthChar-Deployment directory.${NC}"
  exit 1
fi

# Clean previous build artifacts
echo -e "${YELLOW}Cleaning previous build artifacts...${NC}"
rm -rf .next out netlify-deploy.zip

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install --legacy-peer-deps

# Build the project
echo -e "${YELLOW}Building the project...${NC}"
npm run build

# Check if build was successful
if [ ! -d "out" ]; then
  echo -e "${RED}Error: Build failed. The 'out' directory was not created.${NC}"
  exit 1
fi

# Ensure _redirects is in the out directory
echo -e "${YELLOW}Copying _redirects file to out directory...${NC}"
cp _redirects out/

# Create a zip file of the out directory
echo -e "${YELLOW}Creating deployment package...${NC}"
cd out
zip -r ../netlify-deploy.zip .
cd ..

# Check if zip was created successfully
if [ ! -f "netlify-deploy.zip" ]; then
  echo -e "${RED}Error: Failed to create deployment package.${NC}"
  exit 1
fi

echo -e "${GREEN}Deployment package created: netlify-deploy.zip${NC}"
echo -e "${GREEN}Upload this file to Netlify for deployment.${NC}"
echo -e "${YELLOW}Netlify URL: https://app.netlify.com/${NC}"