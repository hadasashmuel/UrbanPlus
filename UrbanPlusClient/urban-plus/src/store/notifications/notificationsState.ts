export interface NotificationItem {
  notificationId: number;
  userId: number;
  mainEventId: number;
  type: number | string;
  content: string;
  distanceFromEvent: number;
  isRead: boolean;
  titleMainEvent: string;
}

export interface NotificationsState {
  notifications: NotificationItem[];
  adminNotifications: NotificationItem[];

  loading: boolean;
  adminLoading: boolean;

  error: string | null;
  adminError: string | null;

  realtimeNotification: NotificationItem | null;
}

export const initialState: NotificationsState = {
  notifications: [],
  adminNotifications: [],

  loading: false,
  adminLoading: false,

  error: null,
  adminError: null,

  realtimeNotification: null,
};