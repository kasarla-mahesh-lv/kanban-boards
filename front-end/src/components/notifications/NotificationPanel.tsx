import { useEffect, useState } from "react";
import type { Notification } from "./types";
import { getNotifications, markRead } from "./NotificationApi";
import "./Notification.css";

interface Props {
  userId: number;
  onClose: () => void;
}

export default function NotificationPanel({ userId, onClose }: Props) {
  const [list, setList] = useState<Notification[]>([]);

  const load = async () => {
    const data = await getNotifications(userId);
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleRead = async (id: number) => {
    await markRead(id);
    load();
  };

  return (
    <div className="notification-panel">
      <div className="notification-header">
        Notifications
        <span onClick={onClose}>✕</span>
      </div>

      {list.length === 0 && <p className="empty">No notifications</p>}

      {list.map((n) => (
        <div
          key={n.id}
          className={`notification-item ${!n.read ? "unread" : ""}`}
          onClick={() => handleRead(n.id)}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
