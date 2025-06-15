import Joi from "joi";

export const taskCreateSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().max(500).optional(),
  assigned_to: Joi.number().integer().positive().required(),
  status: Joi.string()
    .valid("pending", "active", "completed", "deferred", "rejected")
    .default("pending"),
  start_date: Joi.date().optional(),
  end_date: Joi.date().greater(Joi.ref("start_date")).optional(),
}).options({ abortEarly: false });

export const taskUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
  assigned_to: Joi.number().integer().positive().optional(),
  status: Joi.string()
    .valid("pending", "active", "completed", "deferred", "rejected")
    .optional(),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional(),
}).options({ abortEarly: false });

export const taskIdSchema = Joi.number().integer().positive().required();
