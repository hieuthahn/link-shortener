import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

const createUser = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
  }),
});

const getUsers = z.object({
  query: z.object({
    name: z.string().optional(),
    sortBy: z.string().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  }),
});

const getUser = z.object({
  params: z.object({
    userId: z.string().refine((value) => isValidObjectId(value)),
  }),
});

const updateUser = z.object({
  params: z.object({
    userId: z.string().refine((value) => isValidObjectId(value)),
  }),
  body: z.object({
    email: z.string().email().optional(),
    password: z.string().optional(),
    name: z.string().optional(),
  }),
});

const updateUserBody = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
  name: z.string().optional(),
});

const deleteUser = z.object({
  params: z.object({
    userId: z.string().refine((value) => isValidObjectId(value)),
  }),
});

export { createUser, getUsers, getUser, updateUser, updateUserBody, deleteUser };
