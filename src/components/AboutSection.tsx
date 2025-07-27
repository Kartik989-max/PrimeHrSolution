import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 lg:py-28 transition-opacity duration-700 overflow-hidden px-4 sm:px-6 md:px-0 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionProperty: 'opacity, transform', background: 'linear-gradient(120deg, #f7fafd 60%, #e3f1fd 100%)' }}
    >
      {/* Minimal blue accent shape in background */}
      <svg
        className="absolute -z-10 right-[-80px] top-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 opacity-30"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse cx="150" cy="150" rx="120" ry="80" fill="#6ccff6" />
      </svg>
      {/* Minimal blue accent dot */}
      <span className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500-custom" />
      <h2 className="text-xl sm:text-2xl md:text-heading mb-3 text-center tracking-tight">About Us</h2>
      <div className="w-12 h-1 bg-blue-500-custom rounded-full mb-6 sm:mb-8 mx-auto" />
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-10 w-full max-w-6xl">
        <div className="w-full md:w-1/2 flex items-center justify-center order-2 md:order-1">
          <p className="text-sm sm:text-base md:text-body text-center md:text-left max-w-2xl">
            Prime HR Solutions is a leading manpower and HR solutions agency based in Delhi NCR, trusted by top organizations across industries such as Power, Sugar, Paper, IT, and Services. With a team of seasoned HR professionals, we offer a wide range of services including Executive Search, Manpower Outsourcing, Payroll Management, Statutory Compliance, HR Policy Development, and Technical & Behavioral Training. We are committed to building long-term, value-driven partnerships that support our client&apos;s growth through strategic talent solutions.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center order-1 md:order-2">
          <Image
            width={400}
            height={224}
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
            alt="Professional HR team at work"
            className="rounded-2xl shadow-md w-full h-48 sm:h-56 md:h-72 object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
} 