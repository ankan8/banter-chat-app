const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");

const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors(
  {
    origin: 'https://banter-chat-app.vercel.app',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true 
}
));
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));

// Start server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

// Socket.io setup
const io = socket(server, {
  cors: {
    origin: "https://banter-chat-app.vercel.app", // Match the frontend's deployed URL
    credentials: true,
  },
});

// Global variable for online users
global.onlineUsers = new Map();

// Socket connection handler
io.on("connection", (socket) => {
  global.chatSocket = socket;

  // Add user when connected
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} added with socket ID: ${socket.id}`);
  });

  // Handle message sending
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
  

  // Handle user disconnect
  socket.on("disconnect", () => {
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);
        console.log(`User ${key} with socket ID: ${socket.id} has disconnected`);
      }
    });
  });
});
