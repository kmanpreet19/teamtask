import { prisma } from "../prisma/client";

export const createProject = async (data: {
  name: string;
  description?: string;
  ownerId: string;
}) => {
  return prisma.project.create({
    data,
  });
};

/**
 * Get all projects of a user with pagination */
export const getProjects = async (ownerId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.count({ where: { ownerId } }),
  ]);

  return {
    projects,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


export const getProjectById = async (id: string) => {
  return prisma.project.findUnique({
    where: { id },
  });
};

export const updateProject = async (
  id: string,
  data: { name?: string; description?: string }
) => {
  return prisma.project.update({
    where: { id },
    data,
  });
};

export const deleteProject = async (id: string) => {
  return prisma.project.delete({
    where: { id },
  });
};
