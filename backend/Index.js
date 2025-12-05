const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

/* ===== Middleware ===== */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

/* ===== Routes ===== */
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");

app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

/* ===== Database ===== */
mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => {
    console.error("❌ DB Connection Failed:", err);
    process.exit(1);
  });

/* ===== Test Route ===== */
app.get("/", (req, res) => res.send("Backend running"));

/* ===== Server ===== */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
