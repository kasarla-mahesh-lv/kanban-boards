const router = require("express").Router();

// ✅ import ALL required functions
const {
  createColumn,
  updateColumn,
  deleteColumn,
  getAllColumns
} = require("../controllers/columnController");

// 🔹 app.js lo already: app.use("/api/columns", columnRoutes)

// Create column under a board
router.post("/boards/:boardId/columns", createColumn);

// Update column under a board
router.patch("/boards/:boardId/columns/:columnId", updateColumn);

// Get all columns
router.get("/", getAllColumns);

// Delete column
router.delete("/:columnId", deleteColumn);

module.exports = router;
