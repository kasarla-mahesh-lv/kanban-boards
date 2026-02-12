require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const connectDB = require("./src/config/mongo");

// Routes
const authRoutes = require("./src/routes/authRoutes");
//const boardRoutes = require("./src/routes/boardRoutes");
const columnRoutes = require("./src/routes/columnRoutes");
const cardRoutes = require("./src/routes/cardRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const historyRoutes = require("./src/routes/historyRoutes");


const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------- Middlewares -------------------- */
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders:["Authorization"],
  })
);

app.use(morgan("dev"));

/* -------------------- Health -------------------- */
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Kanban Boards API is running 🚀" });
});

/* -------------------- Swagger -------------------- */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* -------------------- Routes -------------------- */
app.use("/api/auth", authRoutes);
// app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/history", historyRoutes);




/* -------------------- Start App -------------------- */
(async () => {
  // Connect to MongoDB
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();