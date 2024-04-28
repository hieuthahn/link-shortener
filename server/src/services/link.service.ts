import config from '@/config/config';
import { ILink, IUser, PaginateOptions } from '@/models';
import Link from '@/models/link.model';
import ApiError from '@/utils/ApiError';
import dayjs from 'dayjs';
import httpStatus from 'http-status';
import { FilterQuery } from 'mongoose';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

const getShortenLinks = async (filter: FilterQuery<any>, options: PaginateOptions) => {
  return await Link.paginate(filter, options);
};
const createShortenLink = async (linkBody: ILink, user: IUser) => {
  const { expirationDate, shortCode: customShortCode } = linkBody;
  let shortCode = customShortCode || nanoid(config.link.shortCodeLength);
  let exists = await Link.findOne({ shortCode });

  if (shortCode && (await Link.isShortCodeTaken(shortCode))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Custom short code already taken');
  }

  while (exists && !customShortCode) {
    shortCode = nanoid(config.link.shortCodeLength);
    exists = await Link.findOne({ shortCode });
  }
  const expireAt = expirationDate
    ? dayjs(expirationDate).valueOf()
    : dayjs().add(config.link.defaultExpirationDays, 'day').valueOf();
  if (expireAt <= dayjs().valueOf()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Expiration date must be in the future');
  }
  if (user) {
    linkBody.user = user;
  }
  return Link.create({ ...linkBody, expirationDate: expireAt, shortCode });
};

const getShortenLinkByShortCode = async (shortCode: string) => {
  return Link.findOne({ shortCode });
};

const updateShortenLinkById = async (linkId: string, updateBody: Partial<ILink>) => {
  const { shortCode } = updateBody;

  if (shortCode && (await Link.isShortCodeTaken(shortCode))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Short code already taken');
  }
  return Link.findOneAndUpdate({ _id: linkId }, updateBody, { new: Object.keys(updateBody).length > 0 });
};

const deleteShortenLinkById = async (linkId: string) => {
  return Link.findByIdAndDelete(linkId);
};

export { getShortenLinks, createShortenLink, getShortenLinkByShortCode, updateShortenLinkById, deleteShortenLinkById };
