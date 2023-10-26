import mongoose from "mongoose";

const { Schema, model } = mongoose;

const lookingForEmployeeSchema = new Schema({
  name: {
    type: String,
    required: [false, "Please fill your name"],
  },
  jobTitle: {
    type: String,
    required: [false, "Please fill your job title"],
  },
  experience: {
    type: String,
    required: [false, "Please fill your experience"],
  },
  email: {
    type: String,
    required: [false, "Please fill your email"],
  },
  phone: {
    type: String,
    required: [false, "Please fill your phone"],
  },
  resume: {
    type: String,
    required: [false, "Please upload your resume "],
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  description: {
    type: String,
    required: [false, "Please fill your description "],
  },
});

lookingForEmployeeSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const lookingForEmployee = model("lookingForEmployee", lookingForEmployeeSchema);

export default lookingForEmployee;
