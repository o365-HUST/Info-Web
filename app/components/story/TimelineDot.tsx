"use client";

interface TimelineDotProps {
  variant?: "default" | "cta";
}

export default function TimelineDot({ variant = "default" }: TimelineDotProps) {
  if (variant === "cta") {
    return (
      <span className="relative flex h-9 w-9 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-dashed border-accent/50" />
        <span className="text-sm font-bold text-accent">+</span>
      </span>
    );
  }

  return (
    <span className="relative flex h-9 w-9 items-center justify-center">
      <span className="absolute inset-0 rounded-full border-2 border-accent/70" />
      <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-sm" />
    </span>
  );
}
