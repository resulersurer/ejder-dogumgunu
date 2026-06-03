import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sadece /admin ile başlayan sayfaları koruyoruz
  if (pathname.startsWith('/admin')) {
    // Login sayfasındaysa sonsuz döngüyü engelle
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const hasSession = request.cookies.has('admin_session');
    
    if (!hasSession) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
