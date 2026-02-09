const History = require("../models/history");

const logHistory = async (data) => {
  try {
    await History.create(data);
  } catch (error) {
    console.log("History log error:", error.message);
  }
};

module.exports = logHistory;
