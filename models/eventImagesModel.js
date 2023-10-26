import mongoose from "mongoose";
const { Schema, model } = mongoose;
const eventImageSchema = new Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  image: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

eventImageSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

eventImageSchema.set("autoIndex", true);

const eventImage = model("eventImage", eventImageSchema);

export default eventImage;
