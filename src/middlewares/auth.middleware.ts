import { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../utils/jwt.util'

export const authMiddleware = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ success: false, message: 'Unauthorized' })
  const token = authHeader.split(' ')[1]
  const payload = verifyJwt(token)
  if (!payload) return res.status(401).json({ success: false, message: 'Invalid token' })
  // payload type is any
  // @ts-ignore
  req.user = { id: (payload as any).sub, role: (payload as any).role }
  return next()
}
