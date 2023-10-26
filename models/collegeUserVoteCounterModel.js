import mongoose from "mongoose";
const { Schema, model } = mongoose;

const collegeUserVoteCounterSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  votes: {
    type: Number,
    default: 0,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "college",
  },
});

collegeUserVoteCounterSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

collegeUserVoteCounterSchema.set("autoIndex", true);

const collegeUserVoteCounter = model("collegeUserVoteCounter", collegeUserVoteCounterSchema);

export default collegeUserVoteCounter;
