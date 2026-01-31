const router = require("express").Router();
const { createColumn, updateColumn, deleteColumn } = require("../controllers/columnController");

router.post("/boards/:boardId/columns", createColumn);
router.patch("/boards/:boardId/columns/:columnId", updateColumn);


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

// delete route 
router.delete("/columns/:columnId",deleteColumn);


module.exports = router;
