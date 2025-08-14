#!/bin/bash

# Exit on error
set -e

echo "Setting up React application for Vercel deployment..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Start development server
echo "Starting development server..."
npm run dev