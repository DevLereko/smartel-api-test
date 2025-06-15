import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import taskController from "./taskController";

export const getAllTasksHandler = async (req: Request, res: Response) => {
  try {
    const tasks = await taskController.getAllTasks();
    res.status(StatusCodes.OK).json(tasks);
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

export const getTaskHandler = async (req: Request, res: Response) => {
  try {
    const task = await taskController.getTaskById(Number(req.params.id));
    res.status(StatusCodes.OK).json(task);
  } catch (err: any) {
    if (err.message === "Task not found") {
      res.status(StatusCodes.NOT_FOUND).json({
        message: err.message,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: err.message,
      });
    }
  }
};

export const createTaskHandler = async (req: Request, res: Response) => {
  try {
    const task = await taskController.createTask(req.body);
    res.status(StatusCodes.CREATED).json({
      message: "Task created successfully",
      task,
    });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

export const updateTaskHandler = async (req: Request, res: Response) => {
  try {
    const task = await taskController.updateTask(
      Number(req.params.id),
      req.body
    );
    res.status(StatusCodes.OK).json({
      message: "Task updated successfully",
      task,
    });
  } catch (err: any) {
    if (err.message === "Task not found or no changes made") {
      res.status(StatusCodes.NOT_FOUND).json({
        message: err.message,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: err.message,
      });
    }
  }
};

export const deleteTaskHandler = async (req: Request, res: Response) => {
  try {
    const result = await taskController.deleteTask(Number(req.params.id));
    res.status(StatusCodes.OK).json(result);
  } catch (err: any) {
    if (err.message === "Task not found") {
      res.status(StatusCodes.NOT_FOUND).json({
        message: err.message,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: err.message,
      });
    }
  }
};

export default {
  getAllTasksHandler,
  getTaskHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
};
