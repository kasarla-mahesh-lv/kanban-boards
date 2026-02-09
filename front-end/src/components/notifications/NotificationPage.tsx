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
<<<<<<< HEAD
import "./Notification.css";
=======
import { getNotifications, markRead } from "./notificationApi"
import type { Notification } from "./types";
import "./NotificationPage.css";
>>>>>>> 99575ae03d26fc639088e691c819e7fddbe46f8f

type Notification = {
  id: number;
  title: string;
  message?: string;
};

const NotificationPage = () => {
  // ✅ list ALWAYS array
  const [list, setList] = useState<Notification[]>([]);
<<<<<<< HEAD
=======
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
>>>>>>> 99575ae03d26fc639088e691c819e7fddbe46f8f

  useEffect(() => {
    // ✅ SAFE MOCK DATA (no API, no crash)
    const response: unknown = [];

<<<<<<< HEAD
    // ✅ DOUBLE SAFETY
    if (Array.isArray(response)) {
      setList(response);
    } else {
      setList([]);
    }
  }, []);
=======
  const handleRead = async (id: number) => {
    try {
      await markRead(id);
      load();
    } catch (err) {
      console.error("Mark read failed:", err);
    }
  };
>>>>>>> 99575ae03d26fc639088e691c819e7fddbe46f8f

  return (
    <div className="notification-page">
      <h2>Notifications</h2>

<<<<<<< HEAD
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
=======
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
>>>>>>> 99575ae03d26fc639088e691c819e7fddbe46f8f
    </div>
  );
};

export default NotificationPage;
