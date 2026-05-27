import { LeetCodeProfile } from '../leetcode/types';

export interface MetricScore {
  score: number;
  label: string;
  description: string;
  insight: string;
  level: 'low' | 'medium' | 'high';
}

export interface BehavioralMetrics {
  overallScore: MetricScore;
  comfortZoneScore: MetricScore;
  contestResilience: MetricScore;
  growthEfficiency: MetricScore;
  topicAvoidance: { topics: string[]; score: number; insight: string };
  hardProblemCourage: MetricScore;
  consistencyStability: MetricScore;
}

function clamp(val: number, min = 0, max = 100): number {
  return Math.round(Math.max(min, Math.min(max, val)));
}

function level(score: number): 'low' | 'medium' | 'high' {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function buildMetricScore(label: string, score: number, descriptions: Record<'low' | 'medium' | 'high', string>, insights: Record<'low' | 'medium' | 'high', string>): MetricScore {
  const bounded = clamp(score);
  const l = level(bounded);

  return {
    score: bounded,
    label,
    description: descriptions[l],
    insight: insights[l],
    level: l,
  };
}

export function computeComfortZoneScore(profile: LeetCodeProfile): MetricScore {
  const { topicStats } = profile;
  if (topicStats.length === 0) {
    return {
      score: 50,
      label: 'Comfort Zone Score',
      description: 'Insufficient topic data.',
      insight: 'Solve problems across more topics to unlock this metric.',
      level: 'medium',
    };
  }
  const solved = topicStats.filter((t) => t.solved > 0);
  const totalTopics = topicStats.length;
  const diversityRatio = solved.length / totalTopics;

  // Penalize if top 3 topics make up > 70% of solves
  const totalSolves = topicStats.reduce((s, t) => s + t.solved, 0);
  const sorted = [...topicStats].sort((a, b) => b.solved - a.solved);
  const top3 = sorted.slice(0, 3).reduce((s, t) => s + t.solved, 0);
  const concentrationPenalty = totalSolves > 0 ? top3 / totalSolves : 1;

  // This is already a 0-100 scale: breadth carries most of the weight, and topic concentration
  // only adjusts it slightly.
  const rawScore = diversityRatio * 80 + (1 - concentrationPenalty) * 20;
  const score = clamp(rawScore);

  const descriptions: Record<string, string> = {
    low: 'You heavily favor a narrow set of topics.',
    medium: 'You explore some variety but have clear comfort zones.',
    high: 'You engage broadly across the problem space.',
  };
  const insights: Record<string, string> = {
    low: 'Branching into unfamiliar topics like DP or Graph theory could unlock significant ranking gains.',
    medium: 'You have a solid foundation — pushing into weaker topics would accelerate growth.',
    high: 'Excellent breadth. Consider deepening mastery in 2–3 specialized areas.',
  };

  const l = level(score);
  return { score, label: 'Comfort Zone Score', description: descriptions[l], insight: insights[l], level: l };
}

export function computeContestResilience(profile: LeetCodeProfile): MetricScore {
  const { contestHistory } = profile;

  if (contestHistory.length < 5) {
    return {
      score: 50, label: 'Contest Resilience',
      description: 'Insufficient contest data.',
      insight: 'Participate in more contests to unlock this metric.',
      level: 'medium',
    };
  }

  let bouncebacks = 0;
  let lossFollowedByParticipation = 0;

  for (let i = 1; i < contestHistory.length; i++) {
    const prev = contestHistory[i - 1];
    const curr = contestHistory[i];
    if (prev.ratingChange < -20) {
      lossFollowedByParticipation++;
      if (curr.ratingChange > 0) bouncebacks++;
    }
  }

  const bounceRate = lossFollowedByParticipation > 0
    ? bouncebacks / lossFollowedByParticipation
    : 0.5;

  const ratingChanges = contestHistory.map((c) => c.ratingChange);
  const mean = ratingChanges.reduce((s, v) => s + v, 0) / ratingChanges.length;
  const variance = ratingChanges.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / ratingChanges.length;
  const volatilityPenalty = Math.min(variance / 10000, 0.5);

  const score = clamp((bounceRate * 70 + (1 - volatilityPenalty) * 30));

  const l = level(score);
  const descriptions: Record<string, string> = {
    low: 'Bad contests often derail your momentum significantly.',
    medium: 'You recover from losses but with inconsistency.',
    high: 'You treat losses as data points, not setbacks.',
  };
  const insights: Record<string, string> = {
    low: 'Consider treating each contest independently — past performance doesn\'t define future results.',
    medium: 'Your resilience is developing. Focus on consistent upsolving after poor contests.',
    high: 'Elite mental model. Your contest trajectory is sustainable.',
  };

  return { score, label: 'Contest Resilience', description: descriptions[l], insight: insights[l], level: l };
}

export function computeGrowthEfficiency(profile: LeetCodeProfile): MetricScore {
  const { problemStats } = profile;
  const { easySolved, mediumSolved, hardSolved, totalSolved } = problemStats;

  if (totalSolved === 0) {
    return { score: 0, label: 'Growth Efficiency', description: 'No problems solved yet.', insight: 'Start solving!', level: 'low' };
  }

  const easyRatio = easySolved / totalSolved;
  const hardRatio = hardSolved / totalSolved;
  const mediumRatio = mediumSolved / totalSolved;

  // Ideal distribution: ~20% easy, ~55% medium, ~25% hard
  const idealEasy = 0.20;
  const idealMedium = 0.55;
  const idealHard = 0.25;

  const deviation =
    Math.abs(easyRatio - idealEasy) +
    Math.abs(mediumRatio - idealMedium) +
    Math.abs(hardRatio - idealHard);

  const progressionScore = (1 - deviation / 2) * 100;

  // Bonus for hard solves
  const hardBonus = Math.min(hardRatio * 200, 20);

  const score = clamp(progressionScore + hardBonus);
  const l = level(score);

  const descriptions: Record<string, string> = {
    low: 'Your problem distribution suggests stagnation.',
    medium: 'You\'re progressing but not optimally.',
    high: 'Your difficulty distribution signals intentional growth.',
  };
  const insights: Record<string, string> = {
    low: `${Math.round(easyRatio * 100)}% of your solves are Easy — shift focus to Medium/Hard for faster growth.`,
    medium: 'Increase your Hard problem ratio to accelerate skill development.',
    high: 'Excellent difficulty balance. You\'re maximizing learning per problem.',
  };

  return { score, label: 'Growth Efficiency', description: descriptions[l], insight: insights[l], level: l };
}

export function computeTopicAvoidance(profile: LeetCodeProfile): { topics: string[]; score: number; insight: string } {
  const { topicStats } = profile;
  if (topicStats.length === 0) {
    return {
      topics: [],
      score: 50,
      insight: 'Insufficient topic data to detect avoidance patterns.',
    };
  }

  // Calculate average percentage across all topics
  const avgPercentage = topicStats.reduce((s, t) => s + t.percentage, 0) / topicStats.length;

  // Topics with zero progress are considered avoided
  const topicsWithProgress = topicStats.filter((t) => t.percentage > 0).length;
  const totalTopics = topicStats.length;
  const coveragePercentage = (topicsWithProgress / totalTopics) * 100;

  // Identify heavily avoided topics (significantly below average)
  const avoidanceThreshold = avgPercentage * 0.3;
  const weakTopics = topicStats
    .filter((t) => t.percentage < avoidanceThreshold && t.percentage > 0 && t.total > 50)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 5)
    .map((t) => t.topic);

  // True avoided topics (completely skipped)
  const trueAvoidedTopics = topicStats
    .filter((t) => t.percentage === 0 && t.total > 50)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((t) => t.topic);

  // Score based on DEPTH of coverage: average completion % across all topics
  // 70%+ average = 100, 50%+ = 80, 30%+ = 60, 15%+ = 40, <15% = 20
  let score = 20;
  if (avgPercentage >= 70) score = 100;
  else if (avgPercentage >= 50) score = 80;
  else if (avgPercentage >= 30) score = 60;
  else if (avgPercentage >= 15) score = 40;

  let insight = '';
  if (trueAvoidedTopics.length > 0 && weakTopics.length > 0) {
    insight = `Completely skipping: ${trueAvoidedTopics.slice(0, 2).join(', ')}. Weak progress: ${weakTopics.slice(0, 3).join(', ')}.`;
  } else if (trueAvoidedTopics.length > 0) {
    insight = `Focus on: ${trueAvoidedTopics.slice(0, 5).join(', ')}`;
  } else if (weakTopics.length > 0) {
    insight = `Strengthen: ${weakTopics.slice(0, 5).join(', ')}`;
  } else {
    insight = `Excellent! You've built strong coverage across all ${totalTopics} topics.`;
  }

  // Return true avoided topics (0%) + weak topics as "topics to work on"
  const avoidedTopics = [...trueAvoidedTopics, ...weakTopics].slice(0, 5);

  return { topics: avoidedTopics, score, insight };
}

