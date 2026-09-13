/**
 * Photo slots for Hero / About / Achievements.
 * AI stand-in JPGs show the intended shot type. Replace with real club photos
 * using the same filenames (see public/assets/README.md).
 */
export const PHOTO_ASSETS = {
  /** Full-bleed hero — prefer 16:9 or 3:2, real campus/event atmosphere */
  heroAllClub: "/assets/hero/hero-allclub.jpg",
  /** About: support desk / Office 365 help */
  aboutSupport: "/assets/about/about-support.jpg",
  /** About: event tech / C2 / workshop */
  aboutEvent: "/assets/about/about-event.jpg",
  /** Achievements: MOSWC advisors banner collage */
  advisorsBanner: "/assets/achievements/advisors-moswc.webp",
} as const;
