import mongoose from "mongoose";
const { Schema, model } = mongoose;

const collegeSchema = new Schema({
  name: {
    type: String,
    required: [false, "Please fill your college name"],
    index: true,
  },
  logo: {
    type: String,
    required: [false, "Please fill your logo"],
  },
  address1: {
    type: String,
    required: [false, "Please fill your address1"],
  },
  address2: {
    type: String,
    required: [false, "Please fill your address2"],
  },
  city: {
    type: String,
    required: [false, "Please fill your city"],
  },
  state: {
    type: String,
    required: [false, "Please fill your state"],
  },
  country: {
    type: String,
    required: [false, "Please fill your country"],
  },
  pincode: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [false, "Please fill your created by"],
  },
  status: {
    enum: ["approved", "pending"],
    type: String,
    default: "approved",
  },
  image: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
});

collegeSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

collegeSchema.set("autoIndex", false);
collegeSchema.index({ name: "text" });
const college = model("college", collegeSchema);
college.createIndexes();
export default college;
