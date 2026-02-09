const History = require("../models/history");

// GET history by boardId
exports.getBoardHistory = async (req, res) => {
  try {
    const { boardId } = req.params;

    if (!boardId) {
      return res.status(400).json({ message: "boardId is required" });
    }

    const history = await History.find({ boardId })
      .sort({ createdAt: -1 });

    res.status(200).json(history);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
