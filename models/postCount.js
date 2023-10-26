import mongoose from "mongoose";
const { Schema, model } = mongoose;
const postCountSchema = new Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"postCount"
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

postCountSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

postCountSchema.set("autoIndex", true);

const postCount = model("postCount", postCountSchema);

export default postCount;
