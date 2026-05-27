import { LEETCODE_BASE_URL } from '@/lib/env';

export const LEETCODE_GRAPHQL_URL = process.env.LEETCODE_GRAPHQL_URL ?? `${LEETCODE_BASE_URL}/graphql`;
export const LEETCODE_ORIGIN = LEETCODE_BASE_URL;
export const LEETCODE_REFERER = `${LEETCODE_BASE_URL}/`;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? '';