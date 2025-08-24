import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export default auth((req) => {
  const protectedPaths = ['/settings', '/dashboard'];
  const { pathname } = req.nextUrl;

  // Check if request path starts with any protected route
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !req.auth) {
    // Redirect to your sign-in page if no auth
    const signInUrl = new URL('/auth/signin', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

// Tell Next.js which paths this middleware applies to
export const config = {
  matcher: ['/settings/:path*', '/dashboard/:path*'],
};
