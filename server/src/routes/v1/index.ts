import express from 'express';
import authRouter from './auth.route';
import linkRouter from './link.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    router: authRouter,
  },
  {
    path: '/shorten',
    router: linkRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
