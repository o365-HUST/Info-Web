"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useInView } from "motion/react";

interface HighlightedTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function HighlightedText({
  children,
  className = "",
  delay = 0,
}: HighlightedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (inView) setDrawn(true);
  }, [inView]);

  return (
    <span
      ref={ref}
      className={`relative isolate inline-block whitespace-nowrap ${className}`}
    >
      <span
        aria-hidden="true"
        className={`text-highlight-mark${drawn ? " is-drawn" : ""}`}
        style={{ "--highlight-delay": `${delay}s` } as CSSProperties}
      />
      {children}
    </span>
  );
}
