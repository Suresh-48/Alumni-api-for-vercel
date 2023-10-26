import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userPermissionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  requestedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["Accepted", "Requested", "Pending"],
    default: "Requested",
  },
});

const userPermission = model("UserPermission", userPermissionSchema);

export default userPermission;
