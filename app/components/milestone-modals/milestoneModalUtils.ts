import { TYPE_LABELS, normalizeMilestoneType } from "@/app/lib/milestoneBoard";
import type { Milestone } from "@/app/types";

export function modalTitle(milestone: Milestone): string {
  const type = normalizeMilestoneType(milestone.type);
  if (type === "alumni") return milestone.alumniName || milestone.title;
  return milestone.title;
}

export function modalDateLabel(milestone: Milestone): string {
  return milestone.dateLabel || String(milestone.year);
}

export function modalTypeLabel(milestone: Milestone): string {
  return TYPE_LABELS[normalizeMilestoneType(milestone.type)];
}

export function alumniInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
