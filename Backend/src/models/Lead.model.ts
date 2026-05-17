import mongoose, { Document, Schema } from 'mongoose';
import { LeadStatus, LeadSource } from '../types/lead.types';

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Qualified', 'Lost'],
        message: 'Status must be one of: New, Contacted, Qualified, Lost',
      },
      default: 'New',
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      enum: {
        values: ['Website', 'Instagram', 'Referral'],
        message: 'Source must be one of: Website, Instagram, Referral',
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast search on name + email
leadSchema.index({ name: 'text', email: 'text' });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.model<ILead>('Lead', leadSchema);
export default Lead;
