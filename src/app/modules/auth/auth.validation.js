import { UserRole } from '@prisma/client';
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
      })
      .min(4, 'Password must be at least 4 characters long'),
    role: z.enum(UserRole).default(UserRole.USER),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
      })
      .min(4, 'Password must be at least 4 characters long'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
      invalid_type_error: 'Refresh token must be a string',
    }),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    type: z.enum(['VERIFY_EMAIL', 'RESET_PASSWORD'], {
      required_error: 'Type is required',
      invalid_type_error: 'Type must be either VERIFY_EMAIL or RESET_PASSWORD',
    }),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    otp: z.string({
      required_error: 'OTP is required',
      invalid_type_error: 'OTP must be a string',
    }),
    type: z.enum(['VERIFY_EMAIL', 'RESET_PASSWORD'], {
      required_error: 'Type is required',
      invalid_type_error: 'Type must be either VERIFY_EMAIL or RESET_PASSWORD',
    }),
  }),
});

export const resetPasswordSchema = z
  .object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      password: z
        .string({
          required_error: 'Password is required',
          invalid_type_error: 'Password must be a string',
        })
        .min(4, 'Password must be at least 4 characters long'),
      confirmPassword: z
        .string({
          required_error: 'Confirm Password is required',
          invalid_type_error: 'Confirm Password must be a string',
        })
        .min(4, 'Confirm Password must be at least 4 characters long'),
      temporaryResetToken: z.string({
        required_error: 'Temporary reset token is required',
        invalid_type_error: 'Temporary reset token must be a string',
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
  });
