const Card = require("../models/card");

// GET ONLY: Fetch all cards from the database
exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find(); // specific command to find data
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};