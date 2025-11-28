import { NextFunction, Request, Response } from 'express'

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  const details = err.details || null
  return res.status(status).json({ success: false, message, details })
}
