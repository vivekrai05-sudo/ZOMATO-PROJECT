//create server

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow origin in dev mode
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  console.log("📦 BODY:", req.body);
  next();
});

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", authRoutes); // ✅ yahin fix hai
app.use("/api/food", foodRoutes);
module.exports = app;
