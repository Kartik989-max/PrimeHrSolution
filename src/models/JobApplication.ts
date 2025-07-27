import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  coverLetter: { 
    type: String, 
    default: '' 
  },
  resumeUrl: { 
    type: String, 
    required: true 
  },
  resumePublicId: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'], 
    default: 'pending' 
  },
  appliedAt: { 
    type: Date, 
    default: Date.now 
  },
  reviewedAt: { 
    type: Date 
  },
  notes: { 
    type: String 
  }
});

// Create compound index to prevent duplicate applications
JobApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export default mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema); 