#!/bin/bash

# Exit on error
set -e

echo "Starting Vercel deployment process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
npx vercel --prod

echo "Deployment completed successfully!"