import { Prisma } from "@prisma/client";
import {
  createProject as repoCreateProject,
  getProjects as repoGetProjects,
  getProjectById as repoGetProjectById,
  updateProject as repoUpdateProject,
  deleteProject as repoDeleteProject,
} from "../repositories/project.repo";

/**
 * Simple HttpError class so services can throw structured errors
 * Your error middleware should read `err.status` and `err.message`.
 */
class HttpError extends Error {
  status: number;
  details?: any;
  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
    // maintain proper prototype chain for `instanceof`
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}


export const createProjectService = async (payload: {
  name: string;
  description?: string;
  ownerId: string;
}) => {
  try {
    const project = await repoCreateProject({
      name: payload.name,
      description: payload.description,
      ownerId: payload.ownerId,
    });

    return project;
  } catch (err: any) {
    // translate prisma errors if necessary
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // example: handle constraint errors
      return Promise.reject(new HttpError(400, "Database error", err.meta));
    }
    return Promise.reject(err);
  }
};

/**
 * getProjectsService
 * - Returns paginated projects of a user
 * - page & limit are sanitized here (defaults & bounds)
 */
export const getProjectsService = async (ownerId: string, page = 1, limit = 10) => {
  // sanitize page & limit
  const p = Math.max(1, Number.isFinite(+page) ? Math.floor(+page) : 1);
  let l = Number.isFinite(+limit) ? Math.floor(+limit) : 10;
  l = Math.min(Math.max(1, l), 100); // allow 1..100

  const result = await repoGetProjects(ownerId, p, l);
  return result;
};

/**
 * getProjectByIdService
 * - Return project if exists, otherwise throw 404
 * - Optionally can load relations (e.g., tasks) later
 */
export const getProjectByIdService = async (projectId: string, requestingUserId?: string) => {
  const project = await repoGetProjectById(projectId);
  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  // optional: if you want to restrict view to owner only, enable this:
  // if (project.ownerId !== requestingUserId) throw new HttpError(403, "Forbidden");

  return project;
};

/**
 * updateProjectService
 * - Only owner can update the project
 * - Returns updated project
 */
export const updateProjectService = async (
  projectId: string,
  requestingUserId: string,
  data: { name?: string; description?: string }
) => {
  const project = await repoGetProjectById(projectId);
  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  if (project.ownerId !== requestingUserId) {
    throw new HttpError(403, "You are not allowed to update this project");
  }

  try {
    const updated = await repoUpdateProject(projectId, {
      name: data.name,
      description: data.description,
    });
    return updated;
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return Promise.reject(new HttpError(400, "Database error", err.meta));
    }
    return Promise.reject(err);
  }
};

/**
 * deleteProjectService
 * - Only owner can delete the project
 * - Returns deleted project info (or message)
 */
export const deleteProjectService = async (projectId: string, requestingUserId: string) => {
  const project = await repoGetProjectById(projectId);
  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  if (project.ownerId !== requestingUserId) {
    throw new HttpError(403, "You are not allowed to delete this project");
  }

  try {
    const deleted = await repoDeleteProject(projectId);
    return deleted;
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return Promise.reject(new HttpError(400, "Database error", err.meta));
    }
    return Promise.reject(err);
  }
};
