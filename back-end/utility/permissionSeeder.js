const Permission = require("../src/models/permissions");

const defaultPermissions = [
  { key: "ALL", description: "Full system access" },

  { key: "CREATE_USER", description: "Create users" },
  { key: "UPDATE_USER", description: "Update users" },
  { key: "DELETE_USER", description: "Delete users" },

  //cardroutes
  { key: "CREATE_CARD", description: "create card" },
  { key: "UPDATE_CARD", description: "update card" },
  { key: "UPDATE_MOVECARD", description: "update movecard" },
  { key: "VIEW_CARDS", description: "view cards" },
  { key: "DELETE_CARD", description: "delete card" },

  //columnroutes
  { key: "VIEW_COLUMNSBYPROJECT", description: "get columns by project" },
  { key: "CREATE_COLUMN", description: "create column" },
  { key: "UPDATE_COLUMN", description: "update column" },
  { key: "DELETE_COLUMN", description: "delete column" },

  //historyroutes
  { key: "VIEW_HISTORY", description: "get all history" },
  { key: "VIEW_TASKHISTORY", description: "view task history" },
  { key: "CREATE_HISTORY", description: "create history" },

  //projectroutes
  { key: "CREATE_PROJECT", description: "Create project" },
  { key: "UPDATE_PROJECT", description: "Update project" },
  { key: "DELETE_PROJECT", description: "Delete project" },
  { key: "VIEW_PROJECT", description: "View project" },
  { key: "VIEW_OPENPROJECT", description: "view open project" },
  { key: "VIEW_PROJECTBYID", description: "View ProjectByID" },

  //TASKROUTES
  { key: "VIEW_PROJECTTASKS", description: "view project tasks" },
  { key: "CREATE_TASKTOPROJECT", description: "create task to project" },
  { key: "VIEW_TASKBYTASKIDINPROJECT", description: "view task by taskid in project" },
  { key: "UPDATE_TASKINPROJECT", description: "Update task in project" },
  { key: "DELETE_TASKINPROJECT", description: "Delete task in project" },
  { key: "VIEW_COLUMNSTASKS", description: "View columnstasks" },

  //roleroutes
  {key:"VIEW_ROLE",description:"View Role"},
  {key:"CREATE_ROLE",description:"Create Role"},
  {key:"UPDATE_ROLE",description:"Update Role"},
  {key:"DELETE_ROLE",description:"Delete Role"},
  {key:"UPDATE_ROLEPERMISSIONS",description:"update role permissions"},
  {key:"DELETE_ROLEPERMISSIONS",description:"Delete role permissions"},
  {key:"UPDATE_USERROLE",description:"Update User Role"},


  //permissionroutes
  {key:"VIEW_PERMISSIONS",description:"View permissions"},

  //teamroutes
  {key:"VIEW_TEAMMEMBERS",description:""},
  {key:"CREATE_TEAMMEMBER",description:""},
  {key:"VIEW_TEAMMEMBERBYPROJECTID",description:""},
  {key:"VIEW_TEAMMEMBERBYID",description:""},
  {key:"UPDATE_TEAMMEMBER",description:""},
  {key:"DELETE_TEAMMEMBER",description:""},
  {key:"CREATE_ACCEPTINVITATION",description:""},
  {key:"CREATE_TEAMMEMBERLOGIN",description:""},

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