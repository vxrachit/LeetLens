import { NextResponse } from 'next/server';
import { APP_URL } from '@/lib/env';
import { GITHUB_ACCESS_TOKEN_COOKIE } from '@/lib/github-auth';

export async function GET() {
  const response = NextResponse.redirect(new URL('/auth/signin', APP_URL));
  response.cookies.set(GITHUB_ACCESS_TOKEN_COOKIE, '', { path: '/', maxAge: 0 });
  response.cookies.set('github_user_login', '', { path: '/', maxAge: 0 });
  response.cookies.set('github_oauth_state', '', { path: '/', maxAge: 0 });
  response.cookies.set('github_oauth_next', '', { path: '/', maxAge: 0 });
  return response;
}