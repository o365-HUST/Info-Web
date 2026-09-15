import type { MilestoneType } from "@/app/types";

export type ModalTheme = {
  stamp: string;
  stampBorder: string;
  chip: string;
  accent: string;
  accentMuted: string;
  ink: string;
  inkMuted: string;
  outer: string;
  inner: string;
  lineColor: string;
};

export const MODAL_THEMES: Record<MilestoneType, ModalTheme> = {
  moc: {
    stamp: "bg-[#fef9c3] text-[#713f12]",
    stampBorder: "border-[#eab308]",
    chip: "text-[#92400e]",
    accent: "text-[#b45309]",
    accentMuted: "text-[#d97706]",
    ink: "text-[#713f12]",
    inkMuted: "text-[#92400e]",
    outer: "#fde68a",
    inner: "#fffef7",
    lineColor: "rgba(180,83,9,0.12)",
  },
  thanh_tich: {
    stamp: "bg-[#fce7f3] text-[#831843]",
    stampBorder: "border-[#ec4899]",
    chip: "text-[#9d174d]",
    accent: "text-[#be185d]",
    accentMuted: "text-[#db2777]",
    ink: "text-[#831843]",
    inkMuted: "text-[#9d174d]",
    outer: "#f9a8d4",
    inner: "#fff5f9",
    lineColor: "rgba(190,24,93,0.1)",
  },
  alumni: {
    stamp: "bg-[#dcfce7] text-[#14532d]",
    stampBorder: "border-[#22c55e]",
    chip: "text-[#166534]",
    accent: "text-[#15803d]",
    accentMuted: "text-[#16a34a]",
    ink: "text-[#14532d]",
    inkMuted: "text-[#166534]",
    outer: "#86efac",
    inner: "#f0fdf4",
    lineColor: "rgba(21,128,61,0.1)",
  },
  photo: {
    stamp: "bg-[#ffedd5] text-[#431407]",
    stampBorder: "border-[#ea580c]",
    chip: "text-[#7c2d12]",
    accent: "text-[#c2410c]",
    accentMuted: "text-[#ea580c]",
    ink: "text-[#431407]",
    inkMuted: "text-[#7c2d12]",
    outer: "#fcd9b6",
    inner: "#fffaf5",
    lineColor: "rgba(124,45,18,0.08)",
  },
};

export const PAPER_GRAIN =
  "repeating-linear-gradient(0deg, rgba(0,0,0,0.018) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,0.012) 0 1px, transparent 1px 5px)";
