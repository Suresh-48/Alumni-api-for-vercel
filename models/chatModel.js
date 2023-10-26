import mongoose from "mongoose";
const { Schema, model } = mongoose;

const chatSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    schoolId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    text: {
      type: String,
      required: [false, "Please Fill Your Message"],
    },
    sent: {
      type: Boolean,
    },
    received: {
      type: Boolean,
    },
    createdAt:{
      type: String,
    },
    user:{
      type:Object
    }
  },
  
);

// chatSchema.method("toJSON", function () {
//   const { __v, _id, ...object } = this.toObject();
//   object.id = _id;
//   return object;
// });

chatSchema.set("autoIndex", false);
const chat = model("Chat", chatSchema);
export default chat;
