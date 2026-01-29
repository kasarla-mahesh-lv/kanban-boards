const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
    title: { type: String, required: true },
}, { 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
    versionKey: false 
});

// Link Board to Columns
boardSchema.virtual('columns', {
    ref: 'Column',
    localField: '_id',
    foreignField: 'boardId'
});

module.exports = mongoose.model("Board", boardSchema);