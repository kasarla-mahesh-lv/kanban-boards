const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema({
    title: { type: String, required: true },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true }
}, { 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
    versionKey: false 
});

// Link Column to Cards
columnSchema.virtual('cards', {
    ref: 'Card',
    localField: '_id',
    foreignField: 'columnId'
});

module.exports = mongoose.model("Column", columnSchema);
