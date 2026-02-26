const Permission = require("../models/permissions");

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Permissions fetched successfully",
      count: permissions.length,
      data: permissions,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


