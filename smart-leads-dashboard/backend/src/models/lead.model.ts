import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { LeadSource, LeadStatus } from '../types/lead.types';

// ── Lead Document Interface ────────────────────────────────────────────────
export interface ILeadDocument extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  // ObjectId reference to the User who created this lead
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

type ILeadModel = Model<ILeadDocument>;

const leadSchema = new Schema<ILeadDocument, ILeadModel>(
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
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'] as LeadStatus[],
      default: 'New' as LeadStatus,
      required: [true, 'Status is required'],
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'] as LeadSource[],
      required: [true, 'Source is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator user reference is required'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────
// Compound and individual indexes for faster filtering, searching, and sorting.
// Text index on name + email enables case-insensitive search via $regex.
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ name: 'text', email: 'text' }); // For search performance
leadSchema.index({ createdBy: 1 }); // For sales role "own leads" queries

export const Lead = mongoose.model<ILeadDocument, ILeadModel>('Lead', leadSchema);
