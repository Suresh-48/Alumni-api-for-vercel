import mongoose from "mongoose";
import college from "./collegeModel.js";
import User from './userModel.js';
import collegeGroup from './collegeGroupModel.js'
const { Schema, model } = mongoose;

const collegeGroupMembersSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    collegeGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collegeGroup,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: college,
    },
    role: {
      type: String,
      enum: ["admin", "student", "alumini"],
      default: "alumini",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "requested"],
      default: "pending",
    },
    degree:{
      type: String,
    },
    dept:{
      type: String,
    },
    year: {
      type: String,
    },
  },
  { timestamps: true }
);

collegeGroupMembersSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// groupMembersSchema.set("autoIndex", true);

const collegeGroupMembers = model("collegeGroupMembers", collegeGroupMembersSchema);

export default collegeGroupMembers;
