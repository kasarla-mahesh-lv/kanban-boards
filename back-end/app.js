const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const boardRoutes = require("./src/routes/boardRoutes");
const columnRoutes = require("./src/routes/columnRoutes");
const cardRoutes = require("./src/routes/cardRoutes");
const projectRoutes = require("./src/routes/projectRoutes"); // ✅ ADD THIS

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"));

// Health route
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Kanban Boards API is running 🚀" });
});

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/projects", projectRoutes); // ✅ ADD THIS

module.exports = app;
