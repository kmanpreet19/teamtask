import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { validate } from '../middlewares/validate.middleware'
import { registerSchema, loginSchema } from '../validators/auth.validator'
import { authMiddleware } from '../middlewares/auth.middleware'
import rateLimit from 'express-rate-limit'

const router = Router()

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: { success: false, message: 'Too many requests, try later' }
})

router.post('/register', authLimiter, validate(registerSchema), authController.register)
router.post('/login', authLimiter, validate(loginSchema), authController.login)
router.get('/me', authMiddleware, authController.getMe)

export default router
