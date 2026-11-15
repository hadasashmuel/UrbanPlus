
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
} from "@microsoft/signalr";

import type { AppDispatch } from "../store";
import { addRealtimeNotification } from "./notificationsSlice";
import type { NotificationItem } from "./notificationsState";

const HUB_URL = "https://localhost:7019/hubs/notifications";

export const startNotificationConnection = async (
  token: string,
  dispatch: AppDispatch
): Promise<HubConnection> => {
  const connection = new HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  connection.on(
    "ReceiveNotification",
    (notification: NotificationItem) => {
      dispatch(addRealtimeNotification(notification));
    }
  );

  await connection.start();

  console.log("SignalR notifications connected");

  return connection;
};
