const HistoryModel = require("../models/history");

exports.getAllHistory = async (req, res) => {
  try {

    const history = await HistoryModel.find()
      .sort({ createdAt: -1 });

    res.status(200).json(history);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
