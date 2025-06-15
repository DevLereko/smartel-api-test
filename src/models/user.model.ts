module.exports = (
  sequelize: {
    define: (
      arg0: string,
      arg1: {
        username: { type: string };
        phoneNumber: { type: string; unique: boolean };
        email: { type: string; unique: boolean };
        password: { type: string };
      }
    ) => any;
  },
  Sequelize: { STRING: string }
) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
    },
    phoneNumber: {
      type: Sequelize.STRING,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
