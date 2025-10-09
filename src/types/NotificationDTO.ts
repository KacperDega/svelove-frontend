export interface NotificationDto {
  id: number;
  message: string;
  type: "NEW_CONVERSATION" | "NEW_MATCH";
  referenceId: number;
  read: boolean;
  createdAt: string;
};