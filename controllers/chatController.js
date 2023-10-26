import Chat from "../models/chatModel.js";
import sendNotificationAll from "../utils/notificationAll.js";
import User from "../models/userModel.js";


// Base Controller
import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "./baseController.js";


export async function createChat(req, res, next) {
  try {
    const data = req.body;

    const CreateChatList = await Chat.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      createdAt: data.createdAt,
      text: data.text,
      user: data.user,
      sent: true,
    });
    res.status(201).json({
      status: "success",
      message: "Chat Created SuccessFully",
      CreateChatList,
    });
  } catch (err) {
    next(err);
  }
}

export async function getChat(req, res, next) {
  try {
    const data = req.query;
    const senderId = data.senderId;
    const receiverId = data.receiverId;

    const getChat = await Chat.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    res.status(200).json({
      status: "success",
      getChat,
    });
  } catch (err) {
    next(err);
    console.log("err", err);
  }
}

export async function chatNotification(req, res, next) {
  try {
    const data = req.query;
    const userId = data.userId;

    const chatNotification = await Chat.find({
      receiverId: userId,
      received: false,
    }).countDocuments();

    const chatData = await Chat.find({
      receiverId: userId,
      received: false,
    }).populate("groupId");

   
   

    res.status(200).json({
      status: "success",
      chatNotification,
      chatData,
    });
  } catch (err) {
    next(err);
    console.log("err", err);
  }
}

export async function chatPushNotification(req, res, next) {
  try {
    const data = req.body;

  


    const chatCount = await Chat.find({
      senderId: data.senderId,
      receiverId: data.receiverId,
      received:false
    })
    
    const receiverDetail = await User.findById({ _id: data.receiverId });
    const senderDetail = await User.findById({ _id: data.senderId });

    const message = `You Have Message from ${
      senderDetail.firstName + " " + senderDetail.lastName
    }`;
    if (chatCount.length !== 0) {
      console.log("send");
      sendNotificationAll(receiverDetail.fcmToken, message);
    }

    let query = { senderId :   data.senderId, receiverId: data.receiverId };
    

  	let data1 = { $set : {schoolId : data.schoolId , groupId: data.groupId}  }
    
    const chatUpateDataNew = await Chat.updateMany(query, data1);
    
    res.status(201).json({
      status: "success",
    });
  } catch (err) {
    next(err);
    console.log("err", err);
  }
}

export const getAllChat = getAll(Chat);
export const updateChat = updateOne(Chat);
export const deleteChat = deleteOne(Chat);
