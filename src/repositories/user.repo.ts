import { prisma } from '../prisma/client'
import type { User } from '@prisma/client'

export const createUser = async (data: { email: string; password: string; name?: string; role?: 'USER' | 'ADMIN' }) => {
  return prisma.user.create({ data })
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } })
}

export const findUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } })
}
