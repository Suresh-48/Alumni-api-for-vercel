import mongoose from "mongoose";
const { Schema, model } = mongoose;

const collegeGroupSchema = new Schema({
  name: {
    type: String,
    unique: false,
    required: [true, "Please fill your group name"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "college",
  },
  image: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  degree:{
    type: String,
  },
  dept: {
    type: String,
  },
  year:{
    type: String,
  },
});

collegeGroupSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
// groupSchema.set("autoIndex", true);

const collegeGroup = model("collegeGroup", collegeGroupSchema);

export default collegeGroup;
