const router = require("express").Router();

const {
  getNotifications,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authmiddlewares");

// ✅ list (optional query: ?isRead=false)
router.get("/",authMiddleware, getNotifications);

// ✅ unread count
router.get("/unread-count",authMiddleware, getUnreadCount);

// ✅ create notification (manual/admin/internal use)
router.post("/",authMiddleware, createNotification);

// ✅ mark one read
router.patch("/:id/read",authMiddleware, markAsRead);

// ✅ mark all read
router.patch("/read-all",authMiddleware, markAllAsRead);

// ✅ delete
router.delete("/:id",authMiddleware, deleteNotification);

module.exports = router;
