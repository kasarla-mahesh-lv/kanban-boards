const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger"); // swagger.js file in root

// Routes
const boardRoutes = require("./src/routes/boardRoutes");
const columnRoutes = require("./src/routes/columnRoutes");
const cardRoutes = require("./src/routes/cardRoutes");
const authRoutes=require("./src/routes/authRoutes");

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

// ✅ Health route
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Kanban Boards API is running 🚀" });
});

// ✅ Swagger UI route (THIS WAS MISSING)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ API Routes (mount them)
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/auth",authRoutes);

module.exports = app;