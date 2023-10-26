import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userVoteCounterSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  votes: {
    type: Number,
    default: 0,
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
});

userVoteCounterSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

userVoteCounterSchema.set("autoIndex", true);

const userVoteCounter = model("userVoteCounter", userVoteCounterSchema);

export default userVoteCounter;
