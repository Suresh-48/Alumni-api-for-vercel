import mongoose from "mongoose";

const { Schema, model } = mongoose;

const collegeLookingForEmployeeSchema = new Schema({
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
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "college",
  },
  description: {
    type: String,
    required: [false, "Please fill your description "],
  },
});

collegeLookingForEmployeeSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const collegeLookingForEmployee = model("collegLookingForEmployee", collegeLookingForEmployeeSchema);

export default collegeLookingForEmployee;
