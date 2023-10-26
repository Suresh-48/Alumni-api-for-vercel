import mongoose from "mongoose";
const { Schema, model } = mongoose;
const collegeEventImageSchema = new Schema({
  collegeEventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "collegeEvent",
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

collegeEventImageSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

collegeEventImageSchema.set("autoIndex", true);

const collegeEventImage = model("collegeEventImage", collegeEventImageSchema);

export default collegeEventImage;
