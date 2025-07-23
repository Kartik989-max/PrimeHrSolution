import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const headlines = [
  "Executive Search",
  "Manpower Outsourcing",
  "Payroll Administration",
  "HR Systems & Policy",
  "Training & Compliance"
];

function useTypewriter(words: string[], speed = 80, pause = 1200) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const word = words[index];
    if (!deleting && displayed.length < word.length) {
      timeout.current = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), speed);
    } else if (!deleting && displayed.length === word.length) {
      timeout.current = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && displayed.length > 0) {
      timeout.current = setTimeout(() => setDisplayed(word.slice(0, displayed.length - 1)), speed / 2);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    }
    return () => { if (timeout.current) clearTimeout(timeout.current); };
  }, [displayed, deleting, index, words, speed, pause]);

  return displayed;
}

export default function HeroSection() {
  const typed = useTypewriter(headlines);
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
      className={`relative w-full min-h-[90vh] flex items-center justify-center bg-black text-white overflow-hidden transition-opacity duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ fontFamily: 'Montserrat, Arial, sans-serif', transitionProperty: 'opacity, transform' }}
    >
      {/* Background image - minimal, light, professional (new image) */}
      <Image
        fill
        src="https://images.pexels.com/photos/6614823/pexels-photo-6614823.jpeg"
        alt="Minimal blue office background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        // style={{ filter: 'brightness(0.96) contrast(1.04)' }}
      />
      {/* Overlay - light for minimal look */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-gray-500/60 to-transparent z-10" />
      {/* Content */}
      <div className="relative px-24 z-20 max-w-fullflex flex-col py-16 w-full gap-6">
        {/* Badge */}
        <div className="mb-4">
          <span className="inline-block px-5 py-2 border border-blue-500 text-blue-500 rounded-full font-semibold text-base shadow-sm">
            Trusted HR Solutions Partner
          </span>
        </div>
        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl max-w-3xl  md:text-5xl font-extrabold leading-tight mb-2 text-white">
          Empowering Organizations with <span className="text-blue-500">{typed}<span className="animate-blink">|</span></span>
        </h1>
        {/* Concise subheadline */}
        <p className="text-body text-white max-w-2xl">
          Prime HR Solutions delivers expert recruitment, outsourcing, and HR services for leading organizations across India.
        </p>
      </div>
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s steps(2, start) infinite;
        }
      `}</style>
    </section>
  );
} 