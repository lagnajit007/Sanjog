# Deployment Guide

## Prerequisites

Before deploying the Sanjog Sign Language Learning Platform, ensure you have:

1. A Clerk account with API keys
2. A Vercel account for deployment

## Environment Variables

The following environment variables must be set in your Vercel project:

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXX
CLERK_SECRET_KEY=sk_test_XXXXX

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

Replace the placeholder values with your actual Clerk API keys.

## Deployment Steps

1. **Set up your Clerk account**:
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Create a new application
   - Get your API keys from the API Keys section

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Add the required environment variables
   - Deploy your application

3. **Verify Authentication**:
   - Test sign-in functionality
   - Test sign-up functionality
   - Verify redirect URLs

## Troubleshooting

If you encounter issues during deployment:

1. **Missing Clerk API Keys**:
   - Ensure the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are correctly set
   - Verify the keys are valid and active in your Clerk dashboard

2. **Build Errors**:
   - Check the build logs for specific errors
   - Make sure you have the latest dependencies installed

3. **Authentication Issues**:
   - Verify the redirect URLs are correctly configured
   - Check that your Clerk application is set up with the correct domains

## Local Development

For local development:

1. Create a `.env.local` file with the required environment variables
2. Run `npm run dev` to start the development server
3. Test authentication flows locally before deploying 