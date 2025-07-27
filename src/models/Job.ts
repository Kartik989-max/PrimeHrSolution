import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Full-time, Part-time
  company: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
  requirements: [{ type: String }],
  viewCount: { type: Number, default: 0 },
  applicationCount: { type: Number, default: 0 },
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema); 