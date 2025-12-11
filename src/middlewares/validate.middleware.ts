import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export const validate = (schema: z.ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {

  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query
    });
    next();
  } catch (err: any) {
    next(err);  // pass it to error middleware
  }
};
