import mongoose from "mongoose";
const { Schema, model } = mongoose;

const collegeStudentsFundSchema = new Schema({
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
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "college",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

collegeStudentsFundSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const collegeStudentsFund = model("collegeStudentsFund", collegeStudentsFundSchema);

export default collegeStudentsFund;
