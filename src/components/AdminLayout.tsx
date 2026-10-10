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

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/auth/session', { credentials: 'include' });
        if (!response.ok) {
          router.replace('/admin/login');
          return;
        }
        const { user } = await response.json();
        if (user?.role !== 'admin') {
          router.replace('/admin/login');
          return;
        }
        setAdminData({ username: user.firstName || 'Admin', role: 'admin', lastLogin: new Date() });
      } catch {
        router.replace('/admin/login');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // ignore
    }
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
