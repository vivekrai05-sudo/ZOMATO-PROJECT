const mongoose = require("mongoose");

function connectDB() {
  //->ISKO CALL KRENGE SERVER.JS ME
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("MongooDB connected");
    })
    .catch((err) => {
      console.log("MongoDB connection error:", err);
    });
}

module.exports = connectDB;
