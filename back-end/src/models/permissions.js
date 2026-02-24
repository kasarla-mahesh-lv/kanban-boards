const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
      // Examples: "CREATE_USER", "UPDATE_TASK", "DELETE_PROJECT"
    },

    description: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", permissionSchema);