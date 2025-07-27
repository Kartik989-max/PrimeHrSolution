// Base error interface
export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

// API error response interface
export interface ApiErrorResponse {
  error: string;
  message?: string;
  status?: number;
  details?: unknown;
}

// Specific error types
export interface ValidationError extends AppError {
  code: 'VALIDATION_ERROR';
  field?: string;
  value?: unknown;
}

export interface AuthenticationError extends AppError {
  code: 'AUTHENTICATION_ERROR';
  status: 401;
}

export interface AuthorizationError extends AppError {
  code: 'AUTHORIZATION_ERROR';
  status: 403;
}

export interface NotFoundError extends AppError {
  code: 'NOT_FOUND_ERROR';
  status: 404;
  resource?: string;
}

export interface DatabaseError extends AppError {
  code: 'DATABASE_ERROR';
  operation?: string;
}

export interface UploadError extends AppError {
  code: 'UPLOAD_ERROR';
  fileType?: string;
  fileSize?: number;
}

export interface NetworkError extends AppError {
  code: 'NETWORK_ERROR';
  url?: string;
}

// Error codes enum
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UPLOAD_ERROR = 'UPLOAD_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Error messages
export const ErrorMessages = {
  VALIDATION_ERROR: 'Validation failed',
  AUTHENTICATION_ERROR: 'Authentication failed',
  AUTHORIZATION_ERROR: 'Access denied',
  NOT_FOUND_ERROR: 'Resource not found',
  DATABASE_ERROR: 'Database operation failed',
  UPLOAD_ERROR: 'File upload failed',
  NETWORK_ERROR: 'Network request failed',
  UNKNOWN_ERROR: 'An unexpected error occurred',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  JOB_CREATION_FAILED: 'Failed to create job posting',
  JOB_UPDATE_FAILED: 'Failed to update job posting',
  JOB_DELETION_FAILED: 'Failed to delete job posting',
  APPLICATION_SUBMISSION_FAILED: 'Failed to submit application',
  RESUME_UPLOAD_FAILED: 'Failed to upload resume',
  CONTACT_SUBMISSION_FAILED: 'Failed to submit contact message',
  ADMIN_LOGIN_FAILED: 'Admin login failed. Please check your credentials.',
  INVALID_CREDENTIALS: 'Invalid username or password',
  EMAIL_ALREADY_EXISTS: 'Email address is already registered',
  PASSWORD_MISMATCH: 'Passwords do not match',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  FILE_TOO_LARGE: 'File size must be less than 5MB',
  INVALID_FILE_TYPE: 'Please upload a valid file type',
  REQUIRED_FIELDS_MISSING: 'Please fill in all required fields'
} as const;

// Error details type for better type safety
export type ErrorDetails = 
  | string 
  | number 
  | boolean 
  | null 
  | undefined 
  | Record<string, unknown> 
  | unknown[];

// Error helper functions
export const createError = (
  message: string,
  code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
  details?: ErrorDetails
): AppError => ({
  message,
  code,
  details
});

export const createValidationError = (
  message: string,
  field?: string,
  value?: unknown
): ValidationError => ({
  message,
  code: ErrorCode.VALIDATION_ERROR,
  field,
  value
});

export const createAuthenticationError = (
  message: string = ErrorMessages.AUTHENTICATION_ERROR
): AuthenticationError => ({
  message,
  code: ErrorCode.AUTHENTICATION_ERROR,
  status: 401
});

export const createNotFoundError = (
  message: string = ErrorMessages.NOT_FOUND_ERROR,
  resource?: string
): NotFoundError => ({
  message,
  code: ErrorCode.NOT_FOUND_ERROR,
  status: 404,
  resource
});

export const createDatabaseError = (
  message: string = ErrorMessages.DATABASE_ERROR,
  operation?: string
): DatabaseError => ({
  message,
  code: ErrorCode.DATABASE_ERROR,
  operation
});

export const createUploadError = (
  message: string = ErrorMessages.UPLOAD_ERROR,
  fileType?: string,
  fileSize?: number
): UploadError => ({
  message,
  code: ErrorCode.UPLOAD_ERROR,
  fileType,
  fileSize
});

export const createNetworkError = (
  message: string = ErrorMessages.NETWORK_ERROR,
  url?: string
): NetworkError => ({
  message,
  code: ErrorCode.NETWORK_ERROR,
  url
}); 