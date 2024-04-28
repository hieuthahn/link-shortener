import mongoose, { Document, FilterQuery, Model, Types } from 'mongoose';
import validator from 'validator';
import { toJSON } from './plugin';
import bcrypt from 'bcrypt';
import { boolean } from 'zod';
import paginate from './plugin/paginate.plugin';

// Document interface
export interface IUser extends Document {
  username?: string;
  fullName?: string;
  email: string;
  imageUrl?: string;
  phoneNumber?: string;
  password: string;
  passwordEnabled: boolean;
  externalAccounts: Types.DocumentArray<ExternalAccount>;
  isEmailVerified: boolean;
}

interface ExternalAccount {
  provider: string;
  providerUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  username: string | null;
}

interface IUserMethods {
  isPasswordMatch(password: string): Promise<boolean>;
}

export type PaginateQueryResult = {
  results: Document[];
  page: number;
  limit: number;
  totalPages: number;
  totalResult: number;
};

export type PaginateOptions = {
  sortBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
};

interface UserModel extends Model<IUser, {}, IUserMethods> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
  paginate(filter: FilterQuery<object>, options: PaginateOptions): Promise<PaginateQueryResult>;
}

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      trim: true,
      index: true,
      square: true,
      unique: true,
      default: null,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error(`Invalid email`);
        }
      },
    },
    phoneNumber: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      square: true,
      default: null,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      trim: true,
      minLength: 6,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    passwordEnabled: {
      type: Boolean,
      default: true,
    },
    externalAccounts: {
      type: [
        {
          provider: String,
          providerUserId: String,
          email: String,
          firstName: String,
          lastName: String,
          avatarUrl: String,
          username: String,
        },
      ],
      default: [],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.statics.isEmailTaken = async function (email: string, excludeUserId: string) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password: string) {
  const user = this;
  return bcrypt.compare(password, user.password) as boolean;
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 6);
  }
  user.passwordEnabled = user.password.length > 0 ? true : false;
  user.fullName =
    user.username ||
    user.email ||
    user.phoneNumber ||
    user.externalAccounts.map((account) => account.firstName + ' ' + account.lastName).join(' ');
  next();
});

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
