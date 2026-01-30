const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      default: "" 
    },
    columnId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Column", 
      required: true 
    },
    order: { 
      type: Number, 
      default: 0 
    }
  }, 
  { 
    timestamps: true, // Adds createdAt and updatedAt automatically
    versionKey: false // Removes the __v field
  }
);

module.exports = mongoose.model("Card", cardSchema);