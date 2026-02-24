const Permission = require("../src/models/permissions");

const defaultPermissions = [
  { key: "ALL", description: "Full system access" },

  { key: "CREATE_USER", description: "Create users" },
  { key: "UPDATE_USER", description: "Update users" },
  { key: "DELETE_USER", description: "Delete users" },

  { key: "CREATE_PROJECT", description: "Create project" },
  { key: "UPDATE_PROJECT", description: "Update project" },
  { key: "DELETE_PROJECT", description: "Delete project" },

  { key: "CREATE_TASK", description: "Create task" },
  { key: "UPDATE_TASK", description: "Update task" },
  { key: "DELETE_TASK", description: "Delete task" },
  { key: "VIEW_TASK", description: "View task" }
];

const seedPermissions = async () => {
  try {
    for (const perm of defaultPermissions) {
      const exists = await Permission.findOne({ key: perm.key });
      if (!exists) {
        await Permission.create(perm);
        console.log(`✅ Permission created: ${perm.key}`);
      }
    }
  } catch (err) {
    console.error("❌ Permission seeding failed", err.message);
  }
};

module.exports = seedPermissions;