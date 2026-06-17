import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminSession = request.cookies.get('admin_session');
  const facultySession = request.cookies.get('faculty_session');
  const { pathname } = request.nextUrl;

  // Admin protection
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !adminSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  if (pathname === '/admin/login' && adminSession) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Faculty protection
  if (pathname.startsWith('/faculty') && pathname !== '/faculty/login' && !facultySession) {
    return NextResponse.redirect(new URL('/faculty/login', request.url));
  }
  if (pathname === '/faculty/login' && facultySession) {
    return NextResponse.redirect(new URL('/faculty/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/faculty/:path*'],
};
