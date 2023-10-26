import mongoose from "mongoose";
const { Schema, model } = mongoose;

const announcementSchema = new Schema(
  {
    title: {
      type: String,
      required: [false, "Please Fill Your Announcement Title"],
    },
    announcement: {
      type: String,
      required: [false, "Please Fill Your Announcement "],
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "college",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userRole: {
      type: String,
      enum: ["admin", "appAdmin"],
    },
  },
  { timestamps: true }
);

announcementSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

announcementSchema.set("autoIndex", true);

const announcement = model("Announcement", announcementSchema);

export default announcement;
