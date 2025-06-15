import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

type DecodedId = {
  id: number;
};

const User = require("../models").user;

export const getUserById = async (id: number) => {
  return await User.findByPk(id);
};

export const checkUserRole = async (userId: number, roleName: string) => {
  const user = await getUserById(userId);
  if (!user) return false;
  const roles = await user.getRoles();
  return roles.some((role: any) => role.name === roleName);
};

export const checkUserRoles = async (userId: number, roleNames: string[]) => {
  const user = await getUserById(userId);
  if (!user) return false;
  const roles = await user.getRoles();
  return roles.some((role: any) => roleNames.includes(role.name));
};

const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers["x-access-token"] as string;

  if (!token) {
    res.status(StatusCodes.FORBIDDEN).send({
      message:
        "No token provided!, please provide token to access this resource!",
    });
  }

  jwt.verify(token, config.secret, (err: Error, decoded: DecodedId) => {
    if (err) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        message:
          "Provided token is expired or invalid, please provide a valid token!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req: any, res: Response, next: () => void) => {
  try {
    const hasRole = await checkUserRole(req.userId, "admin");
    if (hasRole) {
      return next();
    }
    res.status(StatusCodes.FORBIDDEN).send({
      message: "Require Admin Role!",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Internal server error!",
    });
  }
};

const isModerator = async (req: any, res: Response, next: () => void) => {
  try {
    const hasRole = await checkUserRole(req.userId, "moderator");
    if (hasRole) {
      return next();
    }
    res.status(StatusCodes.FORBIDDEN).send({
      message: "Require Moderator Role!",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Internal server error!",
    });
  }
};

const isModeratorOrAdmin = async (
  req: any,
  res: Response,
  next: () => void
) => {
  try {
    const hasRole = await checkUserRoles(req.userId, ["moderator", "admin"]);
    if (hasRole) {
      return next();
    }
    res.status(StatusCodes.FORBIDDEN).send({
      message: "Require Moderator or Admin Role!",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Internal server error!",
    });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
};

export default authJwt;
