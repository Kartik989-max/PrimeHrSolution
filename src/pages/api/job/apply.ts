import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import JobApplication from '@/models/JobApplication';
import Job from '@/models/Job';
import { 
  ApiErrorResponse, 
  ErrorMessages, 
  createValidationError, 
  createDatabaseError, 
  createNotFoundError 
} from '@/types/errors';

// Define error types for MongoDB/Mongoose
interface MongoError extends Error {
  code?: number;
  name: string;
}

interface ValidationError extends Error {
  name: string;
  errors?: Record<string, unknown>;
}

interface CastError extends Error {
  name: string;
  value: unknown;
  kind: string;
}

// Define success response type
interface ApplicationSuccessResponse {
  message: string;
  application: unknown;
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ApiErrorResponse | ApplicationSuccessResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST method is allowed for this endpoint'
    });
  }

  try {
    await dbConnect();

    const {
      jobId,
      userId,
      firstName,
      lastName,
      email,
      phone,
      coverLetter,
      resumeUrl,
      resumePublicId
    } = req.body;

    // Validation
    if (!jobId || !userId || !firstName || !lastName || !email || !phone || !resumeUrl) {
      const validationError = createValidationError(
        ErrorMessages.REQUIRED_FIELDS_MISSING,
        'application_data'
      );
      return res.status(400).json({ 
        error: validationError.message,
        message: 'Please provide all required fields',
        details: validationError
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const validationError = createValidationError(
        'Invalid email format',
        'email',
        email
      );
      return res.status(400).json({ 
        error: validationError.message,
        message: 'Please provide a valid email address',
        details: validationError
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      const notFoundError = createNotFoundError(
        'Job not found',
        'job'
      );
      return res.status(404).json({ 
        error: notFoundError.message,
        message: 'The job you are applying for does not exist',
        details: notFoundError
      });
    }

    // Check if user has already applied for this job
    const existingApplication = await JobApplication.findOne({
      jobId,
      userId
    });

    if (existingApplication) {
      const validationError = createValidationError(
        'You have already applied for this job',
        'application_duplicate'
      );
      return res.status(400).json({ 
        error: validationError.message,
        message: 'You have already submitted an application for this position',
        details: validationError
      });
    }

    // Create the job application
    const jobApplication = await JobApplication.create({
      jobId,
      userId,
      firstName,
      lastName,
      email,
      phone,
      coverLetter: coverLetter || '',
      resumeUrl,
      resumePublicId,
      status: 'pending',
      appliedAt: new Date()
    });

    // Increment the application count for the job
    await Job.findByIdAndUpdate(
      jobId,
      { $inc: { applicationCount: 1 } }
    );

    res.status(201).json({
      message: 'Application submitted successfully',
      application: jobApplication
    });

  } catch (error: unknown) {
    console.error('Job application error:', error);
    
    // Type guard to check if error is a MongoError
    const isMongoError = (err: unknown): err is MongoError => {
      return err instanceof Error && 'code' in err;
    };

    // Type guard to check if error is a ValidationError
    const isValidationError = (err: unknown): err is ValidationError => {
      return err instanceof Error && err.name === 'ValidationError';
    };

    // Type guard to check if error is a CastError
    const isCastError = (err: unknown): err is CastError => {
      return err instanceof Error && err.name === 'CastError';
    };

    // Handle duplicate key error (MongoDB unique constraint violation)
    if (isMongoError(error) && error.code === 11000) {
      const validationError = createValidationError(
        'You have already applied for this job',
        'application_duplicate'
      );
      return res.status(400).json({ 
        error: validationError.message,
        message: 'You have already submitted an application for this position',
        details: validationError
      });
    }

    // Handle database connection errors
    if (error instanceof Error && (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError')) {
      const databaseError = createDatabaseError(
        'Database connection failed',
        'create_application'
      );
      return res.status(503).json({ 
        error: databaseError.message,
        message: 'Service temporarily unavailable. Please try again later.',
        details: databaseError
      });
    }

    // Handle validation errors from Mongoose
    if (isValidationError(error)) {
      const validationError = createValidationError(
        'Invalid application data',
        'mongoose_validation'
      );
      return res.status(400).json({ 
        error: validationError.message,
        message: 'Please check your application data and try again',
        details: validationError
      });
    }

    // Handle cast errors (invalid ObjectId)
    if (isCastError(error)) {
      const validationError = createValidationError(
        'Invalid job or user ID',
        'object_id'
      );
      return res.status(400).json({ 
        error: validationError.message,
        message: 'Invalid application data provided',
        details: validationError
      });
    }
    
    // Generic server error
    const databaseError = createDatabaseError(
      ErrorMessages.APPLICATION_SUBMISSION_FAILED,
      'create_application'
    );
    res.status(500).json({ 
      error: databaseError.message,
      message: 'Failed to submit application. Please try again later.',
      details: databaseError
    });
  }
} 