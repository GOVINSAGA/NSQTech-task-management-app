import mongoose, { Document, Schema } from 'mongoose';

export interface IRecord extends Document {
  title: string;
  description: string;
  category: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: mongoose.Types.ObjectId;
  accessLevel: 'general' | 'admin';
  referenceId: string;
  createdAt: Date;
  updatedAt: Date;
}

const recordSchema = new Schema<IRecord>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Support Ticket', 'Bug Report', 'Feature Request', 'Maintenance', 'Security Audit'],
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    accessLevel: {
      type: String,
      enum: ['general', 'admin'],
      default: 'general',
    },
    referenceId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

recordSchema.pre('save', function (next) {
  if (!this.referenceId) {
    const prefix = this.category.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.referenceId = `${prefix}-${rand}`;
  }
  next();
});

recordSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => {
    delete ret.__v;
    return ret;
  },
});

export const Record = mongoose.model<IRecord>('Record', recordSchema);
