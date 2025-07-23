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
      className={`w-full flex flex-col items-center py-8 transition-opacity duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionProperty: 'opacity, transform' }}
    >
      <h2 className="text-xl font-semibold text-blue-700-custom mb-4">About Us</h2>
      <p className="max-w-2xl text-center text-gray-700 dark:text-gray-200 text-base">
        We are a leading HR recruitment firm dedicated to connecting top talent with leading companies across India. Our team of experienced consultants leverages deep industry knowledge and a personalized approach to deliver tailored staffing solutions. We verify every candidate, offer ongoing support, and build long-term partnerships with our clients. Whether you are a job seeker or an employer, we are committed to your success.
      </p>
    </section>
  );
} 