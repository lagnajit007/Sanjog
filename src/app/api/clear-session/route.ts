import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json(
    { success: true, message: 'Session cookies cleared' },
    { status: 200 }
  );

  // Clear all Clerk-related cookies
  const clerkCookies = [
    '__clerk_db_jwt',
    '__session',
    '__client',
    'clerk_core', 
    'clerk.frontend_api',
    '__clerk_publish_key'
  ];

  clerkCookies.forEach(cookie => {
    response.cookies.delete(cookie);
  });

  return response;
}

export const dynamic = 'force-dynamic'; 