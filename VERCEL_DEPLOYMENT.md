# Vercel Deployment Guide

## Overview

This document provides instructions for deploying the SynthChar application to Vercel. The application has been migrated from Next.js to React + Vite for optimal performance and compatibility with Vercel's deployment platform.

## Prerequisites

- Node.js (v18.17.0 or higher)
- npm (v9 or higher)
- Vercel CLI (optional for command-line deployment)

## Deployment Steps

### Option 1: Using the Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to your Vercel account
3. Click "New Project"
4. Import your repository
5. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

### Option 2: Using the Command Line

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```
   vercel login
   ```

3. Run the deployment script:
   ```
   ./deploy-vercel.sh
   ```

   Or deploy manually:
   ```
   npm install
   npm run build
   vercel --prod
   ```

## Configuration Files

The following files have been configured for Vercel deployment:

- `vercel.json`: Contains Vercel-specific configuration
- `vite.config.js`: Configures the Vite build process
- `package.json`: Updated with Vite scripts and dependencies

## Environment Variables

If your application requires environment variables, you can set them in the Vercel dashboard under your project settings or include them in a `.env` file (make sure to add this file to `.gitignore` if it contains sensitive information).

## Troubleshooting

- If you encounter build errors, check the Vercel build logs for details
- Ensure all dependencies are correctly listed in `package.json`
- Verify that the `vite.config.js` file is correctly configured
- Check that all import paths use the correct aliases (e.g., `@/components`)

## Additional Resources

- [Vite Documentation](https://vitejs.dev/guide/)
- [Vercel Documentation](https://vercel.com/docs)
- [React Router Documentation](https://reactrouter.com/en/main)