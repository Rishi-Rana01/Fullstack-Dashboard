import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types/user.types';

// ── User Document Interface ────────────────────────────────────────────────
// Extends Mongoose Document so we get all Mongoose methods + our custom ones.
export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  // Custom instance method — compare raw candidate against stored hash
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ── User Model Interface ───────────────────────────────────────────────────
// Typed Model to allow static methods if added in the future
type IUserModel = Model<IUserDocument>;

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,        // Enforced at the DB index level
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['admin', 'sales'] as UserRole[],
      default: 'sales' as UserRole,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt
  }
);

// ── Pre-save Hook: Hash password before persisting ────────────────────────
// Only re-hash if the password field has been modified — avoids double-hashing
// on subsequent saves (e.g., updating email).
userSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// ── Instance Method: Compare password ─────────────────────────────────────
// Uses bcrypt.compare which is timing-attack safe.
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string);
};

// Exclude password from JSON serialization by default.
// We use `any` here strictly because Mongoose's transform callback types
// don't allow deleting typed fields on the ret object in strict mode.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
userSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc: any, ret: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete ret.password;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ret;
  },
});

export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
