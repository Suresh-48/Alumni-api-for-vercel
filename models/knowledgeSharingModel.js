import mongoose from "mongoose";
const { Schema, model } = mongoose;
const knowledgeSharingSchema = new Schema({
  title: {
    type: String,
    require: [false, "title field is required"],
  },
  description: {
    type: String,
    require: [false, "description field is required"],
  },
  category: {
    type: String,
    require: [false, "category field is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  count: {
    type: Number,
    default: 0,
  },

  commentCount: {
    type: Number,
    default: 0,
  },
  postImageUrl: {
    type: String,
  },
  createdOn: {
    type: Date,
  },
});

knowledgeSharingSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

knowledgeSharingSchema.set("autoIndex", true);


const knowledgeSharing = model("post", knowledgeSharingSchema);

export default knowledgeSharing;
