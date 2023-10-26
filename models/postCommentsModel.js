import mongoose from "mongoose";
const { Schema, model } = mongoose;
const postCommentsSchema = new Schema({
  comments: {
    type: String,
    require: [false, "description field is required"],
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

postCommentsSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

postCommentsSchema.set("autoIndex", true);

const postComments = model("post_comments", postCommentsSchema);

export default postComments;
