import React, { useState } from 'react';
import { FiX, FiFileText, FiUpload } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { AppError, ErrorMessages, createUploadError, createValidationError } from '@/types/errors';

interface Job {
  _id: string;
  title: string;
  company: string;
}

interface ApplicationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resume: File | null;
  resumeUrl: string;
}

interface JobApplicationFormProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function JobApplicationForm({ job, isOpen, onClose, onSubmitSuccess }: JobApplicationFormProps) {
  const { user } = useAuth();
  const [uploadingResume, setUploadingResume] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    coverLetter: '',
    resume: null,
    resumeUrl: ''
  });

  // Reset form when user changes or modal opens
  React.useEffect(() => {
    if (isOpen && user) {
      setApplicationForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        coverLetter: '',
        resume: null,
        resumeUrl: ''
      });
    }
  }, [isOpen, user]);

  const uploadResumeToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add username to the form data
    if (user) {
      const username = `${user.firstName}_${user.lastName}`.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
      formData.append('username', username);
    }

    try {
      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || ErrorMessages.RESUME_UPLOAD_FAILED);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : ErrorMessages.RESUME_UPLOAD_FAILED);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError(createUploadError(ErrorMessages.FILE_TOO_LARGE, file.type, file.size));
      return;
    }

    if (!file.type.includes('pdf') && !file.type.includes('doc') && !file.type.includes('docx')) {
      setError(createUploadError(ErrorMessages.INVALID_FILE_TYPE, file.type));
      return;
    }

    setUploadingResume(true);
    setError(null);
    
    try {
      const resumeUrl = await uploadResumeToCloudinary(file);
      setApplicationForm(prev => ({
        ...prev,
        resume: file,
        resumeUrl
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ErrorMessages.RESUME_UPLOAD_FAILED;
      setError(createUploadError(errorMessage));
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!applicationForm.resumeUrl) {
      setError(createValidationError(ErrorMessages.REQUIRED_FIELDS_MISSING, 'resume'));
      return;
    }

    if (!user) {
      setError(createValidationError('Please login to apply', 'authentication'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/job/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job._id,
          userId: user.id,
          firstName: applicationForm.firstName,
          lastName: applicationForm.lastName,
          email: applicationForm.email,
          phone: applicationForm.phone,
          coverLetter: applicationForm.coverLetter,
          resumeUrl: applicationForm.resumeUrl,
          resumePublicId: applicationForm.resume && user ? 
            `resumes/${user.firstName.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_')}_${user.lastName.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}_${applicationForm.resume.name.replace(/\.[^/.]+$/, '')}` : ''
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || ErrorMessages.APPLICATION_SUBMISSION_FAILED);
      }
      
      alert('Application submitted successfully!');
      onClose();
      setApplicationForm({
        firstName: '', lastName: '', email: '', phone: '', coverLetter: '', resume: null, resumeUrl: ''
      });
      setError(null);
      
      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ErrorMessages.APPLICATION_SUBMISSION_FAILED;
      setError(createUploadError(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setApplicationForm({
      firstName: '', lastName: '', email: '', phone: '', coverLetter: '', resume: null, resumeUrl: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
              <p className="text-gray-600">{job.company}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-red-600">{error.message}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={applicationForm.firstName}
                  onChange={(e) => setApplicationForm({ ...applicationForm, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={applicationForm.lastName}
                  onChange={(e) => setApplicationForm({ ...applicationForm, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={applicationForm.email}
                  onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={applicationForm.phone}
                  onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
              <textarea
                value={applicationForm.coverLetter}
                onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us why you're interested in this position..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {applicationForm.resume ? (
                  <div className="flex items-center justify-center gap-2">
                    <FiFileText className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">{applicationForm.resume.name}</span>
                    <button
                      type="button"
                      onClick={() => setApplicationForm({ ...applicationForm, resume: null, resumeUrl: '' })}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload your resume (PDF, DOC, DOCX - max 5MB)
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                )}
                {uploadingResume && (
                  <div className="mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600">Uploading...</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!applicationForm.resumeUrl || isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 