import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { FiEye, FiBriefcase } from 'react-icons/fi';
import { FaBuilding, FaMapMarkerAlt, FaRegClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import JobApplicationForm from '@/components/JobApplicationForm';
import { useAuth } from '@/contexts/AuthContext';
import { AppError, ErrorMessages, createNetworkError } from '@/types/errors';

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  company: string;
  postedAt: string | Date;
  requirements?: string[];
  viewCount: number;
  applicationCount: number;
  hasApplied?: boolean;
  applicationStatus?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, login } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const fetchJob = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/job/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/jobs');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jobData = await response.json();

      if (user) {
        try {
          const applicationResponse = await fetch(`/api/job/check-application?jobId=${id}`, {
            credentials: 'include',
          });
          if (applicationResponse.ok) {
            const applicationData = await applicationResponse.json();
            setJob({
              ...jobData,
              hasApplied: applicationData.hasApplied,
              applicationStatus: applicationData.application?.status || null,
            });
          } else {
            setJob(jobData);
          }
        } catch (err) {
          console.error('Error checking application status:', err);
          setJob(jobData);
        }
      } else {
        setJob(jobData);
      }

      try {
        await fetch(`/api/job/${id}/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error('Error incrementing view count:', err);
      }
    } catch (err) {
      console.error('Error fetching job:', err);
      setError(createNetworkError(ErrorMessages.NETWORK_ERROR));
    } finally {
      setLoading(false);
    }
  }, [id, user, router]);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [fetchJob, id]);

  const handleApplyJob = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setShowApplicationModal(true);
  };

  const handleLogin = (userData: User) => {
    login(userData);
    setShowLoginModal(false);
  };

  const handleRegister = (userData: User) => {
    login(userData);
    setShowRegisterModal(false);
  };

  const handleApplicationSuccess = () => {
    setShowApplicationModal(false);
    fetchJob();
  };

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading || !id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
        <div className="text-center">
          <p className="text-red-600 mb-4">{error.message}</p>
          <button
            onClick={() => router.push('/jobs')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {job && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-lg text-gray-600 flex items-center gap-2 mt-1">
                    <FaBuilding className="text-gray-400" />
                    {job.company}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    <FiBriefcase className="w-4 h-4" />
                    {job.type}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm">
                    <FaMapMarkerAlt className="w-4 h-4" />
                    {job.location}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-gray-500 border-t border-gray-100 pt-4">
                <span className="flex items-center gap-1.5">
                  <FaRegClock className="w-4 h-4" />
                  Posted {formatDate(job.postedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiEye className="w-4 h-4" />
                  {job.viewCount} views
                </span>
                <span className="flex items-center gap-1.5">
                  <FiBriefcase className="w-4 h-4" />
                  {job.applicationCount} applications
                </span>
              </div>
            </div>

            {job.hasApplied && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                {job.applicationStatus === 'shortlisted' ? (
                  <FaCheckCircle className="w-5 h-5 text-green-600" />
                ) : job.applicationStatus === 'rejected' ? (
                  <FaTimesCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <FaRegClock className="w-5 h-5 text-yellow-600" />
                )}
                <span className="text-sm font-medium text-gray-800">
                  You have applied for this position. Status: {job.applicationStatus}
                </span>
              </div>
            )}

            {job.description && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply for this position</h2>
              {job.hasApplied ? (
                <p className="text-gray-600">You have already submitted an application for this job.</p>
              ) : (
                <button
                  onClick={handleApplyJob}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
      {job && (
        <JobApplicationForm
          job={job}
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          onSubmitSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
}
