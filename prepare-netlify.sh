#!/bin/bash

# Clean previous build artifacts
rm -rf .next out netlify-deploy.zip

# Install dependencies
npm install --legacy-peer-deps

# Build the project
npm run build

# Ensure _redirects is in the out directory
cp _redirects out/

# Create a zip file of the out directory
cd out
zip -r ../netlify-deploy.zip .
cd ..

echo "Deployment package created: netlify-deploy.zip"
echo "Upload this file to Netlify for deployment."