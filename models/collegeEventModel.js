import mongoose from "mongoose";
const { Schema, model } = mongoose;

const collegeEventSchema = new Schema({
  title: {
    type: String,
    unique: false,
    required: [false, "Please fill your event Title"],
  },
  collegeGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "collegeGroup",
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "college",
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

collegeEventSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

collegeEventSchema.set("autoIndex", true);

const collegeEvent = model("CollegeEvent", collegeEventSchema);

export default collegeEvent;
