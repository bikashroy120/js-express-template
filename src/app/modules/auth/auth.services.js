import prisma from '../../../config/database.js';
import config from '../../../config/index.js';
import ApiError from '../../../errors/ApiError.js';
import authEmitter from '../../events/emailEvents.js';
import { comparePassword, hashPassword } from '../../helpers/bcrypt.js';
import { createToken, verifyToken } from '../../helpers/jwtHelpers.js';
import crypto from 'crypto';

const register = async (data) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (user) {
    throw new ApiError(400, 'User already exists');
  }

  const hash = await hashPassword(data.password);
  //   const otpToken = crypto.randomInt(1000, 9999).toString();
  //   const tokenExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const newUser = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash,
        role: data.role,
      },
    });

    // await tx.verificationToken.create({
    //   data: {
    //     userId: createdUser.id,
    //     token: otpToken,
    //     expiresAt: tokenExpiry,
    //     type: 'VERIFY_EMAIL',
    //   },
    // });

    return createdUser;
  });

  const { password, ...userWithoutPassword } = newUser;

  const payload = {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = createToken(payload, config.jwt.accessTokenSecret, '7d');
  const refreshToken = createToken(
    payload,
    config.jwt.refreshTokenSecret,
    '30d',
  );

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

const login = async (data) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid email or password');
  }
  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(400, 'Invalid email or password');
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(payload, config.jwt.accessTokenSecret, '7d');
  const refreshToken = createToken(
    payload,
    config.jwt.refreshTokenSecret,
    '30d',
  );

  const { password, ...otherData } = user;

  return {
    user: otherData,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token) => {
  const decoded = verifyToken(token, config.jwt.refreshTokenSecret);
  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = createToken(
    payload,
    config.jwt.accessTokenSecret,
    '7d',
  );

  const newRefreshToken = createToken(
    payload,
    config.jwt.refreshTokenSecret,
    '30d',
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const otpToken = crypto.randomInt(100000, 1000000).toString();
  const tokenExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      token: otpToken,
      expiresAt: tokenExpiry,
      type: 'RESET_PASSWORD',
    },
  });

  // Emit event to send OTP email
  authEmitter.emit('send-otp', {
    email: user.email,
    name: user.name,
    otp: otpToken,
  });

  const responseData = {
    message: 'OTP sent to email',
    ...(config.nodeEnv === 'development' && { otp: otpToken }),
    email: user.email,
  };

  return responseData;
};

const resendOtp = async (email, type) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const otpToken = crypto.randomInt(100000, 1000000).toString();
  const tokenExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      token: otpToken,
      expiresAt: tokenExpiry,
      type,
    },
  });

  // Emit event to send OTP email
  authEmitter.emit('send-otp', {
    email: user.email,
    name: user.name,
    otp: otpToken,
  });

  const responseData = {
    message: 'OTP resent to email',
    ...(config.nodeEnv === 'development' && { otp: otpToken }),
  };

  return responseData;
};

const verifyOtp = async (email, otp, type) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const tokenRecord = await prisma.verificationToken.findFirst({
    where: {
      userId: user.id,
      token: otp,
      type: 'RESET_PASSWORD',
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!tokenRecord) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  if (new Date() > tokenRecord.expiresAt) {
    await prisma.verificationToken.delete({ where: { id: tokenRecord.id } });
    throw new ApiError(400, 'OTP code has expired.');
  }

  if (type === 'VERIFY_EMAIL') {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });
      await tx.verificationToken.delete({ where: { id: tokenRecord.id } });
    });

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = createToken(
      payload,
      config.jwt.accessTokenSecret,
      '7d',
    );
    const refreshToken = createToken(
      payload,
      config.jwt.refreshTokenSecret,
      '30d',
    );

    const { password, ...otherData } = user;

    return {
      user: otherData,
      accessToken,
      refreshToken,
    };
  }

  if (type === 'RESET_PASSWORD') {
    const temporaryResetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      await tx.verificationToken.delete({ where: { id: tokenRecord.id } });
      await tx.verificationToken.create({
        data: {
          userId: tokenRecord.userId,
          type: 'RESET_PASSWORD',
          expiresAt: tokenExpiry,
          token: temporaryResetToken,
        },
      });
    });

    return {
      email: user.email,
      temporaryResetToken,
    };
  }

  return { message: 'OTP verified successfully' };
};

const resetPassword = async (data) => {
  if (data.password !== data.confirmPassword) {
    throw new ApiError(400, 'Password and confirm password do not match');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const tokenRecord = await prisma.verificationToken.findFirst({
    where: {
      userId: user.id,
      token: data.temporaryResetToken,
      type: 'RESET_PASSWORD',
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!tokenRecord) {
    throw new ApiError(400, 'Invalid or expired reset password token');
  }

  const hash = await hashPassword(data.password);

  await prisma.user.update({
    where: {
      email: data.email,
    },
    data: {
      password: hash,
    },
  });

  return { message: 'Password reset successfully' };
};

export const authService = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resendOtp,
  verifyOtp,
  resetPassword,
};
