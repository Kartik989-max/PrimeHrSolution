import React, { useEffect, useState } from "react";
import { FiBriefcase, FiUser, FiMail, FiFileText } from "react-icons/fi";

// Job type definition
export type Job = {
  _id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  company: string;
  postedAt: string | Date;
  requirements?: string[];
};

// Application type definition
interface JobApplication {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
  };
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeUrl: string;
  resumePublicId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: string;
  reviewedAt?: string;
  notes?: string;
}

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs and applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsResponse, applicationsResponse] = await Promise.all([
          fetch('/api/job'),
          fetch('/api/admin/applications?limit=1000') // Get all for stats
        ]);

        const jobsData = await jobsResponse.json();
        const applicationsData = await applicationsResponse.json();

        setJobs(jobsData);
        setApplications(applicationsData.applications || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome, Admin. Here&apos;s an overview of your platform.</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <DashboardCard icon={<FiBriefcase />} label="Total Jobs" value={jobs.length} />
        <DashboardCard icon={<FiFileText />} label="Applications" value={applications.length} />
        <DashboardCard icon={<FiUser />} label="Pending Reviews" value={applications.filter(app => app.status === 'pending').length} />
        <DashboardCard icon={<FiMail />} label="Messages" value={0} />
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SummaryCard
          title="Recent Job Postings"
          items={jobs.slice(0, 5).map(job => job.title)}
        />
        <SummaryCard
          title="Recent Applications"
          items={applications.slice(0, 5).map(app => `${app.firstName} ${app.lastName} - ${app.jobId?.title || 'Unknown Job'}`)}
        />
      </div>
    </>
  );
}

function DashboardCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center">
        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center py-2 px-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">{item}</span>
      </div>
        ))}
      </div>
    </div>
  );
} 