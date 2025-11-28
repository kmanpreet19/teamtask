import { Request, Response, NextFunction } from 'express'
import * as authService from '../services/auth.service'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body
    const result = await authService.registerService({ email, password, name })
    return res.status(201).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const result = await authService.loginService({ email, password })
    return res.status(200).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id
    const result = await authService.getMeService(userId)
    return res.status(200).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}
