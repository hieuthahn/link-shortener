import mongoose, { Document } from 'mongoose';
import { IUser } from './user.model';

export interface ILink extends Document {
  user: IUser;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
  clickCount: number;
  utmParameters: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
  customSocialCards?: {
    title?: string;
    description?: string;
    image?: string;
  };
  geoTargeting?: Array<{
    countryCode: string;
    redirectUrl: string;
  }>;
  expirationDate?: Date;
  linkCloaking: boolean;
  tags: string[];
  apiAccess: {
    hasAccess: boolean;
    apiKey?: string;
  };
}

const linkSchema = new mongoose.Schema<ILink>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
    shortCode: { type: String, required: true, unique: true },
    clickCount: { type: Number, default: 0 },
    utmParameters: {
      utmSource: String,
      utmMedium: String,
      utmCampaign: String,
    },
    customSocialCards: {
      title: String,
      description: String,
      image: String,
    },
    geoTargeting: [
      {
        countryCode: String,
        redirectUrl: String,
      },
    ],
    expirationDate: { type: Date },
    linkCloaking: { type: Boolean, default: false },
    tags: [{ type: String }],
    apiAccess: {
      hasAccess: { type: Boolean, default: false },
      apiKey: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const Link = mongoose.model<ILink>('Link', linkSchema);

export default Link;
