const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const boardRoutes = require("./routes/boardRoutes");
const columnRoutes = require("./routes/columnRoutes");
const cardRoutes = require("./routes/cardRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ ok: true, message: "Kanban API running" }));

app.use("/api/boards", boardRoutes);
app.use("/api", columnRoutes);
app.use("/api", cardRoutes);

module.exports = app;
