import { ReactNode } from "react";
import { useScrollFade } from "@/hooks/use-scroll-fade";

interface ScrollFadeProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function ScrollFade({ children, delay = 0, className = "" }: ScrollFadeProps) {
  const { ref, isVisible } = useScrollFade(0.1);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
