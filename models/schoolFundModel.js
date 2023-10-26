import mongoose from "mongoose";
const { Schema, model } = mongoose;
import validator from "validator";
const { isEmail } = validator;

const schoolFundSchema = new Schema({
  name: {
    type: String,
    required: [false, "Please fill your Fund Name"],
  },
  need: {
    type: String,
    required: [false, "Please Enter total funding needed"],
  },
  description: {
    type: String,
    required: [false, "Please Enter Description"],
  },
  dueDate: {
    type: String,
    required: [false, "Please select Due Date"],
  },
  contact: {
    type: String,
    required: [false, "Please Enter Your name"],
  },
  email: {
    type: String,
    required: [true, "Please fill your email"],
    // unique: true,
    lowercase: true,
    validate: [isEmail, " Please provide a valid email"],
  },
  phone: {
    type: String,
    trim: true,
    required: [true, "Please fill your phone number"],
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
});

schoolFundSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const schoolFund = model("schoolFund", schoolFundSchema);

export default schoolFund;
