export type UserStatsDto = {
  year: number;
  month: number;
  leftSwipes: number;
  rightSwipes: number;
  totalSwipes: number;
  matches: number;
  matchesWithConversation: number;
  matchesWithoutMessages: number;
  updatedAt: string;
};

export type AvailableStatsDto = {
  year: number;
  month: number;
};