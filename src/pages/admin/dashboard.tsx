import React, { useEffect, useState } from "react";
import { FiHome, FiAward, FiFileText, FiImage, FiMail, FiSettings, FiChevronDown, FiUser, FiPlusCircle, FiBriefcase } from "react-icons/fi";
import { useRouter } from "next/router";

const sidebarLinks = [
  { name: "Dashboard", icon: <FiHome />, href: "/admin/dashboard" },
  { name: "Add Job", icon: <FiPlusCircle />, href: "/admin/add-job" },
  { name: "Certification", icon: <FiAward />, href: "#", sub: ["Management Certs", "Product Certs"] },
  { name: "Generate Certifications", icon: <FiFileText />, href: "#" },
  { name: "Blogs", icon: <FiFileText />, href: "#" },
  { name: "Client Logos", icon: <FiImage />, href: "#" },
  { name: "Contact Messages", icon: <FiMail />, href: "#" },
  { name: "Settings", icon: <FiSettings />, href: "#" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Simple client-side auth check (replace with real auth in production)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAdmin = localStorage.getItem('isAdmin');
      if (!isAdmin) router.replace('/admin/login');
    }
  }, [router]);

  // Fetch jobs
  useEffect(() => {
    fetch('/api/job')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoadingJobs(false);
      })
      .catch(() => setLoadingJobs(false));
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between min-h-screen shadow-sm">
        <div>
          <div className="flex items-center gap-2 px-6 py-6 border-b">
            <span className="text-2xl text-orange-500"><FiHome /></span>
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
          <nav className="flex flex-col gap-1 mt-4 px-2">
            {sidebarLinks.map((link, idx) => (
              <div key={link.name} className="">
                <a
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors font-medium ${router.pathname === link.href ? 'bg-blue-100 text-blue-700' : ''}`}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.name}
                  {link.sub && <FiChevronDown className="ml-auto text-gray-400" />}
                </a>
                {/* Submenu (static, not collapsible for now) */}
                {link.sub && (
                  <div className="ml-10 mt-1 flex flex-col gap-1">
                    {link.sub.map((s, i) => (
                      <span key={i} className="text-sm text-gray-500 py-1">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        {/* User Info */}
        <div className="flex items-center gap-3 px-6 py-4 border-t bg-gray-50">
          <div className="bg-blue-100 rounded-full p-2">
            <FiUser className="text-blue-700 text-xl" />
          </div>
          <div>
            <div className="font-semibold text-gray-700">Admin User</div>
            <div className="text-xs text-gray-400">Administrator</div>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-6">Welcome, Admin. Here’s an overview of your platform.</p>
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <DashboardCard icon={<FiAward className="text-orange-400 text-3xl" />} label="Management Certifications" value={14} />
          <DashboardCard icon={<FiFileText className="text-orange-400 text-3xl" />} label="Product Certifications" value={9} />
          <DashboardCard icon={<FiFileText className="text-orange-400 text-3xl" />} label="Blogs" value={97} />
          <DashboardCard icon={<FiMail className="text-orange-400 text-3xl" />} label="Contact Messages" value={1} />
        </div>
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button className="bg-black text-white px-5 py-2 rounded font-semibold flex items-center gap-2"><span>+</span> Add Certification</button>
          <button className="bg-black text-white px-5 py-2 rounded font-semibold flex items-center gap-2"><span>+</span> Add Blog</button>
          <button className="bg-black text-white px-5 py-2 rounded font-semibold flex items-center gap-2"><span>+</span> Add Generated Certification</button>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <SummaryCard title="Management Certs" items={["iso-45003", "iso-26000", "iso-27017"]} />
          <SummaryCard title="Product Certs" items={["ukca-marking", "g-mark", "glp"]} />
          <SummaryCard title="Blogs" items={["Health Risks of Extreme Heat: Ho...", '"Digital India 2.0: What\'s Changing..."', "Tech and Finance: How Innovat..."]} />
          <SummaryCard title="Contacts" items={["Snehq"]} />
        </div>
        {/* Jobs List */}
        <section className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><FiBriefcase /> Jobs</h2>
          {loadingJobs ? (
            <div>Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-gray-500">No jobs posted yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Title</th>
                    <th className="text-left py-2 px-3">Company</th>
                    <th className="text-left py-2 px-3">Location</th>
                    <th className="text-left py-2 px-3">Type</th>
                    <th className="text-left py-2 px-3">Posted</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job: any) => (
                    <tr key={job._id} className="border-b hover:bg-blue-50">
                      <td className="py-2 px-3 font-medium">{job.title}</td>
                      <td className="py-2 px-3">{job.company}</td>
                      <td className="py-2 px-3">{job.location}</td>
                      <td className="py-2 px-3">{job.type}</td>
                      <td className="py-2 px-3">{new Date(job.postedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function DashboardCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center gap-2 border border-gray-100">
      <div>{icon}</div>
      <div className="text-3xl font-bold text-gray-800">{value}</div>
      <div className="text-gray-500 text-sm text-center">{label}</div>
    </div>
  );
}

function SummaryCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-100 flex flex-col gap-2">
      <div className="font-semibold text-orange-500 flex items-center gap-2">
        {title.includes("Management") && <FiAward />}
        {title.includes("Product") && <FiFileText />}
        {title === "Blogs" && <FiFileText />}
        {title === "Contacts" && <FiMail />}
        <span>{title}</span>
      </div>
      <ul className="text-sm text-gray-700 list-disc ml-5">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <div className="text-right mt-2">
        <a href="#" className="text-blue-500 text-xs hover:underline">View All</a>
      </div>
    </div>
  );
} 