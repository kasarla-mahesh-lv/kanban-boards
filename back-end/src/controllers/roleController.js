const Role = require("../models/role");

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissionIds");
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};