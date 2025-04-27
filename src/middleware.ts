// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const isPublic = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/_not-found',
  '/not-found',
  '/api/health',
  '/api/webhook(.*)',
  '/debug(.*)',
  '/api/clear-session(.*)'
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  try {
    // If we're missing a publishable key in production, handle gracefully
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.NODE_ENV === 'production') {
      // For specific routes that need authentication, redirect to homepage
      if (req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Check if the route is public
    if (isPublic(req)) {
      return NextResponse.next();
    }

    // For protected routes, use auth.protect()
    try {
      await auth.protect();
      return NextResponse.next();
    } catch (error) {
      // If token validation fails due to time sync issues or other reasons,
      // redirect to sign-in for authenticated routes
      console.error("Auth protection failed:", error);
      
      // Safely redirect to sign-in if needed
      const signInUrl = new URL('/sign-in', req.url);
      if (req.nextUrl.pathname.startsWith('/dashboard')) {
        signInUrl.searchParams.set('redirect_url', req.url);
      }
      return NextResponse.redirect(signInUrl);
    }
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}, {
  debug: true, // Enable debug mode to help diagnose issues
  clockSkewInMs: 60000, // Add larger clock skew tolerance (1 minute)
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};