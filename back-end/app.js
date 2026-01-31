const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes=require("./src/routes/authRoutes");
const boardRoutes = require("./src/routes/boardRoutes");
const columnRoutes = require("./src/routes/columnRoutes");
const cardRoutes = require("./src/routes/cardRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => res.json({ ok: true, message: "Welcome to Register Page 🙏🤝" }));

// API Routes
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/auth",authRoutes);

module.exports = app;