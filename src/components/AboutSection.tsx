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
      className={`relative w-full flex flex-col items-center justify-center py-20 md:py-28 transition-opacity duration-700 overflow-hidden ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionProperty: 'opacity, transform', background: 'linear-gradient(120deg, #f7fafd 60%, #e3f1fd 100%)' }}
    >
      {/* Minimal blue accent shape in background */}
      <svg
        className="absolute -z-10 right-[-80px] top-1/4 w-64 h-64 opacity-30"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse cx="150" cy="150" rx="120" ry="80" fill="#6ccff6" />
      </svg>
      {/* Minimal blue accent dot */}
      <span className="absolute top-10 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500-custom" />
      <h2 className="text-2xl md:text-3xl font-bold text-blue-700-custom mb-3 text-center tracking-tight">
        About Us
      </h2>
      <div className="w-12 h-1 bg-blue-500-custom rounded-full mb-8 mx-auto" />
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-6xl px-4 md:px-0">
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <p className="text-base md:text-lg text-center md:text-left text-gray-700 max-w-2xl font-normal leading-relaxed">
            Prime HR Solutions is a leading manpower and HR solutions agency based in Delhi NCR, trusted by top organizations across industries such as Power, Sugar, Paper, IT, and Services. With a team of seasoned HR professionals, we offer a wide range of services including Executive Search, Manpower Outsourcing, Payroll Management, Statutory Compliance, HR Policy Development, and Technical & Behavioral Training. We are committed to building long-term, value-driven partnerships that support our clients' growth through strategic talent solutions.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center mt-8 md:mt-0">
          <Image
            width={400}
            height={224}
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
            alt="Professional HR team at work"
            className="rounded-2xl shadow-md w-full h-56 object-cover object-center md:h-72"
          />
        </div>
      </div>
    </section>
  );
} 