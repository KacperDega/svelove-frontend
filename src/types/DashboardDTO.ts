import {NotificationDto} from "./NotificationDTO";
import {UserStatsDto} from "./StatsDTO";

export interface DashboardDto {
  username: string;
  profilePictureUrl: string | null;
  newMatchesCount: number;
  newMessagesCount: number;
  notifications: NotificationDto[];
  currentMonthStats: UserStatsDto;
}