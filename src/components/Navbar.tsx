import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "#services" },
  { name: "Job Seekers", href: "#jobseekers" },
  { name: "Contact Us", href: "/contact" },
  { name: "Jobs Opening", href: "#jobs" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === "/") return router.pathname === "/";
    return href !== "/" && router.asPath.includes(href.replace('#', ''));
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    router.push('/');
  };

  // Handle clicking outside profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Prime HR Solutions" 
              width={140} 
              height={50} 
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2 px-1 ${
                  isActive(link.href) 
                    ? 'text-blue-600' 
                    : 'text-gray-700'
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200" ref={profileMenuRef}>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="px-6 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${open ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 my-1 ${open ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${open ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${open ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100 shadow-lg">
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Mobile Auth Section */}
          <div className="pt-4 pb-3 border-t border-gray-100">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 font-medium hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 text-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-3 py-2 text-center bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 