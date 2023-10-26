import mongoose from "mongoose";
const { Schema, model } = mongoose;

const scholarshipSchema = new Schema({
  purpose: {
    type: String,
    required: [false, "Please fill your Purpose"],
  },
  amount: {
    type: String,
    required: [false, "Please Enter Your Donation Amount"],
  },
  frequency: {
    type: String,
    required: [false, "Please select frequency of contribution"],
  },
  manager: {
    type: String,
    required: [false, "Please select your fund manager"],
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

scholarshipSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const scholarship = model("scholarship", scholarshipSchema);

export default scholarship;
