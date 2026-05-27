import { NextRequest, NextResponse } from 'next/server';
import { APP_URL } from '@/lib/env';
import {
  exchangeGithubCode,
  fetchGithubUser,
  GITHUB_ACCESS_TOKEN_COOKIE,
  GITHUB_OAUTH_NEXT_COOKIE,
  GITHUB_OAUTH_STATE_COOKIE,
  sanitizeNextPath,
  verifyRequiredRepoStar,
} from '@/lib/github-auth';

function clearOauthCookies(response: NextResponse) {
  response.cookies.set(GITHUB_OAUTH_STATE_COOKIE, '', { path: '/', maxAge: 0 });
  response.cookies.set(GITHUB_OAUTH_NEXT_COOKIE, '', { path: '/', maxAge: 0 });
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const expectedState = request.cookies.get(GITHUB_OAUTH_STATE_COOKIE)?.value;
  const nextPath = sanitizeNextPath(request.cookies.get(GITHUB_OAUTH_NEXT_COOKIE)?.value);
  const callbackUrl = `${APP_URL}/api/auth/github/callback`;

  if (!code || !state || !expectedState || state !== expectedState) {
    const response = NextResponse.redirect(new URL('/auth/signin?error=oauth', APP_URL));
    clearOauthCookies(response);
    return response;
  }

  try {
    const accessToken = await exchangeGithubCode(code, callbackUrl);
    const hasRequiredStar = await verifyRequiredRepoStar(accessToken);

    if (!hasRequiredStar) {
      const verifyUrl = new URL('/auth/verify', APP_URL);
      verifyUrl.searchParams.set('error', 'not_starred');
      verifyUrl.searchParams.set('next', nextPath);

      const response = NextResponse.redirect(verifyUrl);
      clearOauthCookies(response);
      return response;
    }

    const user = await fetchGithubUser(accessToken);
    const response = NextResponse.redirect(new URL(nextPath, APP_URL));

    response.cookies.set(GITHUB_ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    response.cookies.set(GITHUB_OAUTH_STATE_COOKIE, '', { path: '/', maxAge: 0 });
    response.cookies.set(GITHUB_OAUTH_NEXT_COOKIE, '', { path: '/', maxAge: 0 });
    response.cookies.set('github_user_login', user.login, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch {
    const response = NextResponse.redirect(new URL('/auth/signin?error=github', APP_URL));
    clearOauthCookies(response);
    response.cookies.set(GITHUB_ACCESS_TOKEN_COOKIE, '', { path: '/', maxAge: 0 });
    response.cookies.set('github_user_login', '', { path: '/', maxAge: 0 });
    return response;
  }
}