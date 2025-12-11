import { z } from "zod";

/**
 * Allowed Task Status values (must match your Prisma enum)
 */
export const TaskStatusEnum = z.enum(["OPEN", "IN_PROGRESS", "DONE"]);

/**
 * Create Task Validation
 */
export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Task title must be at least 3 characters long"),
    description: z.string().optional(),
    projectId: z.string().uuid("Invalid project ID"),
    assignedTo: z.string().uuid("Invalid user ID").optional(),
  }),
});

/**
 * Update Task Validation
 */
export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters").optional(),
    description: z.string().optional(),
    status: TaskStatusEnum.optional(),
    assignedTo: z.string().uuid("Invalid user ID").optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid task ID"),
  })
});

/**
 * Get Tasks by Project Validation (optional)
 */
export const getTasksQuerySchema = z.object({
  query: z.object({
    projectId: z.string().uuid("Invalid project ID"),
    status: TaskStatusEnum.optional(),
  }),
});
