import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaBriefcase, FaEnvelope, FaPhone, FaCalendar, FaFileAlt, FaEye, FaDownload, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  jobType: string;
  jobPostedAt: string;
  status: string;
  appliedAt: string;
  resumeUrl: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  const fetchUserApplications = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/applications?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchUserApplications();
    }
  }, [fetchUserApplications,user?.id]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your profile and track your job applications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* User Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <FaUser className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-gray-600">Active Account</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <FaEnvelope className="text-gray-400 mr-3 w-4 h-4" />
                  <span className="text-gray-700 break-all">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center text-sm">
                    <FaPhone className="text-gray-400 mr-3 w-4 h-4" />
                    <span className="text-gray-700">{user.phone}</span>
                  </div>
                )}
                                 <div className="flex items-center text-sm">
                   <FaCalendar className="text-gray-400 mr-3 w-4 h-4" />
                   <span className="text-gray-700">
                     Member since {user.createdAt ? formatDate(user.createdAt) : 'Recently'}
                   </span>
                 </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/profile"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <FaUser className="mr-2" />
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Applied Jobs Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FaBriefcase className="text-2xl text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Applied Jobs</h2>
                </div>
                <span className="text-sm text-gray-500">
                  {applications.length} application{applications.length !== 1 ? 's' : ''}
                </span>
              </div>

              {loadingApplications ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8">
                  <FaFileAlt className="text-4xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start your job search and apply to positions that match your skills.
                  </p>
                  <Link
                    href="/jobs"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    <FaEye className="mr-2" />
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {application.jobTitle}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-2">{application.company}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center">
                              <FaMapMarkerAlt className="mr-1" />
                              {application.location}
                            </span>
                            <span className="flex items-center">
                              <FaBriefcase className="mr-1" />
                              {application.jobType}
                            </span>
                          </div>
                          
                          <div className="text-xs text-gray-400">
                            Applied on {formatDate(application.appliedAt)}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 mt-4 sm:mt-0 sm:ml-4">
                          <Link
                            href={`/job/${application.jobId}`}
                            className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                          >
                            <FaEye className="mr-1" />
                            View Job
                          </Link>
                          
                          {application.resumeUrl && (
                            <a
                              href={application.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                            >
                              <FaDownload className="mr-1" />
                              Resume
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 