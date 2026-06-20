import express from 'express';
import validate from '../../middlewares/validate.js';
import { authController } from './auth.controller.js';
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from './auth.validation.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  authController.refreshToken,
);
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post('/resend-otp', validate(resendOtpSchema), authController.resendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword,
);
router.post('/change-password', authController.changePassword);
router.get('/profile', auth(), authController.getProfile);
router.post('/change-password', auth(), authController.changePassword);

export const authRoute = router;
