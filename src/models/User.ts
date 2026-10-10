import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field on save
UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Indexes
UserSchema.index({ role: 1 });
UserSchema.index({ resetToken: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema); 