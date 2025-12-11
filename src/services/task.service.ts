import { Prisma } from "@prisma/client";
import { createTask, getTaskById, getTasks, updateTask, deleteTask } from "../repositories/task.repo";
import { getProjectById } from "../repositories/project.repo";
import { prisma } from "../prisma/client";

/**
 * HttpError class
 * Used to throw structured errors handled by error middleware
 */
class HttpError extends Error {
  status: number;
  details?: any;
  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

/**
 * Create Task Service
 * - Project must exist
 * - Only owner can create tasks
 * - If assignedTo provided → must be a valid user
 */
export const createTaskService = async (payload: {
  title: string;
  description?: string;
  projectId: string;
  assignedTo?: string;
  requestingUserId: string;
}) => {
  // 1. Check if project exists
  const project = await getProjectById(payload.projectId);
  if (!project) throw new HttpError(404, "Project not found");

  // 2. Only project owner can create tasks
  if (project.ownerId !== payload.requestingUserId) {
    throw new HttpError(403, "You are not allowed to create tasks in this project");
  }

  // 3. assignedTo validation
  if (payload.assignedTo) {
    const user = await prisma.user.findUnique({ where: { id: payload.assignedTo } });
    if (!user) throw new HttpError(404, "Assigned user not found");
  }

  // 4. Create task
  const task = await createTask({
    title: payload.title,
    description: payload.description,
    projectId: payload.projectId,
    assignedTo: payload.assignedTo ?? null,
  });

  return task;
};

/**
 * Get Tasks Service
 * - Checks project ownership
 * - Allows optional status filter
 */
export const getTasksService = async (
  projectId: string,
  requestingUserId: string,
  filters: { status?: string }
) => {
  const project = await getProjectById(projectId);
  if (!project) throw new HttpError(404, "Project not found");

  // Only owner can view all tasks
  if (project.ownerId !== requestingUserId) {
    throw new HttpError(403, "You are not allowed to view tasks of this project");
  }

  const tasks = await getTasks(projectId, filters);
  return tasks;
};

/**
 * Update Task Service
 * - Task must exist
 * - Only owner OR assigned user can update
 */
export const updateTaskService = async (
  taskId: string,
  requestingUserId: string,
  data: { title?: string; description?: string; status?: string; assignedTo?: string }
) => {
  const task = await getTaskById(taskId);
  if (!task) throw new HttpError(404, "Task not found");

  // Fetch project (for owner check)
  const project = await getProjectById(task.projectId);
  if (!project) throw new HttpError(404, "Project not found");

  // Permission: owner OR assigned user
  const isOwner = project.ownerId === requestingUserId;
  const isAssignee = task.assignedTo === requestingUserId;

  if (!isOwner && !isAssignee) {
    throw new HttpError(403, "You are not allowed to update this task");
  }

  // If changing assigned user
  if (data.assignedTo) {
    const user = await prisma.user.findUnique({ where: { id: data.assignedTo } });
    if (!user) throw new HttpError(404, "Assigned user not found");
  }

  const updated = await updateTask(taskId, data);
  return updated;
};

/**
 * Delete Task Service
 * - Only project owner can delete task
 */
export const deleteTaskService = async (taskId: string, requestingUserId: string) => {
  const task = await getTaskById(taskId);
  if (!task) throw new HttpError(404, "Task not found");

  const project = await getProjectById(task.projectId);
  if (!project) throw new HttpError(404, "Project not found");

  // Only owner can delete
  if (project.ownerId !== requestingUserId) {
    throw new HttpError(403, "You are not allowed to delete this task");
  }

  await deleteTask(taskId);
  return { message: "Task deleted successfully" };
};
