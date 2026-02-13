import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  formatter?: (n: number) => string;
  className?: string;
  duration?: number;
}

export default function AnimatedNumber({
  value,
  formatter = (n) => n.toFixed(0),
  className,
  duration = 400,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef<number>();
  const startRef = useRef<number>();
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = undefined;

    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(from + (to - from) * eased);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  // Sync fromRef on unmount-free value jumps
  useEffect(() => {
    return () => {
      fromRef.current = display;
    };
  });

  return <span className={className}>{formatter(display)}</span>;
}
