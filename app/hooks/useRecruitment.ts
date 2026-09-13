"use client";

import { useEffect, useState } from "react";
import { RECRUITMENT_INFO } from "@/app/data/clubData";
import { getRecruitment } from "@/app/lib/firestoreService";
import type { RecruitmentInfo } from "@/app/types";

export function useRecruitment() {
  const [recruitment, setRecruitment] =
    useState<RecruitmentInfo>(RECRUITMENT_INFO);

  useEffect(() => {
    getRecruitment().then(setRecruitment);

    const handler = (event: Event) => {
      const custom = event as CustomEvent<RecruitmentInfo>;
      if (custom.detail) setRecruitment(custom.detail);
    };

    window.addEventListener("cms-recruitment-updated", handler);
    return () => window.removeEventListener("cms-recruitment-updated", handler);
  }, []);

  return recruitment;
}
