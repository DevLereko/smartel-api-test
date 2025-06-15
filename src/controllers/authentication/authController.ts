const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require("../../models");
const config = require("../../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

export const createUser = async (userData: {
  username: string;
  email: string;
  phoneNumber?: string;
  password: string;
  roles?: string[];
}) => {
  const { username, email, phoneNumber, password, roles } = userData;
  const user = await User.create({
    username,
    email,
    phoneNumber,
    password: bcrypt.hashSync(password, 8),
  });

  if (roles) {
    const roleRecords = await Role.findAll({
      where: {
        name: {
          [Op.or]: roles,
        },
      },
    });
    await user.setRoles(roleRecords);
  } else {
    await user.setRoles([2]);
  }

  if (!user) {
    throw new Error("Failed to create user");
  }

  return user;
};

const signin = async (username: string, password: string) => {
  const user = await User.findOne({
    where: {
      username,
    },
  });

  if (!user) {
    throw new Error("User Not found.");
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    throw new Error("Invalid Password!");
  }

  const token = jwt.sign({ id: user.id }, config.secret, {
    algorithm: "HS256",
    allowInsecureKeySizes: true,
    expiresIn: 86400, // 24 hours
  });

  const roles = await user.getRoles();
  const authorities = roles.map(
    (role: any) => "ROLE_" + role.name.toUpperCase()
  );

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: authorities,
    accessToken: token,
  };
};

export default { createUser, signin };
