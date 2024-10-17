import { getRecoil, setRecoil } from "recoil-nexus";

import { notificationStore } from "../stores/system";

export type Notification = {
  id?: string;
  msg?: string;
  type?: NotificationType;
  timeout?: number;
};

export type NotificationType = "success" | "error" | "info" | "warning";

/**
 * Remove a notification from the store using its id
 * @param id
 */
export const removeNotification: (id: string) => void = (id) => {
  const notifications = getRecoil(notificationStore);

  setRecoil(
    notificationStore, notifications.filter(
      (notification: Notification) => notification.id !== id
    )
  );
};
