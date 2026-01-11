import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // For admin routes, allow the root (/admin) to render the guard page,
  // but rewrite any deeper admin path to the guard unless a valid admin token exists.
  if (path.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')?.value;

    if (token) {
      try {
        await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        console.log(`Access granted to ${path} - admin verified`);
        return NextResponse.next();
      } catch (error) {
        console.error('JWT verification failed for:', path, error);
      }
    }

    // No valid admin token: let /admin render the guard, rewrite deeper paths back to /admin
    if (path === '/admin' || path === '/admin/') {
      return NextResponse.next();
    }

    return NextResponse.rewrite(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
