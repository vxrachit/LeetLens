import { CompareClient } from '@/components/compare/CompareClient';

export const metadata = {
  title: 'Compare Profiles — LeetLens',
  description: 'Compare behavioral profiles of two LeetCode users side by side.',
};

export default function ComparePage() {
  return <CompareClient />;
}
