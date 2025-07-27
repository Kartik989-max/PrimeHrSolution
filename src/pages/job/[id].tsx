import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { FiEye, FiUsers, FiArrowLeft } from 'react-icons/fi';
import { FaMapMarkerAlt, FaBriefcase as FaBriefcaseIcon, FaCalendarAlt } from 'react-icons/fa';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import JobApplicationForm from '@/components/JobApplicationForm';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const fetchJob = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/job/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/jobs');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jobData = await response.json();
      
      // If user is logged in, check application status
      if (user) {
        try {
          const applicationResponse = await fetch(`/api/job/check-application?jobId=${id}&userId=${user.id}`);
          if (applicationResponse.ok) {
            const applicationData = await applicationResponse.json();
            setJob({
              ...jobData,
              hasApplied: applicationData.hasApplied,
              applicationStatus: applicationData.application?.status || null
            });
          } else {
            setJob(jobData);
          }
        } catch (error) {
          console.error('Error checking application status:', error);
          setJob(jobData);
        }
      } else {
        setJob(jobData);
      }

      // Increment view count
      try {
        await fetch(`/api/job/${id}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      setError(createNetworkError(ErrorMessages.NETWORK_ERROR));
    } finally {
      setLoading(false);
    }
  }, [id, user, router]);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [fetchJob,id]);

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
    // Refresh job data to show application status
    fetchJob();
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'hired':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Job</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Link
            href="/jobs"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiArrowLeft className="mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link
            href="/jobs"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiArrowLeft className="mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/jobs"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Jobs
            </Link>
            <div className="text-sm text-gray-500">
              Posted on {formatDate(job.postedAt)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <FaBriefcaseIcon className="mr-2" />
                  {job.company}
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  {job.type}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <FiEye className="mr-1" />
                  {job.viewCount} views
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-1" />
                  {job.applicationCount} applications
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6">
              {user && job.hasApplied ? (
                <div className="text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.applicationStatus || 'pending')}`}>
                    {job.applicationStatus ? job.applicationStatus.charAt(0).toUpperCase() + job.applicationStatus.slice(1) : 'Applied'}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">Application Submitted</p>
                </div>
              ) : (
                <button
                  onClick={handleApplyJob}
                  className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
          <div className="prose prose-sm sm:prose-base max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Apply Section */}
        {!user && (
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Apply?</h3>
            <p className="text-gray-600 mb-4">Sign in or create an account to apply for this position.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onRegister={handleRegister}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}

      {showApplicationModal && job && (
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