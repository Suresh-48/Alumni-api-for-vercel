import mongoose from "mongoose";
const { connect } = mongoose;
import Chat from "./models/chatModel.js";
import { config } from "dotenv";
config({
  path: "./.env",
});

import http from "http";
import * as SocketIO from "socket.io";

import app from "./app.js";
const server = new http.createServer(app);
const io = new SocketIO.Server(server);

io.on("connection", (socket) => {
  socket.on("chat message", async (msg) => {
    //create chat message
    const CreateChatList = await Chat.create({
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      createdAt: msg.createdAt,
      text: msg.text,
      user: msg.user,
      sent: true,
      received: false,
    });

    const senderId = msg.senderId;
    const receiverId = msg.receiverId;

    //update received to tue
    const updateChatList = await Chat.updateMany(
      {
        senderId: receiverId,
        receiverId: senderId,
        received: false,
      },
      {
        $set: { received: true },
      }
    );

    const getChat = await Chat.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    io.emit("chat message", getChat, senderId, receiverId);
  });

  //chat mesage list call
  socket.on("message list", async (data) => {
    const senderId = data.senderId;
    const receiverId = data.receiverId;

    const updateChatList = await Chat.updateMany(
      {
        senderId: receiverId,
        receiverId: senderId,
        received: false,
      },
      {
        $set: { received: true },
      }
    );

    //get chat message list
    const chatList = await Chat.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    //send message list for front end
    io.emit("message list", chatList, senderId, receiverId);
  });

  //delete message
  socket.on("delete message", async (messageId, senderId, receiverId) => {
    const deleteMessage = await Chat.findByIdAndDelete({ _id: messageId });

    const chatMessageList = await Chat.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    //send message list  after deleted for front end
    io.emit("delete message", chatMessageList, senderId, receiverId);
  });

  //disconnect
  socket.on("disconnect", function () {
    console.log(socket.id + " has disconnected from the chat." + socket.id);
  });
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!! shutting down....");
  console.log(err.name, err.message);
  process.exit(1);
});

const database = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// Connect the database
connect(database, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((con) => {
  console.log("DB connection Successfully!");
});

// Start the server
const port = process.env.PORT || 5004;
server.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});

// Close the Server
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!!!  shutting down ...");
  console.log(err.name, err.message);
  // server.close(() => {
  //   process.exit(1);
  // });
});
