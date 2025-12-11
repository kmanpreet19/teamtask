import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Project name must be at least 3 characters long"),
    description: z.string().optional(),
  })
});

/**
 * Update Project Validation
 * - name and description are optional, 
 *   but if provided must be valid
 */
export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Project name must be at least 3 characters").optional(),
    description: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid project ID"),
  })
});
