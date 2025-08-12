# Custom Domain Setup for Netlify

## Overview
This document outlines how to set up a custom domain for the SynthChar project on Netlify.

## Steps to Configure a Custom Domain

1. **Purchase a domain**
   - Purchase a domain from a domain registrar (e.g., Namecheap, GoDaddy, Google Domains)

2. **Add the domain in Netlify**
   - Go to your Netlify site dashboard
   - Navigate to "Domain settings"
   - Click "Add custom domain"
   - Enter your domain name and click "Verify"

3. **Configure DNS**
   - Option 1: Use Netlify DNS (recommended)
     - In your Netlify site dashboard, go to "Domain settings"
     - Click "Set up Netlify DNS"
     - Follow the instructions to configure your domain registrar's nameservers
   
   - Option 2: Use your existing DNS provider
     - Add a CNAME record pointing to your Netlify site's default domain
     - Add A records pointing to Netlify's load balancer IP addresses

4. **Enable HTTPS**
   - Netlify automatically provisions a Let's Encrypt SSL certificate for your custom domain
   - Ensure "HTTPS" is enabled in your domain settings

5. **Configure redirects**
   - Set up redirects from www to non-www (or vice versa) as needed

## Troubleshooting

- **DNS propagation**: DNS changes can take up to 48 hours to propagate globally
- **SSL certificate issues**: If your SSL certificate isn't provisioning correctly, check your DNS configuration
- **Domain verification**: If you're having trouble verifying your domain, try adding a TXT record as instructed by Netlify

## Best Practices

- Use Netlify DNS for the simplest setup
- Configure both www and apex domains
- Set up permanent redirects between www and non-www versions
- Enable HTTPS for all traffic