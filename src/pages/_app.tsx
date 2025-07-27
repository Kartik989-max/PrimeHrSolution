import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Check if current page is an admin page (but not login)
  const isAdminPage = router.pathname.startsWith('/admin') && router.pathname !== '/admin/login';

  // If it's an admin page, wrap with AdminLayout
  if (isAdminPage) {
    return (
      <AuthProvider>
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      </AuthProvider>
    );
  }
  
  // For non-admin pages, render with navbar and footer
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </AuthProvider>
  );
}