export function computeHardProblemCourage(profile: LeetCodeProfile): MetricScore {
  const { problemStats } = profile;
  const { easySolved, mediumSolved, hardSolved } = problemStats;
  const total = easySolved + mediumSolved + hardSolved;

  if (total === 0) {
    return { score: 0, label: 'Hard Problem Courage', description: 'No data.', insight: 'Start solving!', level: 'low' };
  }

  const hardRatio = hardSolved / total;
  // Blend hard ratio with absolute hard volume so tiny samples do not overstate courage.
  const ratioScore = hardRatio * 75;
  const evidenceScore = Math.min(Math.log2(hardSolved + 1) * 8, 25);
  const score = clamp(ratioScore + evidenceScore);

  const l = level(score);
  const descriptions: Record<string, string> = {
    low: 'You rarely attempt Hard problems.',
    medium: 'You occasionally challenge yourself with Hard problems.',
    high: 'You actively seek out and conquer Hard problems.',
  };
  const insights: Record<string, string> = {
    low: `Only ${hardSolved} Hard problems solved (${Math.round(hardRatio * 100)}%). Hard problems offer 3x the learning density.`,
    medium: `${hardSolved} Hard problems solved. Pushing to 1 hard per week would compound your skills significantly.`,
    high: `${hardSolved} Hard problems solved (${Math.round(hardRatio * 100)}%). You\'re in the top tier of problem solvers.`,
  };

  return { score, label: 'Hard Problem Courage', description: descriptions[l], insight: insights[l], level: l };
}

