import { useEffect, useState } from "react";
import { getNotifications, markRead } from "./notificationApi";
import type { Notification } from "./types";
import "./NotificationPage.css";

const NotificationPage: React.FC = () => {
  const [list, setList] = useState<Notification[]>([]);
  const userId = 1;

  const load = async () => {
    try {
      const data = await getNotifications(userId);

      
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setList([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRead = async (id: number) => {
    try {
      await markRead(id);
      load();
    } catch (err) {
      console.error("Mark read failed:", err);
    }
  };

  return (
    <div className="notification-page">
      <h2>Notifications</h2>

      <div className="notification-list">
        {list.length === 0 ? (
          <p>No notifications</p>
        ) : (
          list.map((n) => (
            <div
              key={n.id}
              className={`notification-row ${!n.read ? "unread" : ""}`}
              onClick={() => handleRead(n.id)}
            >
              <span>{n.message}</span>
              <span className="notification-time">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
