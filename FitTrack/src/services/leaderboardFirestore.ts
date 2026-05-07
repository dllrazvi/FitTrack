/**
 * Community leaderboard is backed by `publicLeaderboardStats` (one doc per user, synced from workouts).
 */
export type {LeaderboardRow} from './publicLeaderboardStatsFirestore';
export {
  subscribePublicLeaderboard as subscribeLeaderboard,
  syncMyPublicLeaderboardStats,
  ensureMyLeaderboardRowExists,
} from './publicLeaderboardStatsFirestore';
