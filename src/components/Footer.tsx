import Image from "next/image";
import { FaInstagram, FaLinkedin, FaYoutube, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 pt-10 pb-4 mt-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-0">
        {/* Logo and tagline */}
        <div className="flex flex-col items-center md:items-center w-full md:w-1/3 mb-6 md:mb-0">
          <Image src="/logo.png" alt="Prime HR Solutions Logo" width={180} height={80} className="mb-2 h-45 w-45 object-cover" />
          {/* <span className="text-body text-gray-700 mt-2">Connecting Talent with Opportunity</span> */}
        </div>
        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/3 mb-6 md:mb-0">
          <span className="font-bold text-base mb-2 text-gray-900">Quick Links</span>
          <ul className="flex text-gray-700 flex-col gap-1 text-body">
            <li><a href="/about" className="hover:text-blue-700 transition-colors">About Us</a></li>
            <li><a href="/jobs" className="hover:text-blue-700 transition-colors">Jobs</a></li>
            <li><a href="/contact" className="hover:text-blue-700 transition-colors">Contact</a></li>
            <li><a href="/privacy" className="hover:text-blue-700 transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
        {/* Contact & Social */}
        <div className="flex flex-col text-gray-700 items-center md:items-start w-full md:w-1/3">
          <span className="font-bold text-base mb-2 text-gray-900">Contact Us</span>
          <span className="mb-2 text-body flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> Delhi NCR, India</span>
          <span className="mb-2 text-body flex items-center gap-2"><FaPhoneAlt className="text-blue-500" /> <a href="tel:+911234567890" className="hover:text-blue-700 transition-colors">+91 12345 67890</a></span>
          <span className="mb-2 text-body">Mail: <a href="mailto:info@primehrsolution.com" className="text-blue-700 font-semibold hover:underline">info@primehrsolution.com</a></span>
          <div className="flex items-center gap-4 mt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" className="text-2xl text-blue-500 hover:text-blue-700 transition-colors"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn" className="text-2xl text-blue-500 hover:text-blue-700 transition-colors"><FaLinkedin /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener" aria-label="YouTube" className="text-2xl text-blue-500 hover:text-blue-700 transition-colors"><FaYoutube /></a>
          </div>
        </div>
      </div>
      <div className="w-full text-center text-sm text-gray-500 border-t border-gray-200 mt-8 pt-4">
        Copyright &copy; {new Date().getFullYear()} Prime HR Solutions. All rights reserved.
      </div>
    </footer>
  );
} 