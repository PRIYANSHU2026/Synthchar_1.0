# SynthChar - React Application

## Overview

SynthChar is an advanced glass manufacturing calculator for batch composition and gravimetric factor calculations. This version has been migrated from Next.js to React.js with Vite for optimal performance and compatibility with Vercel's deployment platform.

## Features

- Batch Calculator for glass composition
- Advanced Visualization tools
- Formula Creator

## Getting Started

### Prerequisites

- Node.js (v18.17.0 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
   
Alternatively, you can use the setup script:
```
./setup-react.sh
```

## Deployment

This application is configured for deployment on Vercel. See the [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md) for detailed instructions.

### Quick Deployment

To deploy to Vercel:

```
./deploy-vercel.sh
```

## Project Structure

- `/src` - Application source code
  - `/app` - Legacy Next.js files (for reference)
  - `/components` - React components
  - `/contexts` - React context providers
  - `/lib` - Utility functions
  - `/pages` - Page components
  - `/types` - TypeScript type definitions

## Technologies Used

- React.js
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Three.js (for 3D visualizations)
- Plotly.js (for charts)

## License

This project is proprietary and confidential.