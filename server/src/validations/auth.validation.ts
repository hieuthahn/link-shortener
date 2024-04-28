import { z } from 'zod';

const register = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
    username: z.string().optional(),
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
});

const login = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

const logout = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

const refreshTokens = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

const forgotPassword = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const resetPassword = z.object({
  query: z.object({
    token: z.string(),
  }),
  body: z.object({
    password: z.string(),
  }),
});

const verifyEmail = z.object({
  query: z.object({
    token: z.string(),
  }),
});

export { register, login, logout, refreshTokens, forgotPassword, resetPassword, verifyEmail };
