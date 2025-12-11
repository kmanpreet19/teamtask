import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";

import {
  createTaskSchema,
  updateTaskSchema,
  getTasksQuerySchema,
} from "../validators/task.validator";

import {
  createTaskController,
  getTasksController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/task.controller";

const router = Router();

/*@route POST /api/tasks*/
router.post(
  "/",
  authMiddleware,
  validate(createTaskSchema),
  createTaskController
);

/*@route GET /api/tasks?projectId=...&status=...Get tasks of a specific project*/
router.get(
  "/",
  authMiddleware,
  validate(getTasksQuerySchema),
  getTasksController
);

/* @route PATCH /api/tasks/:id*/
router.patch(
  "/:id",
  authMiddleware,
  validate(updateTaskSchema),
  updateTaskController
);

/* @route DELETE /api/tasks/:id*/
router.delete(
  "/:id",
  authMiddleware,
  deleteTaskController
);

export default router;
