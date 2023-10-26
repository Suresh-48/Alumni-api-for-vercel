import mongoose from "mongoose";
const { Schema, model } = mongoose;
import validator from "validator";
const { isEmail } = validator;

const brainTeaserSchema = new Schema({
  scored: {
    type: Number,
  },
  level: {
    type: Number,
    default: 1,
  },
  answers:{
    type:Object
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status:{
    type:String,
    enum: ["pending", "completed"],
  },
  category:{
    type:String
  }
});

brainTeaserSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const brainTeaser = model("BrainTeaser", brainTeaserSchema);

export default brainTeaser;
