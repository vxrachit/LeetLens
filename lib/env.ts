export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://web.vxrachit.dpdns.org';
export const LEETCODE_BASE_URL = process.env.NEXT_PUBLIC_LEETCODE_BASE_URL ?? 'https://leetcode.com';
export const LEETCODE_ASSETS_URL = process.env.NEXT_PUBLIC_LEETCODE_ASSETS_URL ?? 'https://assets.leetcode.com';
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ?? '';
export const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER ?? 'vxrachit';
export const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO ?? 'LeetLens';
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;