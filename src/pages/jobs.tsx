import React, { useEffect, useState } from 'react';
import { FiMapPin, FiBriefcase, FiEye, FiCalendar, FiX } from 'react-icons/fi';
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



export default function JobsPage() {
  const { user, isLoading: authLoading, login } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    fetchJobs();
  }, [user]); // Refetch jobs when user changes (login/logout)



  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/job');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // If user is logged in, check application status for each job
      if (user) {
        const jobsWithApplicationStatus = await Promise.all(
          data.map(async (job: Job) => {
            try {
              const applicationResponse = await fetch(`/api/job/check-application?jobId=${job._id}&userId=${user.id}`);
              if (applicationResponse.ok) {
                const applicationData = await applicationResponse.json();
                return {
                  ...job,
                  hasApplied: applicationData.hasApplied,
                  applicationStatus: applicationData.application?.status || null
                };
              }
            } catch (error) {
              console.error(`Error checking application status for job ${job._id}:`, error);
            }
            return job;
          })
        );
        setJobs(jobsWithApplicationStatus);
      } else {
      setJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(createNetworkError(ErrorMessages.NETWORK_ERROR));
    } finally {
      setLoading(false);
    }
  };

  const handleViewJob = async (job: Job) => {
    setSelectedJob(job);
    setShowJobModal(true);
    
    try {
      // Increment view count
      const response = await fetch(`/api/job/${job._id}/view`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update view count: ${response.status}`);
      }
      
      // Update the local state to reflect the new view count
      setJobs(prevJobs => 
        prevJobs.map(j => 
          j._id === job._id 
            ? { ...j, viewCount: (j.viewCount || 0) + 1 }
            : j
        )
      );
    } catch (error) {
      console.error('Error updating view count:', error);
      // Don't show error to user for view count updates
    }
  };

  const handleApplyJob = (job: Job) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleLogin = (userData: User) => {
    login(userData); // Call AuthContext login function
    setShowLoginModal(false);
    setError(null);
    
    // If there's a selected job, open application form
    if (selectedJob) {
      handleApplyJob(selectedJob);
    }
  };

  const handleRegister = (userData: User) => {
    login(userData); // Call AuthContext login function (register also logs in)
    setShowRegisterModal(false);
    setError(null);
    
    // If there's a selected job, open application form
    if (selectedJob) {
      handleApplyJob(selectedJob);
    }
  };

  const handleApplicationSuccess = () => {
    // Update the local state to reflect the new application count and mark as applied
    if (selectedJob) {
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job._id === selectedJob._id 
            ? { 
                ...job, 
                applicationCount: (job.applicationCount || 0) + 1,
                hasApplied: true,
                applicationStatus: 'pending'
              }
            : job
        )
      );
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || job.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading || authLoading) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen text-black bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
              <p className="text-xl text-blue-100 mb-8">
                Discover exciting opportunities with top companies
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search jobs by title, company, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="all">All Types</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Available Positions ({filteredJobs.length})
            </h2>
            <p className="text-gray-600">
              Browse through our latest job openings
            </p>
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

          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                        <p className="text-gray-600 mb-4">{job.description}</p>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        job.type === 'Full-time' ? 'bg-green-100 text-green-800' :
                        job.type === 'Part-time' ? 'bg-yellow-100 text-yellow-800' :
                        job.type === 'Contract' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {job.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <FiBriefcase className="w-4 h-4 mr-2" />
                        <span className="text-sm">{job.company}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiMapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiCalendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {new Date(job.postedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiEye className="w-4 h-4 mr-2" />
                        <span className="text-sm">{job.viewCount || 0} views</span>
                      </div>
                    </div>

                    {job.requirements && job.requirements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.slice(0, 3).map((req, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {req}
                            </span>
                          ))}
                          {job.requirements.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              +{job.requirements.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 lg:ml-6">
                    <button
                      onClick={() => handleViewJob(job)}
                      className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      View Details
                    </button>
                    {job.hasApplied ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <span className="text-sm">✓ Applied</span>
                        {job.applicationStatus && (
                          <span className="text-xs bg-white text-black bg-opacity-20 px-2 py-1 rounded">
                            {job.applicationStatus.charAt(0).toUpperCase() + job.applicationStatus.slice(1)}
                          </span>
                        )}
                      </button>
                    ) : (
                    <button
                      onClick={() => handleApplyJob(job)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply Now
                    </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FiBriefcase className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms.' : 'No job openings available at the moment.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Job Detail Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                  <p className="text-xl text-gray-600">{selectedJob.company}</p>
                </div>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="w-5 h-5 mr-2" />
                  <span>{selectedJob.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="w-5 h-5 mr-2" />
                  <span>Posted {new Date(selectedJob.postedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiEye className="w-5 h-5 mr-2" />
                  <span>{selectedJob.viewCount || 0} views</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedJob.description}</p>
                </div>
              </div>

              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="text-gray-700">{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  onClick={() => setShowJobModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedJob.hasApplied ? (
                  <button
                    disabled
                    className="px-6 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed flex items-center gap-2"
                  >
                    <span>✓ Applied</span>
                    {selectedJob.applicationStatus && (
                      <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                        {selectedJob.applicationStatus.charAt(0).toUpperCase() + selectedJob.applicationStatus.slice(1)}
                      </span>
                    )}
                  </button>
                ) : (
                <button
                  onClick={() => {
                    setShowJobModal(false);
                    handleApplyJob(selectedJob);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply Now
                </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <JobApplicationForm
          job={selectedJob}
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          onSubmitSuccess={handleApplicationSuccess}
        />
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
} 