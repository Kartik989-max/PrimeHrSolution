import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Years of Market Leadership", value: 5, suffix: "+" },
  { label: "Careers Made", value: 36_000, suffix: "" },
  { label: "Consultants", value: 165, suffix: "+" },
  { label: "Industries Covered", value: 24, suffix: "" },
];

function useCountUp(target: number, duration = 1200, start: boolean = false) {
  const [count, setCount] = useState(0);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }
    let startTime: number | null = null;
    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
      else setCount(target);
    }
    raf.current = requestAnimationFrame(animate);
    return () => { if (raf.current !== undefined) cancelAnimationFrame(raf.current); };
  }, [target, duration, start]);
  return count;
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // Store counts for each stat
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));

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

  // Animate counts when visible
  useEffect(() => {
    if (!visible) {
      setCounts(stats.map(() => 0));
      return;
    }
    const rafs: number[] = [];
    stats.forEach((stat, i) => {
      let startTime: number | null = null;
      const duration = 1200 + i * 200;
      function animate(ts: number) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        setCounts(prev => {
          const next = [...prev];
          next[i] = Math.floor(progress * stat.value);
          return next;
        });
        if (progress < 1) rafs[i] = requestAnimationFrame(animate);
        else setCounts(prev => {
          const next = [...prev];
          next[i] = stat.value;
          return next;
        });
      }
      rafs[i] = requestAnimationFrame(animate);
    });
    return () => rafs.forEach(id => cancelAnimationFrame(id));
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      className={`w-full flex flex-col items-center py-12  transition-opacity duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionProperty: 'opacity, transform' }}
    >
      <h2 className="text-heading mb-8">Our Impact</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
        {stats.map((stat, i) => {
          // Format with commas for large numbers
          const display = stat.value >= 1000 ? counts[i].toLocaleString() : counts[i];
          return (
            <div
              key={stat.label}
              className={`flex flex-col items-center bg-white rounded-xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-shadow duration-300 transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0'}`}
              style={{ transitionDelay: `${i * 120}ms`, transitionProperty: 'opacity, transform' }}
            >
              <span className="text-4xl font-extrabold text-blue-700 mb-2">
                {display}
                {stat.suffix}
              </span>
              <span className="text-subheading text-center">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
} 