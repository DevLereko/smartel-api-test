import express from "express";
const router = express.Router();
import authController from "../controllers/authentication/authView";
import verifySignUp from "../middlewares/verifySignUp";

router.post("/auth/login", authController.signin);

router.post(
  "/auth/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  authController.createUser
);
module.exports = router;

export = router;
