# Continuous Deployment with Netlify

## Overview
This document outlines the continuous deployment setup for the SynthChar project using Netlify.

## Deployment Workflow
1. Code is pushed to the main branch of the repository
2. Netlify automatically detects the changes and triggers a build
3. The build process runs using the configuration in netlify.toml
4. If the build is successful, the site is deployed to production

## Branch Deploys
Netlify also supports branch deploys, which create preview deployments for branches other than main.

## Deploy Contexts
The following deploy contexts are available:

- Production: Deploys from the main branch
- Deploy Previews: Deploys from pull requests
- Branch Deploys: Deploys from branches other than main

## Environment Variables
Different environment variables can be set for different deploy contexts in the Netlify UI.

## Build Hooks
Build hooks can be used to trigger builds from external services.

## Notifications
Notifications can be set up to alert team members of successful or failed deployments.