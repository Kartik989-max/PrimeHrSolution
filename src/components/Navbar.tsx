import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

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
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/") return router.pathname === "/";
    return href !== "/" && router.asPath.includes(href.replace('#', ''));
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm font-sans" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-700">
        <Image src={'/logo.png'} alt="PRIME HR SOLUTION" width={100} height={100} className="h-20 w-20 object-cover" />
       </Link>
        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative font-medium px-2 py-1 transition-colors duration-200
                text-black
                hover:text-blue-700
                ${isActive(link.href) ? 'text-blue-700 underline' : ''}`}
              style={{ zIndex: 1 }}
            >
              {link.name}
            </Link>
          ))}
        </div>
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-2 items-center ml-4">
          <Link href="/auth/login" className="px-4 py-1 rounded border border-blue-700 text-blue-700 font-semibold hover:bg-blue-50 transition-colors">Login</Link>
          <Link href="/auth/register" className="px-4 py-1 rounded bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors">Sign Up</Link>
        </div>
        {/* Hamburger Icon */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none group"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 my-1 ${open ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-transform duration-300 md:hidden
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
      >
        {/* Close Button (hidden, hamburger animates to X) */}
        <div className="absolute top-6 right-6 w-10 h-10" />
        {/* Mobile Nav Links */}
        <div className="flex flex-col gap-8 items-center w-full">
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-2xl font-semibold px-4 py-2 transition-colors duration-200 rounded hover:bg-blue-100 hover:text-blue-700 ${isActive(link.href) ? 'text-blue-700 underline' : 'text-black'}`}
              onClick={() => setOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
        {/* Mobile Auth Buttons */}
        <div className="flex flex-col gap-3 items-center w-full mt-8">
          <Link href="/auth/login" className="w-4/5 text-center px-4 py-2 rounded border border-blue-700 text-blue-700 font-semibold hover:bg-blue-50 transition-colors">Login</Link>
          <Link href="/auth/register" className="w-4/5 text-center px-4 py-2 rounded bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors">Sign Up</Link>
        </div>
      </div>
      <style jsx>{`
        .after\:scale-x-100 {
          transform: scaleX(1);
        }
        .after\:scale-x-0 {
          transform: scaleX(0);
        }
      `}</style>
    </nav>
  );
} 