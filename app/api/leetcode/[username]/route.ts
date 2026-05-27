import { NextRequest, NextResponse } from 'next/server';
import { fetchLeetCodeProfile } from '@/lib/leetcode/client';
import { computeAllMetrics } from '@/lib/metrics';
import { determineArchetype, generateBehavioralInsights, ARCHETYPES } from '@/lib/archetypes';
import { GITHUB_ACCESS_TOKEN_COOKIE, verifyRequiredRepoStar } from '@/lib/github-auth';
import { logger } from '@/lib/logger';

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const accessToken = request.cookies.get(GITHUB_ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const hasRequiredStar = await verifyRequiredRepoStar(accessToken);
  if (!hasRequiredStar) {
    return NextResponse.json({ error: 'Repo is not starred' }, { status: 403 });
  }

  const { username } = params;

  if (!username || username.length < 2 || username.length > 40) {
    return NextResponse.json({ error: 'Invalid username. Must be 2-40 characters.' }, { status: 400 });
  }

  // Validate username format (alphanumeric, underscore, hyphen)
  const cleanUsername = username.toLowerCase().trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
    return NextResponse.json({ error: 'Invalid username format. Use only letters, numbers, underscores, and hyphens.' }, { status: 400 });
  }

  try {
    const profile = await fetchLeetCodeProfile(cleanUsername);

    // Check if we got meaningful data
    if (!profile || profile.problemStats.totalSolved === 0) {
      return NextResponse.json({
        error: 'Profile not found or has no solved problems.',
        suggestion: 'Check that the username exists on LeetCode.'
      }, { status: 404 });
    }

    const metrics = computeAllMetrics(profile);
    const archetypeId = determineArchetype(metrics);
    const archetype = ARCHETYPES[archetypeId];
    const insights = generateBehavioralInsights(metrics, archetypeId);

    return NextResponse.json({
      profile,
      metrics,
      archetype,
      insights,
      meta: {
        username: cleanUsername,
        fetchedAt: new Date().toISOString(),
        isMockData: profile.problemStats.totalSolved === 0,
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      }
    });

  } catch (err) {
    logger.error('API Error:', err instanceof Error ? err.message : err);
    return NextResponse.json({
      error: 'Failed to fetch profile data. Please try again.',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
