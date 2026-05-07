export type ChallengeBadgePreset = {
  id: string;
  label: string;
  icon: string;
  description: string;
};

/** Creator picks one of these when making a challenge; finishers earn it in Badges. */
export const CHALLENGE_BADGE_PRESETS: ChallengeBadgePreset[] = [
  {
    id: 'bronze_finisher',
    label: 'Bronze Finisher',
    icon: '🥉',
    description: 'Bronze-tier completion badge',
  },
  {
    id: 'silver_finisher',
    label: 'Silver Finisher',
    icon: '🥈',
    description: 'Silver-tier completion badge',
  },
  {
    id: 'gold_finisher',
    label: 'Gold Finisher',
    icon: '🥇',
    description: 'Gold-tier completion badge',
  },
  {
    id: 'gem_elite',
    label: 'Gem Elite',
    icon: '💎',
    description: 'Elite milestone badge',
  },
  {
    id: 'firestarter',
    label: 'Firestarter',
    icon: '🔥',
    description: 'Energy & endurance focus',
  },
  {
    id: 'power_builder',
    label: 'Power Builder',
    icon: '💪',
    description: 'Strength & consistency',
  },
  {
    id: 'streak_runner',
    label: 'Streak Runner',
    icon: '⚡',
    description: 'Streak & discipline',
  },
  {
    id: 'champion',
    label: 'Champion',
    icon: '👑',
    description: 'Top performer vibe',
  },
  {
    id: 'community_star',
    label: 'Community Star',
    icon: '⭐',
    description: 'Community spotlight',
  },
  {
    id: 'iron_will',
    label: 'Iron Will',
    icon: '🏋️',
    description: 'Grit & persistence',
  },
];

export function getChallengeBadgePresetById(
  id: string | undefined | null,
): ChallengeBadgePreset | undefined {
  if (!id || typeof id !== 'string') {
    return undefined;
  }
  return CHALLENGE_BADGE_PRESETS.find(p => p.id === id);
}

export const DEFAULT_CHALLENGE_BADGE_PRESET_ID =
  CHALLENGE_BADGE_PRESETS[0]?.id ?? 'bronze_finisher';
