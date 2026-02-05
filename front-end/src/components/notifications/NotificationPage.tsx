import { useEffect, useState } from "react";
import { getNotifications, markRead } from "./notificationApi";
import type { Notification } from "./types";
import "./NotificationPage.css";

const NotificationPage: React.FC = () => {
  const [list, setList] = useState<Notification[]>([]);
  const userId = 1;

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
