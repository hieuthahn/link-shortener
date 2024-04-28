import httpStatus from 'http-status';
import { tokenService, userService } from '.';
import Token from '@/models/token.model';
import { TokenType } from '@/config/token';
import ApiError from '@/utils/ApiError';

const loginUserWithEmailAndPassword = async (email: string, password: string) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const logout = async (refreshToken: string) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: TokenType.REFRESH, blacklisted: false });
  console.log(refreshTokenDoc);
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.deleteOne();
};

const refreshAuth = async (refreshToken: string) => {
  try {
    console.log('first', refreshToken);
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, TokenType.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user._id);
    if (!user) {
      throw new Error();
    }
    if (refreshTokenDoc.blacklisted) {
      throw new Error('blacklisted user');
    }
    const token = tokenService.generateAuthTokens(user._id);
    await refreshTokenDoc.deleteOne();
    return token;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error?.message || 'Please authenticate');
  }
};

const resetPassword = async (resetPasswordToken: string, newPassword: string) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, TokenType.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user._id);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user._id, { password: newPassword });
    await Token.deleteMany({ user: user._id, type: TokenType.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const verifyEmail = async (verifyEmailToken: string) => {
  try {
    const verifyTokenDoc = await tokenService.verifyToken(verifyEmailToken, TokenType.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyTokenDoc.user._id);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user._id, type: TokenType.VERIFY_EMAIL });
    await userService.updateUserById(user._id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

export { loginUserWithEmailAndPassword, logout, refreshAuth, resetPassword, verifyEmail };
