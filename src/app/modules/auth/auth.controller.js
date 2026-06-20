import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import { authService } from './auth.services.js';

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Token refreshed successfully',
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'If the email exists, a reset code has been sent',
    data: result,
  });
});

const resendOtp = catchAsync(async (req, res) => {
  const { email, type } = req.body;
  const result = await authService.resendOtp(email, type);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'If the email exists, a reset code has been sent',
    data: result,
  });
});

const verifyOtp = catchAsync(async (req, res) => {
  const { email, otp, type } = req.body;
  const result = await authService.verifyOtp(email, otp, type);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OTP verified successfully',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { email, password, confirmPassword, temporaryResetToken } = req.body;
  const result = await authService.resetPassword({
    email,
    password,
    confirmPassword,
    temporaryResetToken,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password reset successfully',
    data: result,
  });
});

const getProfile = catchAsync(async (req, res) => {
  const userId = req?.user?.id;
  const result = await authService.getProfile(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const result = await authService.changePassword({
    userId,
    currentPassword,
    newPassword,
    confirmNewPassword,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

export const authController = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resendOtp,
  verifyOtp,
  resetPassword,
  getProfile,
  changePassword,
};
