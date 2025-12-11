import { Request, Response, NextFunction } from "express";
import {
  createTaskService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
} from "../services/task.service";

/**
 * Create Task
 */
export const createTaskController = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const requestingUserId = req.user.id;
    const { title, description, projectId, assignedTo } = req.body;

    const task = await createTaskService({
      title,
      description,
      projectId,
      assignedTo,
      requestingUserId,
    });

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Tasks (filter by project & optional status)
 */
export const getTasksController = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const requestingUserId = req.user.id;
    const projectId = req.query.projectId as string;
    const status = req.query.status as string | undefined;

    const tasks = await getTasksService(projectId, requestingUserId, {
      status,
    });

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Task
 */
export const updateTaskController = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const requestingUserId = req.user.id;
    const taskId = req.params.id;

    const { title, description, status, assignedTo } = req.body;

    const updated = await updateTaskService(taskId, requestingUserId, {
      title,
      description,
      status,
      assignedTo,
    });

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Task
 */
export const deleteTaskController = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const requestingUserId = req.user.id;
    const taskId = req.params.id;

    const result = await deleteTaskService(taskId, requestingUserId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};
