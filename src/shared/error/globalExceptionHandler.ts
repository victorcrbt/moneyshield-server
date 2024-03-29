import { Request, Response, NextFunction } from 'express';

import AppError from './AppError';

export default function globalExceptionHandler(
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction
): Response {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error(err);

  return res.status(500).json({ error: 'Internal server error.' });
}
