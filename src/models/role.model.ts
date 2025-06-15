module.exports = (
  sequelize: {
    define: (
      arg0: string,
      arg1: {
        id: { type: number; primaryKey: boolean };
        name: { type: string };
        description?: { type: string };
      }
    ) => any;
  },
  Sequelize: { INTEGER: number; STRING: string }
) => {
  const Role = sequelize.define("roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
  });

  return Role;
};
