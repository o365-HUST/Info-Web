/**
 * Photo slots for Hero / About / Achievements.
 * Drop real club JPEGs with the same basenames into public/assets/,
 * then point these paths to the `.jpg` files (see public/assets/README.md).
 */
export const PHOTO_ASSETS = {
  /** Full-bleed hero — prefer 16:9 or 3:2, real campus/event atmosphere */
  heroCampus: "/assets/hero/hero-campus.svg",
  /** About: support desk / Office 365 help */
  aboutSupport: "/assets/about/about-support.svg",
  /** About: event tech / C2 / workshop */
  aboutEvent: "/assets/about/about-event.svg",
  /** Achievements: MOSWC advisors banner collage */
  advisorsBanner: "/assets/achievements/advisors-moswc.webp",
} as const;
