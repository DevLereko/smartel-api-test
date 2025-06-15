import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email } = req.body;

    // Check Username
    const userByUsername = await User.findOne({
      where: { username: username },
    });
    if (userByUsername) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: "Failed! Username is already in use!" });
      return; // Just return without returning the response
    }

    // Check Email
    const userByEmail = await User.findOne({ where: { email: email } });
    if (userByEmail) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: "Failed! Email is already in use!" });
      return;
    }

    next();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: "An error occurred" });
  }
};

const checkRolesExisted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { roles } = req.body;
    if (roles) {
      for (let i = 0; i < roles.length; i++) {
        if (!ROLES.includes(roles[i])) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: "Failed! Role does not exist = " + roles[i] });
          return;
        }
      }
    }
    next();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: "An error occurred" });
  }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

export default verifySignUp;
