import bcrypt from 'bcrypt'
import { createUser, findUserByEmail, findUserById } from '../repositories/user.repo'
import { signJwt } from '../utils/jwt.util'

export async function registerService(payload: { email: string; password: string; name?: string }) {
  const existing = await findUserByEmail(payload.email)
  if (existing) {
    const err: any = new Error('User already exists')
    err.status = 409
    throw err
  }

  const hashed = await bcrypt.hash(payload.password, 12)
  const user = await createUser({ email: payload.email, password: hashed, name: payload.name })
  const accessToken = signJwt({ sub: user.id, role: user.role })
  return { user: { id: user.id, email: user.email, name: user.name }, accessToken }
}

export async function loginService(payload: { email: string; password: string }) {
  const user = await findUserByEmail(payload.email)
  if (!user) {
    const err: any = new Error('Invalid credentials')
    err.status = 401
    throw err
  }
  const match = await bcrypt.compare(payload.password, user.password)
  if (!match) {
    const err: any = new Error('Invalid credentials')
    err.status = 401
    throw err
  }
  const accessToken = signJwt({ sub: user.id, role: user.role })
  return { user: { id: user.id, email: user.email, name: user.name }, accessToken }
}

export async function getMeService(userId: string) {
  const user = await findUserById(userId)
  if (!user) {
    const err: any = new Error('User not found')
    err.status = 404
    throw err
  }
  return { id: user.id, email: user.email, name: user.name, role: user.role }
}
