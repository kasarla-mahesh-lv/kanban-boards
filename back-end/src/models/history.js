const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true
    },

    actionType: {
      type: String,
      required: true
    },

    taskTitle: String,
    taskCode: String,
    taskId: String,

    fromColumn: String,
    toColumn: String,

    boardId: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);
