const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      //enum: ["admin", "manager", "teamlead", "employee"],
      lowercase: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    permissionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission"
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("roles", roleSchema);