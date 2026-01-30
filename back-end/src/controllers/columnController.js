const Column = require("../models/Column");

// MUST have 'exports.' before the function name
exports.getAllColumns = async (req, res) => { 
    try {
        const columns = await Column.find().populate('cards');
        res.status(200).json(columns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};