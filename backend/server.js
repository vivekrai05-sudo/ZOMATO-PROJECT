//start server
require("dotenv").config();
const app = require("./src/app"); //yha pr app naam likhna  zarori nhi h
const connectDB = require("./src/db/db");

connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
