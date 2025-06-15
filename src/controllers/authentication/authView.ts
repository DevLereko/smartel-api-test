import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import authenticationController from "./authController";

const createUser = async (req: Request, res: Response): Promise<void> => {
  const user = await authenticationController.createUser({
    username: req.body.username,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    roles: req.body.roles,
  });

  if (!user) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Failed to create user",
    });
  }

  res.status(StatusCodes.OK).send({
    message: "User created successfully",
    user,
  });
};

const signin = async (req: Request, res: Response) => {
  try {
    const user = await authenticationController.signin(
      req.body.username,
      req.body.password
    );
    res.status(StatusCodes.OK).send({
      message: "Login successfully",
      user,
    });
  } catch (err: any) {
    if (err.message === "User Not found.") {
      res.status(StatusCodes.NOT_FOUND).send({ message: err.message });
    } else if (err.message === "Invalid Password!") {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: err.message, accessToken: null });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    }
  }
};

export default { createUser, signin };
