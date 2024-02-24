require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const core = require("cors");
const helmet = require("helmet");
const auth = require("./middleware/auth");

const db = mongoose.connection;
const app = express();
const PORT = process.env.PORT || 6000;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(helmet());
app.use(helmet.contentSecurityPolicy());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/users", auth, userRoutes);
app.use("/books", auth, bookRoutes);
app.use(
  core({
    allowedHeaders: ["Content-Type", "Authorization"], // Allow only specified headers
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running in PORT ${PORT}`))
  )
  .catch((error) => console.log(error.message));
