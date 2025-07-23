import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  phrases: string[];
  speed?: number;
  pause?: number;
  className?: string;
}

export default function Typewriter({ phrases, speed = 80, pause = 1200, className = "" }: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentPhrase = phrases[phraseIdx];
    if (!deleting && charIdx < currentPhrase.length) {
      timeoutRef.current = setTimeout(() => setCharIdx(charIdx + 1), speed);
      setDisplayed(currentPhrase.slice(0, charIdx + 1));
    } else if (!deleting && charIdx === currentPhrase.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeoutRef.current = setTimeout(() => setCharIdx(charIdx - 1), speed / 2);
      setDisplayed(currentPhrase.slice(0, charIdx - 1));
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx((phraseIdx + 1) % phrases.length);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause]);

  return (
    <span className={`border-r-2 border-blue-400 pr-1 ${className}`}>{displayed}</span>
  );
} 