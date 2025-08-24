#!/bin/bash

# Test the local build to ensure it works before deployment
echo "Testing local build..."

# Install serve if not already installed
npm install -g serve

# Serve the dist directory
serve -s dist