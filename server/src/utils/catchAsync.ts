import { NextFunction } from 'express';

const catchAsync = (fn: (arg0: Request, arg1: Response, arg2: NextFunction) => any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = catchAsync;
