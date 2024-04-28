import { linkService } from '@/services';
import ApiError from '@/utils/ApiError';
import catchAsync from '@/utils/catchAsync';
import { getPublicIp, getPublicIpGeo } from '@/utils/ipGeo';
import pick from '@/utils/pick';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

const getShortenLinks = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['shortCode', 'originalUrl']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await linkService.getShortenLinks(filter, options);
  return result;
});

const createShortenLink = catchAsync(async (req: Request, res: Response) => {
  const linkBody = req.body;
  const result = await linkService.createShortenLink(linkBody, req.user);
  res.status(httpStatus.CREATED).send({ data: result });
});

const getShortenLinkByShortCode = catchAsync(async (req: Request, res: Response) => {
  const { shortCode } = req.params;
  const result = await linkService.getShortenLinkByShortCode(shortCode as string);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link not found');
  }

  const { expirationDate, geoTargeting } = result;

  if (dayjs().isAfter(dayjs(expirationDate))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link expired');
  }

  if (geoTargeting && geoTargeting?.length > 0) {
    const publicIp = (await getPublicIp()) || '';
    const ipGeo = await getPublicIpGeo(publicIp);
    result.ipGeo = ipGeo;
  }

  res.send(result);
});

const updateShortenLinkById = catchAsync(async (req: Request, res: Response) => {
  const { linkId } = req.params;
  const linkBody = req.body;
  const result = await linkService.updateShortenLinkById(linkId, linkBody);
  res.send(result);
});

const deleteShortenLinkById = catchAsync(async (req: Request, res: Response) => {
  const { linkId } = req.params;
  await linkService.deleteShortenLinkById(linkId);
  res.status(httpStatus.NO_CONTENT).send();
});

export { getShortenLinks, createShortenLink, getShortenLinkByShortCode, updateShortenLinkById, deleteShortenLinkById };
