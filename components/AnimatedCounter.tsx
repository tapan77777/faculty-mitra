"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export default function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasAnimated(true);
        observer.disconnect();

        const numericMatch = value.match(/[\d,]+/);
        if (!numericMatch) return;

        const numStr = numericMatch[0].replace(/,/g, "");
        const num = parseInt(numStr, 10);
        if (isNaN(num)) return;

        const steps = 50;
        const duration = 1800;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          const current = Math.min(Math.round((num / steps) * step), num);
          const formatted = current.toLocaleString("en-IN");
          setDisplay(value.replace(numericMatch[0], formatted));
          if (step >= steps) clearInterval(timer);
        }, duration / steps);
      },
      { threshold: 0.1, rootMargin: "-60px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
