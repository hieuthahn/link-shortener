// src/middleware/validationMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import httpStatus from 'http-status';
import pick from '@/utils/pick';

const validate = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const object = pick(req, ['params', 'query', 'body']);
      schema.parse(object);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message.toLowerCase()}`,
        }));
        res.status(httpStatus.BAD_REQUEST).json({ error: 'Invalid data', details: errorMessages });
      } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
      }
    }
  };
};

export default validate;
