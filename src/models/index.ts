const config = require("../config/db.config");
const db: any = {};

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model")(sequelize, Sequelize);
db.role = require("../models/role.model")(sequelize, Sequelize);
db.task = require("../models/task.model")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
});

db.task.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

db.user.hasMany(db.task, {
  foreignKey: "userId",
  as: "tasks",
});

db.ROLES = ["user", "admin", "moderator"];

/** Default Roles Initialization */
db.initializeRoles = async () => {
  const count = await db.role.count();
  if (count === 0) {
    console.log("Initializing roles...");
    await db.role.bulkCreate([
      { id: 1, name: "User", description: "Basic user" },
      { id: 2, name: "Admin", description: "Administrator" },
      { id: 3, name: "Moderator", description: "Moderator user" },
    ]);
    console.log("Default roles have been added.");
  } else {
    console.log("Roles already initialized. Skipping seeding.");
  }
};

module.exports = db;
