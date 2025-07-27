import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  company: { type: String, default: '' },
  country: { type: String, default: '' },
  industry: { type: String, default: '' },
  service: { type: String, default: '' },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema); 