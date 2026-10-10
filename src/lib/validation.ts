import { z, ZodError, ZodSchema } from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters long')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
});

export const jobSchema = z.object({
  title: z.string().min(1, 'Job title is required').max(200),
  description: z.string().min(1, 'Job description is required'),
  location: z.string().min(1, 'Location is required').max(200),
  type: z.string().min(1, 'Job type is required').max(100),
  company: z.string().min(1, 'Company is required').max(200),
  requirements: z.array(z.string()).optional(),
});

export const applySchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  coverLetter: z.string().optional(),
  resumeUrl: z.string().url('Resume URL is required'),
  resumePublicId: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  industry: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(1, 'Message is required').max(5000),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const updateApplicationSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired']),
  notes: z.string().optional(),
});

export function validateBody<T>(req: NextApiRequest, res: NextApiResponse, schema: ZodSchema<T>): T | null {
  try {
    return schema.parse(req.body) as T;
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.issues });
      return null;
    }
    throw error;
  }
}
