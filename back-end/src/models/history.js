const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true
    },
    createdBy: {
      type: String
    },
    personId: {
      type: String,
      required: true
  },
  activity: {
      type: String,
      required: true
  }
  },
  
  
  { timestamps: true }
);


module.exports = mongoose.model("History", historySchema);
