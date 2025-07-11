import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  // This fetches the JWT token from the request cookies
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
  });

  const protectedPaths = ['/settings', '/dashboard'];

  const { pathname } = req.nextUrl;

  // Check if request path starts with any protected route
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    // Redirect to your sign-in page if no token
    const signInUrl = new URL('/auth/signin', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Tell Next.js which paths this middleware applies to
export const config = {
  matcher: ['/settings/:path*', '/dashboard/:path*'],
};
