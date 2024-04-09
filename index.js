const express = require("express");
const app = express();
const PORT = 3000;
const cors = require("cors");
app.use(cors());

const server = require("http").Server(app);

const io = require("socket.io")(server, {
  cors: {
    origin: ["http://192.168.29.86:8081"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("join_chat", (data) => {
    socket.join(data);
    console.log(`User with ${socket.id} joined room ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected ", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening to ${PORT}`);
});
