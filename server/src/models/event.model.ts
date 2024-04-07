import mongoose from 'mongoose';
import { ILink } from './link.model';

interface IEvent extends Document {
  type: string;
  link: ILink;
  eventData: any;
  createdAt: Date;
}

const eventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    link: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Link',
      required: true,
    },
    eventData: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;
