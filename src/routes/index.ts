import express from "express";
const router = express.Router();
import authController from "../controllers/authentication/authView";
import taskView from "../controllers/task-management/taskView";
import verifySignUp from "../middlewares/verifySignUp";
import authJwt from "../middlewares/authJwt";

router.post("/auth/login", authController.signin);

router.post(
  "/auth/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  authController.createUser
);

router.get("/auth/users", [authJwt.verifyToken], authController.getAllUsers);

router.get("/tasks", [authJwt.verifyToken], taskView.getAllTasksHandler);
router.get("/tasks/:id", [authJwt.verifyToken], taskView.getTaskHandler);
router.post("/tasks", [authJwt.verifyToken], taskView.createTaskHandler);
router.put("/tasks/:id", [authJwt.verifyToken], taskView.updateTaskHandler);
router.delete("/tasks/:id", [authJwt.verifyToken], taskView.deleteTaskHandler);

router.post(
  "/tasks/:id/reassign",
  [authJwt.verifyToken, authJwt.isAdmin],
  taskView.reAssignTask
);

module.exports = router;

export = router;
