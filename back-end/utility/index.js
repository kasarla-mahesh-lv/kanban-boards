const seedPermissions = require("./permissionSeeder");
const seedRoles = require("./roles.seeder");

const runSeeders = async () => {
  await seedPermissions();
  await seedRoles();
};

module.exports = runSeeders;