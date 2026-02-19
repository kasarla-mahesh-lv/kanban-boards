const HistoryModel = require("../models/history");
const { createHistorySchema } = require("../validators/historyValidator");


// ✅ Get Full History
exports.getAllHistory = async (req, res) => {
  try {

    const history = await HistoryModel.find()
      .sort({ createdAt: -1 });

    res.status(200).json(history);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ Get History By Task
exports.getTaskHistory = async (req, res) => {
  try {

    const { taskId } = req.params;

    const history = await HistoryModel.find({ taskId })
      .sort({ createdAt: -1 });

    res.status(200).json(history);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.createHistory = async (req, res) => {
  try {
    const { error } = createHistorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }
    const { taskId, activity } = req.body;

    if (!taskId || !activity) {
      return res.status(400).json({
        message: "taskId and activity are required"
      });
    }

    const history = await HistoryModel.create({
      taskId,
      activity,
      createdBy: req.user?.name || "Unknown",
      personId: req.user?.id
    });

    res.status(201).json(history);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
