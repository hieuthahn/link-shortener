import { IUser } from '@/models';
import User, { PaginateOptions } from '@/models/user.model';
import httpStatus from 'http-status';
import { FilterQuery, QueryOptions } from 'mongoose';

const createUser = async (userBody: IUser) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Email already taken');
  }
  return User.create(userBody);
};

const queryUsers = async (filter: FilterQuery<any>, options: PaginateOptions) => {
  const users = await User.paginate(filter, options);
  return users;
};

const getUserById = async (userId: string) => {
  return User.findById(userId);
};

const getUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

const updateUserById = async (userId: string, updateBody: {} extends IUser) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.deleteOne();
  return user;
};

export { createUser, queryUsers, getUserById, getUserByEmail, updateUserById, deleteUserById };