export function computeConsistencyStability(profile: LeetCodeProfile): MetricScore {
  const { submissionCalendar } = profile;
  const entries = Object.entries(submissionCalendar).sort(([a], [b]) => Number(a) - Number(b));

  if (entries.length === 0) {
    return { score: 0, label: 'Consistency Stability', description: 'No submission data.', insight: 'Start solving regularly!', level: 'low' };
  }

  const now = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo = now - 30 * 86400;
  const ninetyDaysAgo = now - 90 * 86400;

  const recentEntries = entries.filter(([ts]) => Number(ts) > thirtyDaysAgo);
  const quarterEntries = entries.filter(([ts]) => Number(ts) > ninetyDaysAgo);

  const activeDaysLast30 = recentEntries.length;
  const activeDaysLast90 = quarterEntries.length;

  const dailyConsistency = (activeDaysLast30 / 30) * 100;
  const quarterConsistency = (activeDaysLast90 / 90) * 100;

  // Check for burst vs steady patterns
  const weeklyBuckets: number[] = Array(12).fill(0);
  quarterEntries.forEach(([ts]) => {
    const weekIdx = Math.floor((now - Number(ts)) / (7 * 86400));
    if (weekIdx < 12) weeklyBuckets[11 - weekIdx]++;
  });

  const nonZeroWeeks = weeklyBuckets.filter((v) => v > 0).length;
  const weeklyStability = nonZeroWeeks / 12;

  // Favor recent regularity, with longer-term history and spread as smaller stabilizers.
  const score = clamp(dailyConsistency * 0.7 + quarterConsistency * 0.15 + weeklyStability * 15);
  const l = level(score);

  const descriptions: Record<string, string> = {
    low: 'Your activity is sporadic with long gaps.',
    medium: 'You maintain moderate consistency with occasional breaks.',
    high: 'You have disciplined, sustainable solving habits.',
  };
  const insights: Record<string, string> = {
    low: `Only ${activeDaysLast30} active days in the last month. Consistent daily practice (even 1 problem) compounds over time.`,
    medium: `${activeDaysLast30} active days last month. Try to solve on at least 5 days per week for optimal retention.`,
    high: `${activeDaysLast30} active days last month. Your consistency is a competitive advantage.`,
  };

  return { score, label: 'Consistency Stability', description: descriptions[l], insight: insights[l], level: l };
}

