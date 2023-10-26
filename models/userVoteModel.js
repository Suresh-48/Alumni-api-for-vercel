import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userVoteSchema = new Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
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

userVoteSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

userVoteSchema.set("autoIndex", true);

const userVote = model("userVote", userVoteSchema);

export default userVote;
