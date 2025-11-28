import { NextFunction, Request, Response } from 'express'
import { ZodSchema } from 'zod'

export const validate = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, params: req.params, query: req.query })
    return next()
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.errors ?? err.message })
  }
}
