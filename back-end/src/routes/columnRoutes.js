const express = require("express");
const router = express.Router();
const columnController = require("../controllers/columnController");

// The "||" check prevents the crash if the controller is missing a function
router.get("/", columnController.getAllColumns || ((req, res) => res.send("Controller not found")));

module.exports = router;