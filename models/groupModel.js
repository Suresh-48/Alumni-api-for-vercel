import mongoose from "mongoose";
const { Schema, model } = mongoose;

const groupSchema = new Schema({
  name: {
    type: String,
    unique: false,
    required: [true, "Please fill your group name"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  image: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  standard:{
    type: String,
  },
  section: {
    type: String,
  },
  year: {
    type: String,
  },
});

groupSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
// groupSchema.set("autoIndex", true);

const group = model("Group", groupSchema);

export default group;
