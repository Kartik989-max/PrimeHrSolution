import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from './AdminSidebar';
import { AdminData } from '@/types/admin';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Admin authentication check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAdmin = localStorage.getItem('isAdmin');
      const adminDataStr = localStorage.getItem('adminData');

      if (!isAdmin || isAdmin !== 'true') {
        router.replace('/admin/login');
        return;
      }

      if (adminDataStr) {
        try {
          setAdminData(JSON.parse(adminDataStr));
        } catch (error) {
          console.error('Error parsing admin data:', error);
        }
      }
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminData');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <AdminSidebar adminData={adminData} onLogout={handleLogout} />

      {/* Main Content with left margin for fixed sidebar */}
      <main className="ml-64 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 