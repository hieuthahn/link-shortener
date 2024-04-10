import express from 'express';
import authRouter from './auth.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    router: authRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
