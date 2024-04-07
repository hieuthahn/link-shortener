import mongoose, { Document } from 'mongoose';
import { ILink } from './link.model';

interface IClick extends Document {
  link: ILink;
  clickedAt: Date;
  referrer?: string;
  userAgent?: string;
  ip?: string;
  geoLocation?: {
    country?: string;
    city?: string;
  };
  utmParams?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

const clickSchema = new mongoose.Schema<IClick>({
  link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: true,
  },
  clickedAt: {
    type: Date,
    default: Date.now,
  },
  referrer: { type: String },
  userAgent: { type: String },
  ip: { type: String },
  geoLocation: {
    country: { type: String },
    city: { type: String },
  },
  utmParams: {
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },
  },
});

const Click = mongoose.model<IClick>('Click', clickSchema);

export default Click;