export function computeOverallScore(profile: LeetCodeProfile, metrics: Omit<BehavioralMetrics, 'overallScore'>): MetricScore {
  const topicCoverageScore = metrics.topicAvoidance.score;

  const weightedScore =
    metrics.consistencyStability.score * 0.25 +
    metrics.growthEfficiency.score * 0.20 +
    metrics.hardProblemCourage.score * 0.20 +
    metrics.contestResilience.score * 0.15 +
    metrics.comfortZoneScore.score * 0.10 +
    topicCoverageScore * 0.10;

  const descriptions: Record<'low' | 'medium' | 'high', string> = {
    low: 'Your profile is still narrow or inconsistent overall.',
    medium: 'You have a solid foundation, with a few clear growth levers left.',
    high: 'You show strong, balanced practice across the key dimensions.',
  };

  const weakestSignal = [
    { label: 'Consistency', score: metrics.consistencyStability.score },
    { label: 'Growth', score: metrics.growthEfficiency.score },
    { label: 'Hard Courage', score: metrics.hardProblemCourage.score },
    { label: 'Contest', score: metrics.contestResilience.score },
    { label: 'Topic Breadth', score: metrics.comfortZoneScore.score },
    { label: 'Topic Coverage', score: topicCoverageScore },
  ].sort((a, b) => a.score - b.score)[0];

  const insights: Record<'low' | 'medium' | 'high', string> = {
    low: `${weakestSignal.label} is your biggest drag right now. Improve that first for the fastest overall lift.`,
    medium: `${weakestSignal.label} is the clearest lever to push you into a stronger overall profile.`,
    high: `Your weakest area is ${weakestSignal.label.toLowerCase()}, but your profile is already well balanced.`,
  };

  return buildMetricScore('Overall Score', weightedScore, descriptions, insights);
}

export function computeAllMetrics(profile: LeetCodeProfile): BehavioralMetrics {
  const comfortZoneScore = computeComfortZoneScore(profile);
  const contestResilience = computeContestResilience(profile);
  const growthEfficiency = computeGrowthEfficiency(profile);
  const topicAvoidance = computeTopicAvoidance(profile);
  const hardProblemCourage = computeHardProblemCourage(profile);
  const consistencyStability = computeConsistencyStability(profile);

  const baseMetrics = {
    comfortZoneScore,
    contestResilience,
    growthEfficiency,
    topicAvoidance,
    hardProblemCourage,
    consistencyStability,
  };

  return {
    overallScore: computeOverallScore(profile, baseMetrics),
    ...baseMetrics,
  };
}
