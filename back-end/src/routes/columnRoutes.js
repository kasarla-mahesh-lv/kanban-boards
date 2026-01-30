const express = require("express");
const router = express.Router();
const Column = require("../models/Column");

router.get("/api/columns", async (req, res) => {
  try {
    const columns = await Column.find()
      .sort({ order: 1 })
      .populate({
        path: "cards",
        options: { sort: { order: 1 } }
      });

    res.status(200).json(columns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
