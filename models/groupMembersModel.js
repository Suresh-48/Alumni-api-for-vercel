import mongoose from "mongoose";
import School from "./schoolModel.js";
const { Schema, model } = mongoose;

const User = mongoose.model("User");
const Group = mongoose.model("Group");

// var School = mongoose.model("School");
const groupMembersSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Group,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: School,
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
    standard:{
      type: String,
    },
    section: {
      type: String,
    },
    year: {
      type: String,
    },
  },
  { timestamps: true }
);

groupMembersSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// groupMembersSchema.set("autoIndex", true);

const groupMembers = model("groupMembers", groupMembersSchema);

export default groupMembers;
