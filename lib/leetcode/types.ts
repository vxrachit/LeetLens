export interface TopicStats {
  topic: string;
  solved: number;
  total: number;
  percentage: number;
}

export interface ContestEntry {
  contestTitle: string;
  ranking: number;
  problemsSolved: number;
  totalProblems: number;
  rating: number;
  ratingChange: number;
  date: string;
}

export interface SubmissionCalendar {
  [timestamp: string]: number;
}

export interface ProblemStats {
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  totalSolved: number;
}

export interface LeetCodeProfile {
  username: string;
  realName: string;
  avatar: string;
  ranking: number;
  reputation: number;
  starRating: number;
  aboutMe: string;
  school: string;
  country: string;
  problemStats: ProblemStats;
  topicStats: TopicStats[];
  contestHistory: ContestEntry[];
  submissionCalendar: SubmissionCalendar;
  streakDays: number;
  activeDays: number;
  acceptanceRate: number;
  languageStats?: LanguageStat[];
  recentSubmissions: RecentSubmission[];
  badges?: Badge[];
  upcomingBadges?: UpcomingBadge[];
  activeBadge?: ActiveBadge | null;
}

export interface RecentSubmission {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded';
  timestamp: string;
  lang: string;
}

export interface LanguageStat {
  lang: string;
  count: number;
  percentage: number;
}

export interface Badge {
  id?: string | number;
  name?: string;
  displayName?: string;
  icon?: string;
  hoverText?: string;
  creationDate?: number;
  category?: string;
}

export interface UpcomingBadge {
  name?: string;
  icon?: string;
  progress?: number;
}

export interface ActiveBadge {
  displayName?: string;
  icon?: string;
}
