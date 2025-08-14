#!/bin/bash

# Exit on error
set -e

echo "Starting Vercel build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

echo "Build completed successfully!"