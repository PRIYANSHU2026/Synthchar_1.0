# SynthChar Deployment Package

## Directory Structure

This deployment package has been organized with a clean structure:

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
├── _redirects           # Netlify redirect rules
├── next.config.js       # Next.js configuration
├── netlify.toml         # Netlify configuration
├── package.json         # Project dependencies
├── package-lock.json    # Locked dependencies
└── prepare-netlify.sh   # Deployment script
```

## Deployment Instructions

### Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn

### Local Development

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

1. Build the project:
   ```bash
   npm run build
   ```

2. The build output will be in the `out` directory.

### Deploying to Netlify

1. Run the deployment script:
   ```bash
   ./prepare-netlify.sh
   ```

2. Upload the generated `netlify-deploy.zip` file to Netlify:
   - Go to [Netlify](https://app.netlify.com/)
   - Drag and drop the zip file to the Netlify dashboard
   - Wait for the deployment to complete

## Configuration

### Next.js Configuration

The `next.config.js` file is configured for static site generation with the following settings:

- `output: 'export'` for static site generation
- `unoptimized: true` for images
- `distDir: 'out'` for build output

### Netlify Configuration

The `netlify.toml` file contains the following configuration:

- Build command: `npm run build`
- Publish directory: `out`
- Node.js version: 18.17.0
- Edge functions for HTML transformation
- Cache control headers for static assets

### Redirect Rules

The `_redirects` file contains the following rule to ensure proper routing:

```
/* /index.html 200
```

## Troubleshooting

If you encounter issues during deployment:

1. Check the build logs for errors
2. Ensure all dependencies are installed correctly
3. Verify that the _redirects file is correctly copied to the out directory
4. Check that the netlify.toml file has the correct configuration