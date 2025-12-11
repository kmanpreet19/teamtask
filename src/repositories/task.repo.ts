import { prisma } from "../prisma/client";

/**
 * Create a new task
 */
export const createTask = async (data: {
  title: string;
  description?: string;
  projectId: string;
  assignedTo?: string | null;
}) => {
  return prisma.task.create({
    data,
  });
};

/**
 * Get tasks by project with optional status filter
 */
export const getTasks = async (
  projectId: string,
  filters: { status?: string }
) => {
  return prisma.task.findMany({
    where: {
      projectId,
      ...(filters.status && { status: filters.status }), // optional
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Get a single task by ID
 */
export const getTaskById = async (id: string) => {
  return prisma.task.findUnique({
    where: { id },
  });
};

/**
 * Update a task (title, description, status, assignedTo)
 */
export const updateTask = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    status?: string;
    assignedTo?: string | null;
  }
) => {
  return prisma.task.update({
    where: { id },
    data
  });
};

/**
 * Delete task
 */
export const deleteTask = async (id: string) => {
  return prisma.task.delete({
    where: { id },
  });
};
