import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { GITHUB_ACCESS_TOKEN_COOKIE, sanitizeNextPath, verifyRequiredRepoStar } from '@/lib/github-auth';

interface PageProps {
  params: { username: string };
}

export function generateMetadata({ params }: PageProps) {
  return {
    title: `${params.username} — LeetLens Analysis`,
    description: `Behavioral analysis for ${params.username} on LeetCode`,
  };
}

export default async function AnalyzePage({ params }: PageProps) {
  const accessToken = cookies().get(GITHUB_ACCESS_TOKEN_COOKIE)?.value;
  const nextPath = `/analyze/${encodeURIComponent(decodeURIComponent(params.username))}`;

  if (!accessToken) {
    redirect(`/auth/signin?next=${encodeURIComponent(nextPath)}`);
  }

  const hasRequiredStar = await verifyRequiredRepoStar(accessToken);
  if (!hasRequiredStar) {
    redirect(`/auth/verify?error=not_starred&next=${encodeURIComponent(nextPath)}`);
  }

  return <DashboardClient username={decodeURIComponent(params.username)} />;
}
