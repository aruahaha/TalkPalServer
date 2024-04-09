const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
app.use(cors());

const server = require("http").Server(app);

const io = require("socket.io")(server, {
  cors: {
    origin: ["http://192.168.29.86:8081"],
  },
  allowEIO3: true,
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

app.get("/", (req, res) => {
  res.send(`<h1>Socket start on : ${PORT}</h1>`);
});

server.listen(PORT, () => {
  console.log(`Server is listening to ${PORT}`);
});
