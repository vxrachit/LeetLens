import { GITHUB_CLIENT_ID, GITHUB_OWNER, GITHUB_REPO, GITHUB_REPO_URL } from '@/lib/env';
import { GITHUB_CLIENT_SECRET } from '@/lib/server/env';

export const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
export const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
export const GITHUB_API_URL = 'https://api.github.com';
export const GITHUB_ACCESS_TOKEN_COOKIE = 'github_access_token';
export const GITHUB_OAUTH_STATE_COOKIE = 'github_oauth_state';
export const GITHUB_OAUTH_NEXT_COOKIE = 'github_oauth_next';

export const REQUIRED_REPO_SLUG = `${GITHUB_OWNER}/${GITHUB_REPO}`;
export const REQUIRED_REPO_URL = GITHUB_REPO_URL;

export interface GithubUserProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
}

export function sanitizeNextPath(nextPath?: string | null): string {
  if (!nextPath || !nextPath.startsWith('/') || nextPath.startsWith('//')) {
    return '/';
  }

  return nextPath;
}

export function buildGithubAuthorizeUrl(state: string, callbackUrl: string): string {
  const url = new URL(GITHUB_AUTHORIZE_URL);
  url.searchParams.set('client_id', GITHUB_CLIENT_ID);
  url.searchParams.set('redirect_uri', callbackUrl);
  url.searchParams.set('state', state);
  url.searchParams.set('scope', 'read:user public_repo');
  return url.toString();
}

export async function exchangeGithubCode(code: string, callbackUrl: string): Promise<string> {
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error('GitHub OAuth is not configured');
  }

  const response = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: callbackUrl,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub token exchange failed with status ${response.status}`);
  }

  const payload = await response.json() as { access_token?: string; error?: string; error_description?: string };
  if (payload.error) {
    throw new Error(payload.error_description || payload.error);
  }

  if (!payload.access_token) {
    throw new Error('GitHub did not return an access token');
  }

  return payload.access_token;
}

export async function fetchGithubUser(accessToken: string): Promise<GithubUserProfile> {
  const response = await fetch(`${GITHUB_API_URL}/user`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub user lookup failed with status ${response.status}`);
  }

  return response.json() as Promise<GithubUserProfile>;
}

export async function verifyRequiredRepoStar(accessToken: string): Promise<boolean> {
  const response = await fetch(`${GITHUB_API_URL}/user/starred/${REQUIRED_REPO_SLUG}`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (response.status === 204) {
    return true;
  }

  if (response.status === 404) {
    return false;
  }

  throw new Error(`GitHub star verification failed with status ${response.status}`);
}