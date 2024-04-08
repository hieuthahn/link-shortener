import { NextFunction, Request } from 'express';
import httpStatus from 'http-status';
import passport from 'passport';

const verifyCallback =
  (req: Request, resolve: (any?: any) => void, reject: (any?: any) => void, requiredRights: any[]) =>
  async (err: any, user: any, info: any) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;

    resolve();
  };

const auth =
  (...requiredRights: any[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(
        req,
        res,
        next
      );
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
