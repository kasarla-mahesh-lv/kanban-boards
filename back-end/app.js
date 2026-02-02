const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// FIX: Point to 'src/routes' because app.js is outside
const boardRoutes = require("./src/routes/boardRoutes");
const columnRoutes = require("./src/routes/columnRoutes");
const cardRoutes = require("./src/routes/cardRoutes");
const projectRoutes = require("./src/routes/projectRoutes"); // ✅ add here

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Kanban Boards API is running 🚀" });
});

// API Routes
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/cards", cardRoutes);

// ✅ your new route (taskId search will come under this)
app.use("/api/projects", projectRoutes);

module.exports = app;
