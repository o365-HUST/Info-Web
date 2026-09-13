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
  /** Core missions: student account / M365 support desk */
  missionSupport: "/assets/core-missions/hotrosinhvien-02.jpg",
  /** Core missions: auditorium / event tech crew */
  missionEvent: "/assets/core-missions/kythuatsukien-01.jpg",
  /** Core missions: classroom workshop / KNM training */
  missionTraining: "/assets/core-missions/hotrodaotao-03.jpg",
  /** Core missions: company visit / industry networking */
  missionEnterprise: "/assets/core-missions/ketnoidoanhnghiep-04.jpg",
  /** Achievements: MOSWC advisors banner collage */
  advisorsBanner: "/assets/achievements/advisors-moswc.webp",
} as const;
