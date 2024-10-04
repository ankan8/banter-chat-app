const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");

const app = express();
const socket = require("socket.io");
require("dotenv").config();

// CORS setup
app.use(cors({
  origin: ['https://banter-chat-app.vercel.app', 'http://localhost:3000'],
  methods: 'GET,POST,PUT,DELETE',
  credentials: true 
}));

app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));

// Start server with a fallback port if `process.env.PORT` is not set
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Socket.io setup
const io = socket(server, {
  cors: {
    origin: ["https://banter-chat-app.vercel.app", "http://localhost:3000"],
    credentials: true,
  },
});

// Global variable for online users
global.onlineUsers = new Map();

// Socket connection handler
io.on("connection", (socket) => {
  console.log(`New user connected: Socket ID ${socket.id}`);

  // Add user when connected
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} added with Socket ID: ${socket.id}`);
  });

  // Handle message sending
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    
    if (sendUserSocket) {
      // Send the message to the intended user
      socket.to(sendUserSocket).emit("msg-receive", data.message);
      console.log(`Message sent from User ${data.from} to User ${data.to}: ${data.message}`);
    } else {
      console.log(`User ${data.to} is not online, message could not be delivered.`);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    // Find and remove the disconnected user from the onlineUsers map
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} with Socket ID ${socket.id} has disconnected`);
        break;
      }
    }
  });
});
