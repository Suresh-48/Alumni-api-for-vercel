import mongoose from "mongoose";
const { Schema, model } = mongoose;

const collegeUserVoteSchema = new Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "college",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  votes: {
    type: Number,
  },
});

collegeUserVoteSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

collegeUserVoteSchema.set("autoIndex", true);

const collegeUserVote = model("collegeUserVote", collegeUserVoteSchema);

export default collegeUserVote;
