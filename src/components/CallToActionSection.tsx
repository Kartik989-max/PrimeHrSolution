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
      className={`w-full flex flex-col items-center py-16 md:py-20 transition-opacity duration-700 bg-gradient-to-br from-blue-50 via-white to-blue-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionProperty: 'opacity, transform' }}
    >
      <h2 className="text-heading mb-2 text-center">Ready to Take the Next Step?</h2>
      <div className="w-14 h-1 bg-blue-500-custom rounded-full mb-8 mx-auto" />
      <p className="text-body mb-8 text-center max-w-xl">
        Whether you&apos;re looking for your next opportunity or need to fill a key position, we&apos;re here to help. Reach out to us today!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
        <a
          href="#"
          className="flex-1 bg-white border border-blue-500-custom text-blue-700-custom px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors text-base text-center"
        >
          Request a Job
        </a>
      </div>
    </section>
  );
} 