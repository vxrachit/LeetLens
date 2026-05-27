export const QUERIES = {
  userContestRankingInfo: `
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
      }
      userContestRankingHistory(username: $username) {
        attended
        ranking
        rating
        ratingDelta
        problemsSolved
        totalProblems
        contest {
          title
          startTime
        }
      }
    }
  `,
  userProfileCalendar: `
    query userProfileCalendar($username: String!) {
      matchedUser(username: $username) {
        profileCalendar {
          activeYears
          streak
          totalActiveDays
          dccNumber {
            difficulty
            count
          }
          submissionCalendar
        }
      }
    }
  `,
  skillStats: `
    query skillStats($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advancedTagCount
          intermediateTagCount
          fundamentalTagCount
        }
      }
      tagProblemCounts(username: $username) {
        tagName
        tagSlug
        problemsSolved
        problemsTotal
      }
    }
  `,
  userProfile: `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        profile {
          aboutMe
          username
          realName
          websites
          countryName
          skillTags
          postViewCount
          postViewCountDiff
          reputation
          reputationDiff
          solutionCount
          solutionCountDiff
          categoryDiscussCount
          categoryDiscussCountDiff
        }
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
          totalSubmissionNum {
            difficulty
            count
          }
        }
      }
      userPublicProfile(username: $username) {
        profile {
          ranking
        }
      }
    }
  `,
  recentAcSubmissions: `
    query recentAcSubmissions($username: String!) {
      recentAcSubmissionList(username: $username, limit: 20) {
        id
        title
        titleSlug
        lang
        timestamp
      }
    }
  `,
  userProblemsSolved: `
    query userProblemsSolved($username: String!) {
      matchedUser(username: $username) {
        problemsSolvedBeatsStats {
          difficulty
          percentage
        }
        solvedNumber
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
          totalSubmissionNum {
            difficulty
            count
          }
        }
        contributionStats {
          questionCount
          testcaseCount
        }
      }
    }
  `,
  combinedProfile: `
    query combinedProfile($username: String!) {
      matchedUser(username: $username) {
        profile {
          aboutMe
          username
          realName
          countryName
          reputation
          starRating
          peopleRanking
          ranking
        }
        submitStatsGlobal: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profileCalendar {
          activeYears
          streak
          totalActiveDays
          submissionCalendar
        }
      }
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
      }
      userContestRankingHistory(username: $username) {
        attended
        ranking
        rating
        ratingDelta
        problemsSolved
        totalProblems
        contest {
          title
          startTime
        }
      }
      tagProblemCounts(username: $username) {
        tagName
        tagSlug
        problemsSolved
        problemsTotal
      }
      recentAcSubmissionList(username: $username, limit: 20) {
        id
        title
        titleSlug
        lang
        timestamp
      }
    }
  `,
};
