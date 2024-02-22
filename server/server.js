require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const core = require("cors");
// const path = require("path");
// const http = require("http");
// const socketio = require("socket.io");

const db = mongoose.connection;
const app = express();
const PORT = process.env.PORT || 6000;
// const server = http.createServer(app);
// const io = socketio(server);
// const publicDirectoryPath = path.join(__dirname, "./public");

// app.use(express.static(publicDirectoryPath));

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(express.json());
app.use(userRoutes);
app.use(bookRoutes);
app.use(
  core({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow only specified HTTP methods
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
// app.listen(PORT, () => {
//   console.log(`Server is running in PORT ${PORT}`);
// });
