import mongoose from 'mongoose';

interface ITag extends Document {
  name: string;
  created_at: Date;
  updated_at: Date;
}

const tagSchema = new mongoose.Schema<ITag>(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Tag = mongoose.model<ITag>('Tag', tagSchema);

export default Tag;
