const Card = require("../models/card");

exports.createCard = async (req, res) => {
    try {
        const newCard = new Card(req.body);
        const savedCard = await newCard.save();
        res.status(201).json(savedCard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getCardsByColumnId = async (req, res) => {
    try {
        const cards = await Card.find({ columnId: req.params.columnId });
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};