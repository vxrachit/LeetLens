import { LeetCodeProfile, TopicStats, ContestEntry, SubmissionCalendar, ProblemStats, RecentSubmission } from './types';
import { LEETCODE_ASSETS_URL, LEETCODE_BASE_URL } from '@/lib/env';
import { LEETCODE_GRAPHQL_URL, LEETCODE_ORIGIN, LEETCODE_REFERER } from '@/lib/server/env';
import { logger } from '@/lib/logger';

const CACHE_DURATION_MS = 0; // Disabled for testing

interface CacheEntry {
  data: LeetCodeProfile;
  timestamp: number;
}

const profileCache = new Map<string, CacheEntry>();

const LEETCODE_TOTALS = {
  easy: 800,
  medium: 1600,
  hard: 700,
};

const TOPIC_TOTALS: Record<string, number> = {
  'Array': 1400, 'String': 780, 'Hash Table': 620, 'Dynamic Programming': 480,
  'Math': 540, 'Sorting': 310, 'Greedy': 380, 'Depth-First Search': 420,
  'Binary Search': 250, 'Tree': 190, 'Breadth-First Search': 230,
  'Matrix': 180, 'Two Pointers': 200, 'Bit Manipulation': 170,
  'Stack': 210, 'Heap': 160, 'Graph': 240, 'Sliding Window': 145,
  'Backtracking': 130, 'Linked List': 165, 'Recursion': 95,
  'Binary Tree': 200, 'Trie': 60, 'Segment Tree': 45, 'Union Find': 70,
};

