"use client";

import { normalizeMilestoneType } from "@/app/lib/milestoneBoard";
import type { BlogPost, Milestone } from "@/app/types";
import AlumniSpotlightModal from "./AlumniSpotlightModal";
import MocNoteModal from "./MocNoteModal";
import PhotoFrameModal from "./PhotoFrameModal";
import ThanhTichNoteModal from "./ThanhTichNoteModal";

interface NoteModalRouterProps {
  milestone: Milestone;
  postsById: Record<string, BlogPost>;
  onClose: () => void;
  reducedMotion: boolean;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}

export default function NoteModalRouter({
  milestone,
  postsById,
  onClose,
  reducedMotion,
  closeRef,
}: NoteModalRouterProps) {
  const type = normalizeMilestoneType(milestone.type);

  switch (type) {
    case "photo":
      return (
        <PhotoFrameModal
          milestone={milestone}
          postsById={postsById}
          onClose={onClose}
          reducedMotion={reducedMotion}
          closeRef={closeRef}
        />
      );
    case "alumni":
      return (
        <AlumniSpotlightModal
          milestone={milestone}
          postsById={postsById}
          onClose={onClose}
          reducedMotion={reducedMotion}
          closeRef={closeRef}
        />
      );
    case "thanh_tich":
      return (
        <ThanhTichNoteModal
          milestone={milestone}
          postsById={postsById}
          onClose={onClose}
          reducedMotion={reducedMotion}
          closeRef={closeRef}
        />
      );
    case "moc":
    default:
      return (
        <MocNoteModal
          milestone={milestone}
          postsById={postsById}
          onClose={onClose}
          reducedMotion={reducedMotion}
          closeRef={closeRef}
        />
      );
  }
}
