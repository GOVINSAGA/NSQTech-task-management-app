import { Request, Response, NextFunction } from 'express';

export const delayMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const delayMs = parseInt(req.query.delay as string, 10);

  if (delayMs && delayMs > 0 && delayMs <= 10000) {
    console.log(`[Delay] Simulating ${delayMs}ms API latency for ${req.method} ${req.path}`);
    setTimeout(() => next(), delayMs);
  } else {
    next();
  }
};
