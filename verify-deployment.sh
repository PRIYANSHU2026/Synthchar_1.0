#!/bin/bash

# Verification script for SynthChar deployment
# This script checks if all required files and directories are present

# Set colors for output
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${YELLOW}Verifying SynthChar deployment structure...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "next.config.js" ]; then
  echo -e "${RED}Error: Not in the project root directory.${NC}"
  echo -e "${YELLOW}Please run this script from the SynthChar-Deployment directory.${NC}"
  exit 1
fi

# Check for essential files
essential_files=("package.json" "next.config.js" "netlify.toml" "_redirects" "README.md")
for file in "${essential_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo -e "${RED}❌ Missing essential file: $file${NC}"
    exit 1
  else
    echo -e "${GREEN}✅ Found essential file: $file${NC}"
  fi
done

# Check for essential directories
essential_dirs=("src" "public" "config")
for dir in "${essential_dirs[@]}"; do
  if [ ! -d "$dir" ]; then
    echo -e "${RED}❌ Missing essential directory: $dir${NC}"
    exit 1
  else
    echo -e "${GREEN}✅ Found essential directory: $dir${NC}"
  fi
done

# Check for source code directories
src_dirs=("app" "components" "contexts" "lib" "types")
for dir in "${src_dirs[@]}"; do
  if [ ! -d "src/$dir" ]; then
    echo -e "${RED}❌ Missing source directory: src/$dir${NC}"
    exit 1
  else
    echo -e "${GREEN}✅ Found source directory: src/$dir${NC}"
  fi
done

# Verify next.config.js settings
if grep -q "output: 'export'" next.config.js; then
  echo -e "${GREEN}✅ next.config.js has correct output setting${NC}"
else
  echo -e "${RED}❌ next.config.js missing 'output: export' setting${NC}"
fi

if grep -q "unoptimized: true" next.config.js; then
  echo -e "${GREEN}✅ next.config.js has correct image optimization setting${NC}"
else
  echo -e "${RED}❌ next.config.js missing 'unoptimized: true' setting${NC}"
fi

# Verify _redirects file
if grep -q "/* /index.html 200" _redirects; then
  echo -e "${GREEN}✅ _redirects file has correct redirect rule${NC}"
else
  echo -e "${RED}❌ _redirects file missing correct redirect rule${NC}"
fi

echo -e "\n${GREEN}Deployment structure verification complete!${NC}"
echo -e "${YELLOW}You can now deploy this package to Netlify using the deploy.sh script.${NC}"