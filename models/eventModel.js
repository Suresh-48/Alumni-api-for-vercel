import mongoose from "mongoose";
const { Schema, model } = mongoose;

const eventSchema = new Schema({
  title: {
    type: String,
    unique: false,
    required: [false, "Please fill your event Title"],
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  co1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
    required: [false, "please enter Description"],
  },
  date: {
    type: Date,
    required: [false, "Please Enter Date"],
  },
  time: {
    type: String,
  },
  address: {
    type: String,
  },
  eventImage: {
    type: String,
  },
  eventImageUrl: {
    type: String,
  },
});

eventSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

eventSchema.set("autoIndex", true);

const event = model("Event", eventSchema);

export default event;
