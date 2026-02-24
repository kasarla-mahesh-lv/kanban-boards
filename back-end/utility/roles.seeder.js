const Role = require("../src/models/role");
const Permission = require("../src/models/permissions");

const seedRoles = async () => {
  try {
    const permissions = await Permission.find();

    const permMap = {};
    permissions.forEach(p => {
      permMap[p.key] = p._id;
    });

    const roles = [
      {
        name: "admin",
        description: "System Administrator",
        permissionKeys: ["ALL"]
      },
      {
        name: "manager",
        description: "Manager role",
        permissionKeys: [
          "CREATE_PROJECT",
          "UPDATE_PROJECT",
          "CREATE_TASK",
          "UPDATE_TASK",
          "VIEW_TASK"
        ]
      },
      {
        name: "teamlead",
        description: "Team Lead role",
        permissionKeys: [
          "CREATE_TASK",
          "UPDATE_TASK",
          "VIEW_TASK"
        ]
      },
      {
        name: "employee",
        description: "Employee role",
        permissionKeys: ["VIEW_TASK"]
      }
    ];

    for (const role of roles) {
      const exists = await Role.findOne({ name: role.name });
      if (!exists) {
        await Role.create({
          name: role.name,
          description: role.description,
          permissionIds: role.permissionKeys.map(k => permMap[k])
        });
        console.log(`✅ Role created: ${role.name}`);
      }
    }
  } catch (err) {
    console.error("❌ Role seeding failed", err.message);
  }
};

module.exports = seedRoles;