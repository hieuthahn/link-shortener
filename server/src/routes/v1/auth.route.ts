import { authController } from '@/controllers';
import auth from '@/middlewares/auth';
import validate from '@/middlewares/validate';
import { authValidation } from '@/validations';
import express from 'express';

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('./logout', validate(authValidation.logout), authController.logout);
router.post('/refreshTokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgotPassword', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/resetPassword', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/sendVerificationEmail', auth(), authController.sendVerificationEmail);
router.post('/verifyEmail', validate(authValidation.verifyEmail), authController.verifyEmail);

export default router;
