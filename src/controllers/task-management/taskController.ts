const db = require("../../models");
const Task = db.task;

interface TaskData {
  title: string;
  description?: string;
  assigned_to: number;
  status: "pending" | "active" | "completed" | "deferred" | "rejected";
  start_date?: Date;
  end_date?: Date;
}

export const getAllTasks = async (limit: number = 2, offset: number = 0) => {
  return await Task.findAll({
    limit,
    offset,
  });
};

export const getTaskById = async (id: number) => {
  const task = await Task.findByPk(id);
  if (!task) {
    throw new Error("Task not found");
  }
  return task;
};

export const createTask = async (taskData: TaskData) => {
  const taskWithDefaults = {
    ...taskData,
    status: taskData.status ?? "pending",
  };

  const task = await Task.create(taskWithDefaults);
  if (!task) {
    throw new Error("Failed to create task");
  }
  return task;
};

export const updateTask = async (id: number, taskData: Partial<TaskData>) => {
  const [affectedCount] = await Task.update(taskData, {
    where: { id },
  });

  if (affectedCount === 0) {
    throw new Error("Task not found or no changes made");
  }

  return await getTaskById(id);
};

export const deleteTask = async (id: number) => {
  const deletedCount = await Task.destroy({
    where: { id },
  });

  if (deletedCount === 0) {
    throw new Error("Task not found");
  }

  return { message: "Task deleted successfully" };
};

export default {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
