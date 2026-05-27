import { NextRequest, NextResponse } from 'next/server';
import { GITHUB_ACCESS_TOKEN_COOKIE, fetchGithubUser, verifyRequiredRepoStar } from '@/lib/github-auth';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(GITHUB_ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const [profile, hasRequiredStar] = await Promise.all([
      fetchGithubUser(accessToken),
      verifyRequiredRepoStar(accessToken),
    ]);

    if (!hasRequiredStar) {
      return NextResponse.json({ authenticated: false, hasRequiredStar: false }, { status: 403 });
    }

    return NextResponse.json({
      authenticated: true,
      hasRequiredStar: true,
      profile,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}