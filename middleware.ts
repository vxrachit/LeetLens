import { NextRequest, NextResponse } from 'next/server';
import { GITHUB_ACCESS_TOKEN_COOKIE, verifyRequiredRepoStar } from '@/lib/github-auth';

const PUBLIC_PATHS = [
  '/auth/signin',
  '/auth/verify',
  '/api/auth/github/start',
  '/api/auth/github/callback',
  '/api/auth/github/session',
  '/api/auth/logout',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function redirectToSignIn(request: NextRequest) {
  const url = new URL('/auth/signin', request.url);
  url.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(url);
}

function redirectToVerify(request: NextRequest) {
  const url = new URL('/auth/verify', request.url);
  url.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    isPublicPath(pathname)
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(GITHUB_ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return redirectToSignIn(request);
  }

  try {
    const hasRequiredStar = await verifyRequiredRepoStar(accessToken);
    if (!hasRequiredStar) {
      const response = redirectToVerify(request);
      response.cookies.set(GITHUB_ACCESS_TOKEN_COOKIE, '', { path: '/', maxAge: 0 });
      response.cookies.set('github_user_login', '', { path: '/', maxAge: 0 });
      return response;
    }
  } catch {
    const response = redirectToSignIn(request);
    response.cookies.set(GITHUB_ACCESS_TOKEN_COOKIE, '', { path: '/', maxAge: 0 });
    response.cookies.set('github_user_login', '', { path: '/', maxAge: 0 });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};