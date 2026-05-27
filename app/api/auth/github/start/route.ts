import { NextRequest, NextResponse } from 'next/server';
import { APP_URL } from '@/lib/env';
import { buildGithubAuthorizeUrl, GITHUB_OAUTH_NEXT_COOKIE, GITHUB_OAUTH_STATE_COOKIE, sanitizeNextPath } from '@/lib/github-auth';

export async function GET(request: NextRequest) {
  if (!process.env.GITHUB_CLIENT_ID && !process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID) {
    const url = new URL('/auth/signin', APP_URL);
    url.searchParams.set('error', 'config');
    return NextResponse.redirect(url);
  }

  const state = crypto.randomUUID();
  const nextUrl = sanitizeNextPath(request.nextUrl.searchParams.get('next'));
  const callbackUrl = `${APP_URL}/api/auth/github/callback`;

  const response = NextResponse.redirect(buildGithubAuthorizeUrl(state, callbackUrl));

  response.cookies.set(GITHUB_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 10 * 60,
  });

  response.cookies.set(GITHUB_OAUTH_NEXT_COOKIE, nextUrl, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 10 * 60,
  });

  return response;
}