import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaYoutube, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 pt-6 sm:pt-8 md:pt-10 pb-4 mt-8 sm:mt-12 md:mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 sm:gap-8 lg:gap-0">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center lg:items-start w-full lg:w-1/3 mb-4 lg:mb-0">
            <Image 
              src="/logo.png" 
              alt="Prime HR Solutions Logo" 
              width={180} 
              height={80} 
              className="mb-3 h-24 sm:h-32 md:h-40 w-auto object-contain" 
            />
            <span className="text-xs sm:text-sm text-gray-600 mt-1 text-center lg:text-left max-w-xs">
              Connecting Talent with Opportunity
            </span>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-col items-center lg:items-start w-full lg:w-1/3 mb-4 lg:mb-0">
            <span className="font-bold text-sm sm:text-base mb-3 text-gray-900">Quick Links</span>
            <ul className="flex text-gray-700 flex-col gap-2 sm:gap-1 text-sm sm:text-base text-center lg:text-left">
              <li>
                <Link href="/about" className="hover:text-blue-700 transition-colors py-1 px-2 rounded hover:bg-blue-50">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-blue-700 transition-colors py-1 px-2 rounded hover:bg-blue-50">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-700 transition-colors py-1 px-2 rounded hover:bg-blue-50">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-700 transition-colors py-1 px-2 rounded hover:bg-blue-50">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact & Social */}
          <div className="flex flex-col text-gray-700 items-center lg:items-start w-full lg:w-1/3">
            <span className="font-bold text-sm sm:text-base mb-3 text-gray-900">Contact Us</span>
            <div className="space-y-2 sm:space-y-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm sm:text-base">
                <FaMapMarkerAlt className="text-blue-500 flex-shrink-0" />
                <span>Delhi NCR, India</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm sm:text-base">
                <FaPhoneAlt className="text-blue-500 flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-blue-700 transition-colors">
                  +91 12345 67890
                </a>
              </div>
              <div className="text-sm sm:text-base">
                Mail: <a href="mailto:info@primehrsolution.com" className="text-blue-700 font-semibold hover:underline break-all">
                  info@primehrsolution.com
                </a>
              </div>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-4 mt-4 sm:mt-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram" 
                className="p-2 text-xl sm:text-2xl text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-200"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn" 
                className="p-2 text-xl sm:text-2xl text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-200"
              >
                <FaLinkedin />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube" 
                className="p-2 text-xl sm:text-2xl text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-200"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="w-full text-center text-xs sm:text-sm text-gray-500 border-t border-gray-200 mt-6 sm:mt-8 pt-4 px-4">
          <p>Copyright &copy; {new Date().getFullYear()} Prime HR Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 