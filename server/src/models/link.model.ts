import mongoose, { Document, FilterQuery, Model } from 'mongoose';
import { IUser, PaginateOptions, PaginateQueryResult } from './user.model';
import { toJSON } from './plugin';
import paginate from './plugin/paginate.plugin';

export interface ILink extends Document {
  user: IUser;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
  clickCount?: number;
  utmParameters: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
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
  password?: string;
  apiAccess: {
    hasAccess: boolean;
    apiKey?: string;
  };
}

interface LinkModel extends Model<ILink, {}, {}> {
  isShortCodeTaken(shortCode: string): Promise<boolean>;
  paginate(filter: FilterQuery<object>, options: PaginateOptions): Promise<PaginateQueryResult>;
}

const linkSchema = new mongoose.Schema<ILink, LinkModel, {}>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    originalUrl: {
      type: String,
      required: true,
    },
    shortCode: { type: String, required: true, unique: true },
    clickCount: { type: Number, default: 0 },
    utmParameters: {
      utmSource: { type: String, default: '' },
      utmMedium: { type: String, default: '' },
      utmCampaign: { type: String, default: '' },
      utmContent: { type: String, default: '' },
      utmTerm: { type: String, default: '' },
    },
    customSocialCards: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      image: { type: String, default: '' },
    },
    geoTargeting: [
      {
        countryCode: String,
        redirectUrl: String,
      },
    ],
    expirationDate: { type: Date },
    linkCloaking: { type: Boolean, default: true },
    tags: [{ type: String }],
    password: { type: String },
    apiAccess: {
      hasAccess: { type: Boolean },
      apiKey: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

linkSchema.plugin(paginate);

linkSchema.statics.isShortCodeTaken = async function (shortCode: string) {
  const link = await this.findOne({ shortCode });
  return !!link;
};

const Link = mongoose.model<ILink, LinkModel>('Link', linkSchema);

export default Link;
