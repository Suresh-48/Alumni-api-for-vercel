import mongoose from "mongoose";
const { Schema, model } = mongoose;
import validator from "validator";
const { isEmail } = validator;

const brainTeaserQuestionsSchema = new Schema({
  category: {
    type: String,
    required: [false, "Please fill your Fund Name"],
  },
  question: {
    type: String,
    required: [false, "Please Enter total funding needed"],
  },
  option1: {
    type: String,
    required: [false, "Please Enter option 1"],
  },
  option2: {
    type: String,
    required: [false, "Please Enter option 2"],
  },
  option3: {
    type: String,
    required: [false, "Please Enter option 3"],
  },
  option4: {
    type: String,
    required: [true, "Please Enter option 4"],
  },
  answer: {
    type: String,
    required: [true, "Please Enter option 4"],
  },
  level: {
    type: Number,
  },
});

brainTeaserQuestionsSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const brainTeaserQuestions = model(
  "BrainTeaserQuestions",
  brainTeaserQuestionsSchema
);

export default brainTeaserQuestions;
