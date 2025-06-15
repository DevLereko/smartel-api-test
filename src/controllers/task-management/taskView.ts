import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import taskController from "./taskController";
import {
  TaskNotFoundError,
  ValidationError,
} from "../../errors/TaskNotFoundError";
import {
  taskCreateSchema,
  taskUpdateSchema,
  taskIdSchema,
} from "../../errors/taskSchema";

export const getAllTasksHandler = async (req: Request, res: Response) => {
  try {
    const tasks = await taskController.getAllTasks();
    res.status(StatusCodes.OK).json(tasks);
  } catch (err: unknown) {
    handleError(res, err);
  }
};

export const getTaskHandler = async (req: Request, res: Response) => {
  try {
    const { error, value } = taskIdSchema.validate(Number(req.params.id));
    if (error) {
      throw new ValidationError(error.details.map((d) => d.message).join(", "));
    }

    const task = await taskController.getTaskById(value);
    res.status(StatusCodes.OK).json(task);
  } catch (err: unknown) {
    handleError(res, err);
  }
};

export const createTaskHandler = async (req: Request, res: Response) => {
  try {
    const { error, value } = taskCreateSchema.validate(req.body);
    if (error) {
      throw new ValidationError(error.details.map((d) => d.message).join(", "));
    }

    const task = await taskController.createTask(value);
    res.status(StatusCodes.CREATED).json({
      message: "Task created successfully",
      task,
    });
  } catch (err: unknown) {
    handleError(res, err);
  }
};

export const updateTaskHandler = async (req: Request, res: Response) => {
  try {
    // Validate ID
    const idValidation = taskIdSchema.validate(Number(req.params.id));
    if (idValidation.error) {
      throw new ValidationError(
        idValidation.error.details.map((d) => d.message).join(", ")
      );
    }

    // Validate body
    const { error, value } = taskUpdateSchema.validate(req.body);
    if (error) {
      throw new ValidationError(error.details.map((d) => d.message).join(", "));
    }

    const task = await taskController.updateTask(idValidation.value, value);
    res.status(StatusCodes.OK).json({
      message: "Task updated successfully",
      task,
    });
  } catch (err: unknown) {
    handleError(res, err);
  }
};

export const deleteTaskHandler = async (req: Request, res: Response) => {
  try {
    const { error, value } = taskIdSchema.validate(Number(req.params.id));
    if (error) {
      throw new ValidationError(error.details.map((d) => d.message).join(", "));
    }

    const result = await taskController.deleteTask(value);
    res.status(StatusCodes.OK).json(result);
  } catch (err: unknown) {
    handleError(res, err);
  }
};

const reAssignTask = async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.id);
    const { newUserId } = req.body;

    if (!newUserId) {
      throw new ValidationError("New user ID is required for reassignment");
    }

    const task = await taskController.reAssignTask(taskId, newUserId);
    res.status(StatusCodes.OK).json({
      message: "Task reassigned successfully",
      task,
    });
  } catch (err: unknown) {
    handleError(res, err);
  }
};

function handleError(res: Response, err: unknown) {
  if (err instanceof ValidationError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: err.message,
    });
  } else if (err instanceof TaskNotFoundError) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: err.message,
    });
  } else if (err instanceof Error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message || "Internal server error",
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unknown error occurred",
    });
  }
}

export default {
  getAllTasksHandler,
  getTaskHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
  reAssignTask,
};
