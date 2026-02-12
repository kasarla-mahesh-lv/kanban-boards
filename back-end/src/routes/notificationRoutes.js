const router = require("express").Router();

const {
  getNotifications,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

// ✅ list (optional query: ?isRead=false)
router.get("/", getNotifications);

// ✅ unread count
router.get("/unread-count", getUnreadCount);

// ✅ create notification (manual/admin/internal use)
router.post("/", createNotification);

// ✅ mark one read
router.patch("/:id/read", markAsRead);

// ✅ mark all read
router.patch("/read-all", markAllAsRead);

// ✅ delete
router.delete("/:id", deleteNotification);

module.exports = router;