async function fetchGraphQL<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(LEETCODE_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Origin': LEETCODE_ORIGIN,
      'Referer': LEETCODE_REFERER,
    },
    body: JSON.stringify({ query, variables }),
  });

  const rawText = await res.text();
  if (!res.ok) {
    logger.warn('LeetCode GraphQL non-200 response:', {
      status: res.status,
      snippet: rawText.slice(0, 300),
    });
    throw new Error(`LeetCode API error: ${res.status} - ${rawText.slice(0, 200)}`);
  }

  let json: { data?: T; errors?: Array<{ message: string }> };
  try {
    json = JSON.parse(rawText);
  } catch {
    logger.warn('LeetCode GraphQL invalid JSON response:', rawText.slice(0, 300));
    throw new Error('LeetCode API error: Invalid JSON response');
  }
  if (json.errors?.length) {
    logger.warn('LeetCode GraphQL errors payload:', json.errors);
    throw new Error(`GraphQL errors: ${json.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  if (!json.data) {
    logger.warn('LeetCode GraphQL empty data payload:', rawText.slice(0, 300));
    throw new Error('LeetCode API error: Empty data payload');
  }

  return json.data;
}

interface UserProfileData {
  matchedUser: {
    username?: string;
    profile: {
      realName?: string;
      userAvatar?: string;
      aboutMe?: string;
      countryName?: string;
      reputation?: number;
      starRating?: number;
      ranking?: number;
    };
    submitStats: {
      acSubmissionNum: Array<{ difficulty: string; count: number }>;
    };
    submissionCalendar?: string;
    tagProblemCounts?: {
      advanced: Array<{ tagName: string; problemsSolved: number }>;
      intermediate: Array<{ tagName: string; problemsSolved: number }>;
      fundamental: Array<{ tagName: string; problemsSolved: number }>;
    };
    languageProblemCount?: Array<{ languageName: string; problemsSolved: number }>;
    badges?: Array<{
      id?: string | number;
      name?: string;
      displayName?: string;
      icon?: string;
      hoverText?: string;
      creationDate?: number;
      category?: string;
    }>;
    upcomingBadges?: Array<{ name?: string; icon?: string; progress?: number }>;
    activeBadge?: { displayName?: string; icon?: string } | null;
  } | null;
}

interface ContestData {
  userContestRanking: {
    attendedContestsCount?: number;
    rating?: number;
    globalRanking?: number;
  } | null;
  userContestRankingHistory: Array<{
    attended: boolean;
    ranking: number;
    rating: number;
    problemsSolved: number;
    totalProblems: number;
    contest: {
      title: string;
      startTime: number;
    };
  }>;
}

interface RecentSubmissionsData {
  recentAcSubmissionList: Array<{
    id: string;
    title: string;
    titleSlug: string;
    lang: string;
    timestamp: string;
  }>;
}

function normalizeLeetCodeImageUrl(value?: string | null): string | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  if (trimmed.startsWith('/')) return `${LEETCODE_BASE_URL}${trimmed}`;

  return `${LEETCODE_BASE_URL}/${trimmed.replace(/^\.\/+/, '')}`;
}

function resolveBadgeIcon(badge: Record<string, unknown> | null | undefined): string | undefined {
  if (!badge) return undefined;

  const candidates = [
    badge.icon,
    badge.iconUrl,
    badge.iconURL,
    badge.image,
    badge.imageUrl,
    badge.imageURL,
    badge.badgeIcon,
    badge.badgeIconUrl,
    badge.logo,
    badge.logoUrl,
    badge.url,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return normalizeLeetCodeImageUrl(candidate);
    }
  }

  return undefined;
}

function parseSubmissionCalendar(calendarJson?: string): SubmissionCalendar {
  if (!calendarJson) return {};
  try {
    return JSON.parse(calendarJson);
  } catch {
    return {};
  }
}

function timestampToDate(ts: number): string {
  const ms = ts < 1e12 ? ts * 1000 : ts;
  return new Date(ms).toISOString().split('T')[0];
}

export async function fetchLeetCodeProfile(username: string): Promise<LeetCodeProfile> {
  const cleanUsername = username.toLowerCase().trim();

  const cached = profileCache.get(cleanUsername);
  if (cached && CACHE_DURATION_MS > 0 && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return cached.data;
  }

  try {
    const userProfileQuery = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            realName
            userAvatar
            aboutMe
            countryName
            reputation
            starRating
            ranking
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          tagProblemCounts {
            advanced {
              tagName
              problemsSolved
            }
            intermediate {
              tagName
              problemsSolved
            }
            fundamental {
              tagName
              problemsSolved
            }
          }
          languageProblemCount {
            languageName
            problemsSolved
          }
          badges {
            id
            name
            displayName
            icon
            hoverText
            creationDate
            category
          }
          upcomingBadges { name icon progress }
          activeBadge { displayName icon }
          submissionCalendar
        }
      }
    `;

    const contestQuery = `
      query getUserContestInfo($username: String!) {
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
        }
        userContestRankingHistory(username: $username) {
          attended
          ranking
          rating
          problemsSolved
          totalProblems
          contest {
            title
            startTime
          }
        }
      }
    `;

    const recentQuery = `
      query getRecentSubmissions($username: String!) {
        recentAcSubmissionList(username: $username, limit: 500) {
          id
          title
          titleSlug
          lang
          timestamp
        }
      }
    `;

    let profileData: UserProfileData | null = null;
    let contestData: ContestData | null = null;
    let recentData: RecentSubmissionsData | null = null;

    const errors: string[] = [];

    try {
      profileData = await fetchGraphQL<UserProfileData>(userProfileQuery, { username: cleanUsername });
    } catch (e) {
      errors.push(`Profile: ${e instanceof Error ? e.message : 'Unknown'}`);
    }

    if (!profileData?.matchedUser?.profile) {
      throw new Error('User not found on LeetCode');
    }

    try {
      contestData = await fetchGraphQL<ContestData>(contestQuery, { username: cleanUsername });
    } catch (e) {
      errors.push(`Contest: ${e instanceof Error ? e.message : 'Unknown'}`);
    }

    try {
      recentData = await fetchGraphQL<RecentSubmissionsData>(recentQuery, { username: cleanUsername });
    } catch (e) {
      errors.push(`Recent: ${e instanceof Error ? e.message : 'Unknown'}`);
    }

    if (errors.length > 0) {
      logger.warn('LeetCode partial errors:', errors.join('; '));
    }

    const profile = profileData.matchedUser.profile;
    const submissionCalendar = profileData.matchedUser.submissionCalendar;
    const submitStats = profileData.matchedUser.submitStats?.acSubmissionNum || [];

    const problemStats: ProblemStats = {
      easySolved: submitStats.find(s => s.difficulty?.toLowerCase() === 'easy')?.count || 0,
      easyTotal: LEETCODE_TOTALS.easy,
      mediumSolved: submitStats.find(s => s.difficulty?.toLowerCase() === 'medium')?.count || 0,
      mediumTotal: LEETCODE_TOTALS.medium,
      hardSolved: submitStats.find(s => s.difficulty?.toLowerCase() === 'hard')?.count || 0,
      hardTotal: LEETCODE_TOTALS.hard,
      totalSolved: submitStats.find(s => s.difficulty?.toLowerCase() === 'all')?.count ||
        submitStats.reduce((sum, s) => sum + (s.count || 0), 0),
    };

    const tagGroups = profileData.matchedUser.tagProblemCounts;
    const flatTags = [
      ...(tagGroups?.fundamental || []),
      ...(tagGroups?.intermediate || []),
      ...(tagGroups?.advanced || []),
    ];

    const tagTotals = new Map<string, number>();
    for (const tag of flatTags) {
      tagTotals.set(tag.tagName, (tagTotals.get(tag.tagName) || 0) + (tag.problemsSolved || 0));
    }

    const topicStats: TopicStats[] = Array.from(tagTotals.entries()).map(([tagName, solved]) => {
      const total = TOPIC_TOTALS[tagName] || 100;
      return {
        topic: tagName,
        solved,
        total,
        percentage: Math.round((solved / total) * 100),
      };
    });

    const contestHistory: ContestEntry[] = (contestData?.userContestRankingHistory || [])
      .filter(c => c.attended && c.contest)
      .sort((a, b) => a.contest.startTime - b.contest.startTime)
      .map(c => ({
        contestTitle: c.contest.title,
        ranking: c.ranking,
        problemsSolved: c.problemsSolved,
        totalProblems: c.totalProblems,
        rating: Math.round(c.rating || 0),
        ratingChange: 0,
        date: timestampToDate(c.contest.startTime),
      }));

    const rawRecent = (recentData?.recentAcSubmissionList || []);
    const recentSubmissions: RecentSubmission[] = rawRecent.slice(0, 20).map(sub => ({
      title: sub.title,
      difficulty: 'Medium' as const,
      status: 'Accepted' as const,
      timestamp: new Date(Number(sub.timestamp) * 1000).toISOString(),
      lang: sub.lang,
    }));

    // Prefer LeetCode's aggregated languageProblemCount if available
    const profileLangCounts = profileData.matchedUser.languageProblemCount || [];
    let languageStats: { lang: string; count: number; percentage: number }[] = [];
    if (profileLangCounts && profileLangCounts.length > 0) {
      const totalLang = profileLangCounts.reduce((s, l) => s + (l.problemsSolved || 0), 0) || 1;
      languageStats = profileLangCounts
        .map(l => ({ lang: (l.languageName || 'unknown').toLowerCase(), count: l.problemsSolved || 0, percentage: Math.round(((l.problemsSolved || 0) / totalLang) * 100) }))
        .sort((a, b) => b.count - a.count);
    } else {
      // Aggregate language statistics from recent submissions (best-effort fallback)
      const langCounts: Record<string, number> = {};
      for (const s of rawRecent) {
        const l = (s.lang || 'unknown').toString().toLowerCase();
        langCounts[l] = (langCounts[l] || 0) + 1;
      }
      const totalLangSamples = rawRecent.length || 1;
      languageStats = Object.entries(langCounts)
        .map(([lang, count]) => ({ lang, count, percentage: Math.round((count / totalLangSamples) * 100) }))
        .sort((a, b) => b.count - a.count);
    }

    const acceptanceRate = problemStats.totalSolved > 0
      ? Math.round((problemStats.totalSolved / (submitStats.reduce((s, st) => s + (st.count || 0), 0) || 1)) * 1000) / 10
      : 0;

    // Map badges / upcoming / active badge if available
    const badges = (profileData.matchedUser.badges || []).map((b) => ({
      id: b.id,
      name: b.name,
      displayName: b.displayName,
      icon: resolveBadgeIcon(b as unknown as Record<string, unknown>),
      hoverText: b.hoverText,
      creationDate: b.creationDate,
      category: b.category,
    }));

    const upcomingBadges = (profileData.matchedUser.upcomingBadges || []).map((b) => ({
      name: b.name,
      icon: resolveBadgeIcon(b as unknown as Record<string, unknown>),
      progress: b.progress,
    }));

    const activeBadge = profileData.matchedUser.activeBadge
      ? {
          displayName: profileData.matchedUser.activeBadge.displayName,
          icon: resolveBadgeIcon(profileData.matchedUser.activeBadge as unknown as Record<string, unknown>),
        }
      : null;

    const result: LeetCodeProfile = {
      username: profileData.matchedUser.username || cleanUsername,
      realName: profile.realName || '',
      avatar: profile.userAvatar || `${LEETCODE_ASSETS_URL}/users/avatars/avatar_${cleanUsername}.png`,
      ranking: profile.ranking || contestData?.userContestRanking?.globalRanking || 0,
      reputation: profile.reputation || 0,
      starRating: profile.starRating || 0,
      aboutMe: profile.aboutMe || '',
      school: '',
      country: profile.countryName || '',
      problemStats,
      topicStats,
      contestHistory,
      submissionCalendar: parseSubmissionCalendar(submissionCalendar),
      streakDays: 0,
      activeDays: 0,
      acceptanceRate,
      recentSubmissions,
      languageStats,
      badges,
      upcomingBadges,
      activeBadge,
    };

    profileCache.set(cleanUsername, { data: result, timestamp: Date.now() });
    return result;

  } catch (err) {
    logger.error('LeetCode API failed:', err instanceof Error ? err.message : err);
    throw new Error(`Failed to fetch LeetCode profile for ${cleanUsername}: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

export function bustProfileCache(username?: string) {
  if (username) {
    profileCache.delete(username.toLowerCase().trim());
  } else {
    profileCache.clear();
  }
}
