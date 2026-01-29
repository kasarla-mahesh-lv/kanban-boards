const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    columnId: { type: mongoose.Schema.Types.ObjectId, ref: "Column", required: true },
}, { 
    toJSON: { virtuals: true }, 
    versionKey: false 
});

module.exports = mongoose.model("Card", cardSchema);