import { useEffect, useRef, useState } from "react";

export default function CallToActionSection() {
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
      className={`w-full flex flex-col items-center py-12 transition-opacity duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionProperty: 'opacity, transform' }}
    >
      <h2 className="text-xl font-semibold text-blue-700-custom mb-4">Ready to Take the Next Step?</h2>
      <p className="mb-6 text-gray-700 dark:text-gray-200 text-center max-w-lg">
        Whether you’re looking for your next opportunity or need to fill a key position, we’re here to help. Reach out to us today!
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="#"
          className="bg-blue-500-custom text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700-custom transition-colors text-base text-center"
        >
          Request a Job
        </a>
        <a
          href="#"
          className="bg-white border border-blue-500-custom text-blue-700-custom px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-50 transition-colors text-base text-center"
        >
          Post Your Requirement
        </a>
      </div>
    </section>
  );
} 