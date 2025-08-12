# SynthChar Deployment Guide

## Overview

This guide provides instructions for deploying the SynthChar application to Netlify. A clean deployment structure has been created at:

```
~/Desktop/SynthChar-Deployment/
```

## Deployment Structure

The deployment directory has been organized with the following structure:

```
SynthChar-Deployment/
├── config/
│   └── netlify/         # Netlify-specific configuration files
├── public/              # Static assets
│   ├── images/          # Image assets
│   └── Periodic_Table.csv
├── src/                 # Source code
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript type definitions
├── .env.production      # Production environment variables
├── _redirects           # Netlify redirect rules
├── deploy.sh            # Deployment script
├── next.config.js       # Optimized Next.js configuration
├── netlify.toml         # Netlify configuration
├── package.json         # Project dependencies
├── package-lock.json    # Locked dependencies
├── README.md            # Project documentation
└── verify-deployment.sh # Deployment verification script
```

## Deployment Steps

### 1. Verify the Deployment Structure

Before deploying, verify that the deployment structure is correct:

```bash
cd ~/Desktop/SynthChar-Deployment
./verify-deployment.sh
```

This script will check for all required files and directories and verify that the configuration files have the correct settings.

### 2. Deploy to Netlify

To deploy the application to Netlify:

```bash
cd ~/Desktop/SynthChar-Deployment
./deploy.sh
```

This script will:
1. Clean previous build artifacts
2. Install dependencies
3. Build the project
4. Copy the _redirects file to the out directory
5. Create a zip file of the out directory

After the script completes, upload the generated `netlify-deploy.zip` file to Netlify:
1. Go to [Netlify](https://app.netlify.com/)
2. Drag and drop the zip file to the Netlify dashboard
3. Wait for the deployment to complete

### 3. Verify the Deployment

After the deployment is complete, Netlify will provide a URL (e.g., https://synthchar.netlify.app). Visit this URL to verify that the deployment was successful.

## Configuration Details

### Next.js Configuration

The `next.config.js` file has been optimized for production with the following settings:

- `output: 'export'` for static site generation
- `unoptimized: true` for images
- `distDir: 'out'` for build output
- `swcMinify: true` for better minification
- Console logs removed in production

### Netlify Configuration

The `netlify.toml` file contains the following configuration:

- Build command: `npm run build`
- Publish directory: `out`
- Node.js version: 18.17.0
- Edge functions for HTML transformation
- Cache control headers for static assets

### Environment Variables

The `.env.production` file contains environment variables for the production environment:

- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://synthchar.netlify.app`
- `NEXT_USE_NETLIFY_EDGE=true`

## Troubleshooting

If you encounter issues during deployment:

1. Check the build logs for errors
2. Ensure all dependencies are installed correctly
3. Verify that the _redirects file is correctly copied to the out directory
4. Check that the netlify.toml file has the correct configuration
5. Try running the verification script to identify any missing files or incorrect configurations

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Netlify Edge Functions Documentation](https://docs.netlify.com/edge-functions/overview/)