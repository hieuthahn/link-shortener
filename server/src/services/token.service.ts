import config from '@/config/config';
import { TokenType } from '@/config/token';
import { IUser } from '@/models';
import Token from '@/models/token.model';
import dayjs, { Dayjs } from 'dayjs';
import jwt from 'jsonwebtoken';
import { userService } from '.';
import httpStatus from 'http-status';
import ApiError from '@/utils/ApiError';

const generateToken = (userId: string, expires: Dayjs, type: TokenType, secret: string = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: dayjs().unix(),
    exp: dayjs(expires).unix(),
    type,
  };

  return jwt.sign(payload, secret);
};

const saveToken = async (token: string, userId: string, expires: Dayjs, type: TokenType, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires,
    type,
    blacklisted,
  });
  return tokenDoc;
};

const verifyToken = async (token: string, type: TokenType) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

const generateAuthTokens = async (user: IUser) => {
  const accessTokenExpires = dayjs().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user._id, accessTokenExpires, TokenType.ACCESS);
  const refreshTokenExpires = dayjs().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user._id, refreshTokenExpires, TokenType.REFRESH);
  await saveToken(refreshToken, user._id, refreshTokenExpires, TokenType.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const generateVerifyEmailToken = async (user: IUser) => {
  const expires = dayjs().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user._id, expires, TokenType.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user._id, expires, TokenType.VERIFY_EMAIL);
  return verifyEmailToken;
};

const generateResetPasswordToken = async (email: string) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this email');
  }
  const expires = dayjs().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(email, expires, TokenType.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user._id, expires, TokenType.RESET_PASSWORD);
  return resetPasswordToken;
};

export {
  generateToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  saveToken,
  verifyToken,
};
