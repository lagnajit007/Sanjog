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
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
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
  await auth.protect();
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};