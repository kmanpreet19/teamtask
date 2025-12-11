import { NextFunction, Request, Response } from 'express';


import { ZodError } from "zod";
import { formatZodError } from "../utils/format-zod-error";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction)  => {
  console.log("ERROR:", err);

  // If it's a Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formatZodError(err)
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
