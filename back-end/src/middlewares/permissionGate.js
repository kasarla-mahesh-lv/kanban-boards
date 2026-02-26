const UserModel = require("../models/User");

const permissionGate = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.user._id)
        .populate({
          path: "roles",
          populate: {
            path: "permissionIds"
          }
        });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const hasPermission = user.roles.some(role => {
        console.log("Role:", role.name);
        return role.permissionIds.some(permission => {
          console.log("Permission key:", permission.key);
          console.log("Required:", requiredPermission);
          return permission.key === requiredPermission;
        });
      });

      if (!hasPermission) {
        return res.status(403).json({
          message: "Access Denied. Permission required."
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};

// Make sure this line is present
module.exports = permissionGate;