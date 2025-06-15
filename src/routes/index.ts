import express from "express";
const router = express.Router();
import authController from "../controllers/authentication/authView";
import taskView from "../controllers/task-management/taskView";
import verifySignUp from "../middlewares/verifySignUp";

router.post("/auth/login", authController.signin);

router.post(
  "/auth/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  authController.createUser
);

router.get("/tasks", taskView.getAllTasksHandler);
router.get("/tasks/:id", taskView.getTaskHandler);
router.post("/tasks", taskView.createTaskHandler);
router.put("/tasks/:id", taskView.updateTaskHandler);
router.delete("/tasks/:id", taskView.deleteTaskHandler);

module.exports = router;

export = router;
