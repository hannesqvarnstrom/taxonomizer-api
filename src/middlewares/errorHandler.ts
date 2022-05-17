import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

declare type WebError = Error & { status?: number };
export const errorHandler = (err: WebError, req: Request, res: Response, next: NextFunction): Response => {
  res.status(err.status || 500);
  return res.send({ error: err })
};

export const errorNotFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  next(createError(404));
};
