import { TokenType } from '@/config/token';
import mongoose from 'mongoose';
import { toJSON } from './plugin';
import { IUser } from './user.model';

export interface IToken extends Document {
  token: string;
  user: IUser;
  type: string;
  expires: Date | boolean;
  blacklisted: boolean;
}

const tokenSchema = new mongoose.Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: TokenType,
    },
    expires: {
      type: Date,
      default: false,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

tokenSchema.plugin(toJSON);

const Token = mongoose.model<IToken>('Token', tokenSchema);

export default Token;
