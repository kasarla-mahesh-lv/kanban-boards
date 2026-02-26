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
          "CREATE_TASKTOPROJECT",
          "UPDATE_TASKINPROJECT",
          "VIEW_TASK",
          "DELETE_TASK",
          "VIEW_ROLE",
          "CREATE_ROLE",
          "UPDATE_ROLE",
          "DELETE_ROLE",
          "UPDATE_USERROLE",
          "VIEW_PERMISSIONS",
          "VIEW_TEAMMEMBERS",
          "CREATE_TEAMMEMBER",
          "VIEW_TEAMMEMBERBYPROJECTID",
          "VIEW_TEAMMEMBERBYID",
          "UPDATE_TEAMMEMBER",
          "DELETE_TEAMMEMBER",
          "CREATE_ACCEPTINVITATION",
          "CREATE_TEAMMEMBERLOGIN",
          "CREATE_CARD",
          "UPDATE_CARD",
          "UPDATE_MOVECARD",
          "VIEW_CARDS",
          "DELETE_CARD",
          "VIEW_HISTORY",
          "VIEW_TASKHISTORY",
          "VIEW_PROJECTS",
          "CREATE_PROJECT",
          "VIEW_OPENPROJECT",
          "VIEW_PROJECTBYID",
          "UPDATE_ROLEPERMISSIONS",
          "DELETE_ROLEPERMISSIONS",
          "VIEW_COLUMNSBYPROJECT",
          "CREATE_COLUMN",
          "UPDATE_COLUMN",
          "DELETE_COLUMN"
        ]
      },
      {
        name: "teamlead",
        description: "Team Lead role",
        permissionKeys: [
          "CREATE_TASKTOPROJECT",
          "UPDATE_TASKINPROJECT",
          "VIEW_PROJECTTASKS",
          "VIEW_TASKBYTASKIDINPROJECT",
          "VIEW_COLUMNSTASKS",
          "VIEW_ROLE",
          "VIEW_PERMISSIONS",
          "VIEW_TEAMMEMBERS",
          "VIEW_TEAMMEMBERBYPROJECTID",
          "VIEW_TEAMMEMBERBYID",
          "CREATE_TEAMMEMBERLOGIN",
          "CREATE_CARD",
          "UPDATE_CARD",
          "UPDATE_MOVECARD",
          "VIEW_CARDS",
          "VIEW_HISTORY",
          "VIEW_TASKHISTORY",
        ]
      },
      {
        name: "employee",
        description: "Employee role",
        permissionKeys: ["VIEW_TASK","VIEW_ROLE","VIEW_PERMISSIONS","VIEW_TEAMMEMBERS","VIEW_TEAMMEMBERBYPROJECTID",
          "VIEW_TEAMMEMBERBYID", "CREATE_ACCEPTINVITATION","VIEW_CARDS","VIEW_HISTORY","VIEW_TASKHISTORY"]
      }
    ];

    for (const role of roles) {

  let permissionIds = [];

  if (role.permissionKeys.includes("ALL")) {
    permissionIds = permissions.map(p => p._id);
  } else {
    permissionIds = role.permissionKeys.map(k => permMap[k]);
  }

  await Role.findOneAndUpdate(
    { name: role.name },
    {
      name: role.name,
      description: role.description,
      permissionIds
    },
    { upsert: true, new: true }
  );

  console.log(`✅ Role synced: ${role.name}`);
}
  } catch (err) {
    console.error("❌ Role seeding failed", err.message);
  }
};

module.exports = seedRoles;