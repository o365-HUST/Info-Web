export interface ClubInfo {
  name: string;
  officialTitle: string;
  role: string;
  affiliation: string;
  leader: { name: string; role: string; phone: string };
  email: string;
  phone: string;
  locations: Array<{ title: string; detail: string }>;
  portalUrl: string;
  fanpageUrl: string;
  groupUrl: string;
  messengerUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
}

export interface RecruitmentInfo {
  campaignName: string;
  generation: string;
  deadlineDate: string;
  deadlineDisplay: string;
  formUrl: string;
  callToAction: string;
  /** Show recruitment CTAs on navbar, hero, and department pages */
  visible: boolean;
}

export interface DepartmentBentoItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  type: "photo" | "stat" | "quote" | "skills" | "activity";
  colSpan?: string; // Tailwind grid col class e.g. "col-span-1" | "col-span-2"
  accent?: string;
  badge?: string;
  description?: string;
  quoteAuthor?: string;
  skills?: string[];
  statValue?: string;
  statLabel?: string;
}

export interface DepartmentGallerySlide {
  src: string;
  alt: string;
  title: string;
  caption?: string;
  fit?: "cover" | "contain";
  /** Links slide to a sub-unit when department has dual mảng */
  subUnitId?: DepartmentSubUnitId;
}

export type DepartmentSubUnitId = "knm" | "ky-thuat";

export interface DepartmentSubUnit {
  id: DepartmentSubUnitId;
  index: "01" | "02";
  name: string;
  tagline: string;
  mission: string;
  tools: string[];
  /** Up to 3 bullets */
  trainingFocus: string[];
  accent?: "warm" | "cool";
}

export interface Department {
  id: string;
  index: string;
  name: string;
  slugs?: string[];
  icon: string; // lucide icon name
  image: string;
  color: string; // pastel hex for card bg
  accentColor: string; // stronger accent for icon/border
  tagline: string;
  description: string;
  fullDescription?: string;
  mission?: string;
  leader?: { name: string; role: string; quote?: string; avatar?: string };
  viceLeaders?: Array<{ name: string; role: string; avatar?: string }>;
  stats?: Array<{ label: string; value: string; desc?: string }>;
  keyActivities?: Array<{ title: string; desc: string; icon?: string }>;
  skillsLearned?: string[];
  /** Thành tích / dấu ấn thành viên tiêu biểu */
  memberHighlights?: Array<{ name: string; detail: string }>;
  /** Activity photos for the Điểm nhấn gallery (not the hero team shot) */
  gallery?: DepartmentGallerySlide[];
  bentoItems?: DepartmentBentoItem[];
  /** Internal mảng (e.g. KNM + Kĩ thuật within Ban Chuyên môn) */
  subUnits?: DepartmentSubUnit[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  thumbnail: string;
  url: string;
  content?: string;
  published?: boolean;
  author?: string;
  authorDescription?: string;
  /** Large hero tile on /blog bento (max one shown). */
  heroSpot?: boolean;
  /** Right-column Nổi bật cards (max 3; excludes hero). */
  featuredSpot?: boolean;
  /** @deprecated Use featuredSpot — still read for older Firestore docs. */
  featured?: boolean;
  /** Sort before non-pinned posts regardless of date. */
  pinned?: boolean;
}

export type MilestoneType = "moc" | "thanh_tich" | "alumni" | "photo";

export interface Milestone {
  id: string;
  /** Unknown/missing values should be treated as "moc" when rendering. */
  type: MilestoneType;
  /** Chapter grouping (e.g. 2024). */
  year: number;
  /** Human display label, e.g. "08/2023", "09-12/2024", "Giữa 05/2025". */
  dateLabel?: string;
  /** Sortable key, e.g. "2023-08", "2025-05-mid", "2026-01". */
  sortKey?: string;
  title: string;
  description?: string;
  images?: string[];
  alumniName?: string;
  alumniRole?: string;
  alumniAvatar?: string;
  alumniQuote?: string;
  alumniLink?: string;
  /** Blog post id; expand CTA links to /blog/{relatedPostId}. */
  relatedPostId?: string;
  /** Include this note in the chronological thread (default true). */
  threaded?: boolean;
  /** Admin-defined corkboard X as fraction of canvas width (0–1). */
  boardRelX?: number;
  /** Admin-defined corkboard Y as fraction of canvas height (0–1). */
  boardRelY?: number;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: string; // lucide icon name
}

export interface Advisor {
  id: string;
  name: string;
  medal: string;
  event: string;
  app: "excel" | "powerpoint" | "word";
  medalTier: "gold" | "bronze";
  subjectLabel: string;
  year: number;
}

export interface MissionItem {
  title: string;
  detail: string;
  image: string;
  imageAlt: string;
}

export type ResourceAttachmentType =
  | "office"
  | "pdf"
  | "image"
  | "video"
  | "other";

export interface ResourceAttachment {
  id: string;
  name: string;
  url: string;
  type: ResourceAttachmentType;
  size?: number;
  /** Firebase Storage object path — used for reliable deletes */
  storagePath?: string;
}

export interface ResourcePageData {
  title: string;
  content: string;
  attachments: ResourceAttachment[];
  updatedAt?: string;
}
