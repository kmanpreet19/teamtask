import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";

import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.validator";

import {
  createProjectController,
  getProjectsController,
  getProjectByIdController,
  updateProjectController,
  deleteProjectController,
} from "../controllers/project.controller";

const router = Router();

/*@route POST /api/projects  (Create) */
router.post(
  "/",
  authMiddleware,
  validate(createProjectSchema),
  createProjectController
);

/*@route GET /api/projects Get all projects for logged-in user with pagination
 */
router.get(
  "/",
  authMiddleware,
  getProjectsController
);

/* @route GET /api/projects/:id*/
router.get(
  "/:id",
  authMiddleware,
  getProjectByIdController
);

/*@route PATCH /api/projects/:id */
router.patch(
  "/:id",
  authMiddleware,
  validate(updateProjectSchema),
  updateProjectController
);

/*@route DELETE /api/projects/:id*/
router.delete(
  "/:id",
  authMiddleware,
  deleteProjectController
);

export default router;
