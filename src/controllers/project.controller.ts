import { Request, Response, NextFunction } from "express";
import {
  createProjectService,
  getProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
} from "../services/project.service";


export const createProjectController = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user.id; // from auth middleware
    const { name, description } = req.body;

    const project = await createProjectService({
      name,
      description,
      ownerId,
    });

    return res.status(201).json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

/* Get All Projects (with pagination)*/
export const getProjectsController = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user.id;

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const result = await getProjectsService(ownerId, page, limit);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectByIdController = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;

    const project = await getProjectByIdService(projectId, userId);

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};


export const updateProjectController = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;

    const { name, description } = req.body;

    const updatedProject = await updateProjectService(projectId, userId, {
      name,
      description,
    });

    return res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProjectController = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;

    await deleteProjectService(projectId, userId);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
