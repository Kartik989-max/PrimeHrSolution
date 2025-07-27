import React from 'react';
import { useRouter } from 'next/router';
import { FiHome, FiImage, FiMail, FiSettings, FiUser, FiPlusCircle, FiBriefcase, FiLogOut } from 'react-icons/fi';
import { AdminData } from '@/types/admin';

interface AdminSidebarProps {
  adminData?: AdminData | null;
  onLogout: () => void;
}

const sidebarLinks = [
  { name: "Dashboard", icon: <FiHome />, href: "/admin/dashboard" },
  { name: "Job Management", icon: <FiBriefcase />, href: "/admin/dashboard/job" },
  { name: "Add Job", icon: <FiPlusCircle />, href: "/admin/dashboard/add-job" },
  { name: "Applications", icon: <FiUser />, href: "/admin/dashboard/applications" },
  { name: "Contact Messages", icon: <FiMail />, href: "/admin/dashboard/messages" },
  { name: "Client Logos", icon: <FiImage />, href: "#" },
  { name: "Settings", icon: <FiSettings />, href: "#" },
];

export default function AdminSidebar({ adminData, onLogout }: AdminSidebarProps) {
  const router = useRouter();

  return (
    <aside className="fixed text-black   left-0 top-0 h-screen w-64 bg-white border-r shadow-sm flex flex-col z-10">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 px-6 py-6 border-b">
          <span className="text-2xl text-blue-500"><FiHome /></span>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <nav className="flex-1 flex flex-col gap-1 mt-4 px-2 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <div key={link.name}>
              <a
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors font-medium ${router.pathname === link.href ? 'bg-blue-100 text-blue-700' : ''}`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.name}
              </a>
            </div>
          ))}
        </nav>
      </div>
      {/* User Info */}
      <div className="px-6 py-4 border-t bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-blue-100 rounded-full p-2">
            <FiUser className="text-blue-700 text-xl" />
          </div>
          <div>
            <div className="font-semibold text-gray-700">
              {adminData?.username || 'Admin User'}
            </div>
            <div className="text-xs text-gray-400">Administrator</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <FiLogOut className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
} 