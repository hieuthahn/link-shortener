import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

const getShortenLinks = z.object({
  query: z.object({
    shortCode: z.string().optional(),
    originalUrl: z.string().optional(),
    sortBy: z.string().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  }),
});

const createShortenLink = z.object({
  body: z.object({
    user: z.any().optional(),
    originalUrl: z.string().url().trim(),
    shortCode: z.string().optional(),
    clickCount: z.number().optional(),
    utmParameters: z
      .object({
        utmSource: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
        utmContent: z.string().optional(),
        utmTerm: z.string().optional(),
      })
      .optional(),
    customSocialCards: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
      })
      .optional(),
    geoTargeting: z
      .array(
        z.object({
          countryCode: z.string(),
          redirectUrl: z.string(),
        })
      )
      .optional(),
    expirationDate: z.string().datetime().optional(),
    linkCloaking: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    password: z.string().optional(),
    apiAccess: z
      .object({
        hasAccess: z.boolean(),
        apiKey: z.string(),
      })
      .optional(),
  }),
});

const getShortenLinkByShortCode = z.object({
  params: z.object({
    shortCode: z.string(),
  }),
});

const updateShortenLinkById = z.object({
  params: z.object({
    linkId: z.string().refine((value) => isValidObjectId(value), 'Invalid linkId'),
  }),
  body: z.object({
    shortCode: z.string().optional(),
    utmParameters: z
      .object({
        utmSource: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
        utmContent: z.string().optional(),
        utmTerm: z.string().optional(),
      })
      .optional(),
    customSocialCards: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
      })
      .optional(),
    geoTargeting: z
      .array(
        z.object({
          countryCode: z.string(),
          redirectUrl: z.string(),
        })
      )
      .optional(),
    expirationDate: z.string().datetime().optional(),
    linkCloaking: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    password: z.string().optional(),
  }),
});

const deleteShortenLinkById = z.object({
  params: z.object({
    linkId: z.string(),
  }),
});

export { getShortenLinks, createShortenLink, getShortenLinkByShortCode, updateShortenLinkById, deleteShortenLinkById };
