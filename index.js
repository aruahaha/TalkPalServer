const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
app.use(cors());
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const server = require("http").Server(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://192.168.29.86:8081",
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("on_load", (user) => {
    const updateRow = async () => {
      await supabase
        .from("TalkPal")
        .update({ socketId: socket.id })
        .eq("name", user);
    };
    updateRow();
  });
  socket.on("join_chat", (recevier) => {
    socket.emit("receiver", recevier);
  });

  socket.on("send_message", (data) => {
    socket.to(data.receiverId).emit("receive_message", data);
  });
});

app.get("/", (req, res) => {
  res.send(`<h1>Socket start on : ${PORT}</h1>`);
});

server.listen(PORT, () => {
  console.log(`Server is listening to ${PORT}`);
});
