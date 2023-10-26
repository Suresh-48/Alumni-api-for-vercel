import mongoose from "mongoose";
const { Schema, model } = mongoose;

const schoolSchema = new Schema({
  name: {
    type: String,
    required: [false, "Please fill your school name"],
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
    // index: true,
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

schoolSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

schoolSchema.set("autoIndex", false);
schoolSchema.index({ name: "text" });
const school = model("School", schoolSchema);
school.createIndexes();
export default school;
