// import { useEffect, useState } from "react";
// import { getNotifications, markRead } from "./notificationApi";
// import type { Notification } from "./types";
// import "./NotificationPage.css";

// const NotificationPage: React.FC = () => {
//   const [list, setList] = useState<Notification[]>([]);
//   const userId = 1;

//   const load = async () => {
//     const data = await getNotifications(userId);
//     setList(data);
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const handleRead = async (id: number) => {
//     await markRead(id);
//     load();
//   };

//   return (
//     <div className="notification-page">
//       <h2>Notifications</h2>

//       <div className="notification-list">
//         {list.length === 0 ? (
//           <p>No notifications</p>
//         ) : (
//           list.map((n) => (
//             <div
//               key={n.id}
//               className={`notification-row ${!n.read ? "unread" : ""}`}
//               onClick={() => handleRead(n.id)}
//             >
//               <span>{n.message}</span>

//               <span className="notification-time">
//                 {new Date(n.createdAt).toLocaleString()}
//               </span>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );    
// };

// export default NotificationPage;
import { useEffect, useState } from "react";
import "./Notification.css";

type Notification = {
  id: number;
  title: string;
  message?: string;
};

const NotificationPage = () => {
  // ✅ list ALWAYS array
  const [list, setList] = useState<Notification[]>([]);

  useEffect(() => {
    // ✅ SAFE MOCK DATA (no API, no crash)
    const response: unknown = [];

    // ✅ DOUBLE SAFETY
    if (Array.isArray(response)) {
      setList(response);
    } else {
      setList([]);
    }
  }, []);

  return (
    <div className="notification-page">
      <h2>Notifications</h2>

      {/* ✅ map ONLY on array */}
      {Array.isArray(list) && list.length > 0 ? (
        list.map((item) => (
          <div key={item.id} className="notification-card">
            <h4>{item.title}</h4>
            {item.message && <p>{item.message}</p>}
          </div>
        ))
      ) : (
        <p>No notifications found</p>
      )}
    </div>
  );
};

export default NotificationPage;
